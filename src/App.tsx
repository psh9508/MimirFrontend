import React, { useState } from 'react';
import MovieMainPage from './components/MovieMainPage';
import MovieLoginPage from './components/MovieLoginPage';
import './index.css';

type PageType = 'main' | 'login';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginClick = () => {
    setCurrentPage('login');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('main');
  };

  const handleBackToMain = () => {
    setCurrentPage('main');
  };

  return (
    <div className="App movie-app">
      <MovieMainPage onLoginClick={handleLoginClick} isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />
      {currentPage === 'login' && (
        <MovieLoginPage
          onBack={handleBackToMain}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default App;
