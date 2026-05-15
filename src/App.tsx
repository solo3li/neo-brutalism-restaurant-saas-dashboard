import { useState } from "react";
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
import {
  AnalyticsPage,
  BranchesPage,
  MenuPage,
  OrdersPage,
  ReviewsPage,
  SettingsPage,
  StaffPage,
} from "./pages/ManagementPages";
import PosPage from "./pages/PosPage";
import AuthPage from "./pages/AuthPage";

function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="neo-card bg-gradient-to-l from-brand-yellow via-brand-orange to-brand-pink p-6 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-neo-text">
            صباح الخير، عبدالله! ☀️
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
      <StatsCards />

      {/* Live Status */}
      <LiveStatus />

      {/* Quick Actions */}
      <QuickActions />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <OrdersChart />
      </div>

      {/* Orders Table */}
      <OrdersTable />

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
    case "orders":
      return <OrdersPage />;
    case "menu":
      return <MenuPage />;
    case "branches":
      return <BranchesPage />;
    case "staff":
      return <StaffPage />;
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <AuthPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-neo-bg font-cairo">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          onLogout={() => setIsLoggedIn(false)}
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
