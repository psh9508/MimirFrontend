import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, LoginRequest } from '../types/auth';
import authService from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState<boolean>(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const [verificationUserId, setVerificationUserId] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = () => {
      const token = authService.getAccessToken();
      const userData = authService.getUser();
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(userData);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    setLoading(true);
    setError(null);

    // 이미 이메일 인증이 필요한 상태에서 동일한 이메일로 재로그인 시도하는 경우
    if (needsVerification && verificationEmail === credentials.login_id) {
      setError('Please complete email verification for this account or use a different email.');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login(credentials);
      
      if ('requires_email_verification' in response) {
        setNeedsVerification(true);
        setVerificationEmail(credentials.login_id);
        setVerificationUserId(response.user_id);
        setError(response.message || 'Email verification required');
      } else {
        authService.setTokens(response.access_token, response.refresh_token);
        authService.setUser(response.user);
        
        setIsAuthenticated(true);
        setUser(response.user);
      }
    } catch (err: any) {
      if (err.status === 403 && err.needsVerification) {
        setNeedsVerification(true);
        setVerificationEmail(credentials.login_id);
        setVerificationUserId(err.userId);
        setError('Email verification required');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Login failed';
        setError(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    authService.clearTokens();
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
    setNeedsVerification(false);
    setVerificationEmail(null);
    setVerificationUserId(null);
  };

  const clearVerification = (): void => {
    setNeedsVerification(false);
    setVerificationEmail(null);
    setVerificationUserId(null);
    setError(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
    error,
    needsVerification,
    verificationEmail,
    verificationUserId,
    clearVerification,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;