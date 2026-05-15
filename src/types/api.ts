export interface LoginResponse {
  token: string;
  tenant: {
    id: string;
    name: string;
    subdomain: string;
  };
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  status: string;
  rating: number;
  ordersCount: number;
  revenue: number;
}

export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  addresses: string[];
  totalOrders: number;
  totalSpent: number;
  lastVisit: string | null;
}

export interface Staff {
  id: string;
  fullName: string;
  role: string;
  ordersHandled: number;
  rating: number;
  status: string;
  avatar: string;
}

export interface MenuCategory {
  id: number;
  name: string;
  icon: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  itemsSummary: string;
  totalAmount: number;
  status: string;
  orderType: string;
  createdAt: string;
}

export interface RevenuePoint {
  name: string;
  revenue: number;
  expenses: number;
}

export interface HourlyOrders {
  hour: string;
  orders: number;
}

export interface DailyRating {
  day: string;
  rating: number;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeTables: number;
  pendingOrders: number;
  revenueData: RevenuePoint[];
  ordersPerHour: HourlyOrders[];
  weeklyRatings: DailyRating[];
}
