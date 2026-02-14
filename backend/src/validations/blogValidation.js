const Joi = require('joi');

const createBlog = {
  body: Joi.object().keys({
    title: Joi.string().required().min(3).max(200),
    content: Joi.string().required().min(10),
    summary: Joi.string().required().max(500),
    featuredImage: Joi.string().uri().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    category: Joi.string().valid('Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Education', 'Other').optional(),
    status: Joi.string().valid('draft', 'published').optional()
  })
};

const updateBlog = {
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex()
  }),
  body: Joi.object().keys({
    title: Joi.string().min(3).max(200).optional(),
    content: Joi.string().min(10).optional(),
    summary: Joi.string().max(500).optional(),
    featuredImage: Joi.string().uri().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    category: Joi.string().valid('Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Education', 'Other').optional(),
    status: Joi.string().valid('draft', 'published').optional()
  }).min(1)
};

const getBlog = {
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex()
  })
};

const deleteBlog = {
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex()
  })
};

const getBlogs = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow('').optional(),  // Add .allow('')
    category: Joi.string().allow('').optional(), // Add .allow('')
    tag: Joi.string().optional(),
    author: Joi.string().length(24).hex().optional(),
    sortBy: Joi.string().valid('createdAt', 'updatedAt', 'views', 'likesCount').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  })
};

const likeBlog = {
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex()
  })
};

const createComment = {
  params: Joi.object().keys({
    blogId: Joi.string().required().length(24).hex()
  }),
  body: Joi.object().keys({
    content: Joi.string().required().min(1).max(1000),
    parentComment: Joi.string().length(24).hex().optional()
  })
};

const updateComment = {
  params: Joi.object().keys({
    blogId: Joi.string().required().length(24).hex(),
    commentId: Joi.string().required().length(24).hex()
  }),
  body: Joi.object().keys({
    content: Joi.string().required().min(1).max(1000)
  })
};

const deleteComment = {
  params: Joi.object().keys({
    blogId: Joi.string().required().length(24).hex(),
    commentId: Joi.string().required().length(24).hex()
  })
};

const likeComment = {
  params: Joi.object().keys({
    blogId: Joi.string().required().length(24).hex(),
    commentId: Joi.string().required().length(24).hex()
  })
};

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  deleteBlog,
  getBlogs,
  likeBlog,
  createComment,
  updateComment,
  deleteComment,
  likeComment
};