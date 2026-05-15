import { useMemo, useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  Coffee,
  CreditCard,
  Download,
  Eye,
  FileText,
  Filter,
  Flame,
  Gift,
  Globe2,
  LockKeyhole,
  MapPin,
  MessageSquare,
  PackageCheck,
  Percent,
  Plus,
  Printer,
  QrCode,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  Truck,
  UserCheck,
  Users,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  Cell,
} from "recharts";
import { CategoryChart, OrdersChart, RevenueChart } from "../components/Charts";
import WeeklyRatings from "../components/WeeklyRatings";
import {
  menuApi,
  ordersApi,
  branchesApi,
  staffApi,
} from "../utils/api";
import { MenuItem, MenuCategory, Order, Branch, Staff } from "../types/api";

const tooltipStyle = {
  background: "#fff",
  border: "2px solid #1A1A1A",
  borderRadius: "8px",
  boxShadow: "2px 2px 0px #1A1A1A",
  fontWeight: 700,
};

const formatCurrency = (value: number) => `${value.toLocaleString("ar-SA")} ر.س`;

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accent: string;
  actionLabel?: string;
}

function PageHeader({ title, subtitle, icon: Icon, accent, actionLabel }: PageHeaderProps) {
  return (
    <div className={`${accent} neo-card p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
      <div className="flex items-center gap-4">
        <div className="neo-card-flat bg-white p-3">
          <Icon size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black">{title}</h2>
          <p className="font-bold text-neo-text/70">{subtitle}</p>
        </div>
      </div>
      {actionLabel && (
        <button className="neo-btn bg-white px-5 py-2.5 flex items-center justify-center gap-2">
          <Plus size={18} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}

interface MetricTileProps {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  color: string;
}

function MetricTile({ label, value, note, icon: Icon, color }: MetricTileProps) {
  return (
    <div className="neo-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-black">{value}</p>
          <p className="mt-1 text-xs font-bold text-gray-400">{note}</p>
        </div>
        <div className={`${color} rounded-xl border-2 border-neo-border p-2`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function StatusPill({ label, color }: { label: string; color: string }) {
  return <span className={`neo-badge ${color}`}>{label}</span>;
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [query, setQuery] = useState("");

  useEffect(() => {
    ordersApi.getAll().then(res => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "الكل" || order.status === statusFilter;
      const matchesQuery = `${order.orderNumber} ${order.customerName} ${order.itemsSummary}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [orders, query, statusFilter]);

  const columns = [
    { title: "قيد الانتظار", icon: Clock, color: "bg-brand-yellow", orders: orders.filter((order) => order.status === "Pending") },
    { title: "جاري التحضير", icon: Flame, color: "bg-brand-orange", orders: orders.filter((order) => order.status === "Preparing") },
    { title: "جاهز ومكتمل", icon: CheckCircle2, color: "bg-brand-green", orders: orders.filter((order) => order.status === "Completed") },
  ];

  if (loading) return <div className="p-20 text-center font-black text-2xl animate-pulse">جاري تحميل الطلبات... 📦</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة الطلبات"
        subtitle="تابع الطلبات من الاستلام حتى التسليم في لوحة واحدة"
        icon={ShoppingBag}
        accent="bg-brand-orange"
        actionLabel="طلب جديد"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricTile label="طلبات مفتوحة" value={`${orders.length}`} note="داخل المطبخ والتوصيل" icon={Clock} color="bg-brand-yellow" />
        <MetricTile label="متوسط التجهيز" value="١٤ د" note="أسرع من أمس بدقيقتين" icon={Flame} color="bg-brand-orange" />
        <MetricTile label="توصيل نشط" value="٧" note="٣ مناطق داخل المدينة" icon={Truck} color="bg-brand-blue" />
        <MetricTile label="نسبة الإكمال" value="٩٦٪" note="آخر ٢٤ ساعة" icon={CheckCircle2} color="bg-brand-green" />
      </div>

      <div className="neo-card p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-xl">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="neo-input w-full pr-10"
            placeholder="ابحث برقم الطلب، العميل، أو الأصناف"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['الكل', 'Pending', 'Preparing', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`neo-btn px-4 py-2 text-sm ${statusFilter === status ? 'bg-brand-yellow' : 'bg-white'}`}
            >
              {status === "الكل" ? "الكل" : status === "Pending" ? "قيد الانتظار" : status === "Preparing" ? "جاري التحضير" : "مكتمل"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {columns.map((column) => {
          const Icon = column.icon;
          return (
            <div key={column.title} className="neo-card p-4">
              <div className={`${column.color} rounded-xl border-2 border-neo-border p-3 flex items-center justify-between mb-4`}>
                <div className="flex items-center gap-2 font-black">
                  <Icon size={18} />
                  {column.title}
                </div>
                <span className="neo-badge bg-white">{column.orders.length}</span>
              </div>
              <div className="space-y-3">
                {column.orders.map((order) => (
                  <div key={order.id} className="rounded-xl border-2 border-neo-border bg-white p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-brand-blue">{order.orderNumber}</span>
                      <span className="text-xs font-bold text-gray-500">{new Date(order.createdAt).toLocaleTimeString('ar-SA')}</span>
                    </div>
                    <p className="mt-1 font-bold">{order.customerName || "عميل خارجي"}</p>
                    <p className="text-sm font-semibold text-gray-500">{order.itemsSummary}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <StatusPill label={order.orderType} color="bg-brand-pink" />
                      <span className="font-black">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | "الكل">("الكل");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, categoriesRes] = await Promise.all([
          menuApi.getItems(),
          menuApi.getCategories()
        ]);
        setItems(itemsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredMenu = activeCategory === "الكل" ? items : items.filter((item) => item.categoryId === activeCategory);

  if (loading) return <div className="p-20 text-center font-black text-2xl animate-pulse">جاري تحميل القائمة... ☕</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="قائمة الطعام"
        subtitle="إدارة الأصناف، الأسعار، التوفر، وربحية كل منتج"
        icon={UtensilsCrossed}
        accent="bg-brand-green"
        actionLabel="إضافة صنف"
      />

      <div className="neo-card p-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("الكل")}
            className={`neo-btn px-4 py-2 text-sm ${activeCategory === "الكل" ? "bg-brand-green" : "bg-white"}`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`neo-btn px-4 py-2 text-sm ${activeCategory === cat.id ? "bg-brand-green" : "bg-white"}`}
            >
              {cat.name} {cat.icon}
            </button>
          ))}
        </div>
      </div>

      <div className="neo-card overflow-hidden">
        <div className="p-4 border-b-2 border-neo-border flex items-center justify-between">
          <h3 className="font-black text-lg">الأصناف</h3>
          <StatusPill label={`${filteredMenu.length} صنف`} color="bg-brand-green" />
        </div>
        <div className="divide-y divide-gray-100">
          {filteredMenu.map((item) => (
            <div key={item.id} className="p-4 hover:bg-yellow-50">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border-2 border-neo-border bg-white p-3 text-3xl">🍕</div>
                  <div>
                    <h4 className="font-black">{item.name}</h4>
                    <p className="text-sm font-bold text-gray-500">{item.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:min-w-[200px]">
                  <div><p className="text-xs font-bold text-gray-400">السعر</p><p className="font-black">{formatCurrency(item.price)}</p></div>
                </div>
                <StatusPill label="نشط" color="bg-brand-green" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    branchesApi.getAll().then(res => {
      setBranches(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-20 text-center font-black text-2xl animate-pulse">جاري تحميل الفروع... 🏪</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة الفروع"
        subtitle="راقب أداء كل فرع، حالة التشغيل، ومناطق التوصيل"
        icon={Store}
        accent="bg-brand-blue"
        actionLabel="فرع جديد"
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {branches.map((branch, index) => (
          <div key={branch.id} className="neo-card p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className={`${index % 2 === 0 ? "bg-brand-blue" : "bg-brand-cyan"} rounded-xl border-2 border-neo-border p-3`}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg">{branch.name}</h3>
                  <p className="text-sm font-bold text-gray-500">{branch.address}</p>
                </div>
              </div>
              <StatusPill label={branch.status} color={branch.status === "Open" ? "bg-brand-green" : "bg-brand-red text-white"} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl border-2 border-neo-border bg-white p-3"><p className="text-xs font-bold text-gray-500">طلبات</p><p className="text-xl font-black">{branch.ordersCount}</p></div>
              <div className="rounded-xl border-2 border-neo-border bg-white p-3"><p className="text-xs font-bold text-gray-500">إيرادات</p><p className="text-xl font-black">{formatCurrency(branch.revenue)}</p></div>
              <div className="rounded-xl border-2 border-neo-border bg-white p-3"><p className="text-xs font-bold text-gray-500">تقييم</p><p className="text-xl font-black">{branch.rating}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    staffApi.getAll().then(res => {
      setStaff(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-20 text-center font-black text-2xl animate-pulse">جاري تحميل فريق العمل... 👨‍🍳</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة الموظفين"
        subtitle="الورديات، الأداء، الصلاحيات، ومتابعة الفريق لحظة بلحظة"
        icon={Users}
        accent="bg-brand-pink"
        actionLabel="موظف جديد"
      />

      <div className="neo-card p-5">
        <h3 className="font-black text-lg mb-4">الفريق الحالي</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {staff.map((member) => (
            <div key={member.id} className="rounded-xl border-2 border-neo-border bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{member.avatar}</div>
                  <div>
                    <h4 className="font-black">{member.fullName}</h4>
                    <p className="text-sm font-bold text-gray-500">{member.role}</p>
                  </div>
                </div>
                <StatusPill label={member.status} color={member.status === "Available" ? "bg-brand-green" : "bg-brand-orange"} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-yellow-50 p-2"><p className="text-xs font-bold text-gray-500">طلبات</p><p className="font-black">{member.ordersHandled}</p></div>
                <div className="rounded-lg bg-yellow-50 p-2"><p className="text-xs font-bold text-gray-500">تقييم</p><p className="font-black">{member.rating}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="التقارير والإحصائيات"
        subtitle="مؤشرات مالية وتشغيلية تساعدك على اتخاذ قرار أسرع"
        icon={BarChart3}
        accent="bg-brand-purple text-white"
        actionLabel="تصدير تقرير"
      />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RevenueChart data={[]} />
        <OrdersChart data={[]} />
      </div>
    </div>
  );
}

export function ReviewsPage() {
  return <div className="p-20 text-center font-black text-2xl">قسم التقييمات قيد التطوير... 🏗️</div>;
}

export function SettingsPage() {
  return <div className="p-20 text-center font-black text-2xl">قسم الإعدادات قيد التطوير... 🏗️</div>;
}
