import express from 'express';
import mongoose from 'mongoose'
import Blog from '../models/Blog.model.js';
import slugify from 'slugify';
import { authenticate } from '../middlewares/auth.js'; // Your auth middleware

const router = express.Router();

// =====================================
// GET ALL BLOGS (with filters & search)
// =====================================
router.get('/blogs', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      search = '', 
      tag = '', 
      author = '',
      status = 'published',
      sort = '-publishedAt'
    } = req.query;

    const query = {  };
    console.log("Query : ",query)

    // Search in title, content, and tags
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by tag
    if (tag) {
      query.tags = tag.toLowerCase();
    }

    // Filter by author
    if (author) {
      query.author = author;
    }

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .populate('author', 'name email avatar')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Blog.countDocuments(query)
    ]);

    // Add like count and comment count
    const blogsWithCounts = blogs.map(blog => ({
      ...blog,
      likesCount: blog.likes?.length || 0,
      commentsCount: blog.comments?.length || 0
    }));
    console.log("Blogs whole : ",blogsWithCounts)
    res.json({
      success: true,
      blogs: blogsWithCounts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =====================================
// GET FEATURED BLOGS
// =====================================
router.get('/blogs/featured', async (req, res) => {
  try {
    const blogs = await Blog.find({ 
      status: 'published',
      featured: true 
    })
      .populate('author', 'name email avatar')
      .sort('-publishedAt')
      .limit(6)
      .lean();

    res.json({
      success: true,
      blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =====================================
// GET POPULAR TAGS
// =====================================
router.get('/blogs/tags', async (req, res) => {
  try {
    const tags = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { 
        $group: { 
          _id: '$tags', 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 30 }
    ]);

    res.json({
      success: true,
      tags: tags.map(t => ({ name: t._id, count: t.count }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =====================================
// GET SINGLE BLOG (by slug or ID)
// =====================================
router.get('/blogs/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;
    
    // Check if it's an ObjectId or slug
    const query = mongoose.Types.ObjectId.isValid(slugOrId)
      ? { _id: slugOrId }
      : { slug: slugOrId };

    const blog = await Blog.findOne(query)
      .populate('author', 'name email avatar bio')
      .populate('comments.userId', 'name avatar')
      .lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    // Increment view count (do this asynchronously, don't wait)
    Blog.updateOne({ _id: blog._id }, { $inc: { views: 1 } }).exec();

    res.json({
      success: true,
      blog: {
        ...blog,
        likesCount: blog.likes?.length || 0,
        commentsCount: blog.comments?.length || 0
      }
    });
  } catch (error) {
    console.log("Error : ",error)
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =====================================
// CREATE BLOG (Protected)
// =====================================
router.post('/blogs', authenticate, async (req, res) => {
  try {
    const { title, content, tags, coverImage, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const blog = new Blog({
      title,
      slug,
      content,
      tags: tags || [],
      coverImage,
      author: req.user.id, // From auth middleware
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date() : null
    });

    await blog.save();

    const populatedBlog = await Blog.findById(blog._id)
      .populate('author', 'name email avatar');
    console.log("Blog : ",populatedBlog)
    res.status(201).json({
      success: true,
      blogs: populatedBlog
    });
  } catch (error) {
    console.log("error : ",error)
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =====================================
// UPDATE BLOG (Protected)
// =====================================
router.put('/blogs/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, coverImage, status } = req.body;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own blogs'
      });
    }

    // Update fields
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (tags) blog.tags = tags;
    if (coverImage !== undefined) blog.coverImage = coverImage;
    if (status) {
      blog.status = status;
      if (status === 'published' && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }
    }

    await blog.save();

    const updatedBlog = await Blog.findById(blog._id)
      .populate('author', 'name email avatar');

    res.json({
      success: true,
      blog: updatedBlog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =====================================
// DELETE BLOG (Protected)
// =====================================
router.delete('/blogs/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own blogs'
      });
    }

    await blog.deleteOne();

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =====================================
// LIKE/UNLIKE BLOG (Protected)
// =====================================
router.post('/blogs/:id/like', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const likeIndex = blog.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      blog.likes.splice(likeIndex, 1);
    } else {
      // Like
      blog.likes.push(userId);
    }

    await blog.save();

    res.json({
      success: true,
      liked: likeIndex === -1,
      likesCount: blog.likes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =====================================
// ADD COMMENT (Protected)
// =====================================
router.post('/blogs/:id/comments', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    blog.comments.push({
      userId: req.user.id,
      content: content.trim()
    });

    await blog.save();

    const updatedBlog = await Blog.findById(id)
      .populate('comments.userId', 'name avatar');

    res.status(201).json({
      success: true,
      comments: updatedBlog.comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =====================================
// DELETE COMMENT (Protected)
// =====================================
router.delete('/blogs/:blogId/comments/:commentId', authenticate, async (req, res) => {
  try {
    const { blogId, commentId } = req.params;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const comment = blog.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is the comment author or blog author
    if (comment.userId.toString() !== req.user.id && blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments'
      });
    }

    comment.deleteOne();
    await blog.save();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =====================================
// GET USER'S BLOGS (Protected)
// =====================================
router.get('/users/:userId/blogs', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find({ author: userId, status: 'published' })
        .populate('author', 'name email avatar')
        .sort('-publishedAt')
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Blog.countDocuments({ author: userId, status: 'published' })
    ]);

    res.json({
      success: true,
      blogs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;