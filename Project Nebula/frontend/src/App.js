import React, { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import TreatmentDashboard from './components/TreatmentDashboard';
import Events from './components/Events';
import EducationalResources from './components/EducationalResources';
import ResearchUpdates from './components/ResearchUpdates';
import Feedback from './components/Feedback';
import Newsletter from './components/Newsletter';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

const AuthenticatedApp = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'events', 'resources', 'research-updates', 'feedback', 'newsletter'

  if (isAuthenticated) {
    return (
      <div className="app-container">
        <nav className="main-nav">
          <div className="nav-brand">Project Nebula</div>
          <div className="nav-links">
            <button 
              className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentView('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`nav-link ${currentView === 'events' ? 'active' : ''}`}
              onClick={() => setCurrentView('events')}
            >
              Events
            </button>
            <button 
              className={`nav-link ${currentView === 'resources' ? 'active' : ''}`}
              onClick={() => setCurrentView('resources')}
            >
              Resources
            </button>
            <button 
              className={`nav-link ${currentView === 'research-updates' ? 'active' : ''}`}
              onClick={() => setCurrentView('research-updates')}
            >
              Research
            </button>
            <button 
              className={`nav-link ${currentView === 'feedback' ? 'active' : ''}`}
              onClick={() => setCurrentView('feedback')}
            >
              Feedback
            </button>
            <button 
              className={`nav-link ${currentView === 'newsletter' ? 'active' : ''}`}
              onClick={() => setCurrentView('newsletter')}
            >
              Newsletter
            </button>
          </div>
          <div className="nav-actions">
            <span className="user-name">👤 {user.name}</span>
            <button onClick={logout} className="logout-btn-nav">
              Logout
            </button>
          </div>
        </nav>
        
        <div className="main-content">
          {currentView === 'dashboard' && <TreatmentDashboard />}
          {currentView === 'events' && <Events />}
          {currentView === 'resources' && <EducationalResources />}
          {currentView === 'research-updates' && <ResearchUpdates />}
          {currentView === 'feedback' && <Feedback />}
          {currentView === 'newsletter' && <Newsletter />}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="auth-toggle">
        <button 
          className={showLogin ? 'active' : ''}
          onClick={() => setShowLogin(true)}
        >
          Login
        </button>
        <button 
          className={!showLogin ? 'active' : ''}
          onClick={() => setShowLogin(false)}
        >
          Register
        </button>
      </div>
      
      {showLogin ? (
        <LoginForm onLoginSuccess={() => {/* Auth context handles this */}} />
      ) : (
        <RegistrationForm onRegistrationSuccess={() => setShowLogin(true)} />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;