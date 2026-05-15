import { 
  X, LayoutDashboard, ShoppingBag, UtensilsCrossed, Users, 
  BarChart3, Settings, Store, MessageSquare, PhoneCall,
  Building2, ShieldCheck
} from "lucide-react";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
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

export default function MobileSidebar({ isOpen, onClose, activeTab, setActiveTab }: MobileSidebarProps) {
  const userRole = localStorage.getItem("userRole") || "Staff";
  const isOwner = userRole.toLowerCase() === "owner" || userRole === "مدير عام";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <div className="absolute inset-0 bg-neo-border/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-72 bg-neo-card border-l-2 border-neo-border shadow-lg flex flex-col">
        <div className="flex items-center justify-between p-4 border-b-2 border-neo-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-orange neo-card-flat flex items-center justify-center text-xl">
              🍽️
            </div>
            <h1 className="font-black">فودي بورد</h1>
          </div>
          <button onClick={onClose} className="neo-btn bg-brand-red text-white p-1.5">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
          {menuGroups.map((group) => {
            const visibleItems = group.items.filter(item => !item.restricted || isOwner);
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title} className="space-y-2">
                <p className="px-3 text-[10px] font-black uppercase tracking-wider text-neo-text/40">
                  {group.title}
                </p>
                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          onClose();
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg font-bold transition-all ${
                          isActive
                            ? `${item.color} neo-btn text-neo-text`
                            : "hover:bg-gray-100 text-neo-text/70"
                        }`}
                      >
                        <Icon size={22} />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
