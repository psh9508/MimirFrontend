import React, { useState } from 'react';
import Header from './Header';

interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  platform: string;
}

interface MovieMainPageProps {
  onLoginClick: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

// 샘플 트렌딩 영화 데이터
const trendingMovies: { [key: string]: Movie[] } = {
  netflix: [
    { id: 1, title: '오징어 게임 시즌2', poster: '🦑', rating: 9.2, platform: 'netflix' },
    { id: 2, title: '더 글로리', poster: '⚔️', rating: 8.9, platform: 'netflix' },
    { id: 3, title: '지금 우리 학교는', poster: '🧟', rating: 8.5, platform: 'netflix' },
    { id: 4, title: '무빙', poster: '🦸', rating: 9.0, platform: 'netflix' },
    { id: 5, title: '스위트홈', poster: '🏠', rating: 8.3, platform: 'netflix' },
  ],
  watcha: [
    { id: 6, title: '파묘', poster: '⚰️', rating: 8.8, platform: 'watcha' },
    { id: 7, title: '서울의 봄', poster: '🌸', rating: 9.1, platform: 'watcha' },
    { id: 8, title: '범죄도시4', poster: '👊', rating: 8.6, platform: 'watcha' },
    { id: 9, title: '듄: 파트2', poster: '🏜️', rating: 8.7, platform: 'watcha' },
    { id: 10, title: '웡카', poster: '🍫', rating: 7.9, platform: 'watcha' },
  ],
  appletv: [
    { id: 11, title: '킬러스 오브 더 플라워 문', poster: '🌙', rating: 8.4, platform: 'appletv' },
    { id: 12, title: '나폴레옹', poster: '⚔️', rating: 7.8, platform: 'appletv' },
    { id: 13, title: '테드 래소', poster: '⚽', rating: 9.0, platform: 'appletv' },
    { id: 14, title: '세버런스', poster: '🧠', rating: 8.9, platform: 'appletv' },
    { id: 15, title: '파친코', poster: '🎰', rating: 8.7, platform: 'appletv' },
  ],
};

const platformNames: { [key: string]: string } = {
  netflix: 'Netflix',
  watcha: 'Watcha',
  appletv: 'Apple TV+',
};

const platformColors: { [key: string]: string } = {
  netflix: '#E50914',
  watcha: '#FF0558',
  appletv: '#000000',
};

const MovieMainPage: React.FC<MovieMainPageProps> = ({ onLoginClick, isLoggedIn, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('검색어:', searchQuery);
    // TODO: 검색 기능 구현
  };

  return (
    <div className="movie-main-page">
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={onLoginClick}
        onLogoutClick={onLogout}
      />

      <main className="main-content">
        {/* Hero Section with Search */}
        <section className="hero-section">
          <div className="hero-content">
            <h2 className="hero-title">어떤 영화를 찾고 계신가요?</h2>
            <p className="hero-subtitle">수천 개의 영화 리뷰를 검색해보세요</p>
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="영화 제목, 배우, 감독으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">
                  검색
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Trending Movies by Platform */}
        <section className="trending-section">
          {Object.keys(trendingMovies).map((platform) => (
            <div key={platform} className="platform-section">
              <div className="platform-header">
                <h3
                  className="platform-title"
                  style={{ borderLeftColor: platformColors[platform] }}
                >
                  {platformNames[platform]} 인기 작품
                </h3>
                <button className="more-button">더보기 →</button>
              </div>
              <div className="movies-scroll">
                <div className="movies-container">
                  {trendingMovies[platform].map((movie) => (
                    <div key={movie.id} className="movie-card">
                      <div className="movie-poster">
                        <span className="poster-emoji">{movie.poster}</span>
                        <div className="movie-rating">
                          <span className="star">⭐</span>
                          <span>{movie.rating}</span>
                        </div>
                      </div>
                      <div className="movie-info">
                        <h4 className="movie-title">{movie.title}</h4>
                        <span
                          className="platform-badge"
                          style={{ backgroundColor: platformColors[platform] }}
                        >
                          {platformNames[platform]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer className="movie-footer">
        <p>© 2024 MovieReview. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MovieMainPage;
