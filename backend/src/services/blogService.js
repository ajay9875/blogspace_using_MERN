const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const AppError = require('../utils/AppError');

class BlogService {
    // Create blog post
    async createBlog(userId, blogData) {
        const blog = await Blog.create({
            ...blogData,
            author: userId,
            publishedAt: blogData.status === 'published' ? new Date() : null
        });

        return blog.populate('author', 'name email');
    }

    // Get blogs with pagination and search
    async getBlogs(query) {
        const {
            page = 1,
            limit = 10,
            search = '',
            category,
            tag,
            author,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = query;

        const skip = (page - 1) * limit;

        // Build filter
        let filter = { status: 'published' };

        if (category) filter.category = category;
        if (author) filter.author = author;

        // Search functionality
        if (search) {
            filter.$text = { $search: search };
        }

        // Tag filter
        if (tag) {
            filter.tags = tag;
        }

        // Build sort
        let sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query
        const blogs = await Blog.find(filter)
            .populate('author', 'name email')
            .populate('comments') // Add this line to fetch comment data
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Blog.countDocuments(filter);

        return {
            blogs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    // Get single blog
    async getBlogById(blogId) {
        const blog = await Blog.findById(blogId)
            .populate('author', 'name email _id')  // Explicitly include _id
            .populate({
                path: 'comments',
                populate: [
                    { path: 'author', select: 'name email _id' },
                    {
                        path: 'replies',
                        populate: { path: 'author', select: 'name email _id' }
                    }
                ]
            });

        if (!blog) {
            throw new AppError('Blog not found', 404);
        }

        // Increment views
        blog.views += 1;
        await blog.save();

        return blog;
    }

    // Update blog
    async updateBlog(userId, blogId, updateData) {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            throw new AppError('Blog not found', 404);
        }

        // Convert both to strings for reliable comparison
        const blogAuthorId = blog.author.toString();
        const currentUserId = userId.toString();

        console.log('=== AUTHORIZATION CHECK ===');
        console.log('Blog Author ID:', blogAuthorId);
        console.log('Current User ID:', currentUserId);
        console.log('Match:', blogAuthorId === currentUserId);
        console.log('===========================');

        // Check if user is author
        if (blogAuthorId !== currentUserId) {
            throw new AppError('You are not authorized to update this blog', 403);
        }

        // If status changing to published and wasn't published before
        if (updateData.status === 'published' && blog.status !== 'published') {
            updateData.publishedAt = new Date();
        }

        Object.assign(blog, updateData);
        await blog.save();

        return blog.populate('author', 'name email _id');
    }

    // Delete blog
    async deleteBlog(userId, blogId) {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            throw new AppError('Blog not found', 404);
        }

        // Convert both to strings for reliable comparison
        const blogAuthorId = blog.author.toString();
        const currentUserId = userId.toString();

        // Check if user is author
        if (blogAuthorId !== currentUserId) {
            throw new AppError('You are not authorized to delete this blog', 403);
        }

        // Delete all comments associated with this blog
        await Comment.deleteMany({ blog: blogId });

        await blog.deleteOne();

        return { message: 'Blog deleted successfully' };
    }

    // Like/Unlike blog
    async toggleLike(userId, blogId) {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            throw new AppError('Blog not found', 404);
        }

        const likeIndex = blog.likes.indexOf(userId);

        if (likeIndex === -1) {
            // Like blog
            blog.likes.push(userId);
        } else {
            // Unlike blog
            blog.likes.splice(likeIndex, 1);
        }

        await blog.save();

        return {
            liked: likeIndex === -1,
            likesCount: blog.likes.length
        };
    }

    // Get user's blogs
    async getUserBlogs(userId) {
        const blogs = await Blog.find({ author: userId })
            .populate('author', 'name email _id')
            .sort('-createdAt');

        return blogs;
    }

    // Create comment
    async createComment(userId, blogId, commentData) {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            throw new AppError('Blog not found', 404);
        }

        const comment = await Comment.create({
            ...commentData,
            blog: blogId,
            author: userId
        });

        // If it's a reply, add to parent comment's replies
        if (commentData.parentComment) {
            const parentComment = await Comment.findById(commentData.parentComment);
            if (parentComment) {
                parentComment.replies.push(comment._id);
                await parentComment.save();
            }
        }

        return comment.populate('author', 'name email _id');
    }

    // Get comments for blog
    async getBlogComments(blogId) {
        const comments = await Comment.find({
            blog: blogId,
            parentComment: null
        })
            .populate('author', 'name email _id')
            .populate({
                path: 'replies',
                populate: { path: 'author', select: 'name email _id' }
            })
            .sort('-createdAt');

        return comments;
    }

    // Update comment
    async updateComment(userId, blogId, commentId, content) {
        const comment = await Comment.findOne({
            _id: commentId,
            blog: blogId
        });

        if (!comment) {
            throw new AppError('Comment not found', 404);
        }

        // Convert both to strings for reliable comparison
        const commentAuthorId = comment.author.toString();
        const currentUserId = userId.toString();

        if (commentAuthorId !== currentUserId) {
            throw new AppError('You are not authorized to update this comment', 403);
        }

        comment.content = content;
        comment.isEdited = true;
        await comment.save();

        return comment.populate('author', 'name email _id');
    }

    // Delete comment
    async deleteComment(userId, blogId, commentId) {
        const comment = await Comment.findOne({
            _id: commentId,
            blog: blogId
        });

        if (!comment) {
            throw new AppError('Comment not found', 404);
        }

        // Convert both to strings for reliable comparison
        const commentAuthorId = comment.author.toString();
        const currentUserId = userId.toString();

        if (commentAuthorId !== currentUserId) {
            throw new AppError('You are not authorized to delete this comment', 403);
        }

        // Delete all replies
        if (comment.replies.length > 0) {
            await Comment.deleteMany({ _id: { $in: comment.replies } });
        }

        await comment.deleteOne();

        return { message: 'Comment deleted successfully' };
    }

    // Like/Unlike comment
    async toggleCommentLike(userId, blogId, commentId) {
        const comment = await Comment.findOne({
            _id: commentId,
            blog: blogId
        });

        if (!comment) {
            throw new AppError('Comment not found', 404);
        }

        const likeIndex = comment.likes.indexOf(userId);

        if (likeIndex === -1) {
            comment.likes.push(userId);
        } else {
            comment.likes.splice(likeIndex, 1);
        }

        await comment.save();

        return {
            liked: likeIndex === -1,
            likesCount: comment.likes.length
        };
    }
}

module.exports = new BlogService();