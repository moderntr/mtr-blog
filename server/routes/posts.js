const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');

// @route   GET /api/posts
// @desc    Get all posts with pagination and filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      status = 'published',
      category,
      tag,
      author,
      search,
      featured
    } = req.query;

    // Build filter object
    const filter = { status };

    // Add category filter if provided
    if (category) {
      filter.categories = category;
    }

    // Add tag filter if provided
    if (tag) {
      filter.tags = tag;
    }

    // Add author filter if provided
    if (author) {
      filter.author = author;
    }

    // Add featured filter if provided
    if (featured === 'true') {
      filter.featured = true;
    }

    // Add search filter if provided
    if (search) {
      filter.$text = { $search: search };
    }

    // Get posts with pagination
    const posts = await Post.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'name avatar')
      .populate('categories', 'name slug');

    // Get total count for pagination
    const total = await Post.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: posts.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      },
      data: posts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/posts/featured
// @desc    Get featured posts
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const posts = await Post.find({ status: 'published', featured: true })
      .sort('-createdAt')
      .limit(parseInt(limit))
      .populate('author', 'name avatar')
      .populate('categories', 'name slug');

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get post by ID or slug
// @access  Public
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    
    // Check if it's an ID or slug
    const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
    
    let post;
    if (isObjectId) {
      post = await Post.findById(idOrSlug);
    } else {
      post = await Post.findOne({ slug: idOrSlug });
    }

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    // Populate post data
    await post.populate('author', 'name avatar bio');
    await post.populate('categories', 'name slug');
    await post.populate({
      path: 'comments',
      match: { status: 'approved', parent: null },
      populate: {
        path: 'author',
        select: 'name avatar'
      }
    });

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private (Writer, Admin)
router.post(
  '/',
  [
    body('title', 'Title is required').not().isEmpty(),
    body('content', 'Content is required').not().isEmpty(),
    body('categories', 'At least one category is required').isArray({ min: 1 })
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if user is writer or admin
      const user = await User.findById(req.auth.id);
      
      if (!user || (user.role !== 'writer' && user.role !== 'admin')) {
        return res.status(403).json({ message: 'Not authorized to create posts' });
      }

      const {
        title,
        content,
        excerpt,
        featuredImage,
        categories,
        tags,
        status = user.role === 'admin' ? 'published' : 'draft',
        seo,
        featured = false
      } = req.body;

      // Create new post
      const post = new Post({
        title,
        content,
        excerpt: excerpt || content.substring(0, 160) + '...',
        featuredImage,
        categories,
        tags,
        author: req.auth.id,
        status,
        seo,
        featured: user.role === 'admin' ? featured : false
      });

      // Save post
      await post.save();

      // Add post to user's posts
      user.posts.push(post._id);
      await user.save();

      res.status(201).json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private (Post Author, Admin)
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is post author or admin
    const user = await User.findById(req.auth.id);
    
    if (!user || (user.role !== 'admin' && post.author.toString() !== req.auth.id)) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    // Only allow admin to change featured status
    if (req.body.featured !== undefined && user.role !== 'admin') {
      delete req.body.featured;
    }

    // Update post
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedPost
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private (Post Author, Admin)
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is post author or admin
    const user = await User.findById(req.auth.id);
    
    if (!user || (user.role !== 'admin' && post.author.toString() !== req.auth.id)) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete post
    await post.deleteOne();

    // Remove post from user's posts
    await User.findByIdAndUpdate(post.author, {
      $pull: { posts: post._id }
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Like a post
// @access  Private
router.post('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if post is already liked
    if (post.likes.includes(req.auth.id)) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    // Add user to likes
    post.likes.push(req.auth.id);
    await post.save();

    // Add post to user's liked posts
    await User.findByIdAndUpdate(req.auth.id, {
      $push: { likedPosts: post._id }
    });

    res.status(200).json({
      success: true,
      data: { likesCount: post.likes.length }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/posts/:id/unlike
// @desc    Unlike a post
// @access  Private
router.post('/:id/unlike', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if post is not liked
    if (!post.likes.includes(req.auth.id)) {
      return res.status(400).json({ message: 'Post not liked yet' });
    }

    // Remove user from likes
    post.likes = post.likes.filter(
      like => like.toString() !== req.auth.id
    );
    await post.save();

    // Remove post from user's liked posts
    await User.findByIdAndUpdate(req.auth.id, {
      $pull: { likedPosts: post._id }
    });

    res.status(200).json({
      success: true,
      data: { likesCount: post.likes.length }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;