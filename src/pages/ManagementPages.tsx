import { useState, useEffect } from "react";
import { 
  Users, Plus, Star, Trash2, ShieldCheck, CalendarDays, 
  ShoppingBag, UserCheck, UtensilsCrossed, Store, MapPin, 
  Clock, CheckCircle2, XCircle, ChevronRight, Filter,
  Building2, Key, CheckSquare, Square
} from "lucide-react";
import { 
  staffApi, menuApi, branchesApi, ordersApi, 
  departmentsApi, rolesApi, employeesApi 
} from "../utils/api";
import { 
  Staff, MenuCategory, MenuItem, Branch, Order,
  Department, Role, Permission
} from "../types/api";

const formatCurrency = (value: number) => `${value.toLocaleString("ar-SA")} ر.س`;

function StatusPill({ label, color }: { label: string; color: string }) {
  return <span className={`neo-badge ${color}`}>{label}</span>;
}

// --- DEPARTMENTS PAGE ---
export function DepartmentsPage() {
  const [depts, setDepts] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");

  const fetchDepts = async () => {
    try {
      setLoading(true);
      const res = await departmentsApi.getAll();
      setDepts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDepts(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await departmentsApi.create({ name: newName });
      setNewName("");
      setShowAddForm(false);
      fetchDepts();
    } catch (err) { alert("فشل الإضافة"); }
  };

  const handleDelete = async (id: string) => {
    if (confirm("حذف القسم؟")) {
      try { await departmentsApi.delete(id); fetchDepts(); } catch (err) { alert("فشل الحذف"); }
    }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-2xl">جاري تحميل الأقسام... 🏢</div>;

  return (
    <div className="space-y-6">
      <div className="bg-brand-orange neo-card p-5 flex justify-between items-center text-neo-text">
        <div className="flex items-center gap-4">
          <div className="neo-card-flat bg-white p-3"><Building2 size={28} /></div>
          <div>
            <h2 className="text-2xl font-black">الأقسام</h2>
            <p className="font-bold opacity-70">نظم موظفيك في أقسام إدارية وتشغيلية</p>
          </div>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="neo-btn bg-white px-5 py-2.5 flex items-center gap-2">
          <Plus size={18} /><span>قسم جديد</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="neo-card p-5 bg-white flex gap-4">
          <input required type="text" placeholder="اسم القسم" className="neo-input flex-1" value={newName} onChange={e => setNewName(e.target.value)} />
          <button type="submit" className="neo-btn bg-brand-green px-8">حفظ</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {depts.map(dept => (
          <div key={dept.id} className="neo-card p-5 flex justify-between items-center bg-white group">
            <div>
              <h3 className="font-black text-xl">{dept.name}</h3>
              <p className="font-bold text-neo-text/50">{dept.employeeCount} موظف</p>
            </div>
            <button onClick={() => handleDelete(dept.id)} className="p-2 text-brand-red hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- ROLES PAGE ---
export function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [depts, setDepts] = useState<Department[]>([]);
  const [allPerms, setAllPerms] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", departmentId: "", permissions: [] as string[] });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, deptsRes, permsRes] = await Promise.all([
        rolesApi.getAll(),
        departmentsApi.getAll(),
        rolesApi.getPermissions()
      ]);
      setRoles(rolesRes.data);
      setDepts(deptsRes.data);
      setAllPerms(permsRes.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleTogglePerm = (code: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(code) 
        ? prev.permissions.filter(p => p !== code)
        : [...prev.permissions, code]
    }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.departmentId) return alert("اختر القسم");
    try {
      await rolesApi.create(newRole);
      setShowAddForm(false);
      setNewRole({ name: "", departmentId: "", permissions: [] });
      fetchData();
    } catch (err) { alert("فشل الإضافة"); }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-2xl">جاري تحميل الصلاحيات... 🔑</div>;

  return (
    <div className="space-y-6">
      <div className="bg-brand-purple neo-card p-5 flex justify-between items-center text-white">
        <div className="flex items-center gap-4">
          <div className="neo-card-flat bg-white p-3 text-neo-text"><ShieldCheck size={28} /></div>
          <div>
            <h2 className="text-2xl font-black text-white">الأدوار والصلاحيات</h2>
            <p className="font-bold opacity-70">حدد مهام كل دور وصلاحيات الوصول للنظام</p>
          </div>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="neo-btn bg-white text-neo-text px-5 py-2.5 flex items-center gap-2">
          <Plus size={18} /><span>دور جديد</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="neo-card p-6 bg-white space-y-6">
          <h3 className="font-black text-lg">إنشاء دور جديد</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black opacity-50">اسم الدور</label>
              <input required type="text" placeholder="مثلاً: مشرف صالة" className="neo-input w-full" value={newRole.name} onChange={e => setNewRole({...newRole, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black opacity-50">القسم</label>
              <select required className="neo-input w-full" value={newRole.departmentId} onChange={e => setNewRole({...newRole, departmentId: e.target.value})}>
                <option value="">اختر القسم</option>
                {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
             <label className="text-xs font-black opacity-50">الصلاحيات</label>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {allPerms.map(p => (
                  <button type="button" key={p.code} onClick={() => handleTogglePerm(p.code)} className={`p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${newRole.permissions.includes(p.code) ? 'bg-brand-purple text-white border-neo-border' : 'bg-gray-50 border-transparent hover:border-neo-border/20'}`}>
                    {newRole.permissions.includes(p.code) ? <CheckSquare size={18} /> : <Square size={18} />}
                    <span className="font-bold text-sm">{p.name}</span>
                  </button>
                ))}
             </div>
          </div>
          <button type="submit" className="neo-btn bg-brand-green w-full py-4 font-black">حفظ الدور الجديد</button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles.map(role => (
          <div key={role.id} className="neo-card p-5 bg-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-black text-xl">{role.name}</h3>
                <span className="neo-badge bg-brand-purple/10 text-brand-purple text-[10px]">{role.departmentName}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {role.permissions.map(p => (
                <span key={p} className="text-[10px] font-black bg-gray-100 px-2 py-1 rounded border border-neo-border/10">{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- STAFF PAGE (Enhanced to EMPLOYEES) ---
export function StaffPage() {
  const [employees, setEmployees] = useState<Staff[]>([]);
  const [depts, setDepts] = useState<Department[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmp, setNewEmp] = useState({ fullName: "", email: "", password: "User123!", departmentId: "", roles: [] as string[] });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, deptsRes, rolesRes] = await Promise.all([
        employeesApi.getAll(),
        departmentsApi.getAll(),
        rolesApi.getAll()
      ]);
      setEmployees(empRes.data);
      setDepts(deptsRes.data);
      setAllRoles(rolesRes.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeesApi.create(newEmp);
      setShowAddForm(false);
      setNewEmp({ fullName: "", email: "", password: "User123!", departmentId: "", roles: [] });
      fetchData();
    } catch (err) { alert("فشل الإضافة"); }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-2xl">جاري تحميل الموظفين... 🤵</div>;

  return (
    <div className="space-y-6">
      <div className="bg-brand-pink neo-card p-5 flex justify-between items-center text-neo-text">
        <div className="flex items-center gap-4">
          <div className="neo-card-flat bg-white p-3"><Users size={28} /></div>
          <div>
            <h2 className="text-2xl font-black">إدارة الموظفين</h2>
            <p className="font-bold opacity-70">أضف الموظفين، عين أقسامهم، وخصص أدوارهم المتعددة</p>
          </div>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="neo-btn bg-white px-5 py-2.5 flex items-center gap-2">
          <Plus size={18} /><span>موظف جديد</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="neo-card p-6 bg-white space-y-6">
          <h3 className="font-black text-lg">إضافة موظف جديد</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             <input required type="text" placeholder="الاسم الكامل" className="neo-input" value={newEmp.fullName} onChange={e => setNewEmp({...newEmp, fullName: e.target.value})} />
             <input required type="email" placeholder="البريد الإلكتروني" className="neo-input" value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} />
             <select required className="neo-input" value={newEmp.departmentId} onChange={e => setNewEmp({...newEmp, departmentId: e.target.value})}>
                <option value="">اختر القسم</option>
                {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
             </select>
          </div>
          <div className="space-y-2">
             <label className="text-xs font-black opacity-50">الأدوار الوظيفية</label>
             <div className="flex flex-wrap gap-2">
                {allRoles.filter(r => !newEmp.departmentId || r.departmentId === newEmp.departmentId).map(r => (
                   <button type="button" key={r.id} onClick={() => setNewEmp(prev => ({...prev, roles: prev.roles.includes(r.name) ? prev.roles.filter(x => x !== r.name) : [...prev.roles, r.name]}))} className={`neo-btn px-4 py-2 text-xs ${newEmp.roles.includes(r.name) ? 'bg-brand-pink' : 'bg-white'}`}>
                      {r.name}
                   </button>
                ))}
             </div>
          </div>
          <button type="submit" className="neo-btn bg-brand-green w-full py-4 font-black">حفظ الموظف</button>
        </form>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {employees.map(emp => (
          <div key={emp.id} className="neo-card p-5 bg-white flex flex-col sm:flex-row gap-5 items-center sm:items-start group">
            <div className="w-20 h-20 bg-brand-blue rounded-2xl flex items-center justify-center text-4xl border-2 border-neo-border shadow-[3px_3px_0px_#1A1A1A]">
               {emp.avatar || "👤"}
            </div>
            <div className="flex-1 text-center sm:text-right">
               <h3 className="font-black text-xl mb-1">{emp.fullName}</h3>
               <p className="text-sm font-bold text-neo-text/50 mb-3">{emp.email}</p>
               <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="neo-badge bg-brand-orange/10 text-brand-orange text-[10px]">{emp.departmentName}</span>
                  {emp.roles?.map(role => (
                    <span key={role} className="neo-badge bg-brand-blue text-white text-[10px]">{role}</span>
                  ))}
               </div>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-3">
               <StatusPill label={emp.status} color={emp.status === "Available" ? "bg-brand-green" : "bg-brand-orange"} />
               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 neo-btn bg-white"><ShieldCheck size={16} /></button>
                  <button className="p-2 neo-btn bg-white text-brand-red"><Trash2 size={16} /></button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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
                  <p className="text-sm font-bold text-neo-text/60">{branch.address}</p>
                </div>
              </div>
              <StatusPill label={branch.status} color={branch.status === "Open" ? "bg-brand-green" : "bg-brand-red text-white"} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl border-2 border-neo-border bg-white p-3"><p className="text-xs font-bold text-neo-text/60">طلبات</p><p className="text-xl font-black">{branch.ordersCount}</p></div>
              <div className="rounded-xl border-2 border-neo-border bg-white p-3"><p className="text-xs font-bold text-neo-text/60">إيرادات</p><p className="text-xl font-black">{formatCurrency(branch.revenue)}</p></div>
              <div className="rounded-xl border-2 border-neo-border bg-white p-3"><p className="text-xs font-bold text-neo-text/60">تقييم</p><p className="text-xl font-black">{branch.rating}</p></div>
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
                    <p className="text-sm font-bold text-neo-text/60">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div><p className="text-xs font-bold text-neo-text/50">السعر</p><p className="font-black">{formatCurrency(item.price)}</p></div>
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

// --- ORDERS PAGE ---
export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("الكل");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const branchId = localStorage.getItem('selectedBranchId');
      const params = branchId ? { branchId } : {};
      const res = await ordersApi.getAll(params);
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
                <p className="text-[10px] font-bold text-neo-text/50">رقم الطلب</p>
                <p className="font-black text-sm">{order.orderNumber}</p>
              </div>
              <div>
                <h4 className="font-black">{order.customerName}</h4>
                <p className="text-xs font-bold text-neo-text/60">{order.itemsSummary}</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
               <div className="text-center">
                 <p className="text-[10px] font-bold text-neo-text/50">الوقت</p>
                 <p className="font-black text-sm">{new Date(order.createdAt).toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' })}</p>
               </div>
               <div className="text-center">
                 <p className="text-[10px] font-bold text-neo-text/50">المبلغ</p>
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

// Placeholder for Reviews
export function ReviewsPage() {
    return <div className="p-20 text-center font-black text-2xl">قسم التقييمات قيد التطوير... 🏗️</div>;
}

export function SettingsPage() {
    return <div className="p-20 text-center font-black text-2xl">قسم الإعدادات قيد التطوير... 🏗️</div>;
}
