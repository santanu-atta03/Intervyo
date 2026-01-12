const API_URL = import.meta.env.VITE_API_URL || 'https://intervyo.onrender.com/api';

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Blog API calls
export const blogService = {
  // Get all blogs with filters
  async getBlogs({ page = 1, limit = 12, search = '', tag = '', sort = '-publishedAt' } = {}) {
    const params = new URLSearchParams({ page, limit, search, tag, sort });
    const response = await fetch(`${API_URL}/blogs?${params}`);
    return response.json();
  },

  // Get featured blogs
  async getFeaturedBlogs() {
    const response = await fetch(`${API_URL}/blogs/featured`);
    return response.json();
  },

  // Get popular tags
  async getTags() {
    const response = await fetch(`${API_URL}/blogs/tags`);
    return response.json();
  },

  // Get single blog
  async getBlog(slugOrId) {
    const response = await fetch(`${API_URL}/blogs/${slugOrId}`);
    return response.json();
  },

  // Create blog
  async createBlog(blogData) {
    const response = await fetch(`${API_URL}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(blogData)
    });
    return response.json();
  },

  // Update blog
  async updateBlog(id, blogData) {
    const response = await fetch(`${API_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(blogData)
    });
    return response.json();
  },

  // Delete blog
  async deleteBlog(id) {
    const response = await fetch(`${API_URL}/blogs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    return response.json();
  },

  // Like/Unlike blog
  async toggleLike(id) {
    const response = await fetch(`${API_URL}/blogs/${id}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    return response.json();
  },

  // Add comment
  async addComment(blogId, content) {
    const response = await fetch(`${API_URL}/blogs/${blogId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ content })
    });
    return response.json();
  },

  // Delete comment
  async deleteComment(blogId, commentId) {
    const response = await fetch(`${API_URL}/blogs/${blogId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    return response.json();
  },

  // Get user's blogs
  async getUserBlogs(userId, page = 1, limit = 10) {
    const response = await fetch(`${API_URL}/users/${userId}/blogs?page=${page}&limit=${limit}`);
    return response.json();
  }
};
