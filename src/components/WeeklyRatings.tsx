import { weeklyRatings } from "../data/mockData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

export default function WeeklyRatings() {
  return (
    <div className="neo-card p-5">
      <div className="mb-4">
        <h3 className="font-black text-lg">⭐ تقييمات الأسبوع</h3>
        <p className="text-sm text-gray-500 font-semibold">متوسط التقييم اليومي</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={weeklyRatings}>
          <XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 700 }} />
          <YAxis domain={[4, 5]} tick={{ fontSize: 12, fontWeight: 700 }} />
          <Bar dataKey="rating" radius={[8, 8, 0, 0]} strokeWidth={2} stroke="#1A1A1A">
            {weeklyRatings.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.rating >= 4.8
                    ? "#00E676"
                    : entry.rating >= 4.5
                    ? "#FFD700"
                    : "#FF6B35"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-brand-green rounded border-2 border-neo-border"></div>
          <span className="text-xs font-bold">ممتاز (4.8+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-brand-yellow rounded border-2 border-neo-border"></div>
          <span className="text-xs font-bold">جيد (4.5+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-brand-orange rounded border-2 border-neo-border"></div>
          <span className="text-xs font-bold">متوسط</span>
        </div>
      </div>
    </div>
  );
}
