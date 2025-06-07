const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Please add a comment'],
      trim: true,
      maxlength: [1000, 'Comment cannot be more than 1000 characters']
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'spam'],
      default: 'pending'
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    isAnonymous: {
      type: Boolean,
      default: false
    },
    guestInfo: {
      name: String,
      email: String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual to get replies to this comment
CommentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent',
  justOne: false
});

// Virtual to get likes count
CommentSchema.virtual('likesCount').get(function () {
  return this.likes.length;
});

module.exports = mongoose.model('Comment', CommentSchema);