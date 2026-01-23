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
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>✈️</div>
          <h1 style={{
            background: 'linear-gradient(135deg, #4a90d9 0%, #2e6cb5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '2.5rem',
            margin: '0',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: '700',
            letterSpacing: '2px'
          }}>SKY HIGH</h1>
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
        <p style={{ color: '#c4d4e0', fontSize: '1.1rem' }}>Crew Schedule Management Dashboard</p>
      </div>

      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        padding: '1.5rem',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '16px',
        border: '1px solid rgba(74, 144, 217, 0.2)',
        boxShadow: '0 8px 32px rgba(74, 144, 217, 0.15)'
      }}>
        <h2 style={{ color: '#4a90d9', marginBottom: '0.5rem', fontFamily: 'Montserrat, sans-serif' }}>Welcome back!</h2>
        {user && (
          <p style={{ color: '#718096' }}>
            Logged in as: <span style={{ color: '#4a90d9', fontWeight: '500' }}>{user.email}</span>
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
          background: 'rgba(255, 255, 255, 0.9)',
          border: '2px solid rgba(74, 144, 217, 0.2)',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
          <h3 style={{ color: '#4a90d9', marginBottom: '0.5rem', fontFamily: 'Montserrat, sans-serif' }}>My Schedule</h3>
          <p style={{ color: '#718096' }}>View and manage your flight schedule</p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          border: '2px solid rgba(74, 144, 217, 0.2)',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
          <h3 style={{ color: '#4a90d9', marginBottom: '0.5rem', fontFamily: 'Montserrat, sans-serif' }}>Swap Requests</h3>
          <p style={{ color: '#718096' }}>Request or accept schedule swaps</p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          border: '2px solid rgba(74, 144, 217, 0.2)',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
          <h3 style={{ color: '#4a90d9', marginBottom: '0.5rem', fontFamily: 'Montserrat, sans-serif' }}>Crew Members</h3>
          <p style={{ color: '#718096' }}>Connect with fellow crew members</p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          border: '2px solid rgba(74, 144, 217, 0.2)',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
          <h3 style={{ color: '#4a90d9', marginBottom: '0.5rem', fontFamily: 'Montserrat, sans-serif' }}>Settings</h3>
          <p style={{ color: '#718096' }}>Manage your account preferences</p>
        </div>
      </div>

    </div>
  );
};

export default MainPage;