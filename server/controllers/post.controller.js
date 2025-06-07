const Post = require('../models/Post');
const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.getPosts = async (req, res) => {
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

    const filter = { status };

    if (category) filter.categories = category;
    if (tag) filter.tags = tag;
    if (author) filter.author = author;
    if (featured === 'true') filter.featured = true;
    if (search) filter.$text = { $search: search };

    const posts = await Post.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'name avatar')
      .populate('categories', 'name slug');

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
};

exports.getPost = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    
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

    post.views += 1;
    await post.save();

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
};

exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
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

    await post.save();

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
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(req.auth.id);
    
    if (!user || (user.role !== 'admin' && post.author.toString() !== req.auth.id)) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    if (req.body.featured !== undefined && user.role !== 'admin') {
      delete req.body.featured;
    }

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
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(req.auth.id);
    
    if (!user || (user.role !== 'admin' && post.author.toString() !== req.auth.id)) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();

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
};