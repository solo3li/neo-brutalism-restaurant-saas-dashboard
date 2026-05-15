import { useState, useEffect } from "react";
import { Users, Plus, Star, Trash2, ShieldCheck, CalendarDays, ShoppingBag, UserCheck } from "lucide-react";
import { staffApi } from "../utils/api";
import { Staff } from "../types/api";

function StatusPill({ label, color }: { label: string; color: string }) {
  return <span className={`neo-badge ${color}`}>{label}</span>;
}

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

export function AnalyticsPage() {
    return <div className="p-20 text-center font-black text-2xl">قسم التقارير قيد التطوير... 📊</div>;
}

export function ReviewsPage() {
  return <div className="p-20 text-center font-black text-2xl">قسم التقييمات قيد التطوير... 🏗️</div>;
}

export function SettingsPage() {
  return <div className="p-20 text-center font-black text-2xl">قسم الإعدادات قيد التطوير... 🏗️</div>;
}
