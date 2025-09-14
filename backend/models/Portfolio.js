const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true,
  },
  name: String,
  bio: String,
  projects: [
    {
      title: String,
      description: String,
      link: String,
    },
  ],
  slug: {
    type: String,
    unique: true,
    required: true
  }
})

const sectionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  content: { type: mongoose.Schema.Types.Mixed },
  images: [{ type: String }]
});

module.exports = mongoose.model('Portfolio', portfolioSchema);