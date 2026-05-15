import { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  ShoppingCart
} from "lucide-react";
import { menuApi, ordersApi } from "../utils/api";
import { MenuItem, MenuCategory } from "../types/api";

const formatCurrency = (value: number) => `${value.toLocaleString("ar-SA")} ر.س`;

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export default function PosPage() {
  const [activeCategory, setActiveCategory] = useState<number | "الكل">("الكل");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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
        console.error("Failed to fetch POS data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = activeCategory === "الكل" || item.categoryId === activeCategory;
      const matchesSearch = item.name.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, items]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1, emoji: "🍕" }]; // Placeholder emoji
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    try {
      await ordersApi.create({
        items: cart.map(i => ({ menuItemId: i.id, quantity: i.quantity }))
      });
      setCart([]);
      alert("تم إرسال الطلب بنجاح! 🎉");
    } catch (err) {
      alert("فشل إرسال الطلب.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartTax = cartTotal * 0.15;
  const cartGrandTotal = cartTotal + cartTax;

  if (loading) return <div className="p-20 text-center font-black text-2xl animate-pulse">جاري تحميل القائمة... 🍕</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Items Section */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* Search and Filters */}
        <div className="neo-card p-4 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-neo-border" strokeWidth={3} />
            <input 
              type="text" 
              placeholder="ابحث عن صنف..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="neo-input w-full pr-10 border-2 border-neo-border shadow-[2px_2px_0px_#1A1A1A] font-bold"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            <button
              onClick={() => setActiveCategory("الكل")}
              className={`neo-btn px-4 py-2 whitespace-nowrap text-sm font-black border-2 border-neo-border shadow-[2px_2px_0px_#1A1A1A] transition-all ${activeCategory === "الكل" ? 'bg-brand-yellow' : 'bg-white'}`}
            >
              الكل
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`neo-btn px-4 py-2 whitespace-nowrap text-sm font-black border-2 border-neo-border shadow-[2px_2px_0px_#1A1A1A] transition-all ${activeCategory === cat.id ? 'bg-brand-yellow' : 'bg-white'}`}
              >
                {cat.name} {cat.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayItems.map(item => (
              <button 
                key={item.id}
                onClick={() => addToCart(item)}
                className="neo-card p-4 flex flex-col items-center text-center group hover:bg-brand-yellow transition-colors relative overflow-hidden"
              >
                <div className="w-16 h-16 bg-[#FFFBEB] rounded-xl border-2 border-neo-border flex items-center justify-center text-4xl mb-3 group-hover:scale-110 transition-transform shadow-[2px_2px_0px_#1A1A1A]">
                  🍕
                </div>
                <h3 className="font-black text-sm mb-1 line-clamp-1 group-hover:text-neo-border">{item.name}</h3>
                <p className="font-black text-xl text-brand-blue">{formatCurrency(item.price)}</p>
                <div className="mt-3 w-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="neo-btn bg-brand-green w-full py-2 text-sm font-black border-2 border-neo-border shadow-[2px_2px_0px_#1A1A1A]">إضافة</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-full lg:w-96 flex flex-col gap-6 h-full">
        <div className="neo-card flex-1 flex flex-col overflow-hidden">
          {/* Cart Header */}
          <div className="p-4 border-b-2 border-neo-border bg-brand-orange flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart size={20} />
              <h3 className="font-black text-lg">سلة الطلبات</h3>
            </div>
            <span className="neo-badge bg-white">{cart.length}</span>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-neo-border gap-4">
                <div className="w-24 h-24 rounded-full border-4 border-neo-border flex items-center justify-center bg-[#FFFBEB] shadow-[6px_6px_0px_#1A1A1A]">
                  <ShoppingCart size={40} className="text-brand-orange" strokeWidth={2.5} />
                </div>
                <div className="text-center">
                  <p className="font-black text-2xl mb-1">السلة فارغة</p>
                </div>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-neo-border shadow-[4px_4px_0px_#1A1A1A] hover:-translate-y-[2px] transition-all">
                  <div className="flex-1">
                    <h4 className="font-black text-base line-clamp-1">{item.name}</h4>
                    <p className="text-sm font-black text-brand-blue">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 bg-[#FFFBEB] border-2 border-neo-border rounded-lg p-1.5 shadow-[2px_2px_0px_#1A1A1A]">
                    <button 
                      onClick={() => addToCart(item)}
                      className="w-8 h-6 neo-btn bg-brand-green p-0 flex items-center justify-center border-2 border-neo-border rounded"
                    >
                      <Plus size={16} strokeWidth={4} />
                    </button>
                    <span className="font-black w-8 text-center text-lg">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-6 neo-btn bg-brand-red text-white p-0 flex items-center justify-center border-2 border-neo-border rounded"
                    >
                      {item.quantity === 1 ? <Trash2 size={14} strokeWidth={3} /> : <Minus size={16} strokeWidth={4} />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="p-4 border-t-2 border-neo-border bg-[#FFFBEB] space-y-3">
            <div className="flex justify-between items-center text-2xl font-black pt-3 border-t-2 border-neo-border mt-3 text-neo-text">
              <span>الإجمالي</span>
              <span className="text-brand-orange bg-white px-3 py-1 rounded-lg border-2 border-neo-border shadow-[2px_2px_0px_#1A1A1A]">{formatCurrency(cartGrandTotal)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 grid grid-cols-2 gap-3 bg-white border-t-2 border-neo-border">
            <button className="neo-btn bg-brand-red text-white border-2 border-neo-border py-3 flex items-center justify-center gap-2 font-black" onClick={() => setCart([])}>
              مسح
            </button>
            <button 
              disabled={checkoutLoading}
              className="neo-btn bg-brand-green col-span-2 py-4 flex items-center justify-center gap-3 text-xl font-black border-2 border-neo-border"
              onClick={handleCheckout}
            >
              {checkoutLoading ? "جاري المعالجة..." : <><CreditCard size={28} strokeWidth={3} /> دفع واستلام</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
