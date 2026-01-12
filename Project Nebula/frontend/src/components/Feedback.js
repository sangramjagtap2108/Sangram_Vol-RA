import React, { useState } from 'react';
import './Feedback.css';

const Feedback = () => {
  const [showThankYou, setShowThankYou] = useState(false);

  const handleOpenFeedbackForm = () => {
    // Open Google Form in a new tab
    window.open('https://forms.gle/jgdJbP4WF2dmw8bY7', '_blank', 'noopener,noreferrer');
    
    // Show thank you message
    setShowThankYou(true);
    
    // Hide thank you message after 5 seconds
    setTimeout(() => {
      setShowThankYou(false);
    }, 5000);
  };

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <h1>📝 We Value Your Feedback</h1>
        <p className="feedback-subtitle">
          Help us improve Project Nebula by sharing your thoughts and experiences
        </p>
      </div>

      <div className="feedback-content">
        <div className="feedback-card">
          <div className="feedback-icon">💬</div>
          <h2>Share Your Experience</h2>
          <p>
            Your feedback helps us create a better platform for the CF community. 
            This survey takes just 2-3 minutes to complete and is completely <strong>anonymous</strong>.
          </p>

          <div className="feedback-info">
            <h3>What We'll Ask:</h3>
            <ul>
              <li>✨ Your suggestions for improvement</li>
              <li>🎯 How interesting you find the platform</li>
              <li>🧭 Ease of navigation</li>
              <li>💊 CF modulator information</li>
              <li>📊 Demographic information</li>
              <li>💭 Any additional comments</li>
            </ul>
          </div>

          <div className="feedback-privacy">
            <div className="privacy-badge">
              <span className="privacy-icon">🔒</span>
              <div>
                <strong>Your Privacy Matters</strong>
                <p>All responses are anonymous and confidential</p>
              </div>
            </div>
          </div>

          <button 
            className="feedback-button"
            onClick={handleOpenFeedbackForm}
          >
            📋 Open Feedback Form
          </button>

          {showThankYou && (
            <div className="thank-you-message">
              <span className="thank-you-icon">🎉</span>
              <strong>Thank you for your feedback!</strong>
              <p>Your input helps us make Project Nebula better for everyone.</p>
            </div>
          )}
        </div>

        <div className="feedback-side-info">
          <div className="info-box">
            <h3>🌟 Why Your Feedback Matters</h3>
            <p>
              Project Nebula is built <em>for</em> the CF community, <em>by</em> people 
              who care about improving patient care. Your insights help us:
            </p>
            <ul>
              <li>Prioritize the most needed features</li>
              <li>Improve user experience</li>
              <li>Better serve the CF community</li>
              <li>Shape future development</li>
            </ul>
          </div>

          <div className="info-box">
            <h3>💡 What Happens Next?</h3>
            <p>
              We review all feedback regularly and use it to guide our development 
              roadmap. While we can't respond to individual submissions (due to 
              anonymity), your voice is heard and valued.
            </p>
          </div>

          <div className="info-box contact-box">
            <h3>📧 Need Direct Support?</h3>
            <p>
              For specific issues or questions requiring a response, 
              please contact us directly through the dashboard or email us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
