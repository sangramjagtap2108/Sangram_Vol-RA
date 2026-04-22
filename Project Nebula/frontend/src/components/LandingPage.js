import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onProceed }) => {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-content">
          <div className="landing-header">
            <h1 className="landing-headline">Treatments Together, Never Alone</h1>
            <p className="landing-subtitle">Welcome to Nebula</p>
          </div>

          <div className="landing-description">
            <p className="intro-text">
              A private social space designed exclusively for the <strong>Cystic Fibrosis community</strong>.
            </p>

            <div className="key-points">
              <div className="point">
                <p>
                  Living with CF often means spending hours in daily treatments, but it doesn't have to be isolating. 
                  Managing CF is a full-time job, but you don't have to navigate it alone.
                </p>
              </div>

              <div className="point">
                <p>
                  <strong>Nebula is designed to be your central hub</strong> for connection, education, and community life. 
                  It's a dedicated platform where you can connect with others in real-time.
                </p>
              </div>

              <div className="point">
                <p>
                  Whether you want to see <strong>who else is currently in treatment</strong>, or you are looking for 
                  <strong> specific medical resources</strong> or want to <strong>stay updated on the latest CF community gatherings</strong>, 
                  everything you need is right here.
                </p>
              </div>
            </div>
          </div>

          <div className="registration-info">
            <h2>New to Project Nebula?</h2>
            <p>To protect our members, registration is required.</p>
            
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Create Your Account</h3>
                  <p>Click "Register" to create your secure login credentials.</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Get Verified</h3>
                  <p>Once verified, you can explore our full list of resources and upcoming events.</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Connect & Thrive</h3>
                  <p>Connect with others who truly understand the journey.</p>
                </div>
              </div>
            </div>
          </div>

          <button className="cta-button" onClick={onProceed}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
