import { useState, useEffect } from "react";
import { 
  BarChart3, TrendingUp, Users, 
  ShoppingBag, DollarSign, RefreshCcw
} from "lucide-react";
import { dashboardApi, branchesApi } from "../utils/api";
import { DashboardStats, Branch } from "../types/api";
import { RevenueChart, OrdersChart } from "../components/Charts";

const formatCurrency = (value: number) => `${value.toLocaleString("ar-SA")} ر.س`;

export function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setFilter] = useState("last7days");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, branchesRes] = await Promise.all([
        dashboardApi.getStats(),
        branchesApi.getAll()
      ]);
      setStats(statsRes.data);
      setBranches(branchesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="p-20 text-center font-black text-2xl animate-pulse">جاري تحليل البيانات... 📊</div>;

  return (
    <div className="space-y-6">
      <div className={`bg-brand-purple neo-card p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-white`}>
        <div className="flex items-center gap-4">
          <div className="neo-card-flat bg-white p-3 text-neo-text">
            <BarChart3 size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black">تحليلات الأداء</h2>
            <p className="font-bold opacity-80">راقب نمو مبيعاتك، سلوك العملاء، وكفاءة الفروع</p>
          </div>
        </div>
        <div className="flex gap-2">
            <button onClick={fetchData} className="neo-btn bg-white text-neo-text p-2.5">
                <RefreshCcw size={18} />
            </button>
            <select className="neo-input bg-white text-neo-text font-bold" value={timeRange} onChange={(e) => setFilter(e.target.value)}>
                <option value="today">اليوم</option>
                <option value="last7days">آخر 7 أيام</option>
                <option value="month">هذا الشهر</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="إجمالي المبيعات" value={formatCurrency(stats?.totalRevenue || 0)} icon={DollarSign} color="bg-brand-green" trend="+12%" />
          <StatCard title="عدد الطلبات" value={stats?.totalOrders || 0} icon={ShoppingBag} color="bg-brand-yellow" trend="+5%" />
          <StatCard title="متوسط قيمة الطلب" value={formatCurrency((stats?.totalRevenue || 0) / (stats?.totalOrders || 1))} icon={TrendingUp} color="bg-brand-cyan" trend="+2%" />
          <StatCard title="العملاء النشطون" value={stats?.totalOrders ? Math.floor(stats.totalOrders * 0.8) : 0} icon={Users} color="bg-brand-pink" trend="+8%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="neo-card p-6 bg-white">
            <h3 className="font-black text-lg mb-6 flex items-center gap-2">
                <DollarSign className="text-brand-green" />
                تحليل الإيرادات اليومية
            </h3>
            <div className="h-[350px]">
                <RevenueChart data={stats?.revenueData || []} />
            </div>
        </div>
        <div className="neo-card p-6 bg-white">
            <h3 className="font-black text-lg mb-6 flex items-center gap-2">
                <ShoppingBag className="text-brand-orange" />
                كثافة الطلبات خلال اليوم
            </h3>
            <div className="h-[350px]">
                <OrdersChart data={stats?.ordersPerHour || []} />
            </div>
        </div>
      </div>

      <div className="neo-card p-6 bg-white">
          <h3 className="font-black text-lg mb-4">أداء الفروع</h3>
          <div className="overflow-x-auto">
              <table className="w-full text-right">
                  <thead>
                      <tr className="border-b-2 border-gray-100">
                          <th className="p-3 font-black">الفرع</th>
                          <th className="p-3 font-black">الطلبات</th>
                          <th className="p-3 font-black">المبيعات</th>
                          <th className="p-3 font-black">التقييم</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                      {branches.map(branch => (
                        <tr key={branch.id}>
                            <td className="p-3 font-bold">{branch.name}</td>
                            <td className="p-3 font-bold">{branch.ordersCount}</td>
                            <td className="p-3 font-black text-brand-green">{formatCurrency(branch.revenue)}</td>
                            <td className="p-3">
                              <span className="text-brand-yellow flex items-center gap-1 font-bold">
                                <TrendingUp size={14}/> {branch.rating}
                              </span>
                            </td>
                        </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, trend }: any) {
    return (
        <div className="neo-card p-5 bg-white">
            <div className="flex items-center justify-between mb-4">
                <div className={`${color} p-2 rounded-lg border-2 border-neo-border`}>
                    <Icon size={20} />
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-full border-2 border-neo-border ${trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {trend}
                </span>
            </div>
            <p className="text-xs font-bold text-gray-500">{title}</p>
            <p className="text-2xl font-black mt-1">{value}</p>
        </div>
    );
}
