import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './TreatmentDashboard.css';

const TreatmentDashboard = () => {
  const { user } = useAuth();
  
  // Treatment Status State
  const [isInTreatment, setIsInTreatment] = useState(false);
  const [treatmentDuration, setTreatmentDuration] = useState(60); // minutes
  const [estimatedEndTime, setEstimatedEndTime] = useState(null);
  
  // Timer State
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerProgress, setTimerProgress] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [completedSessions, setCompletedSessions] = useState(0);

  // Custom Duration State
  const [customDurationValue, setCustomDurationValue] = useState('');
  const [customNextDurationValue, setCustomNextDurationValue] = useState('');

  // Treatment Planning State
  const [showPreTreatmentModal, setShowPreTreatmentModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [treatmentToReschedule, setTreatmentToReschedule] = useState(null);
  const [treatmentPlan, setTreatmentPlan] = useState({
    currentSymptoms: '',
    energyLevel: 5,
    sleepQuality: 5,
    medicationTaken: '',
    treatmentGoals: '',
    nextTreatmentHours: 24,
    nextTreatmentDateTime: '',
    nextTreatmentDuration: 60,
    reminderEmail: true
  });
  const [scheduledTreatments, setScheduledTreatments] = useState([]);

  // Timer Effect
  useEffect(() => {
    let interval = null;
    
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          const newTime = time - 1;
          const totalDuration = treatmentDuration * 60;
          setTimerProgress(((totalDuration - newTime) / totalDuration) * 100);
          
          // Halfway notification
          if (newTime === Math.floor(totalDuration / 2)) {
            showNotification('Halfway through your treatment session!');
          }
          
          // Nearly done notification (5 minutes left)
          if (newTime === 300) {
            showNotification('5 minutes left in your treatment session!');
          }
          
          // Session complete
          if (newTime <= 0) {
            setIsTimerActive(false);
            setIsInTreatment(false);
            setCompletedSessions(prev => prev + 1);
            showNotification('Treatment session completed! Great job!');
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else if (!isTimerActive) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining, treatmentDuration]);

  const showNotification = (message) => {
    if (Notification.permission === 'granted') {
      new Notification('Treatment Tracker', { body: message });
    }
  };

  const requestNotificationPermission = () => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  const handleStartTreatmentClick = () => {
    setShowPreTreatmentModal(true);
  };

  const startTreatment = () => {
    const endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + treatmentDuration);
    
    setIsInTreatment(true);
    setEstimatedEndTime(endTime);
    setTimeRemaining(treatmentDuration * 60);
    setIsTimerActive(true);
    setTimerProgress(0);
    setShowPreTreatmentModal(false);
    
    requestNotificationPermission();
  };

  const endTreatment = () => {
    setIsInTreatment(false);
    setIsTimerActive(false);
    setTimeRemaining(0);
    setTimerProgress(0);
    setEstimatedEndTime(null);
  };

  const scheduleReminderEmail = async (treatmentDateTime, duration) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/treatment/schedule-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          treatmentDateTime: treatmentDateTime.toISOString(),
          duration: duration,
          userEmail: user.email,
          userName: user.name
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification(`Email reminder scheduled for ${new Date(data.reminderTime).toLocaleString()}`);
        console.log('Reminder scheduled successfully:', data);
      } else {
        console.error('Failed to schedule reminder:', data.message);
        alert('Failed to schedule email reminder. Please try again.');
      }
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      alert('Error scheduling email reminder. Please check your connection.');
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatEstimatedTime = (date) => {
    return date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  };

  const handlePlanChange = (field, value) => {
    setTreatmentPlan(prev => ({ ...prev, [field]: value }));
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Minimum 30 minutes from now
    return now.toISOString().slice(0, 16);
  };

  const calculateNextTreatmentTime = () => {
    const now = new Date();
    const nextTime = new Date(now.getTime() + treatmentPlan.nextTreatmentHours * 60 * 60 * 1000);
    return nextTime.toISOString().slice(0, 16);
  };

  // eslint-disable-next-line no-unused-vars
  const handleHoursChange = (hours) => {
    const now = new Date();
    const nextTime = new Date(now.getTime() + hours * 60 * 60 * 1000);
    setTreatmentPlan(prev => ({
      ...prev,
      nextTreatmentHours: hours,
      nextTreatmentDateTime: nextTime.toISOString().slice(0, 16)
    }));
  };

  const saveTreatmentPlan = () => {
    // Use the datetime from input or calculate default time
    const scheduledTimeString = treatmentPlan.nextTreatmentDateTime || calculateNextTreatmentTime();
    const scheduledTime = new Date(scheduledTimeString);
    const now = new Date();
    
    if (scheduledTime <= now) {
      alert('Please select a future date and time for your next treatment.');
      return;
    }

    const newScheduledTreatment = {
      id: Date.now(),
      scheduledTime: scheduledTime,
      reminderEmail: treatmentPlan.reminderEmail,
      duration: treatmentPlan.nextTreatmentDuration,
      createdAt: new Date()
    };

    setScheduledTreatments(prev => [...prev, newScheduledTreatment]);
    
    if (treatmentPlan.reminderEmail) {
      // Schedule reminder with backend
      scheduleReminderEmail(scheduledTime, treatmentPlan.nextTreatmentDuration);
    }
    
    startTreatment();
  };

  const cancelTreatmentPlan = () => {
    setShowPreTreatmentModal(false);
    // Reset form
    setTreatmentPlan({
      currentSymptoms: '',
      energyLevel: 5,
      sleepQuality: 5,
      medicationTaken: '',
      treatmentGoals: '',
      nextTreatmentHours: 24,
      nextTreatmentDateTime: '',
      nextTreatmentDuration: 60,
      reminderEmail: true
    });
  };

  const cancelScheduledTreatment = (treatmentId) => {
    if (window.confirm('Are you sure you want to cancel this scheduled treatment?')) {
      setScheduledTreatments(prev => prev.filter(treatment => treatment.id !== treatmentId));
      showNotification('Treatment cancelled successfully');
    }
  };

  const openRescheduleModal = (treatment) => {
    setTreatmentToReschedule(treatment);
    setTreatmentPlan(prev => ({
      ...prev,
      nextTreatmentDateTime: treatment.scheduledTime.toISOString().slice(0, 16),
      nextTreatmentDuration: treatment.duration,
      reminderEmail: treatment.reminderEmail
    }));
    setShowRescheduleModal(true);
  };

  const saveRescheduledTreatment = () => {
    if (!treatmentPlan.nextTreatmentDateTime) {
      alert('Please select a date and time for the rescheduled treatment.');
      return;
    }

    const scheduledTime = new Date(treatmentPlan.nextTreatmentDateTime);
    const now = new Date();
    
    if (scheduledTime <= now) {
      alert('Please select a future date and time for your treatment.');
      return;
    }

    // Update the existing treatment
    setScheduledTreatments(prev => prev.map(treatment => 
      treatment.id === treatmentToReschedule.id 
        ? {
            ...treatment,
            scheduledTime: scheduledTime,
            duration: treatmentPlan.nextTreatmentDuration,
            reminderEmail: treatmentPlan.reminderEmail
          }
        : treatment
    ));

    if (treatmentPlan.reminderEmail) {
      scheduleReminderEmail(scheduledTime, treatmentPlan.nextTreatmentDuration);
    }

    setShowRescheduleModal(false);
    setTreatmentToReschedule(null);
    showNotification('Treatment rescheduled successfully');
  };

  const cancelReschedule = () => {
    setShowRescheduleModal(false);
    setTreatmentToReschedule(null);
  };

  return (
    <div className="treatment-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="user-info">
          <h1>Welcome back, {user.name}!</h1>
          <p>Ready for your treatment session?</p>
        </div>
      </div>

      {/* Treatment Status Section */}
      <div className="treatment-status-section">
        <h2>Treatment Status</h2>
        
        <div className="status-card">
          <div className="status-indicator">
            <div className={`status-light ${isInTreatment ? 'active' : 'inactive'}`}></div>
            <span className="status-text">
              {isInTreatment ? 'In Treatment' : 'Not in Treatment'}
            </span>
          </div>
          
          {isInTreatment && (
            <div className="treatment-info">
              <p>Estimated end time: {formatEstimatedTime(estimatedEndTime)}</p>
              <p>Duration: {treatmentDuration} minutes</p>
            </div>
          )}
        </div>

        {!isInTreatment ? (
          <div className="start-treatment">
            <div className="duration-selector">
              <label>Treatment Duration:</label>
              <select 
                value={treatmentDuration} 
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setTreatmentDuration(value);
                  if (value !== 0) {
                    setCustomDurationValue('');
                  }
                }}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={75}>75 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>2 hours</option>
                <option value={0}>Custom</option>
              </select>
              
              {treatmentDuration === 0 && (
                <div className="custom-duration">
                  <label>Custom Duration (minutes):</label>
                  <input
                    type="number"
                    min="1"
                    max="480"
                    value={customDurationValue}
                    placeholder="Enter minutes..."
                    onChange={(e) => {
                      setCustomDurationValue(e.target.value);
                    }}
                    onBlur={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setTreatmentDuration(Math.min(Math.max(value, 1), 480));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const value = parseInt(e.target.value) || 1;
                        setTreatmentDuration(Math.min(Math.max(value, 1), 480));
                        e.target.blur();
                      }
                    }}
                    className="custom-duration-input"
                  />
                </div>
              )}
            </div>
            
            <button onClick={handleStartTreatmentClick} className="start-button">
              Start Treatment
            </button>
          </div>
        ) : (
          <button onClick={endTreatment} className="end-button">
            End Treatment
          </button>
        )}
      </div>

      {/* Treatment Timer Section */}
      <div className="timer-section">
        <h2>Treatment Timer</h2>
        
        <div className="timer-card">
          <div className="timer-display">
            <div className="time-remaining">
              {formatTime(timeRemaining)}
            </div>
            
            {isTimerActive && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${timerProgress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{Math.round(timerProgress)}% Complete</span>
              </div>
            )}
          </div>
          
          {!isTimerActive && (
            <div className="timer-controls">
              <div className="timer-info">
                <p>Timer will use your selected treatment duration: <strong>{treatmentDuration} minutes</strong></p>
                <p>Change the duration in the Treatment Status section above.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section - Commented out for now */}
      {/* 
      <div className="stats-section">
        <h2>Your Progress</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{completedSessions}</div>
            <div className="stat-label">Sessions Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{completedSessions * customTimerDuration}</div>
            <div className="stat-label">Minutes Treated</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{completedSessions >= 7 ? '🔥' : '💪'}</div>
            <div className="stat-label">
              {completedSessions >= 7 ? 'On Fire!' : 'Keep Going!'}
            </div>
          </div>
        </div>
      </div>
      */}

      {/* Buddy List Preview - Commented out for now */}
      {/* 
      <div className="buddy-list-section">
        <h2>Treatment Buddies</h2>
        <div className="buddy-list">
          <div className="buddy-item">
            <div className="buddy-avatar">👤</div>
            <div className="buddy-info">
              <span className="buddy-name">Alex</span>
              <span className="buddy-status active">In treatment - 25 mins left</span>
            </div>
          </div>
          <div className="buddy-item">
            <div className="buddy-avatar">👤</div>
            <div className="buddy-info">
              <span className="buddy-name">Sam</span>
              <span className="buddy-status">Available</span>
            </div>
          </div>
          <div className="buddy-item">
            <div className="buddy-avatar">👤</div>
            <div className="buddy-info">
              <span className="buddy-name">Jamie</span>
              <span className="buddy-status private">Busy (Private)</span>
            </div>
          </div>
        </div>
      </div>
      */}

      {/* Scheduled Treatments Section */}
      <div className="scheduled-treatments-section">
        <h2>Scheduled Treatments</h2>
        {scheduledTreatments.length === 0 ? (
          <div className="no-scheduled-treatments">
            <p>No treatments scheduled yet. Use the "Start Treatment" button to schedule your next session.</p>
          </div>
        ) : (
          <div className="scheduled-list">
            {scheduledTreatments.map((treatment) => (
              <div key={treatment.id} className="scheduled-item">
                <div className="scheduled-info">
                  <span className="scheduled-date">
                    {treatment.scheduledTime.toLocaleDateString()}
                  </span>
                  <span className="scheduled-time">
                    {treatment.scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="scheduled-duration">
                    {treatment.duration} minutes
                  </span>
                  {treatment.reminderEmail && (
                    <span className="reminder-badge">📧 Reminder Set</span>
                  )}
                </div>
                <div className="scheduled-actions">
                  <button 
                    onClick={() => openRescheduleModal(treatment)}
                    className="reschedule-button"
                  >
                    📅 Reschedule
                  </button>
                  <button 
                    onClick={() => cancelScheduledTreatment(treatment.id)}
                    className="cancel-button"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pre-Treatment Planning Modal */}
      {showPreTreatmentModal && (
        <div className="modal-overlay">
          <div className="pre-treatment-modal">
            <h2>Pre-Treatment Assessment & Planning</h2>
            
            <div className="modal-content">
              <div className="form-section">
                <h3>Plan Next Treatment</h3>
                
                <div className="form-group">
                  <label>Select date and time for next treatment:</label>
                  <input
                    type="datetime-local"
                    value={treatmentPlan.nextTreatmentDateTime || calculateNextTreatmentTime()}
                    onChange={(e) => handlePlanChange('nextTreatmentDateTime', e.target.value)}
                    min={getMinDateTime()}
                  />
                </div>

                <div className="form-group">
                  <label>Next Treatment Duration:</label>
                  <select 
                    value={treatmentPlan.nextTreatmentDuration} 
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      handlePlanChange('nextTreatmentDuration', value);
                      if (value !== 0) {
                        setCustomNextDurationValue('');
                      }
                    }}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={75}>75 minutes</option>
                    <option value={90}>90 minutes</option>
                    <option value={120}>2 hours</option>
                    <option value={0}>Custom</option>
                  </select>
                  
                  {treatmentPlan.nextTreatmentDuration === 0 && (
                    <div className="custom-duration">
                      <label>Custom Duration (minutes):</label>
                      <input
                        type="number"
                        min="1"
                        max="480"
                        value={customNextDurationValue}
                        placeholder="Enter minutes..."
                        onChange={(e) => {
                          setCustomNextDurationValue(e.target.value);
                        }}
                        onBlur={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          handlePlanChange('nextTreatmentDuration', Math.min(Math.max(value, 1), 480));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const value = parseInt(e.target.value) || 1;
                            handlePlanChange('nextTreatmentDuration', Math.min(Math.max(value, 1), 480));
                            e.target.blur();
                          }
                        }}
                        className="custom-duration-input"
                      />
                    </div>
                  )}
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={treatmentPlan.reminderEmail}
                      onChange={(e) => handlePlanChange('reminderEmail', e.target.checked)}
                    />
                    Send reminder email 30 minutes before scheduled treatment
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={cancelTreatmentPlan} className="cancel-button">
                  Cancel
                </button>
                <button onClick={saveTreatmentPlan} className="confirm-button">
                  Start Treatment & Save Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Treatment Modal */}
      {showRescheduleModal && (
        <div className="modal-overlay">
          <div className="pre-treatment-modal">
            <h2>Reschedule Treatment</h2>
            
            <div className="modal-content">
              <div className="form-section">
                <h3>Update Treatment Details</h3>
                
                <div className="form-group">
                  <label>Select new date and time:</label>
                  <input
                    type="datetime-local"
                    value={treatmentPlan.nextTreatmentDateTime}
                    onChange={(e) => handlePlanChange('nextTreatmentDateTime', e.target.value)}
                    min={getMinDateTime()}
                  />
                </div>

                <div className="form-group">
                  <label>Treatment Duration:</label>
                  <select 
                    value={treatmentPlan.nextTreatmentDuration} 
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      handlePlanChange('nextTreatmentDuration', value);
                      if (value !== 0) {
                        setCustomNextDurationValue('');
                      }
                    }}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={75}>75 minutes</option>
                    <option value={90}>90 minutes</option>
                    <option value={120}>2 hours</option>
                    <option value={0}>Custom</option>
                  </select>
                  
                  {treatmentPlan.nextTreatmentDuration === 0 && (
                    <div className="custom-duration">
                      <label>Custom Duration (minutes):</label>
                      <input
                        type="number"
                        min="1"
                        max="480"
                        value={customNextDurationValue}
                        placeholder="Enter minutes..."
                        onChange={(e) => {
                          setCustomNextDurationValue(e.target.value);
                        }}
                        onBlur={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          handlePlanChange('nextTreatmentDuration', Math.min(Math.max(value, 1), 480));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const value = parseInt(e.target.value) || 1;
                            handlePlanChange('nextTreatmentDuration', Math.min(Math.max(value, 1), 480));
                            e.target.blur();
                          }
                        }}
                        className="custom-duration-input"
                      />
                    </div>
                  )}
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={treatmentPlan.reminderEmail}
                      onChange={(e) => handlePlanChange('reminderEmail', e.target.checked)}
                    />
                    Send reminder email 30 minutes before scheduled treatment
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={cancelReschedule} className="cancel-button">
                  Cancel
                </button>
                <button onClick={saveRescheduledTreatment} className="confirm-button">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatmentDashboard;