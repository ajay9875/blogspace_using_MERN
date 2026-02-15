import React, { useEffect, useState, useMemo } from 'react';
import Fuse from 'fuse.js'; // Import Fuse
import { useBlog } from '../../context/BlogContext';
import BlogCard from './BlogCard';
import SearchBar from './SearchBar'; // Import the new SearchBar
import Pagination from './Pagination';

const BlogList = () => {
  const { blogs, loading, error, pagination, fetchBlogs, likeBlog } = useBlog();

  // Local state for the fuzzy search term
  const [fuzzyQuery, setFuzzyQuery] = useState('');

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '', // We keep this empty to fetch "all" (or current page) from server
    category: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchBlogs(filters);
  }, [filters]);

  // 1. Handle Search: Updates local fuzzy state instead of refetching immediately
  const handleSearch = (searchTerm) => {
    setFuzzyQuery(searchTerm); // Optional: keep for UI, but server logic matters more

    setFilters(prev => ({
      ...prev,
      page: 1,           // Always reset to page 1 for new results
      category: '',      // FIX: Reset category so we search GLOBALLY, not inside the empty category
      search: searchTerm // Send the query to the server
    }));
  };

  // REPLACE your existing handleCategoryChange with this:
  const handleCategoryChange = (category) => {
    setFuzzyQuery(''); // Clear local search text

    setFilters(prev => ({
      ...prev,
      category,
      search: '', // FIX: Clear the server search param so we see all posts in this category
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sortBy: e.target.value, page: 1 });
  };

  const handleLike = async (blogId) => {
    try {
      await likeBlog(blogId);
      fetchBlogs(filters);
    } catch (error) {
      console.error('Failed to like blog:', error);
    }
  };

  // --- FUZZY LOGIC IMPLEMENTATION ---

  // 2. Configure Fuse options
  const fuseOptions = {
    keys: ['title', 'category', 'author.name', 'tags'], // Fields to search in
    threshold: 0.4, // Sensitivity: 0.0 is exact match, 1.0 is match anything
    includeScore: true
  };

  // 3. Create Fuse instance (memoized for performance)
  const fuse = useMemo(() => new Fuse(blogs, fuseOptions), [blogs]);

  // 4. Calculate filtered results
  // REPLACE your existing displayedBlogs with this:
  const displayedBlogs = useMemo(() => {
    // Since the server now handles the 'search' filter, 
    // we just return the blogs directly.
    return blogs;
  }, [blogs]);

  // ----------------------------------

  const categories = [
    'All', 'Technology', 'Lifestyle', 'Travel', 'Food',
    'Health', 'Business', 'Education', 'Other'
  ];

  if (loading && blogs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Posts</h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* Use the new SearchBar */}
          <SearchBar onSearch={handleSearch} />

          <div className="flex gap-4">
            <select
              value={filters.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat === 'All' ? '' : cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="createdAt">Latest</option>
              <option value="views">Most Viewed</option>
              <option value="likesCount">Most Liked</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
          {error}
        </div>
      )}

      {displayedBlogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {fuzzyQuery ? `No matches found for "${fuzzyQuery}"` : "No blog posts found."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Render displayedBlogs (filtered) instead of original blogs */}
            {displayedBlogs.map(blog => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onLike={handleLike}
              />
            ))}
          </div>

          {/* Hide pagination if searching locally, as page numbers won't match filtered results */}
          {!fuzzyQuery && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BlogList;