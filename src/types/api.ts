export interface LoginResponse {
  token: string;
  requiresTwoFactor?: boolean;
  tenant: {
    id: string;
    name: string;
    subdomain: string;
    loginUrl: string;
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
  email?: string;
  departmentId?: string;
  departmentName?: string;
  roles?: string[];
  twoFactorEnabled?: boolean;
  mfaQrCodeUri?: string;
}

export interface Department {
  id: string;
  name: string;
  employeeCount: number;
}

export interface Role {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  permissions: string[];
}

export interface Permission {
  name: string;
  code: string;
  group: string;
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

export interface Notification {
  id: number;
  text: string;
  time: string;
  type: "order" | "warning" | "review" | "success" | "info";
  unread: boolean;
}

export interface TopItem {
  id: number;
  name: string;
  orders: number;
  revenue: number;
  emoji: string;
  trend: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeTables: number;
  pendingOrders: number;
  preparingOrders: number;
  inKitchenOrders: number;
  deliveryOrders: number;
  completedTodayOrders: number;
  revenueData: RevenuePoint[];
  ordersPerHour: HourlyOrders[];
  weeklyRatings: DailyRating[];
  topItems: TopItem[];
  notifications: Notification[];
}
