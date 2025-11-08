import API_CONFIG from '../config/config';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  RefreshTokenRequest,
  VerifyEmailRequest,
  RegenerateCodeRequest,
} from '../types/auth';

class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 403) {
          const error = new Error(errorData.message || 'Email verification required') as any;
          error.status = 403;
          error.needsVerification = true;
          error.userId = errorData.detail?.user_id || errorData.user_id;
          throw error;
        }
        
        // For 400 errors, include the full error data for detailed handling
        if (response.status === 400) {
          const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`) as any;
          error.status = 400;
          error.errorData = errorData;
          throw error;
        }
        
        // For 422 errors, include the full error data
        if (response.status === 422) {
          const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`) as any;
          error.status = 422;
          error.errorData = errorData;
          throw error;
        }
        
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>(API_CONFIG.endpoints.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(data: SignupRequest): Promise<any> {
    const token = this.getAccessToken();
    return this.makeRequest(API_CONFIG.endpoints.signup, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
  }

  async refreshAccessToken(tokens: RefreshTokenRequest): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>(API_CONFIG.endpoints.refreshToken, {
      method: 'POST',
      body: JSON.stringify(tokens),
    });
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<any> {
    return this.makeRequest(API_CONFIG.endpoints.verifyEmail, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async regenerateVerificationCode(data: RegenerateCodeRequest): Promise<any> {
    return this.makeRequest(API_CONFIG.endpoints.regenerateCode, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  setUser(user: { id: string; email: string }): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): { id: string; email: string } | null {
    try {
      const userData = localStorage.getItem('user');
      if (!userData || userData === 'undefined' || userData === 'null') {
        return null;
      }
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Clear invalid data
      localStorage.removeItem('user');
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = new AuthService();
export default authService;