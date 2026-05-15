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

const getBackendUrl = () => {
  // In a real production setup, you'd use a reverse proxy to handle both on port 80/443.
  // For now, we'll point to the VPS IP on port 5109.
  const backendIP = '209.38.238.175';
  return `http://${backendIP}:5109`;
};

export const BACKEND_URL = getBackendUrl();
const API_BASE_URL = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor for Auth token and Tenant ID
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  let tenantId = localStorage.getItem('tenantId');

  // Attempt to extract tenant from subdomain if not in localStorage
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  if (parts.length > 2 || (parts.length === 2 && !hostname.includes('localhost') && !/^\d/.test(hostname))) {
    // Basic logic: first part is tenant ID
    // e.g. 550e8400-e29b-41d4-a716-446655440000.209.38.238.175.sslip.io
    const subdomain = parts[0];
    if (subdomain !== 'www' && subdomain !== 'app') {
      tenantId = subdomain;
    }
  }

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
  getStats: (params?: any) => api.get<DashboardStats>('/dashboard/stats', { params }),
};

export const branchesApi = {
  getAll: () => api.get<Branch[]>('/branches'),
  create: (data: Partial<Branch>) => api.post<Branch>('/branches', data),
  update: (id: string, data: Partial<Branch>) => api.put<Branch>(`/branches/${id}`, data),
  delete: (id: string) => api.delete(`/branches/${id}`),
};

export const customersApi = {
  getAll: (params?: any) => api.get<Customer[]>('/customers', { params }),
  create: (data: Partial<Customer>) => api.post<Customer>('/customers', data),
  update: (id: string, data: Partial<Customer>) => api.put<Customer>(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
};

export const staffApi = {
  getAll: (params?: any) => api.get<Staff[]>('/staff', { params }),
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
  getAll: (params?: any) => api.get<Order[]>('/orders', { params }),
  updateStatus: (id: string, status: string) => api.put<Order>(`/orders/${id}/status`, { status }),
};

export default api;
