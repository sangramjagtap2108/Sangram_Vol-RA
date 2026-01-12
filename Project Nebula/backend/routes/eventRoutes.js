const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getUserEvents
} = require('../controllers/eventController');

// Public routes (can view events without auth)
router.get('/events', getAllEvents);
router.get('/events/:id', getEventById);

// Protected routes (require authentication)
router.post('/events', auth, createEvent);
router.put('/events/:id', auth, updateEvent);
router.delete('/events/:id', auth, deleteEvent);
router.post('/events/:id/register', auth, registerForEvent);
router.delete('/events/:id/unregister', auth, unregisterFromEvent);
router.get('/my-events', auth, getUserEvents);

module.exports = router;
