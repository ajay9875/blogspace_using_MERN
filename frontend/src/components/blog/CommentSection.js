import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBlog } from '../../context/BlogContext';
import { Link } from 'react-router-dom';  // Add this line

const CommentSection = ({ blogId }) => {
  const { user } = useAuth();
  const { createComment, updateComment, deleteComment, likeComment } = useBlog();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      // Comments are included in blog fetch
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const result = await createComment(blogId, {
      content: newComment
    });

    if (result.success) {
      setNewComment('');
      // Refresh blog to get new comment
      window.location.reload();
    }
    setLoading(false);
  };

  const handleSubmitReply = async (commentId) => {
    if (!user || !replyContent.trim()) return;

    setLoading(true);
    const result = await createComment(blogId, {
      content: replyContent,
      parentComment: commentId
    });

    if (result.success) {
      setReplyTo(null);
      setReplyContent('');
      window.location.reload();
    }
    setLoading(false);
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;

    setLoading(true);
    const result = await updateComment(blogId, commentId, editContent);

    if (result.success) {
      setEditingComment(null);
      setEditContent('');
      window.location.reload();
    }
    setLoading(false);
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setLoading(true);
    const result = await deleteComment(blogId, commentId);

    if (result.success) {
      window.location.reload();
    }
    setLoading(false);
  };

  const handleLikeComment = async (commentId) => {
    if (!user) return;

    try {
      await likeComment(blogId, commentId);
      window.location.reload();
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderComment = (comment, isReply = false) => (
    <div key={comment._id} className={`${isReply ? 'ml-12 mt-4' : 'border-b border-gray-200 pb-6 mb-6'}`}>
      <div className="flex items-start space-x-3">
        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <span className="text-indigo-800 font-semibold text-sm">
            {comment.author?.name?.charAt(0)}
          </span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-900">{comment.author?.name}</span>
              <span className="text-sm text-gray-500 ml-2">{formatDate(comment.createdAt)}</span>
              {comment.isEdited && (
                <span className="text-xs text-gray-400 ml-2">(edited)</span>
              )}
            </div>
            
            {user?._id === comment.author?._id && (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingComment(comment._id);
                    setEditContent(comment.content);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          
          {editingComment === comment._id ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
              />
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => handleEditComment(comment._id)}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingComment(null);
                    setEditContent('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-gray-700">{comment.content}</p>
          )}
          
          <div className="mt-2 flex items-center space-x-4">
            <button
              onClick={() => handleLikeComment(comment._id)}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                comment.likes?.includes(user?._id) ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}
            >
              <svg className="h-4 w-4" fill={comment.likes?.includes(user?._id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{comment.likesCount || 0}</span>
            </button>
            
            {!isReply && (
              <button
                onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                className="text-sm text-gray-500 hover:text-indigo-600"
              >
                Reply
              </button>
            )}
          </div>
          
          {replyTo === comment._id && (
            <div className="mt-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows="2"
              />
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => handleSubmitReply(comment._id)}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm"
                >
                  Post Reply
                </button>
                <button
                  onClick={() => {
                    setReplyTo(null);
                    setReplyContent('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              {comment.replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Comments</h3>
      
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows="4"
            required
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              Post Comment
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 text-center rounded-md">
          <p className="text-gray-600">
            Please <Link to="/login" className="text-indigo-600 hover:text-indigo-800">login</Link> to leave a comment.
          </p>
        </div>
      )}
      
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map(comment => renderComment(comment))
        ) : (
          <p className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;