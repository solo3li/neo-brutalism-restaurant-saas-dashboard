import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  BarChart3,
  Settings,
  Store,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const menuItems = [
  { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard, color: "bg-brand-yellow" },
  { id: "orders", label: "الطلبات", icon: ShoppingBag, color: "bg-brand-orange" },
  { id: "menu", label: "قائمة الطعام", icon: UtensilsCrossed, color: "bg-brand-green" },
  { id: "branches", label: "الفروع", icon: Store, color: "bg-brand-blue" },
  { id: "staff", label: "الموظفين", icon: Users, color: "bg-brand-pink" },
  { id: "analytics", label: "التقارير", icon: BarChart3, color: "bg-brand-purple" },
  { id: "reviews", label: "التقييمات", icon: MessageSquare, color: "bg-brand-cyan" },
  { id: "settings", label: "الإعدادات", icon: Settings, color: "bg-brand-lime" },
];

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }: SidebarProps) {
  return (
    <aside
      className={`fixed right-0 top-0 h-screen bg-neo-card border-l-2 border-neo-border z-50 flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="p-4 border-b-2 border-neo-border flex items-center gap-3">
        <div className="w-12 h-12 bg-brand-orange neo-card-flat flex items-center justify-center text-2xl shrink-0">
          🍽️
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-black text-lg leading-tight">فودي بورد</h1>
            <p className="text-xs font-bold text-gray-500">إدارة المطاعم</p>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg font-bold transition-all ${
                isActive
                  ? `${item.color} neo-btn text-neo-text`
                  : "hover:bg-gray-100 text-gray-600 hover:text-neo-text"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={22} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t-2 border-neo-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full neo-btn bg-gray-100 p-2 flex items-center justify-center gap-2"
        >
          {collapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          {!collapsed && <span className="font-bold text-sm">تصغير القائمة</span>}
        </button>
      </div>
    </aside>
  );
}
