import api from './api';

export const blogAPI = {
  // Blog endpoints
  getBlogs: (params) => api.get('/blogs', { params }),
  getBlog: (id) => api.get(`/blogs/${id}`),
  createBlog: (data) => api.post('/blogs', data),
  updateBlog: (id, data) => api.patch(`/blogs/${id}`, data),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),
  likeBlog: (id) => api.post(`/blogs/${id}/like`),
  getUserBlogs: () => api.get('/blogs/user/my-blogs'),
  
  // Comment endpoints
  getComments: (blogId) => api.get(`/blogs/${blogId}/comments`),
  createComment: (blogId, data) => api.post(`/blogs/${blogId}/comments`, data),
  updateComment: (blogId, commentId, data) => api.patch(`/blogs/${blogId}/comments/${commentId}`, data),
  deleteComment: (blogId, commentId) => api.delete(`/blogs/${blogId}/comments/${commentId}`),
  likeComment: (blogId, commentId) => api.post(`/blogs/${blogId}/comments/${commentId}/like`)
};