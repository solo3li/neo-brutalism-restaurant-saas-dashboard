import { useState, useEffect } from "react";
import { Users, Search, Plus, Phone, MapPin, Trash2, ShoppingBag } from "lucide-react";
import { customersApi } from "../utils/api";
import { Customer } from "../types/api";

const formatCurrency = (value: number) => `${value.toLocaleString("ar-SA")} ر.س`;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phoneNumber: "", address: "" });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await customersApi.getAll();
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await customersApi.create({
        name: newCustomer.name,
        phoneNumber: newCustomer.phoneNumber,
        addresses: [newCustomer.address]
      });
      setShowAddForm(false);
      setNewCustomer({ name: "", phoneNumber: "", address: "" });
      fetchCustomers();
    } catch (err) {
      alert("فشل الإضافة");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف العميل؟")) {
      try {
        await customersApi.delete(id);
        fetchCustomers();
      } catch (err) {
        alert("فشل الحذف");
      }
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phoneNumber.includes(searchQuery)
  );

  if (loading) return <div className="p-20 text-center font-black text-2xl animate-pulse">جاري تحميل العملاء... 👥</div>;

  return (
    <div className="space-y-6">
      <div className={`bg-brand-cyan neo-card p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
        <div className="flex items-center gap-4">
          <div className="neo-card-flat bg-white p-3">
            <Users size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black">قاعدة بيانات العملاء</h2>
            <p className="font-bold text-neo-text/70">تواصل مع عملائك، تتبع سجل طلباتهم، وقدم لهم أفضل خدمة</p>
          </div>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="neo-btn bg-white px-5 py-2.5 flex items-center justify-center gap-2">
          <Plus size={18} />
          <span>عميل جديد</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="neo-card p-5 bg-[#FFFBEB] flex flex-col gap-4">
          <h3 className="font-black text-lg">إضافة عميل جديد</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input required type="text" placeholder="اسم العميل" className="neo-input" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
            <input required type="text" placeholder="رقم الهاتف" className="neo-input" value={newCustomer.phoneNumber} onChange={e => setNewCustomer({...newCustomer, phoneNumber: e.target.value})} />
            <input required type="text" placeholder="العنوان" className="neo-input" value={newCustomer.address} onChange={e => setNewCustomer({...newCustomer, address: e.target.value})} />
          </div>
          <button type="submit" className="neo-btn bg-brand-green py-3 mt-2">حفظ العميل</button>
        </form>
      )}

      <div className="neo-card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="ابحث بالاسم أو رقم الهاتف..."
            className="neo-input w-full pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="neo-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-brand-yellow border-b-2 border-neo-border">
                <th className="p-4 font-black">العميل</th>
                <th className="p-4 font-black">التواصل</th>
                <th className="p-4 font-black">العناوين</th>
                <th className="p-4 font-black">النشاط</th>
                <th className="p-4 font-black">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-pink rounded-lg border-2 border-neo-border flex items-center justify-center font-black text-lg">
                        {customer.name[0]}
                      </div>
                      <span className="font-black">{customer.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <Phone size={14} className="text-gray-400" />
                        <span>{customer.phoneNumber}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{customer.addresses[0]}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-2 font-bold">
                        <ShoppingBag size={12} className="text-brand-orange" />
                        <span>{customer.totalOrders} طلبات</span>
                      </div>
                      <div className="flex items-center gap-2 font-bold">
                        <span className="text-brand-green">💰</span>
                        <span>إجمالي: {formatCurrency(customer.totalSpent)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDelete(customer.id)} className="p-2 bg-brand-red text-white rounded-lg border-2 border-neo-border">
                        <Trash2 size={16} />
                      </button>
                    </div>
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
