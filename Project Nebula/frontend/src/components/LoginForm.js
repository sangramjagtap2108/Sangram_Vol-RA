import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/AuthContext';
import './LoginForm.css';

const LoginForm = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Use AuthContext login function to update state
      login(data.user, data.token);

      toast.success('Login successful!');
      
      // Clear form
      setFormData({ email: '', password: '' });
      
      // Call parent callback if provided (optional)
      if (onLoginSuccess) {
        onLoginSuccess(data.user, data.token);
      }

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
        <h2>LOGIN</h2>
        
        {/* Hidden inputs to confuse browser autocomplete */}
        <input type="text" style={{display: 'none'}} />
        <input type="password" style={{display: 'none'}} />
        
        <div className="form-group">
          <input
            type="email"
            name="userEmail"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="form-control"
            placeholder=" "
            required
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <label className="form-label">Email</label>
        </div>

        <div className="form-group">
          <input
            type="password"
            name="userPassword"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="form-control"
            placeholder=" "
            required
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <label className="form-label">Password</label>
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
        </button>

        <p className="register-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>

        <p className="forgot-password">
          <a href="/forgot-password">Forgot your password?</a>
        </p>
      </form>
    </>
  );
};

export default LoginForm;