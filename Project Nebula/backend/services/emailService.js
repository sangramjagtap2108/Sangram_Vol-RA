const nodemailer = require('nodemailer');
const cron = require('node-cron');

// Store scheduled reminders in memory (in production, use database)
let scheduledReminders = [];

// Create email transporter
const createTransporter = () => {
  // For development, you can use a test service like Ethereal or Gmail
  // For production, use services like SendGrid, AWS SES, etc.
  
  return nodemailer.createTransporter({
    // Gmail configuration (requires app password)
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS  // Your Gmail app password
    }
    
    // Alternative: Use Ethereal for testing (creates test accounts)
    /*
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
    */
  });
};

// Send treatment reminder email
const sendTreatmentReminder = async (userEmail, userName, treatmentTime, duration) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@projectnebula.com',
      to: userEmail,
      subject: '🏥 Treatment Reminder - Project Nebula',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(90deg, #74b9ff, #0984e3); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🏥 Treatment Reminder</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Hi ${userName}!</h2>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5;">
              This is a friendly reminder that your treatment session is scheduled for:
            </p>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2196f3;">
              <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1976d2;">
                📅 ${new Date(treatmentTime).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p style="margin: 5px 0 0 0; font-size: 16px; color: #1976d2;">
                🕐 ${new Date(treatmentTime).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
                Duration: ${duration} minutes
              </p>
            </div>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5;">
              Remember to:
            </p>
            <ul style="color: #555; font-size: 14px; line-height: 1.6;">
              <li>Take your medications as prescribed</li>
              <li>Have a comfortable space ready</li>
              <li>Stay hydrated</li>
              <li>Log into Project Nebula to start your session</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000" style="background: linear-gradient(90deg, #7bed9f, #2ed573); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Start Treatment Session
              </a>
            </div>
            
            <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              This is an automated reminder from Project Nebula. You're receiving this because you scheduled a treatment reminder.
            </p>
          </div>
        </div>
      `,
      text: `
        Treatment Reminder - Project Nebula
        
        Hi ${userName}!
        
        This is a reminder that your treatment session is scheduled for:
        Date: ${new Date(treatmentTime).toLocaleDateString()}
        Time: ${new Date(treatmentTime).toLocaleTimeString()}
        Duration: ${duration} minutes
        
        Remember to take your medications and log into Project Nebula to start your session.
        
        Visit: http://localhost:3000
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Treatment reminder email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error sending treatment reminder email:', error);
    return { success: false, error: error.message };
  }
};

// Schedule a treatment reminder
const scheduleReminder = (userEmail, userName, treatmentTime, duration) => {
  const reminderTime = new Date(treatmentTime.getTime() - 30 * 60 * 1000); // 30 minutes before
  const now = new Date();
  
  if (reminderTime <= now) {
    console.log('Reminder time is in the past, not scheduling');
    return { success: false, error: 'Reminder time is in the past' };
  }
  
  const reminderId = Date.now() + Math.random();
  
  // Calculate cron expression for the reminder time
  const cronExpression = `${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${reminderTime.getMonth() + 1} *`;
  
  console.log(`Scheduling reminder for ${reminderTime.toISOString()} with cron: ${cronExpression}`);
  
  const task = cron.schedule(cronExpression, async () => {
    console.log('Sending scheduled treatment reminder...');
    await sendTreatmentReminder(userEmail, userName, treatmentTime, duration);
    
    // Remove from scheduled reminders after sending
    scheduledReminders = scheduledReminders.filter(r => r.id !== reminderId);
    
    // Destroy the cron task
    task.destroy();
  }, {
    scheduled: false // Don't start immediately
  });
  
  // Store the reminder info
  scheduledReminders.push({
    id: reminderId,
    userEmail,
    userName,
    treatmentTime,
    reminderTime,
    duration,
    task
  });
  
  // Start the cron task
  task.start();
  
  return { 
    success: true, 
    reminderId, 
    reminderTime: reminderTime.toISOString(),
    message: 'Reminder scheduled successfully' 
  };
};

// Get all scheduled reminders for a user
const getUserReminders = (userEmail) => {
  return scheduledReminders
    .filter(r => r.userEmail === userEmail)
    .map(r => ({
      id: r.id,
      treatmentTime: r.treatmentTime,
      reminderTime: r.reminderTime,
      duration: r.duration
    }));
};

// Cancel a scheduled reminder
const cancelReminder = (reminderId) => {
  const reminderIndex = scheduledReminders.findIndex(r => r.id === reminderId);
  
  if (reminderIndex !== -1) {
    const reminder = scheduledReminders[reminderIndex];
    reminder.task.destroy();
    scheduledReminders.splice(reminderIndex, 1);
    return { success: true, message: 'Reminder cancelled successfully' };
  }
  
  return { success: false, error: 'Reminder not found' };
};

module.exports = {
  sendTreatmentReminder,
  scheduleReminder,
  getUserReminders,
  cancelReminder
};