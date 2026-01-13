import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './RegistrationForm.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ageGroups = ['Under 13', '13–18', '18+'];
const mutationTypes = ['abc', 'xyz', "I don't know", "I don't want to tell"];

const RegistrationForm = ({ onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    ageGroup: '',
    interests: [],
    favoriteActivities: {
      games: [],
      videos: []
    },
    typeOfMutation: '',
    termsAccepted: false,
    privacySettings: {
      isProfilePublic: false
    },
    avatarUrl: ''
  });

  // For multi-value fields
  const handleArrayChange = (e, field, subfield) => {
    const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
    if (subfield) {
      setFormData(prev => ({
        ...prev,
        favoriteActivities: {
          ...prev.favoriteActivities,
          [subfield]: values
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: values
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'termsAccepted') {
        setFormData(prev => ({ ...prev, termsAccepted: checked }));
      } else if (name === 'isProfilePublic') {
        setFormData(prev => ({
          ...prev,
          privacySettings: { ...prev.privacySettings, isProfilePublic: checked }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // eslint-disable-next-line no-unused-vars
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast.success('Registration successful! Please login with your credentials.');
      // Clear form - with correct field names and default values
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        ageGroup: '',
        interests: [],
        favoriteActivities: {
          games: [],
          videos: []
        },
        typeOfMutation: '',
        termsAccepted: false,
        privacySettings: {
          isProfilePublic: false
        },
        avatar: '' // Changed from avatarUrl to match the form field name
      });
      
      // Redirect to login page after successful registration
      if (onRegistrationSuccess) {
        setTimeout(() => {
          onRegistrationSuccess();
        }, 1500); // Delay to let user see the success message
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
      <form onSubmit={handleSubmit} className="registration-form">
        <h2>CREATE AN ACCOUNT</h2>
      
      <div className="form-group">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-control"
          placeholder=" "
          required
        />
        <label className="form-label">Your Name</label>
      </div>

      <div className="form-group">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
          placeholder=" "
          required
          autoComplete="off"
          autoFill="off"
        />
        <label className="form-label">Your Email</label>
      </div>

      <div className="form-group">
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="form-control"
          placeholder=" "
          required
          autoComplete="new-password"
        />
        <label className="form-label">Password</label>
      </div>

      <div className="form-group">
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="form-control"
          placeholder=" "
          required
        />
        <label className="form-label">Repeat your password</label>
      </div>

      <div className="form-group">
        <label>Age Group *</label>
        <select
          name="ageGroup"
          value={formData.ageGroup}
          onChange={handleChange}
          className="form-control"
          required
        >
          <option value="" disabled>Select Age Group *</option>
          {ageGroups.map(group => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <input
          type="text"
          name="interests"
          value={formData.interests.join(', ')}
          onChange={e => handleArrayChange(e, 'interests')}
          className="form-control"
          placeholder=" "
        />
        <label className="form-label">Your Interests</label>
      </div>

      <div className="form-group">
        <input
          type="text"
          name="games"
          value={formData.favoriteActivities.games.join(', ')}
          onChange={e => handleArrayChange(e, null, 'games')}
          className="form-control"
          placeholder=" "
        />
        <label className="form-label">Favorite Games</label>
      </div>

      <div className="form-group">
        <input
          type="text"
          name="videos"
          value={formData.favoriteActivities.videos.join(', ')}
          onChange={e => handleArrayChange(e, null, 'videos')}
          className="form-control"
          placeholder=" "
        />
        <label className="form-label">Favorite Videos</label>
      </div>

      <div className="form-group">
        <label>Type of Mutation *</label>
        <select
          name="typeOfMutation"
          value={formData.typeOfMutation}
          onChange={handleChange}
          className="form-control"
          required
        >
          <option value="" disabled>Select Type of Mutation *</option>
          {mutationTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <input
          type="text"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          className="form-control"
          placeholder=" "
        />
        <label className="form-label">Avatar Name</label>
      </div>

      <div className="checkbox-group">
        <input
          type="checkbox"
          name="isProfilePublic"
          checked={formData.privacySettings.isProfilePublic}
          onChange={handleChange}
          id="privacy"
        />
        <label htmlFor="privacy">
          Make my profile public
        </label>
      </div>

      <div className="checkbox-group">
        <input
          type="checkbox"
          name="termsAccepted"
          checked={formData.termsAccepted}
          onChange={handleChange}
          required
          id="terms"
        />
        <label htmlFor="terms">
          I agree all statements in <a href="/terms" className="terms-link">Terms of service</a>
        </label>
      </div>

      <button type="submit" className="submit-button">
        REGISTER
      </button>

      <p className="login-link">
        Have already an account? <a href="/login">Login here</a>
      </p>
    </form>
    </>
  );
};

export default RegistrationForm;