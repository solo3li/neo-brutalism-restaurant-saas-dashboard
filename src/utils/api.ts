import axios from 'axios';
import { 
  LoginResponse, 
  Branch, 
  Customer, 
  Staff, 
  MenuCategory, 
  MenuItem, 
  Order, 
  DashboardStats 
} from '../types/api';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor for Auth token and Tenant ID
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const tenantId = localStorage.getItem('tenantId');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (tenantId) {
    config.headers['X-Tenant-Id'] = tenantId;
  }

  return config;
});

export const authApi = {
  login: (credentials: any) => api.post<LoginResponse>('/auth/login', credentials),
};

export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats'),
};

export const branchesApi = {
  getAll: () => api.get<Branch[]>('/branches'),
};

export const customersApi = {
  getAll: () => api.get<Customer[]>('/customers'),
};

export const staffApi = {
  getAll: () => api.get<Staff[]>('/staff'),
};

export const menuApi = {
  getCategories: () => api.get<MenuCategory[]>('/menu/categories'),
  getItems: () => api.get<MenuItem[]>('/menu/items'),
};

export const ordersApi = {
  create: (order: any) => api.post<Order>('/orders', order),
  getAll: () => api.get<Order[]>('/orders'), // If implemented
};

export default api;
