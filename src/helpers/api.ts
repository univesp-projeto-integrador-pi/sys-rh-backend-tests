import axios, { AxiosInstance } from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const api: AxiosInstance = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
  validateStatus: () => true,
  withCredentials: true,
});

export function setAuthToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function clearAuthToken() {
  delete api.defaults.headers.common['Authorization'];
}

export async function fetchAndSetCsrfToken() {
  const res = await api.get('/api/csrf-token');
  const csrfToken = res.data.csrfToken;
  api.defaults.headers.common['x-csrf-token'] = csrfToken;
  return csrfToken;
}

export function clearCsrfToken() {
  delete api.defaults.headers.common['x-csrf-token'];
}

export default api;