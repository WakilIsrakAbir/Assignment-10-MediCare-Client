import axios from 'axios';

const LIVE_SERVER_URL = 'https://assignment-10-medi-care-server.vercel.app/api';

const getBaseURL = () => {
  // When running in the browser, check current domain
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');
    if (!isLocal) {
      return LIVE_SERVER_URL;
    }
  }

  // If explicit environment variable is set and doesn't point to localhost in production
  if (process.env.NEXT_PUBLIC_API_URL) {
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_API_URL.includes('localhost')) {
      return LIVE_SERVER_URL;
    }
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // In production builds, default to live server
  if (process.env.NODE_ENV === 'production') {
    return LIVE_SERVER_URL;
  }

  return 'http://localhost:5000/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 30000, // 30s timeout to handle server cold starts
});

API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');
    
    // Always guarantee live server is targeted when browsing from Vercel or any non-local domain
    if (!isLocal) {
      if (!config.baseURL || config.baseURL.includes('localhost') || config.baseURL.includes('127.0.0.1')) {
        config.baseURL = LIVE_SERVER_URL;
      }
    }

    const token = localStorage.getItem('medicare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend is restarting or network disconnected, return clean rejected error
    if (!error.response) {
      console.warn('Backend server connectivity warning (Network issue or server reloading)');
    }
    return Promise.reject(error);
  }
);

export default API;
