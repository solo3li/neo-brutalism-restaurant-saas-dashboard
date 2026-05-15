import { Bell, Search, Menu } from "lucide-react";
import { notifications } from "../data/mockData";
import { useState } from "react";

interface HeaderProps {
  sidebarCollapsed: boolean;
  onToggleMobile: () => void;
}

export default function Header({ onToggleMobile }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

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

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن طلب، منتج، أو عميل..."
              className="neo-input w-full pr-10 text-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Date */}
          <div className="hidden md:block neo-card-flat px-4 py-2">
            <p className="text-xs font-bold text-gray-500">اليوم</p>
            <p className="font-black text-sm">
              {new Date().toLocaleDateString("ar-SA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

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
              <div className="absolute left-0 top-full mt-2 w-80 neo-card-flat bg-white p-0 overflow-hidden z-50">
                <div className="p-3 bg-brand-yellow border-b-2 border-neo-border">
                  <h3 className="font-black">الإشعارات</h3>
                </div>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 border-b-2 border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      notif.unread ? "bg-yellow-50" : ""
                    }`}
                  >
                    <p className="text-sm font-bold">{notif.text}</p>
                    <p className="text-xs text-gray-400 font-semibold mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="neo-btn bg-brand-green px-3 py-2 flex items-center gap-2 cursor-pointer">
            <span className="text-xl">👤</span>
            <div className="hidden sm:block">
              <p className="font-black text-sm leading-tight">عبدالله الأحمد</p>
              <p className="text-xs font-bold opacity-70">مدير</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
