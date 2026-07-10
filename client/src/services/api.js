import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const servicesAPI = {
  getAll: () => api.get('/services'),
};

export const doctorsAPI = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  getAvailability: (id, date) => api.get(`/doctors/${id}/availability`, { params: { date } }),
};

export const appointmentsAPI = {
  getMyAppointments: () => api.get('/appointments'),
  create: (data) => api.post('/appointments', data),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
};

export const chatAPI = {
  sendMessage: (message, sessionId) => api.post('/chat', { message, sessionId }),
  getHistory: (sessionId) => api.get(`/chat/history/${sessionId}`),
};

export default api;