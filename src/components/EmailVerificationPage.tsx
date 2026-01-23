import React, { useState, useRef, useEffect } from 'react';
import authService from '../services/authService';

interface EmailVerificationPageProps {
  userEmail: string;
  userId: string;
  onVerificationSuccess: () => void;
  onBackToLogin: () => void;
}

const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({
  userEmail,
  userId,
  onVerificationSuccess,
  onBackToLogin
}) => {
  const [verificationCode, setVerificationCode] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [isCodeExpired, setIsCodeExpired] = useState<boolean>(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Resend cooldown timer
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (value && !/^\d$/.test(value)) return; // Only allow numbers

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setError('');
    setIsCodeExpired(false);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (value && index === 5 && newCode.every(digit => digit !== '')) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setVerificationCode(newCode);
      setError('');
      setIsCodeExpired(false);
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (code?: string) => {
    const codeToVerify = code || verificationCode.join('');
    
    if (codeToVerify.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    setError('');
    setIsCodeExpired(false);

    try {
      await authService.verifyEmail({
        user_id: userId,
        login_id: userEmail,
        verification_code: codeToVerify
      });
      
      onVerificationSuccess();
    } catch (err: any) {
      console.log('Full error object:', err); // Debug log
      
      if (err.errorData) {
        console.log('Error data:', err.errorData); // Debug log
        
        if (err.errorData.detail) {
          // Check if it's a verification code expired error
          if (err.errorData.detail.error === 'verification_code_expired') {
            setIsCodeExpired(true);
            setError('');
            setResendCooldown(0); // Allow immediate resend when expired
            console.error('Verification code expired:', err);
            return;
          }
          
          // Check if it's an invalid verification code error
          if (err.errorData.detail.error === 'invalid_verification_code') {
            setError('Invalid verification code. Please try again.');
            setIsCodeExpired(false); // Make sure expired UI is not shown
            console.error('Invalid verification code:', err);
            return;
          }
        }
      }
      
      // Handle other error types
      const errorMessage = err instanceof Error ? err.message : 'Verification failed';
      setError(errorMessage);
      console.error('Verification failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setResendLoading(true);
    setError('');
    setIsCodeExpired(false);

    try {
      await authService.regenerateVerificationCode({
        user_id: userId,
        login_id: userEmail
      });
      
      setResendCooldown(300); // 300 second (5 minute) cooldown
      setVerificationCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend code';
      setError(errorMessage);
      console.error('Resend failed:', err);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="boarding-cutout-left"></div>
      <div className="boarding-cutout-right"></div>

      <div className="sky-high-header">
        <div className="sky-high-icon">
          📧
        </div>
        <h1 className="sky-high-title">VERIFY</h1>
        <p className="sky-high-subtitle">Security Check</p>
      </div>

      <div className="flight-info">
        <div className="departure">
          <div className="city-code">CODE</div>
          <div className="city-name">Pending</div>
        </div>
        <div className="arrival">
          <div className="city-code">OK</div>
          <div className="city-name">Verified</div>
        </div>
      </div>

      <div className="verification-info" style={{ padding: '0 2rem' }}>
        <p>Verification code sent to:</p>
        <strong>{userEmail}</strong>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={{ padding: '0 2rem' }}>
        <div className="verification-inputs">
          {verificationCode.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              className="verification-input"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={loading}
              maxLength={1}
              inputMode="numeric"
              pattern="[0-9]"
            />
          ))}
        </div>

        {error && (
          <div className={`error-message ${isCodeExpired ? 'expired-error' : ''}`}>
            {error}
          </div>
        )}

        {isCodeExpired && (
          <div className="expired-container">
            <div className="expired-content">
              <h3 className="expired-title">Code Expired</h3>
              <p className="expired-description">Your verification code has timed out</p>
              <button
                type="button"
                className="resend-button-primary"
                onClick={handleResendCode}
                disabled={resendLoading}
              >
                {resendLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Sending new code...
                  </>
                ) : (
                  <>
                    <span className="button-icon">🔄</span>
                    Get New Code
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="login-button"
          disabled={loading || verificationCode.some(digit => !digit)}
        >
          {loading ? 'Verifying...' : 'Confirm Code'}
        </button>
      </form>

      {/* Barcode decoration */}
      <div className="barcode-decoration">
        <span></span><span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span><span></span>
      </div>

      <div className="verification-actions" style={{ padding: '0 2rem 1.5rem' }}>
        {!isCodeExpired && (
          <div className="resend-section">
            <span>Didn't receive the code? </span>
            <button
              type="button"
              className="link-button"
              onClick={handleResendCode}
              disabled={resendLoading || resendCooldown > 0}
            >
              {resendLoading ? 'Sending...' :
               resendCooldown > 0 ? `Resend in ${resendCooldown}s` :
               'Resend Code'}
            </button>
          </div>
        )}

        <div className="back-to-login">
          <button
            type="button"
            className="link-button"
            onClick={onBackToLogin}
          >
            ← Use Different Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;