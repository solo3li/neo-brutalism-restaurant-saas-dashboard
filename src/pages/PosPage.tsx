import { useState, useMemo } from "react";
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  Wallet,
  Clock,
  User,
  Hash,
  ChevronLeft,
  ChevronRight,
  Filter,
  ShoppingCart,
  Hold
} from "lucide-react";
import { topItems, categoryData } from "../data/mockData";

const formatCurrency = (value: number) => `${value.toLocaleString("ar-SA")} ر.س`;

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export default function PosPage() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["الكل", ...categoryData.map(c => c.name)];

  const filteredItems = useMemo(() => {
    return topItems.filter(item => {
      const matchesCategory = activeCategory === "الكل" || item.category === activeCategory;
      const matchesSearch = item.name.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Extend mock data with categories since it's missing in topItems
  const itemsWithCategories = useMemo(() => {
    return topItems.map((item, index) => ({
      ...item,
      category: categoryData[index % categoryData.length].name,
      price: 15 + (index * 5) // Mock price
    }));
  }, []);

  const displayItems = useMemo(() => {
    return itemsWithCategories.filter(item => {
      const matchesCategory = activeCategory === "الكل" || item.category === activeCategory;
      const matchesSearch = item.name.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, itemsWithCategories]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1, emoji: item.emoji }];
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

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartTax = cartTotal * 0.15;
  const cartGrandTotal = cartTotal + cartTax;

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
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`neo-btn px-4 py-2 whitespace-nowrap text-sm font-black border-2 border-neo-border shadow-[2px_2px_0px_#1A1A1A] transition-all hover:-translate-y-[1px] hover:shadow-[3px_3px_0px_#1A1A1A] ${activeCategory === cat ? 'bg-brand-yellow' : 'bg-white'}`}
              >
                {cat}
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
                  {item.emoji}
                </div>
                <h3 className="font-black text-sm mb-1 line-clamp-1 group-hover:text-neo-border">{item.name}</h3>
                <p className="text-xs font-bold text-gray-700 mb-2">{item.category}</p>
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
                  <p className="text-base font-bold text-gray-600">أضف بعض الأصناف للبدء 🚀</p>
                </div>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-neo-border shadow-[4px_4px_0px_#1A1A1A] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#1A1A1A] transition-all cursor-default">
                  <div className="w-14 h-14 bg-[#FFFBEB] rounded-lg border-2 border-neo-border flex items-center justify-center text-3xl shadow-[2px_2px_0px_#1A1A1A]">
                    {item.emoji}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-base line-clamp-1">{item.name}</h4>
                    <p className="text-sm font-black text-brand-blue bg-brand-blue/10 inline-block px-2 py-0.5 rounded border-2 border-brand-blue/20 mt-1">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 bg-[#FFFBEB] border-2 border-neo-border rounded-lg p-1.5 shadow-[2px_2px_0px_#1A1A1A]">
                    <button 
                      onClick={() => addToCart(item)}
                      className="w-8 h-6 neo-btn bg-brand-green p-0 flex items-center justify-center border-2 border-neo-border rounded shadow-[1px_1px_0px_#1A1A1A] hover:bg-[#00C853] transition-colors"
                    >
                      <Plus size={16} strokeWidth={4} />
                    </button>
                    <span className="font-black w-8 text-center text-lg">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-6 neo-btn bg-brand-red text-white p-0 flex items-center justify-center border-2 border-neo-border rounded shadow-[1px_1px_0px_#1A1A1A] hover:bg-red-600 transition-colors"
                    >
                      {item.quantity === 1 ? <Trash2 size={14} strokeWidth={3} /> : <Minus size={16} strokeWidth={4} />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="p-4 border-t-2 border-neo-border bg-[#FFFBEB] space-y-3 shadow-[inset_0_4px_0_rgba(0,0,0,0.02)]">
            <div className="flex justify-between text-sm font-bold text-gray-700">
              <span>المجموع الفرعي</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-gray-700">
              <span>الضريبة (١٥٪)</span>
              <span>{formatCurrency(cartTax)}</span>
            </div>
            <div className="flex justify-between items-center text-2xl font-black pt-3 border-t-2 border-neo-border mt-3 text-neo-text">
              <span>الإجمالي</span>
              <span className="text-brand-orange bg-white px-3 py-1 rounded-lg border-2 border-neo-border shadow-[2px_2px_0px_#1A1A1A]">{formatCurrency(cartGrandTotal)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 grid grid-cols-2 gap-3 bg-white border-t-2 border-neo-border">
            <button className="neo-btn bg-[#FFFBEB] border-2 border-neo-border shadow-[2px_2px_0px_#1A1A1A] py-3 flex items-center justify-center gap-2 font-black text-neo-border hover:bg-brand-yellow transition-all hover:-translate-y-[1px] hover:shadow-[3px_3px_0px_#1A1A1A]">
               تعليق
            </button>
            <button className="neo-btn bg-brand-red text-white border-2 border-neo-border shadow-[2px_2px_0px_#1A1A1A] py-3 flex items-center justify-center gap-2 font-black hover:bg-red-600 transition-all hover:-translate-y-[1px] hover:shadow-[3px_3px_0px_#1A1A1A]" onClick={() => setCart([])}>
              مسح
            </button>
            <button className="neo-btn bg-brand-green col-span-2 py-4 flex items-center justify-center gap-3 text-xl font-black border-2 border-neo-border shadow-[4px_4px_0px_#1A1A1A] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1A1A1A] transition-all text-neo-text">
              <CreditCard size={28} strokeWidth={3} />
              دفع واستلام
            </button>
          </div>
        </div>

        {/* Quick Payment Info */}
        <div className="neo-card p-4 bg-brand-cyan border-2 border-neo-border shadow-[4px_4px_0px_#1A1A1A]">
          <div className="flex items-center gap-3 mb-3 border-b-2 border-neo-border pb-2">
            <Clock size={20} strokeWidth={3} />
            <h4 className="font-black text-sm">أداء الكاشير</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <p className="text-xs font-black text-gray-800">متوسط الوقت</p>
              <p className="font-black text-lg">١:٤٥ دقيقة</p>
            </div>
            <div>
              <p className="text-xs font-black text-gray-800">المعاملات اليوم</p>
              <p className="font-black text-lg">٤٨ طلب</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
