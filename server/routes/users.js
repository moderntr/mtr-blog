const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (Admin only)
router.get('/', async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.auth.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view users' });
    }

    const {
      page = 1,
      limit = 20,
      sort = 'name',
      role,
      search
    } = req.query;

    // Build filter object
    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Get users with pagination
    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      },
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Admin or own profile)
router.get('/:id', async (req, res) => {
  try {
    const requestedUser = await User.findById(req.params.id)
      .select('-password')
      .populate('posts', 'title slug featuredImage createdAt');

    if (!requestedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is admin or own profile
    const isAdmin = req.auth.role === 'admin';
    const isOwnProfile = req.auth.id === req.params.id;

    if (!isAdmin && !isOwnProfile) {
      return res.status(403).json({ message: 'Not authorized to view this profile' });
    }

    res.status(200).json({
      success: true,
      data: requestedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin or own profile)
router.put(
  '/:id',
  [
    body('name', 'Name is required').optional().not().isEmpty(),
    body('email', 'Please include a valid email').optional().isEmail()
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if user is admin or own profile
      const isAdmin = req.auth.role === 'admin';
      const isOwnProfile = req.auth.id === req.params.id;

      if (!isAdmin && !isOwnProfile) {
        return res.status(403).json({ message: 'Not authorized to update this profile' });
      }

      // Only admin can update role
      if (req.body.role && !isAdmin) {
        return res.status(403).json({ message: 'Not authorized to update role' });
      }

      // Prevent email change if the email is already taken
      if (req.body.email) {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser && existingUser._id.toString() !== req.params.id) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }

      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        success: true,
        data: updatedUser
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   PUT /api/users/:id/role
// @desc    Update user role (admin only)
// @access  Private (Admin only)
router.put(
  '/:id/role',
  [
    body('role', 'Role is required').not().isEmpty(),
    body('role', 'Invalid role').isIn(['admin', 'writer', 'user'])
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if user is admin
      const user = await User.findById(req.auth.id);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update user roles' });
      }

      const { role } = req.body;

      // Update user role
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        success: true,
        data: updatedUser
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.auth.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete users' });
    }

    // Prevent deleting yourself
    if (req.auth.id === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user
    await userToDelete.deleteOne();

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