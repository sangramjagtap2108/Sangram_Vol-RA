const Event = require('../models/Event');

// Get all events with optional filters
exports.getAllEvents = async (req, res) => {
  try {
    const { status, eventType, isVirtual, upcoming } = req.query;
    
    let filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (eventType) {
      filter.eventType = eventType;
    }
    
    if (isVirtual !== undefined) {
      filter.isVirtual = isVirtual === 'true';
    }
    
    if (upcoming === 'true') {
      filter.startDate = { $gte: new Date() };
      filter.status = { $in: ['Upcoming', 'Ongoing'] };
    }
    
    const events = await Event.find(filter)
      .populate('createdBy', 'name email')
      .sort({ startDate: 1 });
    
    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('registeredAttendees.userId', 'name email');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      eventType,
      startDate,
      endDate,
      location,
      isVirtual,
      virtualLink,
      organizer,
      maxAttendees,
      tags,
      imageUrl
    } = req.body;
    
    // Validation
    if (!title || !description || !eventType || !startDate || !location || !organizer) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, eventType, startDate, location, and organizer'
      });
    }
    
    // Validate dates
    const start = new Date(startDate);
    if (start < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past'
      });
    }
    
    if (endDate) {
      const end = new Date(endDate);
      if (end < start) {
        return res.status(400).json({
          success: false,
          message: 'End date cannot be before start date'
        });
      }
    }
    
    const event = new Event({
      title,
      description,
      eventType,
      startDate,
      endDate,
      location,
      isVirtual: isVirtual || false,
      virtualLink: virtualLink || '',
      organizer,
      maxAttendees: maxAttendees || null,
      tags: tags || [],
      imageUrl: imageUrl || '',
      createdBy: req.user.userId,
      status: 'Upcoming'
    });
    
    await event.save();
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if user is the creator
    if (event.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this event'
      });
    }
    
    // Update fields
    const allowedUpdates = [
      'title', 'description', 'eventType', 'startDate', 'endDate',
      'location', 'isVirtual', 'virtualLink', 'organizer',
      'maxAttendees', 'tags', 'imageUrl', 'status'
    ];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });
    
    await event.save();
    
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if user is the creator
    if (event.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this event'
      });
    }
    
    await Event.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

// Register for an event
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if event is full
    if (event.maxAttendees && event.registeredAttendees.length >= event.maxAttendees) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }
    
    // Check if user is already registered
    const alreadyRegistered = event.registeredAttendees.some(
      attendee => attendee.userId && attendee.userId.toString() === req.user.userId
    );
    
    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }
    
    // Add user to registered attendees
    event.registeredAttendees.push({
      userId: req.user.userId,
      userName: req.body.userName || '',
      userEmail: req.body.userEmail || '',
      registeredAt: new Date()
    });
    
    await event.save();
    
    res.status(200).json({
      success: true,
      message: 'Successfully registered for event',
      event
    });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering for event',
      error: error.message
    });
  }
};

// Unregister from an event
exports.unregisterFromEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Find and remove user from registered attendees
    const initialLength = event.registeredAttendees.length;
    event.registeredAttendees = event.registeredAttendees.filter(
      attendee => attendee.userId && attendee.userId.toString() !== req.user.userId
    );
    
    if (event.registeredAttendees.length === initialLength) {
      return res.status(400).json({
        success: false,
        message: 'You are not registered for this event'
      });
    }
    
    await event.save();
    
    res.status(200).json({
      success: true,
      message: 'Successfully unregistered from event',
      event
    });
  } catch (error) {
    console.error('Error unregistering from event:', error);
    res.status(500).json({
      success: false,
      message: 'Error unregistering from event',
      error: error.message
    });
  }
};

// Get user's registered events
exports.getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({
      'registeredAttendees.userId': req.user.userId
    })
    .populate('createdBy', 'name email')
    .sort({ startDate: 1 });
    
    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user events',
      error: error.message
    });
  }
};
