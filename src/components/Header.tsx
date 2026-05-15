import { Bell, Search, Menu, Store, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { branchesApi } from "../utils/api";
import { Branch } from "../types/api";

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

  const notifications: any[] = [];
  const unreadCount = 0;

  useEffect(() => {    const fetchBranches = async () => {
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
    <header
      className={`sticky top-0 z-40 bg-neo-bg/80 backdrop-blur-md border-b-2 border-neo-border px-6 py-4 transition-all duration-300`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleMobile}
          className="lg:hidden neo-btn bg-brand-yellow p-2"
        >
          <Menu size={22} />
        </button>

        {/* Branch Switcher */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowBranchSwitcher(!showBranchSwitcher)}
            className="neo-btn bg-brand-orange px-4 py-2 flex items-center gap-3 min-w-[200px]"
          >
            <Store size={18} />
            <div className="text-right flex-1">
              <p className="text-[10px] font-black opacity-70 leading-none">الفرع الحالي</p>
              <p className="font-black text-sm">{selectedBranch?.name || "جميع الفروع"}</p>
            </div>
            <ChevronDown size={16} className={`transition-transform ${showBranchSwitcher ? 'rotate-180' : ''}`} />
          </button>

          {showBranchSwitcher && (
            <div className="absolute top-full right-0 mt-2 w-64 neo-card bg-white p-2 z-50">
              <button
                onClick={() => handleBranchSelect(null)}
                className={`w-full text-right p-3 rounded-lg font-bold hover:bg-gray-50 transition-all ${!selectedBranch ? 'bg-brand-orange text-neo-text' : ''}`}
              >
                🌍 جميع الفروع
              </button>
              <div className="h-px bg-neo-border/10 my-2"></div>
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => handleBranchSelect(branch)}
                  className={`w-full text-right p-3 rounded-lg font-bold hover:bg-gray-50 transition-all ${selectedBranch?.id === branch.id ? 'bg-brand-orange text-neo-text' : ''}`}
                >
                  🏪 {branch.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xs">
          <div className="relative">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-neo-text/40" />
            <input
              type="text"
              placeholder="بحث..."
              className="neo-input w-full pr-10 text-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="neo-btn bg-brand-yellow p-2.5 relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -left-2 w-6 h-6 bg-brand-red text-white text-xs font-black rounded-full flex items-center justify-center border border-neo-border animate-pulse-glow">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute left-0 top-full mt-2 w-80 neo-card bg-white p-0 overflow-hidden z-50">
                <div className="p-3 bg-brand-yellow border-b-2 border-neo-border">
                  <h3 className="font-black">الإشعارات</h3>
                </div>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 border-b-2 border-neo-border/5 hover:bg-gray-50 cursor-pointer ${
                      notif.unread ? "bg-yellow-50" : ""
                    }`}
                  >
                    <p className="text-sm font-bold">{notif.text}</p>
                    <p className="text-xs text-neo-text/40 font-semibold mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="neo-btn bg-brand-green px-3 py-2 flex items-center gap-2 cursor-pointer">
            <span className="text-xl">🤵</span>
            <div className="hidden sm:block">
              <p className="font-black text-sm leading-tight">{localStorage.getItem("userName") || "مدير النظام"}</p>
              <p className="text-[10px] font-black text-brand-orange uppercase leading-none mt-0.5">{localStorage.getItem("userRole")}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
