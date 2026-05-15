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
            <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="ابحث عن صنف..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="neo-input w-full pr-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`neo-btn px-4 py-2 whitespace-nowrap text-sm ${activeCategory === cat ? 'bg-brand-yellow' : 'bg-white'}`}
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
                className="neo-card p-4 flex flex-col items-center text-center group hover:bg-yellow-50 transition-colors"
              >
                <div className="w-16 h-16 bg-neo-bg neo-card-flat flex items-center justify-center text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {item.emoji}
                </div>
                <h3 className="font-black text-sm mb-1 line-clamp-1">{item.name}</h3>
                <p className="text-xs font-bold text-gray-500 mb-2">{item.category}</p>
                <p className="font-black text-brand-blue">{formatCurrency(item.price)}</p>
                <div className="mt-3 w-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="neo-btn bg-brand-green w-full py-1 text-xs">إضافة</div>
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3 opacity-50">
                <ShoppingCart size={48} />
                <p className="font-black">السلة فارغة</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-neo-bg/30 p-2 rounded-xl border-2 border-dashed border-gray-200">
                  <div className="w-12 h-12 bg-white neo-card-flat flex items-center justify-center text-2xl">
                    {item.emoji}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-sm">{item.name}</h4>
                    <p className="text-xs font-bold text-brand-blue">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 neo-btn bg-white p-0 flex items-center justify-center"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-black w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => addToCart(item)}
                      className="w-8 h-8 neo-btn bg-brand-yellow p-0 flex items-center justify-center"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="p-4 border-t-2 border-neo-border bg-gray-50 space-y-2">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-gray-500">المجموع الفرعي</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span className="text-gray-500">الضريبة (١٥٪)</span>
              <span>{formatCurrency(cartTax)}</span>
            </div>
            <div className="flex justify-between text-lg font-black pt-2 border-t border-gray-200 mt-2">
              <span>الإجمالي</span>
              <span className="text-brand-orange">{formatCurrency(cartGrandTotal)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 grid grid-cols-2 gap-3">
            <button className="neo-btn bg-white py-3 flex items-center justify-center gap-2">
               تعليق
            </button>
            <button className="neo-btn bg-brand-red text-white py-3 flex items-center justify-center gap-2" onClick={() => setCart([])}>
              مسح
            </button>
            <button className="neo-btn bg-brand-green col-span-2 py-4 flex items-center justify-center gap-3 text-lg">
              <CreditCard size={24} />
              دفع واستلام
            </button>
          </div>
        </div>

        {/* Quick Payment Info */}
        <div className="neo-card p-4 bg-brand-cyan">
          <div className="flex items-center gap-3 mb-3">
            <Clock size={18} />
            <h4 className="font-black text-sm">أداء الكاشير</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold opacity-70">متوسط الوقت</p>
              <p className="font-black">١:٤٥ دقيقة</p>
            </div>
            <div>
              <p className="text-xs font-bold opacity-70">المعاملات اليوم</p>
              <p className="font-black">٤٨ طلب</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
