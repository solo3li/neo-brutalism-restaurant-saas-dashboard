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
  DepartmentsPage,
  RolesPage,
} from "./pages/ManagementPages";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import PosPage from "./pages/PosPage";
import CallCenterPage from "./pages/CallCenterPage";
import CustomersPage from "./pages/CustomersPage";
import LandingPage from "./pages/LandingPage";

function DashboardPage() {
  const { stats, recentOrders, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black text-xl animate-pulse">جاري تحميل بياناتك...</p>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-20 text-center font-black text-2xl text-brand-red">⚠️ {error}</div>;

  const userName = localStorage.getItem("userName") || "أدمن";

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

      {/* Live Status */}
      <LiveStatus />

      {/* Main Stats */}
      <StatsCards stats={stats} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={stats?.revenueData || []} />
        <div className="grid grid-cols-1 gap-6">
           <OrdersChart data={stats?.ordersPerHour || []} />
           <WeeklyRatings data={stats?.weeklyRatings || []} />
        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <OrdersTable orders={recentOrders} />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <TopItems />
        </div>
      </div>

      {/* Branches & Staff */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BranchesCard />
        <StaffCard />
      </div>
    </div>
  );
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
      return;
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
    return <LandingPage onLogin={() => setIsLoggedIn(true)} />;
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
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={handleLogout}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setMobileMenuOpen(false);
        }}
      />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 min-h-screen ${
          sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"
        }`}
      >
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleMobile={() => setMobileMenuOpen(true)}
        />

        <div className="p-6 pb-24">
          <div className="max-w-[1600px] mx-auto">
            {(() => {
              switch (activeTab) {
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
                case "departments":
                  return <DepartmentsPage />;
                case "roles":
                  return <RolesPage />;
                case "employees":
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
            })()}
          </div>
        </div>

        {/* Global Footer */}
        <footer className="p-6 border-t-2 border-neo-border bg-white mt-12 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="w-10 h-10 bg-brand-orange neo-card-flat flex items-center justify-center text-xl">
              🍽️
            </div>
            <p className="font-black text-neo-text">
              فودي بورد (FoodyBoard)
            </p>
            <span className="hidden md:block w-1.5 h-1.5 bg-neo-border rounded-full opacity-20"></span>
            <span className="text-xs font-bold text-neo-text/40">
              جميع الحقوق محفوظة © {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-xs text-neo-text/40 font-semibold mt-1">
            صُنع بـ ❤️ لأصحاب المطاعم والكافيهات
          </p>
        </footer>
      </main>
    </div>
  );
}
