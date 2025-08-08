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
    const user = await User.findById(req.auth.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view all comments' });
    }

    const { page = 1, limit = 20, sort = '-createdAt', post, author } = req.query;
    const filter = {};

    if (post) filter.post = post;
    if (author) filter.author = author;

    const comments = await Comment.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'name avatar')
      .populate('post', 'title slug');

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
    const { page = 1, limit = 10, sort = '-createdAt', parent = 'null' } = req.query;
    const filter = {
      post: req.params.postId
    };

    if (parent === 'null') {
      filter.parent = null;
    } else if (parent) {
      filter.parent = parent;
    }

    const comments = await Comment.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'name avatar')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'name avatar' }
      });

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
// @access  Public / Private
router.post(
  '/',
  [
    body('content', 'Comment content is required').not().isEmpty().trim(),
    body('post', 'Post ID is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { content, post, parent, isAnonymous = false, guestInfo } = req.body;

      const postExists = await Post.findById(post);
      if (!postExists) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if (parent) {
        const parentComment = await Comment.findById(parent);
        if (!parentComment) {
          return res.status(404).json({ message: 'Parent comment not found' });
        }
      }

      const commentData = {
        content,
        post,
        parent: parent || null,
        isAnonymous
      };

      if (req.auth && req.auth.id) {
        commentData.author = req.auth.id;
      } else if (isAnonymous && guestInfo) {
        commentData.guestInfo = {
          name: guestInfo.name || 'Anonymous',
          email: guestInfo.email
        };
      } else {
        return res.status(400).json({
          message: 'Authentication required or guest information must be provided'
        });
      }

      const comment = new Comment(commentData);
      await comment.save();

      await Post.findByIdAndUpdate(post, {
        $push: { comments: comment._id }
      });

      if (req.auth && req.auth.id) {
        await User.findByIdAndUpdate(req.auth.id, {
          $push: { comments: comment._id }
        });
      }

      res.status(201).json({ success: true, data: comment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   PUT /api/comments/:id
// @desc    Edit a comment
// @access  Private (Author or Admin)
router.put('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const user = await User.findById(req.auth.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isAdmin = user.role === 'admin';
    const isAuthor = comment.author && comment.author.toString() === req.auth.id;

    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    const { content } = req.body;
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json({ success: true, data: comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private (Author or Admin)
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const user = await User.findById(req.auth.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isAdmin = user.role === 'admin';
    const isAuthor = comment.author && comment.author.toString() === req.auth.id;

    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();

    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id }
    });

    if (comment.author) {
      await User.findByIdAndUpdate(comment.author, {
        $pull: { comments: comment._id }
      });
    }

    res.status(200).json({ success: true, data: {} });
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

    const userId = req.auth.id;
    const likedIndex = comment.likes.findIndex(like => like.toString() === userId);

    if (likedIndex !== -1) {
      // User already liked -> unlike
      comment.likes.splice(likedIndex, 1);
      await comment.save();

      return res.status(200).json({
        success: true,
        action: 'unliked',
        data: { likesCount: comment.likes.length }
      });
    } else {
      // User hasn't liked yet -> like
      comment.likes.push(userId);
      await comment.save();

      return res.status(200).json({
        success: true,
        action: 'liked',
        data: { likesCount: comment.likes.length }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PATCH /api/comments/:id/status
// @desc    Update comment status
// @access  Private (Admin only)
router.patch('/:id/status', async (req, res) => {
  try {
    const user = await User.findById(req.auth.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update comment status' });
    }

    const { status } = req.body;
    if (!['pending', 'approved', 'rejected', 'spam'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

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

module.exports = router;
