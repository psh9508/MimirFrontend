const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  endpoints: {
    login: '/auth/login',
    signup: '/auth/signup',
    refreshToken: '',
    verifyEmail: '',
    regenerateCode: '',
  },
  timeout: 10000,
};

export default API_CONFIG;