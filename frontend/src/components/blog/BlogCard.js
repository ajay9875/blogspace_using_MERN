import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BlogCard = ({ blog, onLike }) => {
  const { user } = useAuth();
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img 
        src={blog.featuredImage} 
        alt={blog.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-indigo-600 font-semibold">
            {blog.category}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(blog.createdAt)}
          </span>
        </div>
        
        <Link to={`/blog/${blog._id}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
            {blog.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.summary}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-800 font-semibold text-sm">
                {blog.author?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <span className="ml-2 text-sm text-gray-700">
              {blog.author?.name || 'Unknown'}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onLike(blog._id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
            >
              <svg className="h-5 w-5" fill={blog.likes?.includes(user?._id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{blog.likesCount || 0}</span>
            </button>
            
            <Link 
              to={`/blog/${blog._id}#comments`}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{blog.comments?.length || 0}</span>
            </Link>
            
            <div className="flex items-center space-x-1 text-gray-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{blog.views || 0}</span>
            </div>
          </div>
        </div>
        
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;