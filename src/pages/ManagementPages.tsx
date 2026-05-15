import { useMemo, useState } from "react";
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
  PhoneCall,
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
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CategoryChart, OrdersChart, RevenueChart } from "../components/Charts";
import WeeklyRatings from "../components/WeeklyRatings";
import {
  branches,
  notifications,
  ordersPerHour,
  recentOrders,
  staffMembers,
} from "../data/mockData";

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

const menuCatalog = [
  {
    id: 1,
    name: "كابتشينو كلاسيك",
    category: "مشروبات ساخنة",
    price: 30,
    cost: 9,
    sold: 342,
    availability: 96,
    status: "نشط",
    emoji: "☕",
    stock: "متوفر",
  },
  {
    id: 2,
    name: "موكا آيس",
    category: "مشروبات باردة",
    price: 30,
    cost: 11,
    sold: 176,
    availability: 84,
    status: "نشط",
    emoji: "🧋",
    stock: "متوفر",
  },
  {
    id: 3,
    name: "برجر واغيو",
    category: "وجبات رئيسية",
    price: 60,
    cost: 32,
    sold: 287,
    availability: 78,
    status: "نشط",
    emoji: "🍔",
    stock: "محدود",
  },
  {
    id: 4,
    name: "سلطة سيزر",
    category: "وجبات رئيسية",
    price: 30,
    cost: 13,
    sold: 234,
    availability: 91,
    status: "نشط",
    emoji: "🥗",
    stock: "متوفر",
  },
  {
    id: 5,
    name: "تشيز كيك",
    category: "حلويات",
    price: 35,
    cost: 14,
    sold: 198,
    availability: 42,
    status: "تنبيه",
    emoji: "🍰",
    stock: "منخفض",
  },
  {
    id: 6,
    name: "بيتزا مارغريتا",
    category: "وجبات رئيسية",
    price: 50,
    cost: 24,
    sold: 165,
    availability: 88,
    status: "نشط",
    emoji: "🍕",
    stock: "متوفر",
  },
  {
    id: 7,
    name: "كرواسون زبدة",
    category: "مقبلات",
    price: 18,
    cost: 7,
    sold: 144,
    availability: 35,
    status: "تنبيه",
    emoji: "🥐",
    stock: "منخفض",
  },
];

const deliveryOrders = [
  { id: "#4525", driver: "ماجد", zone: "العليا", eta: "12 دقيقة", status: "في الطريق" },
  { id: "#4524", driver: "عبدالعزيز", zone: "النخيل", eta: "18 دقيقة", status: "استلام" },
  { id: "#4523", driver: "سلمان", zone: "الملقا", eta: "7 دقائق", status: "وصل" },
];

const shiftSchedule = [
  { day: "السبت", morning: "محمد، فاطمة", evening: "عبدالرحمن، ليلى", coverage: "98%" },
  { day: "الأحد", morning: "ليلى، محمد", evening: "فاطمة، عبدالرحمن", coverage: "94%" },
  { day: "الإثنين", morning: "عبدالرحمن، ليلى", evening: "محمد، فاطمة", coverage: "96%" },
  { day: "الثلاثاء", morning: "فاطمة، ليلى", evening: "محمد، عبدالرحمن", coverage: "91%" },
];

const reviewList = [
  {
    id: 1,
    customer: "أحمد محمد",
    rating: 5,
    text: "القهوة ممتازة والخدمة سريعة. تجربة تستحق التكرار.",
    channel: "Google",
    status: "تم الرد",
    time: "منذ 30 دقيقة",
  },
  {
    id: 2,
    customer: "سارة علي",
    rating: 4,
    text: "الأكل لذيذ لكن التوصيل تأخر قليلا.",
    channel: "Jahez",
    status: "ينتظر الرد",
    time: "منذ ساعة",
  },
  {
    id: 3,
    customer: "خالد ناصر",
    rating: 5,
    text: "أفضل تشيز كيك في الحي، شكرا للفريق.",
    channel: "Instagram",
    status: "تم الرد",
    time: "منذ 3 ساعات",
  },
  {
    id: 4,
    customer: "نورة سعد",
    rating: 3,
    text: "الطلب وصل ناقص صوص. أتمنى مراجعة التغليف.",
    channel: "HungerStation",
    status: "أولوية",
    time: "أمس",
  },
];

const ratingDistribution = [
  { label: "5 نجوم", value: 68, color: "#00E676" },
  { label: "4 نجوم", value: 21, color: "#FFD700" },
  { label: "3 نجوم", value: 7, color: "#FF6B35" },
  { label: "2 نجوم", value: 3, color: "#FF69B4" },
  { label: "1 نجمة", value: 1, color: "#FF1744" },
];

const integrationRows = [
  { name: "نقاط البيع POS", status: "متصل", icon: CreditCard, color: "bg-brand-green" },
  { name: "بوابات الدفع", status: "متصل", icon: LockKeyhole, color: "bg-brand-blue" },
  { name: "منصات التوصيل", status: "يحتاج تحديث", icon: Truck, color: "bg-brand-yellow" },
  { name: "قائمة QR", status: "متصل", icon: QrCode, color: "bg-brand-purple text-white" },
];

export function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [query, setQuery] = useState("");

  const filteredOrders = useMemo(() => {
    return recentOrders.filter((order) => {
      const matchesStatus = statusFilter === "الكل" || order.status === statusFilter;
      const matchesQuery = `${order.id} ${order.customer} ${order.items}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [query, statusFilter]);

  const columns = [
    { title: "قيد الانتظار", icon: Clock, color: "bg-brand-yellow", orders: recentOrders.filter((order) => order.status === "قيد الانتظار") },
    { title: "جاري التحضير", icon: Flame, color: "bg-brand-orange", orders: recentOrders.filter((order) => order.status === "جاري التحضير") },
    { title: "جاهز ومكتمل", icon: CheckCircle2, color: "bg-brand-green", orders: recentOrders.filter((order) => order.status === "مكتمل") },
  ];

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
        <MetricTile label="طلبات مفتوحة" value="٢٥" note="داخل المطبخ والتوصيل" icon={Clock} color="bg-brand-yellow" />
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
          {['الكل', 'قيد الانتظار', 'جاري التحضير', 'مكتمل'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`neo-btn px-4 py-2 text-sm ${statusFilter === status ? 'bg-brand-yellow' : 'bg-white'}`}
            >
              {status}
            </button>
          ))}
          <button className="neo-btn bg-brand-cyan px-4 py-2 text-sm flex items-center gap-2">
            <Filter size={16} />
            فلترة
          </button>
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
                      <span className="font-black text-brand-blue">{order.id}</span>
                      <span className="text-xs font-bold text-gray-500">{order.time}</span>
                    </div>
                    <p className="mt-1 font-bold">{order.customer}</p>
                    <p className="text-sm font-semibold text-gray-500">{order.items}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <StatusPill label={order.type} color="bg-brand-pink" />
                      <span className="font-black">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 neo-card overflow-hidden">
          <div className="p-4 border-b-2 border-neo-border flex items-center justify-between">
            <h3 className="font-black text-lg">قائمة الطلبات المطابقة</h3>
            <span className="neo-badge bg-brand-green">{filteredOrders.length} طلب</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-neo-border">
                <tr>
                  <th className="p-3 text-right text-sm font-black">الطلب</th>
                  <th className="p-3 text-right text-sm font-black">العميل</th>
                  <th className="p-3 text-right text-sm font-black">الحالة</th>
                  <th className="p-3 text-right text-sm font-black">المبلغ</th>
                  <th className="p-3 text-right text-sm font-black">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-yellow-50">
                    <td className="p-3 font-black text-brand-blue">{order.id}</td>
                    <td className="p-3 font-bold">{order.customer}</td>
                    <td className="p-3"><StatusPill label={order.status} color={order.status === "مكتمل" ? "bg-brand-green" : "bg-brand-yellow"} /></td>
                    <td className="p-3 font-black">{formatCurrency(order.total)}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button className="neo-btn bg-white p-2"><Eye size={15} /></button>
                        <button className="neo-btn bg-brand-yellow p-2"><Printer size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="neo-card p-5">
          <h3 className="font-black text-lg mb-4">مسار التوصيل</h3>
          <div className="space-y-3">
            {deliveryOrders.map((order) => (
              <div key={order.id} className="rounded-xl border-2 border-neo-border p-3 bg-white">
                <div className="flex items-center justify-between">
                  <span className="font-black text-brand-blue">{order.id}</span>
                  <StatusPill label={order.status} color="bg-brand-blue" />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm font-bold text-gray-600">
                  <span>السائق: {order.driver}</span>
                  <span>الحي: {order.zone}</span>
                </div>
                <p className="mt-2 font-black">الوقت المتوقع: {order.eta}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MenuPage() {
  const [category, setCategory] = useState("الكل");
  const categories = ["الكل", ...Array.from(new Set(menuCatalog.map((item) => item.category)))];
  const filteredMenu = category === "الكل" ? menuCatalog : menuCatalog.filter((item) => item.category === category);
  const totalSold = menuCatalog.reduce((sum, item) => sum + item.sold, 0);
  const averageMargin = Math.round(
    menuCatalog.reduce((sum, item) => sum + ((item.price - item.cost) / item.price) * 100, 0) / menuCatalog.length,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="قائمة الطعام"
        subtitle="إدارة الأصناف، الأسعار، التوفر، وربحية كل منتج"
        icon={UtensilsCrossed}
        accent="bg-brand-green"
        actionLabel="إضافة صنف"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricTile label="أصناف نشطة" value={`${menuCatalog.filter((item) => item.status === "نشط").length}`} note="متاحة للبيع الآن" icon={Coffee} color="bg-brand-green" />
        <MetricTile label="مبيعات الأصناف" value={totalSold.toLocaleString("ar-SA")} note="هذا الشهر" icon={ShoppingBag} color="bg-brand-orange" />
        <MetricTile label="متوسط الهامش" value={`${averageMargin}%`} note="بعد تكلفة المواد" icon={Percent} color="bg-brand-yellow" />
        <MetricTile label="تنبيهات المخزون" value={`${menuCatalog.filter((item) => item.stock === "منخفض").length}`} note="تحتاج إعادة توريد" icon={PackageCheck} color="bg-brand-pink" />
      </div>

      <div className="neo-card p-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((itemCategory) => (
            <button
              key={itemCategory}
              onClick={() => setCategory(itemCategory)}
              className={`neo-btn px-4 py-2 text-sm ${category === itemCategory ? "bg-brand-green" : "bg-white"}`}
            >
              {itemCategory}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="neo-btn bg-brand-cyan px-4 py-2 text-sm flex items-center gap-2">
            <QrCode size={16} />
            نشر QR
          </button>
          <button className="neo-btn bg-brand-yellow px-4 py-2 text-sm flex items-center gap-2">
            <SlidersHorizontal size={16} />
            ترتيب القائمة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 neo-card overflow-hidden">
          <div className="p-4 border-b-2 border-neo-border flex items-center justify-between">
            <h3 className="font-black text-lg">الأصناف</h3>
            <StatusPill label={`${filteredMenu.length} صنف`} color="bg-brand-green" />
          </div>
          <div className="divide-y divide-gray-100">
            {filteredMenu.map((item) => {
              const margin = Math.round(((item.price - item.cost) / item.price) * 100);
              return (
                <div key={item.id} className="p-4 hover:bg-yellow-50">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border-2 border-neo-border bg-white p-3 text-3xl">{item.emoji}</div>
                      <div>
                        <h4 className="font-black">{item.name}</h4>
                        <p className="text-sm font-bold text-gray-500">{item.category}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:min-w-[560px]">
                      <div><p className="text-xs font-bold text-gray-400">السعر</p><p className="font-black">{formatCurrency(item.price)}</p></div>
                      <div><p className="text-xs font-bold text-gray-400">التكلفة</p><p className="font-black">{formatCurrency(item.cost)}</p></div>
                      <div><p className="text-xs font-bold text-gray-400">الهامش</p><p className="font-black">{margin}%</p></div>
                      <div><p className="text-xs font-bold text-gray-400">مباع</p><p className="font-black">{item.sold}</p></div>
                      <div><p className="text-xs font-bold text-gray-400">التوفر</p><p className="font-black">{item.availability}%</p></div>
                    </div>
                    <StatusPill label={item.status} color={item.status === "نشط" ? "bg-brand-green" : "bg-brand-yellow"} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="neo-card p-5">
            <h3 className="font-black text-lg mb-4">تنبيهات المخزون</h3>
            <div className="space-y-3">
              {menuCatalog.filter((item) => item.stock !== "متوفر").map((item) => (
                <div key={item.id} className="rounded-xl border-2 border-neo-border p-3 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <p className="font-black text-sm">{item.name}</p>
                      <p className="text-xs font-bold text-gray-500">التوفر {item.availability}%</p>
                    </div>
                  </div>
                  <StatusPill label={item.stock} color="bg-brand-orange" />
                </div>
              ))}
            </div>
          </div>

          <div className="neo-card p-5 bg-brand-yellow">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={20} />
              <h3 className="font-black text-lg">اقتراح ذكي</h3>
            </div>
            <p className="font-bold text-sm leading-7">
              ارفع سعر موكا آيس ٢ ر.س في فرع الرياض. الطلب مرتفع والهامش الحالي يسمح بزيادة الربحية بدون تأثير كبير على المبيعات.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BranchesPage() {
  const totalBranchRevenue = branches.reduce((sum, branch) => sum + branch.revenue, 0);
  const totalBranchOrders = branches.reduce((sum, branch) => sum + branch.orders, 0);
  const averageRating = (branches.reduce((sum, branch) => sum + branch.rating, 0) / branches.length).toFixed(1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة الفروع"
        subtitle="راقب أداء كل فرع، حالة التشغيل، ومناطق التوصيل"
        icon={Store}
        accent="bg-brand-blue"
        actionLabel="فرع جديد"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricTile label="الفروع المفتوحة" value={`${branches.filter((branch) => branch.status === "مفتوح").length}/${branches.length}`} note="حالة تشغيل مباشرة" icon={Store} color="bg-brand-green" />
        <MetricTile label="إيرادات الفروع" value={formatCurrency(totalBranchRevenue)} note="اليوم" icon={CreditCard} color="bg-brand-blue" />
        <MetricTile label="إجمالي الطلبات" value={totalBranchOrders.toLocaleString("ar-SA")} note="جميع المواقع" icon={ShoppingBag} color="bg-brand-orange" />
        <MetricTile label="متوسط التقييم" value={averageRating} note="من ٥ نجوم" icon={Star} color="bg-brand-yellow" />
      </div>

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
                  <p className="text-sm font-bold text-gray-500">مدير الفرع: {index % 2 === 0 ? "عبدالله الأحمد" : "سارة القحطاني"}</p>
                </div>
              </div>
              <StatusPill label={branch.status} color={branch.status === "مفتوح" ? "bg-brand-green" : "bg-brand-red text-white"} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl border-2 border-neo-border bg-white p-3"><p className="text-xs font-bold text-gray-500">طلبات</p><p className="text-xl font-black">{branch.orders}</p></div>
              <div className="rounded-xl border-2 border-neo-border bg-white p-3"><p className="text-xs font-bold text-gray-500">إيرادات</p><p className="text-xl font-black">{formatCurrency(branch.revenue)}</p></div>
              <div className="rounded-xl border-2 border-neo-border bg-white p-3"><p className="text-xs font-bold text-gray-500">تقييم</p><p className="text-xl font-black">{branch.rating}</p></div>
            </div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button className="neo-btn bg-white p-3 flex items-center justify-center gap-2"><PhoneCall size={16} /> اتصال</button>
              <button className="neo-btn bg-brand-yellow p-3 flex items-center justify-center gap-2"><Wifi size={16} /> الأجهزة</button>
              <button className="neo-btn bg-brand-green p-3 flex items-center justify-center gap-2"><Truck size={16} /> التوصيل</button>
            </div>
          </div>
        ))}
      </div>

      <div className="neo-card p-5">
        <h3 className="font-black text-lg mb-4">خطة تشغيل اليوم</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {["استلام مواد خام", "اختبار أجهزة POS", "تحديث مناطق التوصيل", "مراجعة إغلاق النقدية"].map((task, index) => (
            <div key={task} className="rounded-xl border-2 border-neo-border bg-white p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className={index < 2 ? "text-green-600" : "text-gray-400"} />
                <p className="font-black text-sm">{task}</p>
              </div>
              <p className="mt-2 text-xs font-bold text-gray-500">مسؤول: {index % 2 === 0 ? "مدير الفرع" : "مشرف الوردية"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StaffPage() {
  const availableStaff = staffMembers.filter((member) => member.status === "متاح").length;
  const totalHandled = staffMembers.reduce((sum, member) => sum + member.ordersHandled, 0);
  const averageStaffRating = (staffMembers.reduce((sum, member) => sum + member.rating, 0) / staffMembers.length).toFixed(1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة الموظفين"
        subtitle="الورديات، الأداء، الصلاحيات، ومتابعة الفريق لحظة بلحظة"
        icon={Users}
        accent="bg-brand-pink"
        actionLabel="موظف جديد"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricTile label="الموظفون المتاحون" value={`${availableStaff}/${staffMembers.length}`} note="داخل النظام الآن" icon={UserCheck} color="bg-brand-green" />
        <MetricTile label="طلبات منجزة" value={totalHandled.toLocaleString("ar-SA")} note="من بداية الوردية" icon={ShoppingBag} color="bg-brand-orange" />
        <MetricTile label="متوسط الأداء" value={averageStaffRating} note="تقييم داخلي" icon={Star} color="bg-brand-yellow" />
        <MetricTile label="تغطية الورديات" value="٩٥٪" note="الأسبوع الحالي" icon={CalendarDays} color="bg-brand-blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="neo-card p-5">
          <h3 className="font-black text-lg mb-4">الفريق الحالي</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {staffMembers.map((member) => (
              <div key={member.id} className="rounded-xl border-2 border-neo-border bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{member.avatar}</div>
                    <div>
                      <h4 className="font-black">{member.name}</h4>
                      <p className="text-sm font-bold text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <StatusPill label={member.status} color={member.status === "متاح" ? "bg-brand-green" : "bg-brand-orange"} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-yellow-50 p-2"><p className="text-xs font-bold text-gray-500">طلبات</p><p className="font-black">{member.ordersHandled}</p></div>
                  <div className="rounded-lg bg-yellow-50 p-2"><p className="text-xs font-bold text-gray-500">تقييم</p><p className="font-black">{member.rating}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="neo-card overflow-hidden">
          <div className="p-4 border-b-2 border-neo-border flex items-center justify-between">
            <h3 className="font-black text-lg">جدول الورديات</h3>
            <button className="neo-btn bg-brand-yellow px-4 py-2 text-sm">تعديل الجدول</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-neo-border">
                <tr>
                  <th className="p-3 text-right text-sm font-black">اليوم</th>
                  <th className="p-3 text-right text-sm font-black">صباح</th>
                  <th className="p-3 text-right text-sm font-black">مساء</th>
                  <th className="p-3 text-right text-sm font-black">تغطية</th>
                </tr>
              </thead>
              <tbody>
                {shiftSchedule.map((shift) => (
                  <tr key={shift.day} className="border-b border-gray-100">
                    <td className="p-3 font-black">{shift.day}</td>
                    <td className="p-3 text-sm font-bold text-gray-600">{shift.morning}</td>
                    <td className="p-3 text-sm font-bold text-gray-600">{shift.evening}</td>
                    <td className="p-3"><StatusPill label={shift.coverage} color="bg-brand-green" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="neo-card p-5">
        <h3 className="font-black text-lg mb-4">الصلاحيات والتدريب</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {["صلاحية الكاشير", "تدريب السلامة الغذائية", "اعتماد إغلاق اليومية"].map((item, index) => (
            <div key={item} className="rounded-xl border-2 border-neo-border bg-white p-4 flex items-center gap-3">
              <div className={`${index === 0 ? "bg-brand-green" : index === 1 ? "bg-brand-yellow" : "bg-brand-blue"} rounded-lg border-2 border-neo-border p-2`}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="font-black text-sm">{item}</p>
                <p className="text-xs font-bold text-gray-500">{index === 1 ? "ينتهي خلال 12 يوم" : "محدث"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  const conversionData = ordersPerHour.map((item, index) => ({
    hour: item.hour,
    قبول: Math.max(20, item.طلبات - index * 2),
    إلغاء: index % 4 === 0 ? 4 : 2,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="التقارير والإحصائيات"
        subtitle="مؤشرات مالية وتشغيلية تساعدك على اتخاذ قرار أسرع"
        icon={BarChart3}
        accent="bg-brand-purple text-white"
        actionLabel="تصدير تقرير"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricTile label="صافي الربح" value="٢٩,٨٠٠" note="+١١٪ عن الأسبوع الماضي" icon={CreditCard} color="bg-brand-green" />
        <MetricTile label="متوسط السلة" value="٨٧ ر.س" note="أعلى قيمة في المساء" icon={ShoppingBag} color="bg-brand-yellow" />
        <MetricTile label="نسبة الإلغاء" value="٢.١٪" note="ضمن النطاق الصحي" icon={CheckCircle2} color="bg-brand-blue" />
        <MetricTile label="التقارير المجدولة" value="٦" note="مرسلة للإدارة" icon={FileText} color="bg-brand-pink" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RevenueChart />
        <OrdersChart />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <CategoryChart />
        <WeeklyRatings />
        <div className="neo-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-black text-lg">قبول وإلغاء الطلبات</h3>
              <p className="text-sm font-bold text-gray-500">حسب الساعة</p>
            </div>
            <button className="neo-btn bg-brand-yellow p-2"><Download size={16} /></button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fontWeight: 700 }} />
              <YAxis tick={{ fontSize: 12, fontWeight: 700 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="قبول" stroke="#00E676" strokeWidth={2} dot={{ r: 3, strokeWidth: 2 }} />
              <Line type="monotone" dataKey="إلغاء" stroke="#FF1744" strokeWidth={2} dot={{ r: 3, strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="neo-card p-5">
        <h3 className="font-black text-lg mb-4">رؤى قابلة للتنفيذ</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            "ذروة الطلب بين ٧ و٩ مساء. زد موظف تحضير إضافي في هذه الفترة.",
            "مشروبات باردة تحقق نمو ٢٥٪. ضعها أعلى قائمة QR هذا الأسبوع.",
            "فرع الرياض يتفوق في متوسط السلة. انسخ عرض الكومبو لبقية الفروع.",
          ].map((insight, index) => (
            <div key={insight} className="rounded-xl border-2 border-neo-border bg-white p-4">
              <div className={`${index === 0 ? "bg-brand-orange" : index === 1 ? "bg-brand-blue" : "bg-brand-green"} mb-3 inline-flex rounded-lg border-2 border-neo-border p-2`}>
                <Sparkles size={18} />
              </div>
              <p className="text-sm font-bold leading-7">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReviewsPage() {
  const responseRate = Math.round((reviewList.filter((review) => review.status === "تم الرد").length / reviewList.length) * 100);
  const averageReview = (reviewList.reduce((sum, review) => sum + review.rating, 0) / reviewList.length).toFixed(1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="التقييمات والمراجعات"
        subtitle="اجمع آراء العملاء من كل القنوات ورد عليها من مكان واحد"
        icon={MessageSquare}
        accent="bg-brand-cyan"
        actionLabel="رد سريع"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricTile label="متوسط التقييم" value={averageReview} note="آخر ٣٠ يوم" icon={Star} color="bg-brand-yellow" />
        <MetricTile label="مراجعات جديدة" value="١٩" note="هذا الأسبوع" icon={MessageSquare} color="bg-brand-cyan" />
        <MetricTile label="معدل الرد" value={`${responseRate}%`} note="أفضل من الهدف" icon={Send} color="bg-brand-green" />
        <MetricTile label="تعويضات مرسلة" value="٤" note="كوبونات خدمة" icon={Gift} color="bg-brand-pink" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 neo-card p-5">
          <h3 className="font-black text-lg mb-4">صندوق المراجعات</h3>
          <div className="space-y-3">
            {reviewList.map((review) => (
              <div key={review.id} className="rounded-xl border-2 border-neo-border bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black">{review.customer}</h4>
                      <span className="text-xs font-bold text-gray-400">{review.channel}</span>
                    </div>
                    <div className="mt-1 flex gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} size={15} className={index < review.rating ? "fill-brand-yellow text-brand-yellow" : "text-gray-300"} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill label={review.status} color={review.status === "تم الرد" ? "bg-brand-green" : review.status === "أولوية" ? "bg-brand-red text-white" : "bg-brand-yellow"} />
                    <span className="text-xs font-bold text-gray-400">{review.time}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm font-bold leading-7 text-gray-600">{review.text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="neo-btn bg-brand-cyan px-4 py-2 text-sm flex items-center gap-2"><Send size={15} /> رد</button>
                  <button className="neo-btn bg-brand-yellow px-4 py-2 text-sm flex items-center gap-2"><Gift size={15} /> كوبون</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="neo-card p-5">
            <h3 className="font-black text-lg mb-4">توزيع التقييمات</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={ratingDistribution} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="label" type="category" width={70} tick={{ fontSize: 12, fontWeight: 700 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[6, 6, 6, 6]} stroke="#1A1A1A" strokeWidth={2}>
                  {ratingDistribution.map((entry) => (
                    <Cell key={entry.label} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="neo-card p-5 bg-brand-yellow">
            <h3 className="font-black text-lg mb-3">قوالب الرد</h3>
            <div className="space-y-2">
              {["شكر لتقييم ٥ نجوم", "اعتذار عن تأخير التوصيل", "دعوة لتجربة منتج جديد"].map((template) => (
                <button key={template} className="w-full rounded-xl border-2 border-neo-border bg-white p-3 text-right text-sm font-black hover:bg-yellow-50">
                  {template}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="neo-card p-5">
        <h3 className="font-black text-lg mb-4">آخر إشعارات العملاء</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {notifications.slice(0, 3).map((notification) => (
            <div key={notification.id} className="rounded-xl border-2 border-neo-border bg-white p-4">
              <Bell size={18} className="mb-2" />
              <p className="text-sm font-bold leading-6">{notification.text}</p>
              <p className="mt-2 text-xs font-bold text-gray-400">{notification.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const [toggles, setToggles] = useState({
    autoAccept: true,
    sms: true,
    kitchenPrint: false,
    qrMenu: true,
  });

  const toggleSetting = (key: keyof typeof toggles) => {
    setToggles((current) => ({ ...current, [key]: !current[key] }));
  };

  const settingRows = [
    { key: "autoAccept" as const, title: "قبول الطلبات تلقائيا", note: "بعد مراجعة الدفع والموقع", icon: CheckCircle2 },
    { key: "sms" as const, title: "رسائل SMS للعملاء", note: "تحديث حالة الطلب تلقائيا", icon: Bell },
    { key: "kitchenPrint" as const, title: "طباعة المطبخ", note: "إرسال مباشر للطابعة الحرارية", icon: Printer },
    { key: "qrMenu" as const, title: "قائمة QR العامة", note: "تحديث الأسعار فوريا", icon: QrCode },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="الإعدادات"
        subtitle="إعدادات المتجر، الفوترة، التكاملات، والصلاحيات"
        icon={Settings2}
        accent="bg-brand-lime"
        actionLabel="حفظ التغييرات"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 neo-card p-5">
          <h3 className="font-black text-lg mb-4">بيانات النشاط</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-2">
              <span className="text-sm font-black">اسم العلامة التجارية</span>
              <input className="neo-input w-full" defaultValue="فودي بورد كافيه" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-black">رقم الضريبة</span>
              <input className="neo-input w-full" defaultValue="٣٠٠١٢٣٤٥٦٧٠٠٠٠٣" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-black">المدينة الرئيسية</span>
              <input className="neo-input w-full" defaultValue="الرياض" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-black">هاتف الدعم</span>
              <input className="neo-input w-full" defaultValue="9200 12345" />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="neo-btn bg-brand-green px-5 py-2.5">حفظ</button>
            <button className="neo-btn bg-white px-5 py-2.5">إلغاء</button>
          </div>
        </div>

        <div className="neo-card p-5">
          <h3 className="font-black text-lg mb-4">التشغيل السريع</h3>
          <div className="space-y-3">
            {settingRows.map((row) => {
              const Icon = row.icon;
              return (
                <button
                  key={row.key}
                  onClick={() => toggleSetting(row.key)}
                  className="w-full rounded-xl border-2 border-neo-border bg-white p-3 text-right"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg border-2 border-neo-border bg-brand-yellow p-2"><Icon size={16} /></div>
                      <div>
                        <p className="font-black text-sm">{row.title}</p>
                        <p className="text-xs font-bold text-gray-500">{row.note}</p>
                      </div>
                    </div>
                    <span className={`h-7 w-12 rounded-full border-2 border-neo-border p-1 ${toggles[row.key] ? "bg-brand-green" : "bg-gray-200"}`}>
                      <span className={`block h-4 w-4 rounded-full border border-neo-border bg-white transition-transform ${toggles[row.key] ? "translate-x-0" : "-translate-x-5"}`} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="neo-card p-5">
          <h3 className="font-black text-lg mb-4">التكاملات</h3>
          <div className="space-y-3">
            {integrationRows.map((integration) => {
              const Icon = integration.icon;
              return (
                <div key={integration.name} className="rounded-xl border-2 border-neo-border bg-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${integration.color} rounded-lg border-2 border-neo-border p-2`}><Icon size={18} /></div>
                    <div>
                      <p className="font-black">{integration.name}</p>
                      <p className="text-xs font-bold text-gray-500">آخر مزامنة قبل ٥ دقائق</p>
                    </div>
                  </div>
                  <StatusPill label={integration.status} color={integration.status === "متصل" ? "bg-brand-green" : "bg-brand-yellow"} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="neo-card p-5">
          <h3 className="font-black text-lg mb-4">الأمان والصلاحيات</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "مصادقة ثنائية", icon: LockKeyhole, color: "bg-brand-green" },
              { label: "تصدير البيانات", icon: Download, color: "bg-brand-blue" },
              { label: "النطاق العام", icon: Globe2, color: "bg-brand-cyan" },
              { label: "أدوار الإدارة", icon: ShieldCheck, color: "bg-brand-yellow" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-xl border-2 border-neo-border bg-white p-4">
                  <div className={`${item.color} mb-3 inline-flex rounded-lg border-2 border-neo-border p-2`}><Icon size={18} /></div>
                  <p className="font-black">{item.label}</p>
                  <p className="text-xs font-bold text-gray-500 mt-1">مفعل للمديرين فقط</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
