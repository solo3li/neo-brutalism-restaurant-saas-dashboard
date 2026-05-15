import { branches } from "../data/mockData";
import { MapPin, Star } from "lucide-react";

export default function BranchesCard() {
  return (
    <div className="neo-card p-5">
      <div className="mb-4">
        <h3 className="font-black text-lg">🏪 أداء الفروع</h3>
        <p className="text-sm text-gray-500 font-semibold">اليوم</p>
      </div>
      <div className="space-y-3">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className="p-3 rounded-lg border-2 border-neo-border hover:bg-yellow-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-brand-orange" />
                <h4 className="font-bold text-sm">{branch.name}</h4>
              </div>
              <span
                className={`neo-badge text-xs ${
                  branch.status === "مفتوح" ? "bg-brand-green" : "bg-brand-red text-white"
                }`}
              >
                {branch.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 font-semibold">طلبات</p>
                <p className="font-black text-sm">{branch.orders}</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 font-semibold">إيرادات</p>
                <p className="font-black text-sm">{(branch.revenue / 1000).toFixed(1)}K</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 font-semibold">تقييم</p>
                <div className="flex items-center justify-center gap-1">
                  <Star size={12} className="text-brand-yellow fill-brand-yellow" />
                  <p className="font-black text-sm">{branch.rating}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
