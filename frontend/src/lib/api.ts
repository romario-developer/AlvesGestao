import axios from 'axios';
import { useAuthStore } from './auth-store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  const companyId = useAuthStore.getState().companyId;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (companyId) {
    config.headers = config.headers ?? {};
    config.headers['x-company-id'] = companyId;
  }
  return config;
});

export default api;
