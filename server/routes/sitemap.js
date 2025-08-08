const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Category = require('../models/Category');
const User = require('../models/User');

// @route   GET /api/sitemap
// @desc    Get sitemap data for admin panel
// @access  Private (Admin only)
router.get('/', async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.auth.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access sitemap data' });
    }

    // Get counts
    const [postsCount, categoriesCount] = await Promise.all([
      Post.countDocuments({ status: 'published' }),
      Category.countDocuments()
    ]);

    // Get recent posts and categories for sitemap
    const [recentPosts, categories] = await Promise.all([
      Post.find({ status: 'published' })
        .select('slug title updatedAt createdAt')
        .sort('-updatedAt')
        .limit(1000),
      Category.find()
        .select('slug name updatedAt createdAt')
        .sort('name')
    ]);

    const staticPages = [
      { url: '/', priority: 1.0, changefreq: 'daily' },
      { url: '/about', priority: 0.8, changefreq: 'monthly' },
      { url: '/contact', priority: 0.8, changefreq: 'monthly' },
      { url: '/latest', priority: 0.9, changefreq: 'daily' }
    ];

    const sitemapData = {
      stats: {
        totalUrls: staticPages.length + postsCount + categoriesCount,
        posts: postsCount,
        categories: categoriesCount,
        staticPages: staticPages.length
      },
      urls: {
        static: staticPages,
        posts: recentPosts.map(post => ({
          url: `/blog/${post.slug}`,
          lastmod: post.updatedAt || post.createdAt,
          priority: 0.7,
          changefreq: 'weekly'
        })),
        categories: categories.map(category => ({
          url: `/categories/${category.slug}`,
          lastmod: category.updatedAt || category.createdAt,
          priority: 0.6,
          changefreq: 'weekly'
        }))
      },
      lastGenerated: new Date()
    };

    res.status(200).json({
      success: true,
      data: sitemapData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/sitemap/generate
// @desc    Trigger sitemap regeneration
// @access  Private (Admin only)
router.post('/generate', async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.auth.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to generate sitemap' });
    }

    // In a real implementation, you might trigger a background job
    // For now, we'll just return success
    res.status(200).json({
      success: true,
      message: 'Sitemap generation triggered',
      timestamp: new Date()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;