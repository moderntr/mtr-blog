const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');

// @route   GET /api/comments
// @desc    Get all comments with pagination and filters
// @access  Private (Admin only)
router.get('/', async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.auth.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view all comments' });
    }

    const {
      page = 1,
      limit = 20,
      sort = '-createdAt',
      status,
      post,
      author
    } = req.query;

    // Build filter object
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (post) {
      filter.post = post;
    }

    if (author) {
      filter.author = author;
    }

    // Get comments with pagination
    const comments = await Comment.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'name avatar')
      .populate('post', 'title slug');

    // Get total count for pagination
    const total = await Comment.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: comments.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      },
      data: comments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/comments/post/:postId
// @desc    Get comments for a specific post
// @access  Public
router.get('/post/:postId', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      parent = 'null'
    } = req.query;

    const filter = {
      post: req.params.postId,
      status: 'approved'
    };

    // Filter by parent comment (null for top-level comments)
    if (parent === 'null') {
      filter.parent = null;
    } else if (parent) {
      filter.parent = parent;
    }

    // Get comments with pagination
    const comments = await Comment.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'name avatar')
      .populate({
        path: 'replies',
        match: { status: 'approved' },
        populate: {
          path: 'author',
          select: 'name avatar'
        }
      });

    // Get total count for pagination
    const total = await Comment.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: comments.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      },
      data: comments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/comments
// @desc    Create a new comment
// @access  Public (for anonymous) / Private (for authenticated)
router.post(
  '/',
  [
    body('content', 'Comment content is required').not().isEmpty().trim(),
    body('post', 'Post ID is required').not().isEmpty()
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { content, post, parent, isAnonymous = false, guestInfo } = req.body;

      // Check if post exists
      const postExists = await Post.findById(post);
      
      if (!postExists) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Check if parent comment exists if provided
      if (parent) {
        const parentComment = await Comment.findById(parent);
        
        if (!parentComment) {
          return res.status(404).json({ message: 'Parent comment not found' });
        }
      }

      // Create comment object
      const commentData = {
        content,
        post,
        parent: parent || null,
        isAnonymous
      };

      // If authenticated user
      if (req.auth && req.auth.id) {
        commentData.author = req.auth.id;
        commentData.status = 'pending'; // Default for authenticated users
      } 
      // If anonymous user
      else if (isAnonymous && guestInfo) {
        commentData.guestInfo = {
          name: guestInfo.name || 'Anonymous',
          email: guestInfo.email
        };
        commentData.status = 'pending'; // Default for anonymous users
      } else {
        return res.status(400).json({ 
          message: 'Authentication required or guest information must be provided' 
        });
      }

      // Create comment
      const comment = new Comment(commentData);
      
      // Save comment
      await comment.save();

      // Add comment to post's comments array
      await Post.findByIdAndUpdate(post, {
        $push: { comments: comment._id }
      });

      // If authenticated user, add comment to user's comments array
      if (req.auth && req.auth.id) {
        await User.findByIdAndUpdate(req.auth.id, {
          $push: { comments: comment._id }
        });
      }

      res.status(201).json({
        success: true,
        data: comment
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   PUT /api/comments/:id/status
// @desc    Update comment status (approve, reject, mark as spam)
// @access  Private (Admin only)
router.put('/:id/status', async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.auth.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update comment status' });
    }

    const { status } = req.body;

    if (!['pending', 'approved', 'rejected', 'spam'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Update comment status
    comment.status = status;
    await comment.save();

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/comments/:id/like
// @desc    Like a comment
// @access  Private
router.post('/:id/like', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if comment is already liked
    if (comment.likes.includes(req.auth.id)) {
      return res.status(400).json({ message: 'Comment already liked' });
    }

    // Add user to likes
    comment.likes.push(req.auth.id);
    await comment.save();

    res.status(200).json({
      success: true,
      data: { likesCount: comment.likes.length }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private (Comment Author, Admin)
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is comment author or admin
    const user = await User.findById(req.auth.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isAdmin = user.role === 'admin';
    const isAuthor = comment.author && comment.author.toString() === req.auth.id;

    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Delete comment
    await comment.deleteOne();

    // Remove comment from post's comments array
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id }
    });

    // If authenticated user, remove comment from user's comments array
    if (comment.author) {
      await User.findByIdAndUpdate(comment.author, {
        $pull: { comments: comment._id }
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;