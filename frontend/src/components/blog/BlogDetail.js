import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { useAuth } from '../../context/AuthContext';
import CommentSection from './CommentSection';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentBlog, loading, error, fetchBlog, likeBlog, deleteBlog } = useBlog();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    loadBlog();
  }, [id]);

  useEffect(() => {
    if (currentBlog && user) {
      // Check if current user is the author
      setIsLiked(currentBlog.likes?.includes(user._id));
      setLikesCount(currentBlog.likesCount || 0);

      // Debug logs to see what's happening
      console.log('===== AUTHOR CHECK =====');
      console.log('Current User ID:', user._id);
      console.log('Blog Author Object:', currentBlog.author);
      console.log('Blog Author ID:', currentBlog.author?._id || currentBlog.author);

      // Fix: Handle both populated author object and plain author ID
      const authorId = currentBlog.author?._id || currentBlog.author;
      const userId = user._id;

      // Convert both to strings for comparison
      const isUserAuthor = authorId?.toString() === userId?.toString();
      console.log('Is Author?', isUserAuthor);
      console.log('========================');

      setIsAuthor(isUserAuthor);
    }
  }, [currentBlog, user]);

  const loadBlog = async () => {
    try {
      await fetchBlog(id);
    } catch (error) {
      console.error('Failed to load blog:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const result = await likeBlog(id);
      setIsLiked(result.liked);
      setLikesCount(result.likesCount);
    } catch (error) {
      console.error('Failed to like blog:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      const result = await deleteBlog(id);
      if (result.success) {
        navigate('/blogs');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get author name safely
  const getAuthorName = () => {
    if (!currentBlog.author) return 'Unknown';
    return currentBlog.author.name || 'Unknown';
  };

  // Get author initial safely
  const getAuthorInitial = () => {
    const name = getAuthorName();
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !currentBlog) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Blog not found'}</p>
          <Link
            to="/blogs"
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/blogs"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
      >
        ← Back to Blogs
      </Link>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={currentBlog.featuredImage || 'https://via.placeholder.com/800x400?text=Blog+Post'}
          alt={currentBlog.title}
          className="w-full h-96 object-cover"
        />

        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                {currentBlog.category || 'Uncategorized'}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(currentBlog.createdAt)}
              </span>
            </div>

            {isAuthor && (
              <div className="flex space-x-2">
                <Link
                  to={`/blog/edit/${currentBlog._id}`}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {currentBlog.title}
          </h1>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-800 font-semibold">
                  {getAuthorInitial()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {getAuthorName()}
                </p>
                {currentBlog.author?.email && (
                  <p className="text-sm text-gray-500">
                    {currentBlog.author.email}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors ${isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                  }`}
              >
                <svg className="h-6 w-6" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{likesCount} likes</span>
              </button>

              <div className="flex items-center space-x-1 text-gray-500">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{currentBlog.views || 0} views</span>
              </div>
            </div>
          </div>

          {currentBlog.tags && currentBlog.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {currentBlog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            {currentBlog.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>

      <CommentSection blogId={id} />
    </div>
  );
};

export default BlogDetail;