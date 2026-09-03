import axios from 'axios';

/**
 * Reusable Axios instance for MediStock API calls.
 * Configured with base URL from environment variables.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

export default api;
