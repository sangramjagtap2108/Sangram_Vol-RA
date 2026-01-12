const mongoose = require('mongoose');

const ResearchUpdateSchema = new mongoose.Schema({
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
  updateType: {
    type: String,
    enum: ['Clinical Trial', 'Research Study', 'Treatment Development', 'Medical Discovery', 'Health Survey', 'Drug Study', 'Technology', 'Other'],
    required: true
  },
  category: {
    type: String,
    enum: ['Treatment', 'Mental Health', 'Cancer Screening', 'CFTR Modulators', 'Clinical Trials', 'Gene Therapy', 'Drug Development', 'Community Health', 'Other'],
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
  isHighPriority: {
    type: Boolean,
    default: false
  },
  source: {
    type: String,
    default: ''
  },
  researchOrganization: {
    type: String,
    default: ''
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
ResearchUpdateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ResearchUpdate', ResearchUpdateSchema);
