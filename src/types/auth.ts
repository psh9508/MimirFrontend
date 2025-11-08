export interface LoginRequest {
  login_id: string;
  password: string;
}

export interface LoginSuccessResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface LoginVerificationRequiredResponse {
  requires_email_verification: true;
  user_id: string;
  message: string;
}

export type LoginResponse = LoginSuccessResponse | LoginVerificationRequiredResponse;

export interface SignupRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  access_token: string;
  refresh_token: string;
}

export interface VerifyEmailRequest {
  user_id: string;
  login_id: string;
  verification_code: string;
}

export interface RegenerateCodeRequest {
  user_id: string;
  login_id: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string; email: string } | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  needsVerification: boolean;
  verificationEmail: string | null;
  verificationUserId: string | null;
  clearVerification: () => void;
}

export interface VerificationError extends Error {
  status: number;
  needsVerification: boolean;
  email?: string;
}

export interface VerificationCodeExpiredError extends Error {
  name: 'VerificationCodeExpiredError';
  status: number;
  isExpired: boolean;
}