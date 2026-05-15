import { TrendingUp, ShoppingBag, DollarSign, Users, Star } from "lucide-react";
import { DashboardStats } from "../types/api";

interface StatsCardsProps {
  stats: DashboardStats | null;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const displayStats = [
    {
      title: "إجمالي الإيرادات",
      value: stats?.totalRevenue.toLocaleString() || "٠",
      unit: "ر.س",
      change: "+١٢.٥٪",
      trend: "up",
      icon: DollarSign,
      color: "bg-brand-green",
      emoji: "💰",
    },
    {
      title: "الطلبات",
      value: stats?.totalOrders.toString() || "٠",
      unit: "طلب",
      change: "+٨.٣٪",
      trend: "up",
      icon: ShoppingBag,
      color: "bg-brand-orange",
      emoji: "📦",
    },
    {
      title: "الطاولات النشطة",
      value: stats?.activeTables.toString() || "٠",
      unit: "طاولة",
      change: "+٢٪",
      trend: "up",
      icon: Users,
      color: "bg-brand-blue",
      emoji: "👥",
    },
    {
      title: "طلبات معلقة",
      value: stats?.pendingOrders.toString() || "٠",
      unit: "طلب",
      change: "-١",
      trend: "down",
      icon: Star,
      color: "bg-brand-yellow",
      emoji: "⏳",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {displayStats.map((stat, index) => (
        <div
          key={index}
          className={`neo-card p-5 relative overflow-hidden`}
        >
          <div className={`absolute top-0 left-0 w-full h-1.5 ${stat.color}`}></div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500">{stat.title}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black">{stat.value}</span>
                <span className="text-sm font-bold text-gray-400">{stat.unit}</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={16} className="text-green-600" />
                <span className="text-sm font-bold text-green-600">{stat.change}</span>
                <span className="text-xs text-gray-400 font-semibold">عن أمس</span>
              </div>
            </div>
            <div className={`text-4xl animate-float`}>{stat.emoji}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
