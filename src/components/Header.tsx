import React from 'react';

interface HeaderProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLoginClick, onLogoutClick }) => {
  return (
    <header className="movie-header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">🎬</span>
          <h1 className="logo-text">MovieReview</h1>
        </div>
        <nav className="header-nav">
          {isLoggedIn ? (
            <div className="user-menu">
              <span className="user-avatar">👤</span>
              <button className="logout-btn" onClick={onLogoutClick}>
                로그아웃
              </button>
            </div>
          ) : (
            <button className="login-btn" onClick={onLoginClick}>
              로그인
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
