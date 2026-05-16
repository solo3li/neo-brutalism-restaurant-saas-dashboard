import { create } from 'zustand';
import { dashboardApi, ordersApi } from '../utils/api';
import { DashboardStats, Order } from '../types/api';
import * as signalR from '@microsoft/signalr';
import { BACKEND_URL } from '../utils/api';

interface DashboardState {
  stats: DashboardStats | null;
  recentOrders: Order[];
  loading: boolean;
  error: string | null;
  fetchDashboardData: (branchId?: string | null) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  initSignalR: () => () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  recentOrders: [],
  loading: false,
  error: null,

  fetchDashboardData: async (branchId) => {
    set({ loading: true, error: null });
    try {
      const params = branchId ? { branchId } : {};
      const [statsRes, ordersRes] = await Promise.all([
        dashboardApi.getStats(branchId || undefined),
        ordersApi.getAll(params)
      ]);
      set({ stats: statsRes.data, recentOrders: ordersRes.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      await ordersApi.updateStatus(orderId, status);
      // Data will be updated via SignalR or we can manually update local state
      set((state) => ({
        recentOrders: state.recentOrders.map(o => 
          o.id.toString() === orderId ? { ...o, status } : o
        )
      }));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  },

  initSignalR: () => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return () => {};

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BACKEND_URL}/orderHub?tenantId=${tenantId}`)
      .withAutomaticReconnect()
      .build();

    connection.on('ReceiveNewOrder', (order: Order) => {
      set((state) => ({
        recentOrders: [order, ...state.recentOrders.slice(0, 5)],
        stats: state.stats ? {
          ...state.stats,
          totalOrders: state.stats.totalOrders + 1,
          pendingOrders: state.stats.pendingOrders + 1
        } : null
      }));
    });

    connection.start().catch(err => console.error('SignalR Connection Error: ', err));

    return () => {
      connection.stop();
    };
  }
}));
