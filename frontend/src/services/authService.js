import api from './api';
import { jwtDecode } from 'jwt-decode';

const authService = {
  /**
   * Submit Login credentials to backend
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} Formatted user data object
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    const data = response.data;

    let token = '';
    let userData = null;

    if (typeof data === 'string') {
      // Backend returned plain JWT string token
      token = data;
      try {
        const decoded = jwtDecode(token);
        userData = {
          email: decoded.sub || credentials.email,
          role: decoded.role || 'STAFF',
          name: decoded.name || credentials.email.split('@')[0],
          token: token,
        };
      } catch (err) {
        userData = {
          email: credentials.email,
          role: 'STAFF',
          token: token,
        };
      }
    } else if (data && typeof data === 'object') {
      // Backend returned object with token & details
      token = data.token;
      userData = {
        id: data.id,
        name: data.name || credentials.email.split('@')[0],
        email: data.email || credentials.email,
        role: data.role || 'STAFF',
        token: token,
      };
    }

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
    }

    return userData;
  },

  /**
   * Submit Registration form data to backend
   * @param {Object} userData - { name, email, password, role }
   * @returns {Promise<Object>} Registered user object
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Logout user and purge cached session details
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Retrieve current stored user profile
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  /**
   * Extract human-readable error messages from Axios / API errors
   */
  handleError(error) {
    if (error.response) {
      // Backend returned error status code
      if (typeof error.response.data === 'string' && error.response.data.trim()) {
        return error.response.data;
      }
      if (error.response.data && error.response.data.message) {
        return error.response.data.message;
      }
      if (error.response.status === 401) {
        return 'Invalid email or password. Please try again.';
      }
      if (error.response.status === 403) {
        return 'Access denied. You do not have permission.';
      }
      if (error.response.status === 409) {
        return 'An account with this email already exists.';
      }
      return `Server error (${error.response.status}). Please try again later.`;
    } else if (error.request) {
      return 'Unable to reach the server. Please check your connection or try again later.';
    } else {
      return error.message || 'An unexpected error occurred.';
    }
  },
};

export default authService;
