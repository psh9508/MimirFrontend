import React, { useState } from 'react';

interface MovieLoginPageProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

const MovieLoginPage: React.FC<MovieLoginPageProps> = ({ onBack, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 임시 로그인 처리 (나중에 실제 API 연동)
    try {
      // 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (email && password) {
        onLoginSuccess();
      } else {
        setError('이메일과 비밀번호를 입력해주세요.');
      }
    } catch {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="movie-login-page">
      <div className="login-overlay" onClick={onBack}></div>
      <div className="login-modal">
        <button className="close-button" onClick={onBack}>×</button>

        <div className="login-header">
          <span className="login-icon">🎬</span>
          <h2>MovieReview</h2>
          <p>로그인하고 리뷰를 작성해보세요</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="login-divider">
          <span>또는</span>
        </div>

        <div className="social-login">
          <button className="social-button google">
            <span>G</span> Google로 계속하기
          </button>
          <button className="social-button kakao">
            <span>💬</span> 카카오로 계속하기
          </button>
        </div>

        <div className="login-footer">
          <p>아직 계정이 없으신가요? <button className="link-button">회원가입</button></p>
        </div>
      </div>
    </div>
  );
};

export default MovieLoginPage;
