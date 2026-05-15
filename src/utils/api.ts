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
  register: (data: any) => api.post<LoginResponse>('/auth/register', data),
};

export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats'),
};

export const branchesApi = {
  getAll: () => api.get<Branch[]>('/branches'),
  create: (data: Partial<Branch>) => api.post<Branch>('/branches', data),
  update: (id: string, data: Partial<Branch>) => api.put<Branch>(`/branches/${id}`, data),
  delete: (id: string) => api.delete(`/branches/${id}`),
};

export const customersApi = {
  getAll: () => api.get<Customer[]>('/customers'),
  create: (data: Partial<Customer>) => api.post<Customer>('/customers', data),
  update: (id: string, data: Partial<Customer>) => api.put<Customer>(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
};

export const staffApi = {
  getAll: () => api.get<Staff[]>('/staff'),
  create: (data: any) => api.post<Staff>('/staff', data),
  update: (id: string, data: Partial<Staff>) => api.put<Staff>(`/staff/${id}`, data),
  delete: (id: string) => api.delete(`/staff/${id}`),
};

export const menuApi = {
  getCategories: () => api.get<MenuCategory[]>('/menu/categories'),
  createCategory: (data: Partial<MenuCategory>) => api.post<MenuCategory>('/menu/categories', data),
  deleteCategory: (id: number) => api.delete(`/menu/categories/${id}`),
  getItems: () => api.get<MenuItem[]>('/menu/items'),
  createItem: (data: Partial<MenuItem>) => api.post<MenuItem>('/menu/items', data),
  updateItem: (id: number, data: Partial<MenuItem>) => api.put<MenuItem>(`/menu/items/${id}`, data),
  deleteItem: (id: number) => api.delete(`/menu/items/${id}`),
};

export const ordersApi = {
  create: (order: any) => api.post<Order>('/orders', order),
  getAll: () => api.get<Order[]>('/orders'), // If implemented
};

export default api;
