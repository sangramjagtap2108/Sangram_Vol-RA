const { scheduleReminder, getUserReminders, cancelReminder } = require('../services/emailService');

exports.scheduleTreatmentReminder = async (req, res) => {
  try {
    const { treatmentDateTime, duration, userEmail, userName } = req.body;
    
    if (!treatmentDateTime || !duration || !userEmail || !userName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: treatmentDateTime, duration, userEmail, userName'
      });
    }
    
    const treatmentTime = new Date(treatmentDateTime);
    const now = new Date();
    
    if (treatmentTime <= now) {
      return res.status(400).json({
        success: false,
        message: 'Treatment time must be in the future'
      });
    }
    
    const result = scheduleReminder(userEmail, userName, treatmentTime, duration);
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Treatment reminder scheduled successfully',
        reminderId: result.reminderId,
        reminderTime: result.reminderTime
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
    
  } catch (error) {
    console.error('Error scheduling treatment reminder:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while scheduling the reminder'
    });
  }
};

exports.getUserTreatmentReminders = async (req, res) => {
  try {
    const { userEmail } = req.params;
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }
    
    const reminders = getUserReminders(userEmail);
    
    res.status(200).json({
      success: true,
      reminders
    });
    
  } catch (error) {
    console.error('Error fetching user reminders:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching reminders'
    });
  }
};

exports.cancelTreatmentReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;
    
    if (!reminderId) {
      return res.status(400).json({
        success: false,
        message: 'Reminder ID is required'
      });
    }
    
    const result = cancelReminder(parseInt(reminderId));
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.error
      });
    }
    
  } catch (error) {
    console.error('Error cancelling treatment reminder:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while cancelling the reminder'
    });
  }
};