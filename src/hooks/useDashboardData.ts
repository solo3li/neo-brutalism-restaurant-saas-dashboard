import { useState, useEffect } from 'react';
import { dashboardApi, ordersApi } from '../utils/api';
import { DashboardStats, Order } from '../types/api';
import * as signalR from '@microsoft/signalr';

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes] = await Promise.all([
        dashboardApi.getStats(),
        ordersApi.getAll(),
      ]);
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data);
      setError(null);
    } catch (err) {
      setError('فشل تحميل البيانات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // SignalR Connection
    const tenantId = localStorage.getItem('tenantId');
    const token = localStorage.getItem('token');

    if (!tenantId || !token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:5000/orderHub`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        connection.invoke('JoinTenantGroup', tenantId);
        
        connection.on('ReceiveOrderUpdate', (order: Order) => {
          setRecentOrders(prev => [order, ...prev.slice(0, 5)]);
          // Optionally refresh stats too
          dashboardApi.getStats().then(res => setStats(res.data));
        });
      })
      .catch(err => console.error('SignalR Connection Error: ', err));

    return () => {
      connection.stop();
    };
  }, []);

  return { stats, recentOrders, loading, error, refresh: fetchData };
}
