import axios, { AxiosError } from 'axios';
import { User, Partner, Match, ApiError } from '../types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post('/auth/refresh');
        localStorage.setItem('token', data.access_token);
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ access_token: string }>('/auth/login', { email, password }),
  
  register: (userData: Partial<User>) =>
    api.post<User>('/auth/register', userData),
  
  getCurrentUser: () =>
    api.get<User>('/users/me'),
};

export const partnerApi = {
  registerPartner: (partnerData: FormData) =>
    api.post<Partner>('/relationships/register-partner', partnerData),
  
  uploadFace: (image: FormData) =>
    api.post<{ matches: Match[] }>('/face-recognition/upload', image),
  
  getLiveMatches: (frame: Blob) => {
    const formData = new FormData();
    formData.append('frame', frame);
    return api.post<{ matches: Match[] }>('/face-recognition/live', formData);
  },
};

export default api; 