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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    
    if (!formData.login_id || !formData.password) {
      setLocalError('Please enter both email and password.');
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
      <div className="mimir-header">
        <div className="mimir-icon">
          🧙‍♂️
        </div>
        <h1 className="mimir-title">MIMIR</h1>
        <p className="mimir-subtitle">The path to the god of wisdom</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login_id" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="login_id"
            name="login_id"
            className="form-input"
            placeholder="Enter your email"
            value={formData.login_id}
            onChange={handleInputChange}
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          className="login-button"
          disabled={loading}
        >
          {loading ? 'Seeking wisdom...' : 'Enter Mimir'}
        </button>
      </form>

      <div className="signup-link">
        <span>Don't have an account? </span>
        <button 
          type="button" 
          className="link-button"
          onClick={onSwitchToSignup}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginPage;