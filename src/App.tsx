import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import { RevenueChart, OrdersChart, CategoryChart } from "./components/Charts";
import OrdersTable from "./components/OrdersTable";
import TopItems from "./components/TopItems";
import BranchesCard from "./components/BranchesCard";
import StaffCard from "./components/StaffCard";
import LiveStatus from "./components/LiveStatus";
import QuickActions from "./components/QuickActions";
import WeeklyRatings from "./components/WeeklyRatings";
import MobileSidebar from "./components/MobileSidebar";
import { useDashboardData } from "./hooks/useDashboardData";
import {
  BranchesPage,
  MenuPage,
  OrdersPage,
  ReviewsPage,
  SettingsPage,
  StaffPage,
} from "./pages/ManagementPages";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import PosPage from "./pages/PosPage";
import CallCenterPage from "./pages/CallCenterPage";
import CustomersPage from "./pages/CustomersPage";
import AuthPage from "./pages/AuthPage";

function DashboardPage() {
  const { stats, recentOrders, loading, error } = useDashboardData();
  const userName = localStorage.getItem('userName') || "عبدالله";

  if (loading) return <div className="p-20 text-center font-black text-2xl animate-pulse">جاري تحميل البيانات... 🍽️</div>;
  if (error) return <div className="p-20 text-center font-black text-2xl text-brand-red">⚠️ {error}</div>;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="neo-card bg-brand-yellow p-6 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-neo-text">
            صباح الخير، {userName}! ☀️
          </h2>
          <p className="font-bold text-neo-text/80 mt-1">
            إليك ملخص أداء مطعمك اليوم. أداء رائع! 🚀
          </p>
        </div>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-7xl opacity-30 animate-float hidden sm:block">
          🍽️
        </div>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Live Status */}
      <LiveStatus />

      {/* Quick Actions */}
      <QuickActions />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={stats?.revenueData || []} />
        <OrdersChart data={stats?.ordersPerHour || []} />
      </div>

      {/* Orders Table */}
      <OrdersTable orders={recentOrders} />

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopItems />
        <CategoryChart />
        <WeeklyRatings />
      </div>

      {/* Branches & Staff */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BranchesCard />
        <StaffCard />
      </div>
    </div>
  );
}

function getPageContent(tab: string) {
  switch (tab) {
    case "dashboard":
      return <DashboardPage />;
    case "pos":
      return <PosPage />;
    case "callcenter":
      return <CallCenterPage />;
    case "orders":
      return <OrdersPage />;
    case "menu":
      return <MenuPage />;
    case "branches":
      return <BranchesPage />;
    case "staff":
      return <StaffPage />;
    case "customers":
      return <CustomersPage />;
    case "analytics":
      return <AnalyticsPage />;
    case "reviews":
      return <ReviewsPage />;
    case "settings":
      return <SettingsPage />;
    default:
      return <DashboardPage />;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // Multi-tenant redirection and session capture
  useEffect(() => {
    const hostname = window.location.hostname;
    const baseDomain = "209.38.238.175"; // Your VPS IP
    const params = new URLSearchParams(window.location.search);

    // 1. Capture session from URL (sent from central login)
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      localStorage.setItem("tenantId", params.get("tenantId") || "");
      localStorage.setItem("tenantSubdomain", params.get("tenantSubdomain") || "");
      localStorage.setItem("userName", params.get("userName") || "");
      localStorage.setItem("userRole", params.get("userRole") || "");
      
      // Clean up URL and update state
      window.history.replaceState({}, document.title, window.location.pathname);
      setIsLoggedIn(true);
      return; // Stop here and let the next cycle handle redirection if needed
    }

    // 2. Force redirection from main domain to subdomain
    const token = localStorage.getItem('token');
    const storedSubdomain = localStorage.getItem('tenantSubdomain');

    if (token && storedSubdomain && (hostname === baseDomain || hostname === "localhost")) {
       if (!hostname.startsWith(storedSubdomain)) {
          window.location.replace(`http://${storedSubdomain}.${baseDomain}.sslip.io`);
       }
    }
  }, []);

  if (!isLoggedIn) {
    return <AuthPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    // Redirect to central login
    window.location.href = "http://209.38.238.175";
  };

  return (
    <div className="min-h-screen bg-neo-bg font-cairo" dir="rtl">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"
        }`}
      >
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleMobile={() => setMobileMenuOpen(true)}
        />
        <div className="p-4 md:p-6">{getPageContent(activeTab)}</div>

        {/* Footer */}
        <footer className="p-6 text-center border-t-2 border-neo-border mt-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="font-black">فودي بورد</span>
            <span className="text-gray-400 font-bold">|</span>
            <span className="text-sm text-gray-500 font-bold">
              نظام إدارة المطاعم والكافيهات © {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            صُنع بـ ❤️ لأصحاب المطاعم والكافيهات
          </p>
        </footer>
      </main>
    </div>
  );
}
