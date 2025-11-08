import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSwitchToLogin }) => {
  const { loading } = useAuth();
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState<string>('');
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (localError) setLocalError('');
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError('Please fill in all fields.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match.');
      return false;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!validateForm()) {
      return;
    }

    setLocalLoading(true);

    try {
      await authService.signup({
        email: formData.email,
        password: formData.password
      });
      setSuccess(true);
      console.log('Signup successful');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setLocalError(errorMessage);
      console.error('Signup failed:', err);
    } finally {
      setLocalLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-container">
        <div className="mimir-header">
          <div className="mimir-icon">
            ✅
          </div>
          <h1 className="mimir-title">Success!</h1>
          <p className="mimir-subtitle">Account created successfully</p>
        </div>

        <div className="success-message">
          <p>Your account has been created successfully!</p>
          <p>You can now sign in with your credentials.</p>
        </div>

        <button 
          type="button" 
          className="login-button"
          onClick={onSwitchToLogin}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="mimir-header">
        <div className="mimir-icon">
          🧙‍♂️
        </div>
        <h1 className="mimir-title">MIMIR</h1>
        <p className="mimir-subtitle">Join the realm of wisdom</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading || localLoading}
            title="Please enter a valid email address"
            onInvalid={(e) => {
              e.currentTarget.setCustomValidity('Please enter a valid email address');
            }}
            onInput={(e) => {
              e.currentTarget.setCustomValidity('');
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading || localLoading}
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-input"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={loading || localLoading}
            minLength={6}
          />
        </div>

        {localError && <div className="error-message">{localError}</div>}

        <button 
          type="submit" 
          className="login-button"
          disabled={loading || localLoading}
        >
          {localLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="signup-link">
        <span>Already have an account? </span>
        <button 
          type="button" 
          className="link-button"
          onClick={onSwitchToLogin}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignupPage;