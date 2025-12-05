import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }).then((res) => res.data),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users').then((res) => res.data),
  getOne: (id: number) => api.get(`/users/${id}`).then((res) => res.data),
  createUser: (data: any) => api.post('/users', data).then((res) => res.data),
  updateUser: (id: number, data: any) => api.patch(`/users/${id}`, data).then((res) => res.data),
  deleteUser: (id: number) => api.delete(`/users/${id}`).then((res) => res.data),
};

// Tables API
export const tablesAPI = {
  getAll: () => api.get('/tables').then((res) => res.data),
  getOne: (id: number) => api.get(`/tables/${id}`).then((res) => res.data),
  create: (data: any) => api.post('/tables', data).then((res) => res.data),
  update: (id: number, data: any) => api.patch(`/tables/${id}`, data).then((res) => res.data),
  delete: (id: number) => api.delete(`/tables/${id}`).then((res) => res.data),
};

// Menu Items API
export const menuItemsAPI = {
  getAll: () => api.get('/menu-items').then((res) => res.data),
  getOne: (id: number) => api.get(`/menu-items/${id}`).then((res) => res.data),
  create: (data: any) => api.post('/menu-items', data).then((res) => res.data),
  update: (id: number, data: any) => api.patch(`/menu-items/${id}`, data).then((res) => res.data),
  delete: (id: number) => api.delete(`/menu-items/${id}`).then((res) => res.data),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/orders').then((res) => res.data),
  getOne: (id: number) => api.get(`/orders/${id}`).then((res) => res.data),
  create: (data: any) => api.post('/orders', data).then((res) => res.data),
  update: (id: number, data: any) => api.patch(`/orders/${id}`, data).then((res) => res.data),
  delete: (id: number) => api.delete(`/orders/${id}`).then((res) => res.data),
};

// M-Pesa API
export const mpesaAPI = {
  initiateSTKPush: (phoneNumber: string, amount: number, orderId: number) =>
    api.post('/mpesa/stk-push', { phoneNumber, amount, orderId }).then((res) => res.data),
};

export default api;