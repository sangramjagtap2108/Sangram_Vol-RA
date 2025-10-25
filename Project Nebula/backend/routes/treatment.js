const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  scheduleTreatmentReminder,
  getUserTreatmentReminders,
  cancelTreatmentReminder
} = require('../controllers/treatmentController');

// Schedule a new treatment reminder
router.post('/schedule-reminder', auth, scheduleTreatmentReminder);

// Get all reminders for a user
router.get('/reminders/:userEmail', auth, getUserTreatmentReminders);

// Cancel a specific reminder
router.delete('/reminder/:reminderId', auth, cancelTreatmentReminder);

module.exports = router;