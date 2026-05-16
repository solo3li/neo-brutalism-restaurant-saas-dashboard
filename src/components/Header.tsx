import { Bell, Search, Menu, Store, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { branchesApi } from "../utils/api";
import { Branch } from "../types/api";
import { useDashboardStore } from "../store/useDashboardStore";

interface HeaderProps {
  sidebarCollapsed: boolean;
  onToggleMobile: () => void;
  onBranchChange?: (branchId: string | null) => void;
}

export default function Header({ onToggleMobile, onBranchChange }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBranchSwitcher, setShowBranchSwitcher] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const { stats } = useDashboardStore();
  const notifications = stats?.notifications || [];
  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await branchesApi.getAll();
        setBranches(res.data);
        
        const storedBranchId = localStorage.getItem("selectedBranchId");
        if (storedBranchId) {
          const found = res.data.find(b => b.id === storedBranchId);
          if (found) setSelectedBranch(found);
        }
      } catch (err) {
        console.error("Failed to fetch branches", err);
      }
    };
    fetchBranches();
  }, []);

  const handleBranchSelect = (branch: Branch | null) => {
    setSelectedBranch(branch);
    if (branch) {
      localStorage.setItem("selectedBranchId", branch.id);
    } else {
      localStorage.removeItem("selectedBranchId");
    }
    setShowBranchSwitcher(false);
    if (onBranchChange) onBranchChange(branch?.id || null);
    // Refresh to update all components
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 bg-white px-4 border-b-4 border-neo-border lg:px-8">
      {/* Mobile Toggle */}
      <button
        onClick={onToggleMobile}
        className="neo-btn p-2 lg:hidden bg-brand-yellow"
      >
        <Menu size={24} strokeWidth={3} />
      </button>

      {/* Page Title / Search */}
      <div className="hidden lg:flex items-center gap-4 flex-1">
        <div className="relative group w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-neo-border transition-colors group-focus-within:text-brand-orange" size={20} strokeWidth={3} />
          <input
            type="text"
            placeholder="بحث..."
            className="neo-input w-full pr-10 focus:ring-0 focus:border-brand-orange"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-5">
        {/* Branch Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowBranchSwitcher(!showBranchSwitcher)}
            className="neo-btn h-11 px-4 bg-[#FFFBEB] flex items-center gap-2 font-black text-sm"
          >
            <Store size={18} strokeWidth={3} />
            <span className="hidden sm:inline">{selectedBranch?.name || "جميع الفروع"}</span>
            <ChevronDown size={16} strokeWidth={3} className={`transition-transform ${showBranchSwitcher ? 'rotate-180' : ''}`} />
          </button>

          {showBranchSwitcher && (
            <div className="absolute left-0 mt-3 w-64 neo-card bg-white p-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <button
                onClick={() => handleBranchSelect(null)}
                className={`w-full text-right p-3 rounded-lg font-bold text-sm transition-colors mb-1 ${!selectedBranch ? 'bg-brand-yellow' : 'hover:bg-yellow-50'}`}
              >
                🌍 جميع الفروع
              </button>
              <div className="max-h-64 overflow-y-auto">
                {branches.map(branch => (
                  <button
                    key={branch.id}
                    onClick={() => handleBranchSelect(branch)}
                    className={`w-full text-right p-3 rounded-lg font-bold text-sm transition-colors mb-1 ${selectedBranch?.id === branch.id ? 'bg-brand-yellow' : 'hover:bg-yellow-50'}`}
                  >
                    📍 {branch.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`neo-btn p-2.5 relative transition-colors ${showNotifications ? 'bg-brand-orange text-white' : 'bg-white'}`}
          >
            <Bell size={22} strokeWidth={3} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -left-1 w-6 h-6 bg-brand-red text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-neo-border animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute left-0 mt-3 w-80 sm:w-96 neo-card bg-white overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b-2 border-neo-border bg-[#FFFBEB] flex items-center justify-between">
                <h3 className="font-black">الإشعارات</h3>
                <span className="neo-badge bg-brand-yellow text-[10px]">{unreadCount} جديد</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors flex gap-4 ${n.unread ? 'bg-yellow-50/50' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-xl border-2 border-neo-border flex items-center justify-center text-xl shadow-[2px_2px_0px_#1A1A1A] flex-shrink-0 ${
                        n.type === 'order' ? 'bg-brand-green' : 
                        n.type === 'warning' ? 'bg-brand-orange' : 
                        n.type === 'review' ? 'bg-brand-yellow' : 'bg-brand-blue'
                      }`}>
                        {n.type === 'order' ? '🛒' : n.type === 'warning' ? '⚠️' : n.type === 'review' ? '⭐' : 'ℹ️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-neo-text leading-snug">{n.text}</p>
                        <p className="text-[10px] font-black text-neo-text/40 mt-1 uppercase">{n.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-neo-text/40 font-bold">
                    لا توجد إشعارات حالياً
                  </div>
                )}
              </div>
              <button className="w-full p-3 bg-gray-50 text-xs font-black hover:bg-gray-100 border-t-2 border-neo-border">
                عرض جميع الإشعارات
              </button>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pr-2 border-r-2 border-neo-border mr-1">
          <div className="hidden sm:block text-left">
            <p className="text-sm font-black leading-none">{localStorage.getItem("userName") || "أدمن"}</p>
            <p className="text-[10px] font-black text-brand-orange mt-1 uppercase tracking-tighter">
              {localStorage.getItem("userRole") || "مدير النظام"}
            </p>
          </div>
          <div className="w-11 h-11 bg-brand-cyan neo-card-flat flex items-center justify-center text-2xl border-2 border-neo-border overflow-hidden">
            👤
          </div>
        </div>
      </div>
    </header>
  );
}
