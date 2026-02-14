const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        minlength: [10, 'Content must be at least 10 characters']
    },
    summary: {
        type: String,
        required: [true, 'Summary is required'],
        maxlength: [500, 'Summary cannot exceed 500 characters']
    },
    featuredImage: {
        type: String,
        default: 'https://via.placeholder.com/800x400?text=Blog+Post'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    category: {
        type: String,
        enum: ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Education', 'Other'],
        default: 'Other'
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likesCount: {
        type: Number,
        default: 0
    },
    publishedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for search functionality
blogSchema.index({ title: 'text', content: 'text', summary: 'text', tags: 'text' });

// Virtual for comments
blogSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'blog'
});

// Set publishedAt when status changes to published
blogSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

// Update likesCount before save
blogSchema.pre('save', function (next) {
    if (this.isModified('likes')) {
        this.likesCount = this.likes.length;
    }
    next();
});

module.exports = mongoose.model('Blog', blogSchema);