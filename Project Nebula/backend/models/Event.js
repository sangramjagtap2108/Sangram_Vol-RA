const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    enum: ['Webinar', 'Workshop', 'Support Group', 'Fundraiser', 'Awareness Campaign', 'Conference', 'Social Gathering', 'Other'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: false
  },
  location: {
    type: String,
    required: true
  },
  isVirtual: {
    type: Boolean,
    default: false
  },
  virtualLink: {
    type: String,
    default: ''
  },
  organizer: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    organization: {
      type: String,
      default: ''
    }
  },
  maxAttendees: {
    type: Number,
    default: null // null means unlimited
  },
  registeredAttendees: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: String,
    userEmail: String,
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: {
    type: [String],
    default: []
  },
  imageUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
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
EventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual property to check if event is full
EventSchema.virtual('isFull').get(function() {
  if (!this.maxAttendees) return false;
  return this.registeredAttendees.length >= this.maxAttendees;
});

module.exports = mongoose.model('Event', EventSchema);
