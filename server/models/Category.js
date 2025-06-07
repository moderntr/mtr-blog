const mongoose = require('mongoose');
const slugify = require('slugify');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot be more than 50 characters']
    },
    slug: {
      type: String,
      unique: true
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    image: {
      type: String,
      default: 'no-category-image.jpg'
    },
    featured: {
      type: Boolean,
      default: false
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create slug from name
CategorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true
    });
  }
  next();
});

// Virtual to get posts in this category
CategorySchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'categories',
  justOne: false
});

// Virtual to get subcategories
CategorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
  justOne: false
});

module.exports = mongoose.model('Category', CategorySchema);