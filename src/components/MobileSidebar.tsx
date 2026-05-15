import { X, LayoutDashboard, ShoppingBag, UtensilsCrossed, Users, BarChart3, Settings, Store, MessageSquare } from "lucide-react";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard, color: "bg-brand-yellow" },
  { id: "pos", label: "نقطة بيع (POS)", icon: ShoppingBag, color: "bg-brand-purple text-white" },
  { id: "orders", label: "الطلبات", icon: ShoppingBag, color: "bg-brand-orange" },
  { id: "menu", label: "قائمة الطعام", icon: UtensilsCrossed, color: "bg-brand-green" },
  { id: "branches", label: "الفروع", icon: Store, color: "bg-brand-blue" },
  { id: "staff", label: "الموظفين", icon: Users, color: "bg-brand-pink" },
  { id: "analytics", label: "التقارير", icon: BarChart3, color: "bg-brand-purple" },
  { id: "reviews", label: "التقييمات", icon: MessageSquare, color: "bg-brand-cyan" },
  { id: "settings", label: "الإعدادات", icon: Settings, color: "bg-brand-lime" },
];

export default function MobileSidebar({ isOpen, onClose, activeTab, setActiveTab }: MobileSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <div className="absolute inset-0 bg-neo-border/50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-72 bg-neo-card border-l-2 border-neo-border shadow-lg overflow-y-auto">
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
        <nav className="p-3 space-y-2">
          {menuItems.map((item) => {
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
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Icon size={22} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
