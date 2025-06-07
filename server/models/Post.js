const mongoose = require('mongoose');
const slugify = require('slugify');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    slug: {
      type: String,
      unique: true
    },
    content: {
      type: String,
      required: [true, 'Please add content']
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot be more than 500 characters']
    },
    featuredImage: {
      type: String,
      default: 'no-image.jpg'
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      }
    ],
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    readTime: {
      type: Number,
      default: 5
    },
    views: {
      type: Number,
      default: 0
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      canonicalUrl: String,
      ogImage: String
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create slug from title
PostSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true
    });
  }
  next();
});

// Calculate likes count
PostSchema.virtual('likesCount').get(function () {
  return this.likes.length;
});

// Calculate comments count
PostSchema.virtual('commentsCount').get(function () {
  return this.comments.length;
});

// Middleware to update read time based on content length
PostSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    this.readTime = readTime < 1 ? 1 : readTime;
  }
  next();
});

// Index for efficient searching
PostSchema.index({
  title: 'text',
  excerpt: 'text',
  content: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Post', PostSchema);