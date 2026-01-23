import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormData {
  login_id: string;
  password: string;
}

interface LoginPageProps {
  onSwitchToSignup: () => void;
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignup, onLoginSuccess }) => {
  const { login, loading, error: authError } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    login_id: '',
    password: ''
  });
  const [localError, setLocalError] = useState<string>('');
  
  const error = authError || localError;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setLocalError('');
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.login_id || !formData.password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    if (!isValidEmail(formData.login_id)) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    try {
      await login(formData);
      console.log('Login successful');
      onLoginSuccess(); // Navigate to main page
    } catch (err: any) {
      console.error('Login failed:', err);
      // 403 에러 (이메일 인증 필요)인 경우 AuthContext에서 needsVerification을 설정하므로
      // App.tsx에서 자동으로 이메일 인증 페이지로 이동됨. 별도 처리 불필요.
      if (err.status === 403 && err.needsVerification) {
        // AuthContext에서 이미 needsVerification=true로 설정했으므로 리턴만 함
        return;
      }
    }
  };

  return (
    <div className="login-container">
      {/* Boarding pass cutouts */}
      <div className="boarding-cutout-left"></div>
      <div className="boarding-cutout-right"></div>

      {/* Header - Blue top section */}
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
        <p className="sky-high-subtitle">Boarding Pass</p>
      </div>

      {/* Flight Info Section */}
      <div className="flight-info">
        <div className="departure">
          <div className="city-code">YOU</div>
          <div className="city-name">Current</div>
        </div>
        <div className="arrival">
          <div className="city-code">SKY</div>
          <div className="city-name">Dashboard</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login_id" className="form-label">
            Passenger Email
          </label>
          <input
            type="text"
            id="login_id"
            name="login_id"
            className="form-input"
            placeholder="crew@airline.com"
            value={formData.login_id}
            onChange={handleInputChange}
            disabled={loading}
            autoComplete="email"
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
            disabled={loading}
          />
        </div>

        {/* Status indicator */}
        <div className={`status-indicator ${error ? 'status-error' : loading ? 'status-loading' : 'status-ready'}`}>
          {error ? (
            <><span className="status-icon">⚠</span> {error}</>
          ) : loading ? (
            <><span className="status-icon flying">✈</span> Preparing for departure...</>
          ) : (
            <><span className="status-icon">✓</span> Ready for boarding</>
          )}
        </div>

        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading ? 'Taking off...' : 'Board Now'}
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
        <span>New crew member? </span>
        <button
          type="button"
          className="link-button"
          onClick={onSwitchToSignup}
        >
          Register Here
        </button>
      </div>
    </div>
  );
};

export default LoginPage;