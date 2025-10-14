/**
 * Utility function to merge class names with clsx
 */
import clsx from 'clsx';

export function cn(...inputs) {
  return clsx(inputs);
}

/**
 * API base URL
 */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Token storage keys
 */
export const TOKEN_KEY = 'parentflow_token';
export const REFRESH_TOKEN_KEY = 'parentflow_refresh_token';

/**
 * Get auth token from localStorage
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Set auth token to localStorage
 */
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Set refresh token to localStorage
 */
export function setRefreshToken(token) {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

/**
 * Remove auth tokens from localStorage
 */
export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Make authenticated API request
 */
export async function fetchAPI(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired, clear and redirect to login
    clearTokens();
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  return response;
}
