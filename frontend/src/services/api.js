import axios from 'axios';

const getBaseUrl = () => {
  let envUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim();
  envUrl = envUrl.replace(/\/+$/, '');
  if (!envUrl.endsWith('/api')) {
    envUrl = `${envUrl}/api`;
  }
  return envUrl;
};

const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('janpulse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If token expired, clear and notify
      if (localStorage.getItem('janpulse_token')) {
        localStorage.removeItem('janpulse_token');
        localStorage.removeItem('janpulse_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/users/profile'),
  getMyComplaints: () => api.get('/users/my-complaints'),
};

export const complaintAPI = {
  getAll: (params) => api.get('/complaints', { params }),
  getById: (id) => api.get(`/complaints/${id}`),
  create: (formData) =>
    api.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  upvote: (id) => api.post(`/complaints/${id}/upvote`),
  checkNearby: (params) => api.get('/complaints/nearby', { params }),
  analyzeAI: (formData) =>
    api.post('/ai/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getAnalytics: () => api.get('/dashboard/analytics'),
};

export const adminAPI = {
  getComplaints: (params) => api.get('/admin/complaints', { params }),
  updateStatus: (id, formData) =>
    api.put(`/admin/complaints/${id}/status`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  assignDepartment: (id, data) => api.put(`/admin/complaints/${id}/assign`, data),
  getUsers: () => api.get('/admin/users'),
};

export default api;
