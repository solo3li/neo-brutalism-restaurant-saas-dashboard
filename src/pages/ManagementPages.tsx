import { useState, useEffect } from "react";
import { 
  Users, Plus, Star, Trash2, ShieldCheck, CalendarDays, 
  ShoppingBag, UserCheck, UtensilsCrossed, Store, MapPin, 
  Clock, CheckCircle2, XCircle, ChevronRight, Filter
} from "lucide-react";
import { staffApi, menuApi, branchesApi, ordersApi } from "../utils/api";
import { Staff, MenuCategory, MenuItem, Branch, Order } from "../types/api";

const formatCurrency = (value: number) => `${value.toLocaleString("ar-SA")} ر.س`;

function StatusPill({ label, color }: { label: string; color: string }) {
  return <span className={`neo-badge ${color}`}>{label}</span>;
}

// --- BRANCHES PAGE ---
export function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: "", address: "", status: "Open" });

  const fetchBranches = () => {
    setLoading(true);
    branchesApi.getAll().then(res => {
      setBranches(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await branchesApi.create(newBranch);
      setShowAddForm(false);
      setNewBranch({ name: "", address: "", status: "Open" });
      fetchBranches();
    } catch (err) {
      alert("فشل الإضافة");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف الفرع؟")) {
      try {
        await branchesApi.delete(id);
        fetchBranches();
      } catch (err) {
        alert("فشل الحذف");
      }
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-2xl animate-pulse">جاري تحميل الفروع... 🏪</div>;

  return (
    <div className="space-y-6">
      <div className={`bg-brand-blue neo-card p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
        <div className="flex items-center gap-4">
          <div className="neo-card-flat bg-white p-3">
            <Store size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black">إدارة الفروع</h2>
            <p className="font-bold text-neo-text/70">راقب أداء كل فرع، حالة التشغيل، ومناطق التوصيل</p>
          </div>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="neo-btn bg-white px-5 py-2.5 flex items-center justify-center gap-2">
          <Plus size={18} />
          <span>فرع جديد</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="neo-card p-5 bg-[#FFFBEB] flex flex-col gap-4">
          <h3 className="font-black text-lg">إضافة فرع جديد</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input required type="text" placeholder="اسم الفرع" className="neo-input" value={newBranch.name} onChange={e => setNewBranch({...newBranch, name: e.target.value})} />
            <input required type="text" placeholder="العنوان" className="neo-input" value={newBranch.address} onChange={e => setNewBranch({...newBranch, address: e.target.value})} />
            <select className="neo-input" value={newBranch.status} onChange={e => setNewBranch({...newBranch, status: e.target.value})}>
              <option value="Open">مفتوح</option>
              <option value="Closed">مغلق</option>
            </select>
          </div>
          <button type="submit" className="neo-btn bg-brand-green py-3 mt-2">حفظ الفرع</button>
        </form>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {branches.map((branch, index) => (
          <div key={branch.id} className="neo-card p-5 relative group">
            <button onClick={() => handleDelete(branch.id)} className="absolute top-4 left-4 p-2 bg-brand-red text-white rounded-lg border-2 border-neo-border opacity-0 group-hover:opacity-100 transition-opacity">حذف</button>
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

// --- MENU PAGE ---
export function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | "الكل">("الكل");
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", description: "", price: 0, categoryId: 0 });

  const fetchData = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.categoryId === 0) {
        alert("يرجى اختيار الفئة");
        return;
    }
    try {
      await menuApi.createItem(newItem);
      setShowAddForm(false);
      setNewItem({ name: "", description: "", price: 0, categoryId: 0 });
      fetchData();
    } catch (err) {
      alert("فشل الإضافة");
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا صنف؟")) {
        try {
            await menuApi.deleteItem(id);
            fetchData();
        } catch (err) {
            alert("فشل الحذف");
        }
    }
  };

  const filteredMenu = activeCategory === "الكل" ? items : items.filter((item) => item.categoryId === activeCategory);

  if (loading) return <div className="p-20 text-center font-black text-2xl animate-pulse">جاري تحميل القائمة... ☕</div>;

  return (
    <div className="space-y-6">
      <div className={`bg-brand-green neo-card p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
        <div className="flex items-center gap-4">
          <div className="neo-card-flat bg-white p-3">
            <UtensilsCrossed size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black">قائمة الطعام</h2>
            <p className="font-bold text-neo-text/70">إدارة الأصناف، الأسعار، التوفر، وربحية كل منتج</p>
          </div>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="neo-btn bg-white px-5 py-2.5 flex items-center justify-center gap-2">
          <Plus size={18} />
          <span>إضافة صنف</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddItem} className="neo-card p-5 bg-[#FFFBEB] flex flex-col gap-4">
          <h3 className="font-black text-lg">إضافة صنف جديد</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input required type="text" placeholder="اسم الصنف" className="neo-input" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
            <input type="text" placeholder="الوصف" className="neo-input" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
            <input required type="number" placeholder="السعر" className="neo-input" value={newItem.price || ""} onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value)})} />
            <select required className="neo-input" value={newItem.categoryId} onChange={e => setNewItem({...newItem, categoryId: parseInt(e.target.value)})}>
                <option value="0">اختر الفئة</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button type="submit" className="neo-btn bg-brand-yellow py-3 mt-2">حفظ الصنف</button>
        </form>
      )}

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
          <span className="neo-badge bg-brand-green">{filteredMenu.length} صنف</span>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredMenu.map((item) => (
            <div key={item.id} className="p-4 hover:bg-yellow-50 relative group">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border-2 border-neo-border bg-white p-3 text-3xl">🍕</div>
                  <div>
                    <h4 className="font-black">{item.name}</h4>
                    <p className="text-sm font-bold text-gray-500">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div><p className="text-xs font-bold text-gray-400">السعر</p><p className="font-black">{formatCurrency(item.price)}</p></div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDeleteItem(item.id)} className="p-2 bg-brand-red text-white rounded-lg border-2 border-neo-border">
                        <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- STAFF PAGE ---
export function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaff, setNewStaff] = useState({ fullName: "", role: "Waiter", password: "Staff123!" });

  const fetchStaff = () => {
    setLoading(true);
    staffApi.getAll().then(res => {
      setStaff(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await staffApi.create({
        staff: { fullName: newStaff.fullName, role: newStaff.role },
        password: newStaff.password
      });
      setShowAddForm(false);
      setNewStaff({ fullName: "", role: "Waiter", password: "Staff123!" });
      fetchStaff();
    } catch (err) {
      alert("فشل الإضافة");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف الموظف؟")) {
      try {
        await staffApi.delete(id);
        fetchStaff();
      } catch (err) {
        alert("فشل الحذف");
      }
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-2xl animate-pulse">جاري تحميل فريق العمل... 👨‍🍳</div>;

  return (
    <div className="space-y-6">
      <div className={`bg-brand-pink neo-card p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
        <div className="flex items-center gap-4">
          <div className="neo-card-flat bg-white p-3">
            <Users size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black">إدارة الموظفين</h2>
            <p className="font-bold text-neo-text/70">الورديات، الأداء، الصلاحيات، ومتابعة الفريق لحظة بلحظة</p>
          </div>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="neo-btn bg-white px-5 py-2.5 flex items-center justify-center gap-2">
          <Plus size={18} />
          <span>موظف جديد</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="neo-card p-5 bg-[#FFFBEB] flex flex-col gap-4">
          <h3 className="font-black text-lg">إضافة موظف جديد</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input required type="text" placeholder="الاسم الكامل" className="neo-input" value={newStaff.fullName} onChange={e => setNewStaff({...newStaff, fullName: e.target.value})} />
            <select className="neo-input" value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})}>
                <option value="Chief">شيف</option>
                <option value="Barista">باريستا</option>
                <option value="Waiter">نادل</option>
                <option value="Cashier">كاشير</option>
            </select>
            <input required type="password" placeholder="كلمة المرور" className="neo-input" value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} />
          </div>
          <button type="submit" className="neo-btn bg-brand-green py-3 mt-2">حفظ الموظف</button>
        </form>
      )}

      <div className="neo-card p-5">
        <h3 className="font-black text-lg mb-4">الفريق الحالي</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {staff.map((member) => (
            <div key={member.id} className="rounded-xl border-2 border-neo-border bg-white p-4 relative group">
              <button onClick={() => handleDelete(member.id)} className="absolute top-2 left-2 p-1 bg-brand-red text-white rounded border border-neo-border opacity-0 group-hover:opacity-100 transition-opacity">حذف</button>
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

// --- ORDERS PAGE ---
export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("الكل");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await ordersApi.getAll();
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await ordersApi.updateStatus(id, newStatus);
      fetchOrders();
    } catch (err) {
      alert("فشل تحديث الحالة");
    }
  };

  const filteredOrders = filter === "الكل" ? orders : orders.filter(o => o.status === filter);

  if (loading) return <div className="p-20 text-center font-black text-2xl animate-pulse">جاري تحميل الطلبات... 📦</div>;

  return (
    <div className="space-y-6">
      <div className={`bg-brand-yellow neo-card p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
        <div className="flex items-center gap-4">
          <div className="neo-card-flat bg-white p-3">
            <ShoppingBag size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black">إدارة الطلبات</h2>
            <p className="font-bold text-neo-text/70">تتبع وحالة جميع الطلبات من المطبخ حتى التسليم</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {["الكل", "Pending", "Preparing", "Completed", "Cancelled"].map(s => (
          <button 
            key={s} 
            onClick={() => setFilter(s)}
            className={`neo-btn px-4 py-2 whitespace-nowrap ${filter === s ? "bg-brand-yellow" : "bg-white"}`}
          >
            {s === "Pending" ? "معلق" : s === "Preparing" ? "جاري التحضير" : s === "Completed" ? "مكتمل" : s === "Cancelled" ? "ملغي" : s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="neo-card p-4 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="neo-card-flat bg-gray-50 p-2 text-center min-w-[100px]">
                <p className="text-[10px] font-bold text-gray-400">رقم الطلب</p>
                <p className="font-black text-sm">{order.orderNumber}</p>
              </div>
              <div>
                <h4 className="font-black">{order.customerName}</h4>
                <p className="text-xs font-bold text-gray-500">{order.itemsSummary}</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
               <div className="text-center">
                 <p className="text-[10px] font-bold text-gray-400">الوقت</p>
                 <p className="font-black text-sm">{new Date(order.createdAt).toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' })}</p>
               </div>
               <div className="text-center">
                 <p className="text-[10px] font-bold text-gray-400">المبلغ</p>
                 <p className="font-black text-sm text-brand-green">{formatCurrency(order.totalAmount)}</p>
               </div>
               <StatusPill 
                 label={order.status === "Pending" ? "معلق" : order.status === "Preparing" ? "تحضير" : "مكتمل"} 
                 color={order.status === "Pending" ? "bg-brand-yellow" : order.status === "Preparing" ? "bg-brand-orange" : "bg-brand-green"} 
               />
               
               <div className="flex gap-2">
                  {order.status === "Pending" && (
                    <button onClick={() => handleStatusChange(order.id, "Preparing")} className="p-2 bg-brand-orange text-white rounded-lg border-2 border-neo-border"><Clock size={16}/></button>
                  )}
                  {order.status === "Preparing" && (
                    <button onClick={() => handleStatusChange(order.id, "Completed")} className="p-2 bg-brand-green text-white rounded-lg border-2 border-neo-border"><CheckCircle2 size={16}/></button>
                  )}
                  {order.status !== "Completed" && (
                    <button onClick={() => handleStatusChange(order.id, "Cancelled")} className="p-2 bg-brand-red text-white rounded-lg border-2 border-neo-border"><XCircle size={16}/></button>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- PLACEHOLDERS ---
export function AnalyticsPage() {
    return <div className="p-20 text-center font-black text-2xl">قسم التقارير قيد التطوير... 📊</div>;
}

export function ReviewsPage() {
    return <div className="p-20 text-center font-black text-2xl">قسم التقييمات قيد التطوير... 🏗️</div>;
}

export function SettingsPage() {
    return <div className="p-20 text-center font-black text-2xl">قسم الإعدادات قيد التطوير... 🏗️</div>;
}
