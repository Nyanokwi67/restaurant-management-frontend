import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { username, password });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },
  getOne: async (id: number) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },
  createUser: async (userData: any) => {
    const response = await axiosInstance.post('/users', userData);
    return response.data;
  },
  updateUser: async (id: number, userData: any) => {
    const response = await axiosInstance.patch(`/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id: number) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },
};

// Menu Items API
export const menuItemsAPI = {
  getAll: async () => {
    const response = await axiosInstance.get('/menu-items');
    return response.data;
  },
  getOne: async (id: number) => {
    const response = await axiosInstance.get(`/menu-items/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await axiosInstance.post('/menu-items', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await axiosInstance.patch(`/menu-items/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/menu-items/${id}`);
    return response.data;
  },
};

// Tables API
export const tablesAPI = {
  getAll: async () => {
    const response = await axiosInstance.get('/tables');
    return response.data;
  },
  getOne: async (id: number) => {
    const response = await axiosInstance.get(`/tables/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await axiosInstance.post('/tables', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await axiosInstance.patch(`/tables/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/tables/${id}`);
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  getAll: async () => {
    const response = await axiosInstance.get('/orders');
    return response.data;
  },
  getOne: async (id: number) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await axiosInstance.post('/orders', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await axiosInstance.patch(`/orders/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/orders/${id}`);
    return response.data;
  },
};

// Expenses API
export const expensesAPI = {
  getAll: async () => {
    const response = await axiosInstance.get('/expenses');
    return response.data;
  },
  getOne: async (id: number) => {
    const response = await axiosInstance.get(`/expenses/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await axiosInstance.post('/expenses', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await axiosInstance.patch(`/expenses/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/expenses/${id}`);
    return response.data;
  },
};

export default axiosInstance;