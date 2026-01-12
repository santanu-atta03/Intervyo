import { useState, useEffect } from 'react';
import { blogService } from '../services/blog.service';

export function useBlogs(filters = {}) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const data = await blogService.getBlogs(filters);
        if (data.success) {
          setBlogs(data.blogs);
          setPagination(data.pagination);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [JSON.stringify(filters)]);

  return { blogs, loading, error, pagination };
}

export function useBlog(slugOrId) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const data = await blogService.getBlog(slugOrId);
        if (data.success) {
          setBlog(data.blog);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slugOrId) {
      fetchBlog();
    }
  }, [slugOrId]);

  return { blog, loading, error, setBlog };
}

export function useTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await blogService.getTags();
        if (data.success) {
          setTags(data.tags);
        }
      } catch (err) {
        console.error('Error fetching tags:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { tags, loading };
}