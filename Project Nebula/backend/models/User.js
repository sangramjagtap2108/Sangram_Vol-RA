const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long']
  },
  ageGroup: {
    type: String,
    enum: ['Under 13', '13–18', '18+'],
    required: true
  },
  interests: {
    type: [String],
    default: []
  },
  favoriteActivities: {
    games: {
      type: [String],
      default: []
    },
    videos: {
      type: [String],
      default: []
    }
  },
  typeOfMutation: {
    type: String,
    enum: ['abc', 'xyz', 'I don\'t know', 'I don\'t want to tell'],
    required: true
  },
  termsAccepted: {
    type: Boolean,
    required: true
  },
  privacySettings: {
    isProfilePublic: {
      type: Boolean,
      default: true
    }
  },
  avatar: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('User', UserSchema);