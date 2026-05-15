import { useState, useMemo, useEffect } from "react";
import { Search, UserPlus, Phone, Calendar, ShoppingBag, DollarSign } from "lucide-react";
import { customersApi } from "../utils/api";
import { Customer } from "../types/api";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customersApi.getAll().then(res => {
      setCustomers(res.data);
      setLoading(false);
    });
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const query = searchQuery.toLowerCase();
      return (
        customer.name.toLowerCase().includes(query) ||
        customer.phoneNumber.includes(query)
      );
    });
  }, [searchQuery, customers]);

  if (loading) return <div className="p-20 text-center font-black text-2xl animate-pulse">جاري تحميل العملاء... 👥</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-neo-text">👥 إدارة العملاء</h2>
          <p className="font-bold text-gray-600 mt-1">سجل العملاء وتفاصيل التواصل والطلبات.</p>
        </div>
        <button className="neo-btn bg-brand-green py-3 px-6 flex items-center justify-center gap-2 font-black border-2 border-neo-border shadow-[4px_4px_0px_#1A1A1A] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#1A1A1A] transition-all text-neo-text">
          <UserPlus size={20} strokeWidth={3} />
          إضافة عميل جديد
        </button>
      </div>

      <div className="neo-card p-6 border-2 border-neo-border shadow-[4px_4px_0px_#1A1A1A]">
        {/* Search Bar */}
        <div className="relative max-w-md mb-6">
          <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-neo-text" strokeWidth={3} />
          <input
            type="text"
            placeholder="البحث بالاسم أو رقم الجوال..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FFFBEB] border-2 border-neo-border rounded-lg py-3 pr-12 pl-4 font-black shadow-[2px_2px_0px_#1A1A1A] focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b-4 border-neo-border bg-brand-yellow/20">
                <th className="py-4 px-4 font-black text-lg">الاسم</th>
                <th className="py-4 px-4 font-black text-lg">رقم الجوال</th>
                <th className="py-4 px-4 font-black text-lg text-center">الطلبات</th>
                <th className="py-4 px-4 font-black text-lg">إجمالي المشتريات</th>
                <th className="py-4 px-4 font-black text-lg">آخر زيارة</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <tr key={customer.id} className={`border-b-2 border-neo-border hover:bg-brand-yellow/10 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#FFFBEB]/50"}`}>
                  <td className="py-4 px-4 font-bold">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-orange text-white rounded-full border-2 border-neo-border flex items-center justify-center font-black shadow-[2px_2px_0px_#1A1A1A]">
                        {customer.name.charAt(0)}
                      </div>
                      {customer.name}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-700 dir-ltr text-right">
                    {customer.phoneNumber}
                  </td>
                  <td className="py-4 px-4 font-black text-center text-brand-blue">
                    {customer.totalOrders}
                  </td>
                  <td className="py-4 px-4 font-black text-brand-green">
                    {customer.totalSpent.toLocaleString("ar-SA")} ر.س
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-600">
                    {customer.lastVisit ? new Date(customer.lastVisit).toLocaleDateString('ar-SA') : 'لا يوجد'}
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
