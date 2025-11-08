import React from 'react';
import authService from '../services/authService';

interface MainPageProps {
  onLogout: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ onLogout }) => {
  const user = authService.getUser();

  const handleLogout = () => {
    authService.clearTokens();
    onLogout();
  };

  return (
    <div style={{ padding: '2rem', color: 'white', minHeight: '100vh' }}>
      {/* Header with logout button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        padding: '1rem 0'
      }}>
        <div style={{ flex: 1 }}></div>
        <div style={{ textAlign: 'center', flex: 2 }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🏛️</div>
          <h1 style={{ color: '#d4af37', fontSize: '2.5rem', margin: '0' }}>Mimir</h1>
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <button 
            style={{
              background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '600',
              padding: '0.6rem 1.2rem',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease'
            }}
            onClick={handleLogout}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(231, 76, 60, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ color: '#adb5bd', fontSize: '1.1rem' }}>Welcome to your dashboard</p>
      </div>

      <div style={{ 
        textAlign: 'center', 
        marginBottom: '2rem', 
        padding: '1.5rem', 
        background: 'rgba(26, 31, 58, 0.6)', 
        borderRadius: '16px',
        border: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <h2 style={{ color: '#d4af37', marginBottom: '0.5rem' }}>Welcome back!</h2>
        {user && (
          <p style={{ color: '#adb5bd' }}>
            Logged in as: <span style={{ color: '#d4af37' }}>{user.email}</span>
          </p>
        )}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'rgba(26, 31, 58, 0.8)',
          border: '2px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <h3 style={{ color: '#d4af37', marginBottom: '0.5rem' }}>Analytics</h3>
          <p style={{ color: '#adb5bd' }}>View your usage statistics and insights</p>
        </div>

        <div style={{
          background: 'rgba(26, 31, 58, 0.8)',
          border: '2px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
          <h3 style={{ color: '#d4af37', marginBottom: '0.5rem' }}>Settings</h3>
          <p style={{ color: '#adb5bd' }}>Manage your account preferences</p>
        </div>

        <div style={{
          background: 'rgba(26, 31, 58, 0.8)',
          border: '2px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <h3 style={{ color: '#d4af37', marginBottom: '0.5rem' }}>Projects</h3>
          <p style={{ color: '#adb5bd' }}>Create and manage your projects</p>
        </div>

        <div style={{
          background: 'rgba(26, 31, 58, 0.8)',
          border: '2px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
          <h3 style={{ color: '#d4af37', marginBottom: '0.5rem' }}>Team</h3>
          <p style={{ color: '#adb5bd' }}>Collaborate with your team members</p>
        </div>
      </div>

    </div>
  );
};

export default MainPage;