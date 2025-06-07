const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const User = require('../models/User');

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { sort = 'name', featured } = req.query;
    
    // Build filter
    const filter = {};
    
    if (featured === 'true') {
      filter.featured = true;
    }
    
    const categories = await Category.find(filter).sort(sort);
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/categories/:idOrSlug
// @desc    Get category by ID or slug
// @access  Public
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    
    // Check if it's an ID or slug
    const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
    
    let category;
    if (isObjectId) {
      category = await Category.findById(idOrSlug);
    } else {
      category = await Category.findOne({ slug: idOrSlug });
    }

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private (Admin only)
router.post(
  '/',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty()
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
        return res.status(403).json({ message: 'Not authorized to create categories' });
      }

      const { name, description, image, featured = false, parent = null, order = 0 } = req.body;

      // Check if category already exists
      const existingCategory = await Category.findOne({ name });
      
      if (existingCategory) {
        return res.status(400).json({ message: 'Category already exists' });
      }

      // Create new category
      const category = new Category({
        name,
        description,
        image,
        featured,
        parent,
        order
      });

      // Save category
      await category.save();

      res.status(201).json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private (Admin only)
router.put('/:id', async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.auth.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update categories' });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.auth.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete categories' });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete category
    await category.deleteOne();

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