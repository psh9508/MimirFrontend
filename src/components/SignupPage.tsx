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
        <div className="boarding-cutout-left"></div>
        <div className="boarding-cutout-right"></div>

        <div className="sky-high-header">
          <div className="sky-high-icon">
            🎉
          </div>
          <h1 className="sky-high-title">WELCOME</h1>
          <p className="sky-high-subtitle">Boarding Confirmed</p>
        </div>

        <div className="flight-info">
          <div className="departure">
            <div className="city-code">REG</div>
            <div className="city-name">Complete</div>
          </div>
          <div className="arrival">
            <div className="city-code">SKY</div>
            <div className="city-name">Ready</div>
          </div>
        </div>

        <div className="success-message" style={{ padding: '0 2rem', textAlign: 'center', color: '#64748b' }}>
          <p style={{ marginBottom: '0.5rem' }}>Your crew account has been created!</p>
          <p>Please sign in to access your dashboard.</p>
        </div>

        <div style={{ padding: '1rem 2rem 0' }}>
          <button
            type="button"
            className="login-button"
            onClick={onSwitchToLogin}
          >
            Proceed to Gate
          </button>
        </div>

        <div className="barcode-decoration">
          <span></span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      {/* Boarding pass cutouts */}
      <div className="boarding-cutout-left"></div>
      <div className="boarding-cutout-right"></div>

      <div className="sky-high-header">
        <div className="floating-clouds">
          <span className="cloud cloud-1">☁️</span>
          <span className="cloud cloud-2">☁️</span>
          <span className="cloud cloud-3">☁️</span>
        </div>
        <div className="sky-high-icon">
          ✈️
        </div>
        <h1 className="sky-high-title">SKY HIGH</h1>
        <p className="sky-high-subtitle">New Crew Registration</p>
      </div>

      {/* Flight Info Section */}
      <div className="flight-info">
        <div className="departure">
          <div className="city-code">NEW</div>
          <div className="city-name">Member</div>
        </div>
        <div className="arrival">
          <div className="city-code">CREW</div>
          <div className="city-name">Status</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Crew Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            placeholder="crew@airline.com"
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
            placeholder="Create your password"
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
          {localLoading ? 'Processing...' : 'Join Crew'}
        </button>
      </form>

      {/* Barcode decoration */}
      <div className="barcode-decoration">
        <span></span><span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span><span></span>
      </div>

      <div className="signup-link">
        <span>Already a crew member? </span>
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