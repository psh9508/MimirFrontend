import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import EmailVerificationPage from './components/EmailVerificationPage';
import MainPage from './components/MainPage';
import authService from './services/authService';
import './index.css';

type PageType = 'login' | 'signup' | 'verification' | 'main';

const AppContent: React.FC = () => {
  const { needsVerification, verificationEmail, verificationUserId, clearVerification } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('login');

  // Check if user is already authenticated on app load
  useEffect(() => {
    if (authService.isAuthenticated()) {
      setCurrentPage('main');
    }
  }, []);

  const handleSwitchToLogin = () => {
    setCurrentPage('login');
    clearVerification();
  };

  const handleSwitchToSignup = () => {
    setCurrentPage('signup');
  };

  const handleLoginSuccess = () => {
    setCurrentPage('main');
  };

  const handleVerificationSuccess = () => {
    clearVerification();
    setCurrentPage('main');
  };

  const handleLogout = () => {
    setCurrentPage('login');
  };

  // Show verification page if needed
  if (needsVerification && verificationEmail && verificationUserId) {
    return (
      <EmailVerificationPage
        userEmail={verificationEmail}
        userId={verificationUserId}
        onVerificationSuccess={handleVerificationSuccess}
        onBackToLogin={handleSwitchToLogin}
      />
    );
  }

  // Show main page if authenticated
  if (currentPage === 'main') {
    return <MainPage onLogout={handleLogout} />;
  }

  // Show signup or login page
  if (currentPage === 'signup') {
    return <SignupPage onSwitchToLogin={handleSwitchToLogin} />;
  }

  return <LoginPage onSwitchToSignup={handleSwitchToSignup} onLoginSuccess={handleLoginSuccess} />;
};

function App() {
  return (
    <AuthProvider>
      <div className="App">
        {/* Background clouds */}
        <div className="cloud-background">
          <div className="bg-cloud bg-cloud-1"></div>
          <div className="bg-cloud bg-cloud-2"></div>
          <div className="bg-cloud bg-cloud-3"></div>
          <div className="bg-cloud bg-cloud-4"></div>
          <div className="bg-cloud bg-cloud-5"></div>
          <div className="bg-cloud bg-cloud-6"></div>
          <div className="bg-cloud bg-cloud-7"></div>
          <div className="bg-cloud bg-cloud-8"></div>
          <div className="bg-cloud bg-cloud-9"></div>
        </div>
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;