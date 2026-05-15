import { TrendingUp, TrendingDown, ShoppingBag, DollarSign, Users, Star } from "lucide-react";

const stats = [
  {
    title: "إجمالي الإيرادات",
    value: "٧٢,٤٥٠",
    unit: "ر.س",
    change: "+١٢.٥٪",
    trend: "up",
    icon: DollarSign,
    color: "bg-brand-green",
    emoji: "💰",
  },
  {
    title: "الطلبات اليوم",
    value: "٣٤٨",
    unit: "طلب",
    change: "+٨.٣٪",
    trend: "up",
    icon: ShoppingBag,
    color: "bg-brand-orange",
    emoji: "📦",
  },
  {
    title: "العملاء الجدد",
    value: "٦٧",
    unit: "عميل",
    change: "+٢٤.١٪",
    trend: "up",
    icon: Users,
    color: "bg-brand-blue",
    emoji: "👥",
  },
  {
    title: "متوسط التقييم",
    value: "٤.٨",
    unit: "من ٥",
    change: "+٠.٢",
    trend: "up",
    icon: Star,
    color: "bg-brand-yellow",
    emoji: "⭐",
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
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
                {stat.trend === "up" ? (
                  <TrendingUp size={16} className="text-green-600" />
                ) : (
                  <TrendingDown size={16} className="text-red-500" />
                )}
                <span
                  className={`text-sm font-bold ${
                    stat.trend === "up" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {stat.change}
                </span>
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
