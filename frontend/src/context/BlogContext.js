import React, { createContext, useState, useContext, useCallback } from 'react';
import { blogAPI } from '../services/blogApi';

const BlogContext = createContext(null);

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchBlogs = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogAPI.getBlogs(params);
      setBlogs(response.data.data.blogs);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBlog = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogAPI.getBlog(id);
      setCurrentBlog(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blog');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBlog = async (blogData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogAPI.createBlog(blogData);
      return { success: true, data: response.data.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (id, blogData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogAPI.updateBlog(id, blogData);
      return { success: true, data: response.data.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await blogAPI.deleteBlog(id);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete blog');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const likeBlog = async (id) => {
    try {
      const response = await blogAPI.likeBlog(id);
      return response.data.data;
    } catch (err) {
      console.error('Failed to like blog:', err);
      throw err;
    }
  };

  // THIS WAS MISSING - Add fetchUserBlogs function
  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogAPI.getUserBlogs();
      setBlogs(response.data.data); // This will show user's blogs in profile
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your blogs');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (blogId, commentData) => {
    try {
      const response = await blogAPI.createComment(blogId, commentData);
      return { success: true, data: response.data.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  };

  const updateComment = async (blogId, commentId, content) => {
    try {
      const response = await blogAPI.updateComment(blogId, commentId, { content });
      return { success: true, data: response.data.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  };

  const deleteComment = async (blogId, commentId) => {
    try {
      await blogAPI.deleteComment(blogId, commentId);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  };

  const likeComment = async (blogId, commentId) => {
    try {
      const response = await blogAPI.likeComment(blogId, commentId);
      return response.data.data;
    } catch (err) {
      console.error('Failed to like comment:', err);
      throw err;
    }
  };

  const value = {
    blogs,
    currentBlog,
    loading,
    error,
    pagination,
    fetchBlogs,
    fetchBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    fetchUserBlogs, // THIS WAS MISSING - Add to value object
    createComment,
    updateComment,
    deleteComment,
    likeComment
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};