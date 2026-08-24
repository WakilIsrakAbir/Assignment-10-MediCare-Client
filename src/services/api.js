import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
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
