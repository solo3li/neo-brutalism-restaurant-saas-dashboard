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
  LogOut,
  PhoneCall,
  Building2,
  ShieldCheck
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
}

const menuGroups = [
  {
    title: "الرئيسية",
    items: [
      { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard, color: "bg-brand-yellow" },
    ]
  },
  {
    title: "العمليات",
    items: [
      { id: "pos", label: "نقطة بيع (POS)", icon: ShoppingBag, color: "bg-brand-purple text-white" },
      { id: "callcenter", label: "مركز الاتصال", icon: PhoneCall, color: "bg-brand-orange text-white" },
      { id: "orders", label: "الطلبات", icon: ShoppingBag, color: "bg-brand-orange" },
    ]
  },
  {
    title: "الإدارة",
    items: [
      { id: "menu", label: "قائمة الطعام", icon: UtensilsCrossed, color: "bg-brand-green" },
      { id: "branches", label: "الفروع", icon: Store, color: "bg-brand-blue", restricted: true },
      { id: "departments", label: "الأقسام", icon: Building2, color: "bg-brand-orange", restricted: true },
      { id: "roles", label: "الأدوار والصلاحيات", icon: ShieldCheck, color: "bg-brand-purple", restricted: true },
      { id: "staff", label: "الموظفين", icon: Users, color: "bg-brand-pink", restricted: true },
      { id: "customers", label: "العملاء", icon: Users, color: "bg-brand-cyan" },
      { id: "analytics", label: "التقارير", icon: BarChart3, color: "bg-brand-purple", restricted: true },
      { id: "reviews", label: "التقييمات", icon: MessageSquare, color: "bg-brand-cyan" },
      { id: "settings", label: "الإعدادات", icon: Settings, color: "bg-brand-lime" },
    ]
  }
];

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, onLogout }: SidebarProps) {
  const userRole = localStorage.getItem("userRole") || "Staff";
  const isOwner = userRole === "Owner";

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
            <p className="text-xs font-bold text-neo-text/60">إدارة المطاعم</p>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
        {menuGroups.map((group) => {
          const visibleItems = group.items.filter(item => !item.restricted || isOwner);
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.title} className="space-y-2">
              {!collapsed && (
                <p className="px-3 text-[10px] font-black uppercase tracking-wider text-neo-text/40">
                  {group.title}
                </p>
              )}
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg font-bold transition-all ${
                        isActive
                          ? `${item.color} neo-btn text-neo-text`
                          : "hover:bg-gray-100 text-neo-text/70 hover:text-neo-text"
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon size={22} className="shrink-0" />
                      {!collapsed && <span className="text-sm">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Logout & Collapse toggle */}
      <div className="p-3 border-t-2 border-neo-border space-y-2">
        <button
          onClick={onLogout}
          className="w-full neo-btn bg-brand-red text-white p-2 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-bold text-sm">تسجيل الخروج</span>}
        </button>
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full neo-btn bg-gray-50 p-2 flex items-center justify-center gap-2 transition-all text-neo-text/60 hover:text-neo-text"
        >
          {collapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          {!collapsed && <span className="font-bold text-sm">تصغير القائمة</span>}
        </button>
      </div>
    </aside>
  );
}
