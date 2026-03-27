import axios, { AxiosInstance } from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const api: AxiosInstance = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: () => true, // não lança erro em status 4xx/5xx
  withCredentials: true,      // envia cookies nas requisições
});

export function setAuthToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function clearAuthToken() {
  delete api.defaults.headers.common['Authorization'];
}

export default api;