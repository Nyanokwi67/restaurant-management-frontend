import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  createUser: async (userData: any) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
};

// Menu Items API
export const menuItemsAPI = {
  getAll: async () => {
    const response = await api.get('/menu-items');
    return response.data;
  },
};

// Tables API
export const tablesAPI = {
  getAll: async () => {
    const response = await api.get('/tables');
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  create: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
};

// Expenses API
export const expensesAPI = {
  getAll: async () => {
    const response = await api.get('/expenses');
    return response.data;
  },
  create: async (expenseData: any) => {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },
};

export default api;