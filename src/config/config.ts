const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  endpoints: {
    login: '/user/login',
    signup: '/user/signup',
    refreshToken: '/auth/refresh_access_token',
    verifyEmail: '/auth/user_verification',
    regenerateCode: '/auth/regenerate_verification_code',
  },
  timeout: 10000,
};

export default API_CONFIG;