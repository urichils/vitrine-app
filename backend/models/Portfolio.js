// models/Portfolio.js
const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    default: 'My Portfolio'
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  elements: {
    type: Array,
    default: []
  },
  canvas: {
    height: {
      type: Number,
      default: 1200
    },
    background: {
      type: String,
      default: '#ffffff'
    }
  },
  isPublished: {
    type: Boolean,
    default: false,
    index: true
  },
  publishedAt: {
    type: Date,
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updatedAt timestamp before saving
portfolioSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create compound index for userId and slug lookups
portfolioSchema.index({ userId: 1, slug: 1 });

// Index for public portfolio lookups
portfolioSchema.index({ isPublished: 1, slug: 1 });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;