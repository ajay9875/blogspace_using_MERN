const blogService = require('../services/blogService');
const catchAsync = require('../utils/catchAsync');

// Blog Controllers
const createBlog = catchAsync(async (req, res) => {
  const blog = await blogService.createBlog(req.user._id, req.body);
  
  res.status(201).json({
    success: true,
    data: blog
  });
});

const getBlogs = catchAsync(async (req, res) => {
  const result = await blogService.getBlogs(req.query);
  
  res.json({
    success: true,
    data: result
  });
});

const getBlog = catchAsync(async (req, res) => {
  const blog = await blogService.getBlogById(req.params.id);
  
  res.json({
    success: true,
    data: blog
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const blog = await blogService.updateBlog(req.user._id, req.params.id, req.body);
  
  res.json({
    success: true,
    data: blog
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const result = await blogService.deleteBlog(req.user._id, req.params.id);
  
  res.json({
    success: true,
    message: result.message
  });
});

const likeBlog = catchAsync(async (req, res) => {
  const result = await blogService.toggleLike(req.user._id, req.params.id);
  
  res.json({
    success: true,
    data: result
  });
});

const getUserBlogs = catchAsync(async (req, res) => {
  const blogs = await blogService.getUserBlogs(req.user._id);
  
  res.json({
    success: true,
    data: blogs
  });
});

// Comment Controllers
const createComment = catchAsync(async (req, res) => {
  const comment = await blogService.createComment(
    req.user._id, 
    req.params.blogId, 
    req.body
  );
  
  res.status(201).json({
    success: true,
    data: comment
  });
});

const getBlogComments = catchAsync(async (req, res) => {
  const comments = await blogService.getBlogComments(req.params.blogId);
  
  res.json({
    success: true,
    data: comments
  });
});

const updateComment = catchAsync(async (req, res) => {
  const comment = await blogService.updateComment(
    req.user._id,
    req.params.blogId,
    req.params.commentId,
    req.body.content
  );
  
  res.json({
    success: true,
    data: comment
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const result = await blogService.deleteComment(
    req.user._id,
    req.params.blogId,
    req.params.commentId
  );
  
  res.json({
    success: true,
    message: result.message
  });
});

const likeComment = catchAsync(async (req, res) => {
  const result = await blogService.toggleCommentLike(
    req.user._id,
    req.params.blogId,
    req.params.commentId
  );
  
  res.json({
    success: true,
    data: result
  });
});

module.exports = {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  getUserBlogs,
  createComment,
  getBlogComments,
  updateComment,
  deleteComment,
  likeComment
};