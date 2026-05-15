import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { revenueData, ordersPerHour, categoryData } from "../data/mockData";

export function RevenueChart() {
  return (
    <div className="neo-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-black text-lg">📊 الإيرادات والمصروفات</h3>
          <p className="text-sm text-gray-500 font-semibold">آخر 7 أشهر</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-brand-green rounded border-2 border-neo-border"></div>
            <span className="text-xs font-bold">إيرادات</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-brand-orange rounded border-2 border-neo-border"></div>
            <span className="text-xs font-bold">مصروفات</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={revenueData}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00E676" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00E676" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 700 }} />
          <YAxis tick={{ fontSize: 12, fontWeight: 700 }} />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "2px solid #1A1A1A",
              borderRadius: "8px",
              boxShadow: "2px 2px 0px #1A1A1A",
              fontWeight: 700,
            }}
          />
          <Area
            type="monotone"
            dataKey="إيرادات"
            stroke="#00E676"
            strokeWidth={2}
            fill="url(#colorRevenue)"
          />
          <Area
            type="monotone"
            dataKey="مصروفات"
            stroke="#FF6B35"
            strokeWidth={2}
            fill="url(#colorExpenses)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrdersChart() {
  return (
    <div className="neo-card p-5">
      <div className="mb-4">
        <h3 className="font-black text-lg">⏰ الطلبات حسب الساعة</h3>
        <p className="text-sm text-gray-500 font-semibold">توزيع الطلبات اليوم</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={ordersPerHour}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="hour" tick={{ fontSize: 11, fontWeight: 700 }} />
          <YAxis tick={{ fontSize: 12, fontWeight: 700 }} />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "2px solid #1A1A1A",
              borderRadius: "8px",
              boxShadow: "2px 2px 0px #1A1A1A",
              fontWeight: 700,
            }}
          />
          <Bar dataKey="طلبات" radius={[6, 6, 0, 0]} strokeWidth={2} stroke="#1A1A1A">
            {ordersPerHour.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  index % 4 === 0
                    ? "#FFD700"
                    : index % 4 === 1
                    ? "#FF6B35"
                    : index % 4 === 2
                    ? "#448AFF"
                    : "#00E676"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryChart() {
  return (
    <div className="neo-card p-5">
      <div className="mb-4">
        <h3 className="font-black text-lg">🥧 المبيعات حسب الفئة</h3>
        <p className="text-sm text-gray-500 font-semibold">توزيع المبيعات</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            dataKey="value"
            strokeWidth={2}
            stroke="#1A1A1A"
            label={({ name, value }) => `${name} ${value}%`}
            labelLine={{ strokeWidth: 2 }}
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "2px solid #1A1A1A",
              borderRadius: "8px",
              boxShadow: "2px 2px 0px #1A1A1A",
              fontWeight: 700,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
