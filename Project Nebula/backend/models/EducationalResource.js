const mongoose = require('mongoose');

const EducationalResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  resourceType: {
    type: String,
    enum: ['Video', 'Article', 'Podcast', 'Blog Post', 'Conference', 'Webinar', 'Research Paper', 'Guide', 'Other'],
    required: true
  },
  category: {
    type: String,
    enum: ['Treatment', 'Nutrition', 'Mental Health', 'Research', 'Exercise', 'General Information', 'Patient Stories', 'Medical Updates', 'Other'],
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  imageUrl: {
    type: String,
    default: ''
  },
  publishedDate: {
    type: Date,
    default: Date.now
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
EducationalResourceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('EducationalResource', EducationalResourceSchema);
