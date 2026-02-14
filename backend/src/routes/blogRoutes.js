const express = require('express');
const blogController = require('../controllers/blogController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const blogValidation = require('../validations/blogValidation');

const router = express.Router();

// Public routes
router.get('/', validate(blogValidation.getBlogs), blogController.getBlogs);
router.get('/:id', validate(blogValidation.getBlog), blogController.getBlog);
router.get('/:blogId/comments', blogController.getBlogComments);

// Protected routes (require authentication)
router.use(protect);

// Blog routes
router.post('/', validate(blogValidation.createBlog), blogController.createBlog);
router.patch('/:id', validate(blogValidation.updateBlog), blogController.updateBlog);
router.delete('/:id', validate(blogValidation.deleteBlog), blogController.deleteBlog);
router.post('/:id/like', validate(blogValidation.likeBlog), blogController.likeBlog);
router.get('/user/my-blogs', blogController.getUserBlogs);

// Comment routes
router.post('/:blogId/comments', validate(blogValidation.createComment), blogController.createComment);
router.patch('/:blogId/comments/:commentId', validate(blogValidation.updateComment), blogController.updateComment);
router.delete('/:blogId/comments/:commentId', validate(blogValidation.deleteComment), blogController.deleteComment);
router.post('/:blogId/comments/:commentId/like', validate(blogValidation.likeComment), blogController.likeComment);

module.exports = router;