import React, { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import TreatmentDashboard from './components/TreatmentDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

const AuthenticatedApp = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (isAuthenticated) {
    return <TreatmentDashboard />;
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