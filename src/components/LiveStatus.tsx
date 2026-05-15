import { Clock, Flame, ChefHat, Truck, CheckCircle2 } from "lucide-react";

const liveStats = [
  { label: "في الانتظار", count: 8, icon: Clock, color: "bg-brand-yellow", emoji: "⏳" },
  { label: "جاري التحضير", count: 12, icon: Flame, color: "bg-brand-orange", emoji: "🔥" },
  { label: "في المطبخ", count: 5, icon: ChefHat, color: "bg-brand-pink", emoji: "👨‍🍳" },
  { label: "قيد التوصيل", count: 7, icon: Truck, color: "bg-brand-blue", emoji: "🚗" },
  { label: "مكتملة اليوم", count: 316, icon: CheckCircle2, color: "bg-brand-green", emoji: "✅" },
];

export default function LiveStatus() {
  return (
    <div className="neo-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-brand-red rounded-full animate-pulse-glow border-2 border-neo-border"></div>
        <h3 className="font-black text-lg">البث المباشر</h3>
        <span className="neo-badge bg-brand-red text-white text-xs">LIVE</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {liveStats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} p-4 rounded-xl border-2 border-neo-border text-center relative overflow-hidden`}
          >
            <div className="text-2xl mb-1">{stat.emoji}</div>
            <p className="text-2xl font-black">{stat.count}</p>
            <p className="text-xs font-bold mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
