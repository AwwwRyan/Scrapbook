import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor with debugging
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request headers:', config.headers); // Debug log
    } else {
      console.warn('No token found in localStorage'); // Debug warning
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      useAuthStore.getState().setToken(null);
      
      // Store current path
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }
      
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 