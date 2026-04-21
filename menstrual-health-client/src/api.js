/**
 * api.js — Centralized Axios instance
 *
 * All API calls go through this instance so that:
 * 1. Base URL is configured in one place
 * 2. Auth token is automatically attached to every request
 * 3. Response errors are intercepted and normalized
 */

import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

// --------------- Request Interceptor ---------------
// Automatically attach JWT token to every outgoing request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --------------- Response Interceptor ---------------
// Handle 401 (token expired) globally — auto-logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login if token is invalid/expired
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
