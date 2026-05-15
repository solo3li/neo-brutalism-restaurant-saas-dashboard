import { useState, useMemo } from "react";
import { 
  Search, 
  Plus, 
  Minus, 
  CreditCard, 
  ShoppingCart,
  Phone,
  User,
  MapPin,
  Store,
  ChevronDown
} from "lucide-react";
import { topItems, categoryData, customersData, branches } from "../data/mockData";

const formatCurrency = (value: number) => `${value.toLocaleString("ar-SA")} ر.س`;

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export default function CallCenterPage() {
  // Cart & POS State
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Call Center Specific State
  const [mobileNumber, setMobileNumber] = useState("");
  const [isCustomerFound, setIsCustomerFound] = useState(false);
  const [customerName, setCustomerName] = useState("");
  
  const [orderType, setOrderType] = useState<"takeaway" | "delivery">("takeaway");
  const [selectedBranch, setSelectedBranch] = useState("");
  
  // Delivery specific
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // Mock addresses for returning customers
  const mockAddresses = [
    "الرياض، حي العليا، شارع التحلية، مبنى ٤",
    "الرياض، حي الملقا، طريق الملك فهد، فيلا ١٢",
  ];

  const categories = ["الكل", ...categoryData.map(c => c.name)];

  const itemsWithCategories = useMemo(() => {
    return topItems.map((item, index) => ({
      ...item,
      category: categoryData[index % categoryData.length].name,
      price: 15 + (index * 5)
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

  const handleMobileSearch = () => {
    if (mobileNumber.length >= 8) {
      const found = customersData.find(c => c.number.includes(mobileNumber));
      if (found) {
        setIsCustomerFound(true);
        setCustomerName(found.name);
        setSelectedAddress(mockAddresses[0]); // Select first mock address automatically
      } else {
        setIsCustomerFound(false);
        setCustomerName("");
        setIsAddingNewAddress(true);
      }
    } else {
      setIsCustomerFound(false);
      setCustomerName("");
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = orderType === "delivery" ? 15 : 0;
  const cartTax = (cartTotal + deliveryFee) * 0.15;
  const cartGrandTotal = cartTotal + deliveryFee + cartTax;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Menu / POS Section */}
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

      {/* Customer & Call Center Flow Section */}
      <div className="w-full lg:w-[450px] flex flex-col gap-4 h-full overflow-y-auto pr-1">
        
        {/* Step 1: Customer Phone */}
        <div className="neo-card p-4 border-2 border-neo-border shadow-[4px_4px_0px_#1A1A1A] bg-white">
          <h3 className="font-black text-lg flex items-center gap-2 mb-3">
            <Phone size={20} strokeWidth={3} className="text-brand-orange" />
            ١. بيانات المتصل
          </h3>
          <div className="flex gap-2 mb-2">
            <input 
              type="text" 
              placeholder="رقم الجوال (مثال: 050123...)" 
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="neo-input flex-1 border-2 border-neo-border shadow-[2px_2px_0px_#1A1A1A] font-bold text-left dir-ltr"
              maxLength={10}
            />
            <button 
              onClick={handleMobileSearch}
              className="neo-btn bg-brand-blue text-white px-4 border-2 border-neo-border shadow-[2px_2px_0px_#1A1A1A] font-black hover:-translate-y-[1px] hover:shadow-[3px_3px_0px_#1A1A1A] transition-all"
            >
              بحث
            </button>
          </div>
          {isCustomerFound ? (
            <div className="bg-brand-green/20 border-2 border-brand-green p-2 rounded-md mt-2 flex items-center gap-2 font-bold text-sm text-brand-green">
              <User size={16} strokeWidth={3} />
              عميل مسجل: {customerName}
            </div>
          ) : mobileNumber.length >= 8 && !isCustomerFound ? (
             <div className="bg-brand-yellow/20 border-2 border-brand-yellow p-2 rounded-md mt-2 flex items-center gap-2 font-bold text-sm text-brand-orange">
              عميل جديد، يرجى تعبئة البيانات.
            </div>
          ) : null}
        </div>

        {/* Step 2: Order Details */}
        <div className="neo-card flex-1 flex flex-col overflow-hidden border-2 border-neo-border shadow-[4px_4px_0px_#1A1A1A] bg-white min-h-[300px]">
          <div className="p-4 border-b-2 border-neo-border bg-[#FFFBEB] flex items-center justify-between">
            <h3 className="font-black text-lg flex items-center gap-2">
              <ShoppingCart size={20} strokeWidth={3} />
              ٢. الطلب
            </h3>
            <span className="neo-badge bg-brand-yellow border-2 border-neo-border shadow-[1px_1px_0px_#1A1A1A]">{cart.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-neo-border gap-2 opacity-60">
                <ShoppingCart size={32} />
                <p className="font-black">السلة فارغة</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center gap-2 bg-[#FFFBEB] p-2 rounded-lg border-2 border-neo-border shadow-[1px_1px_0px_#1A1A1A]">
                  <div className="flex-1">
                    <h4 className="font-black text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-xs font-black text-brand-blue">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 neo-btn bg-brand-red text-white p-0 flex items-center justify-center border-2 border-neo-border"
                    >
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <span className="font-black w-4 text-center text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => addToCart(item)}
                      className="w-6 h-6 neo-btn bg-brand-green p-0 flex items-center justify-center border-2 border-neo-border"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Step 3: Fulfillment */}
        <div className="neo-card p-4 border-2 border-neo-border shadow-[4px_4px_0px_#1A1A1A] bg-white space-y-4">
          <h3 className="font-black text-lg flex items-center gap-2">
            <Store size={20} strokeWidth={3} />
            ٣. التوصيل والاستلام
          </h3>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setOrderType("takeaway")}
              className={`flex-1 py-2 font-black border-2 border-neo-border rounded-lg transition-all shadow-[2px_2px_0px_#1A1A1A] ${orderType === "takeaway" ? "bg-brand-yellow text-neo-border" : "bg-[#FFFBEB] hover:bg-gray-100"}`}
            >
              استلام (سفري)
            </button>
            <button 
              onClick={() => setOrderType("delivery")}
              className={`flex-1 py-2 font-black border-2 border-neo-border rounded-lg transition-all shadow-[2px_2px_0px_#1A1A1A] ${orderType === "delivery" ? "bg-brand-blue text-white" : "bg-[#FFFBEB] hover:bg-gray-100"}`}
            >
              توصيل
            </button>
          </div>

          <div className="space-y-3">
            {/* Customer Name Input (Always needed unless found) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">اسم العميل</label>
              <input 
                type="text" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="أدخل اسم العميل..."
                className="neo-input w-full border-2 border-neo-border shadow-[2px_2px_0px_#1A1A1A] font-bold bg-[#FFFBEB]"
              />
            </div>

            {/* Branch Selection (Always needed) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">توجيه الطلب للفرع</label>
              <div className="relative">
                <select 
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="neo-input w-full border-2 border-neo-border shadow-[2px_2px_0px_#1A1A1A] font-bold bg-[#FFFBEB] appearance-none"
                >
                  <option value="" disabled>اختر الفرع...</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Delivery specific: Address */}
            {orderType === "delivery" && (
              <div className="pt-2 border-t-2 border-dashed border-neo-border">
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <MapPin size={14} /> عنوان التوصيل
                </label>
                
                {isCustomerFound && !isAddingNewAddress ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <select 
                        value={selectedAddress}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="neo-input w-full border-2 border-neo-border shadow-[2px_2px_0px_#1A1A1A] font-bold bg-[#FFFBEB] appearance-none"
                      >
                        {mockAddresses.map((addr, idx) => (
                          <option key={idx} value={addr}>{addr}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <button 
                      onClick={() => setIsAddingNewAddress(true)}
                      className="text-xs font-black text-brand-blue underline"
                    >
                      + إضافة عنوان جديد
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <textarea 
                      placeholder="أدخل عنوان التوصيل بالتفصيل..."
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="neo-input w-full border-2 border-neo-border shadow-[2px_2px_0px_#1A1A1A] font-bold bg-[#FFFBEB] h-20 resize-none"
                    />
                    {isCustomerFound && (
                      <button 
                        onClick={() => setIsAddingNewAddress(false)}
                        className="text-xs font-black text-brand-orange underline"
                      >
                        العودة للعناوين المحفوظة
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Total & Submit */}
        <div className="neo-card p-4 border-2 border-neo-border shadow-[4px_4px_0px_#1A1A1A] bg-gray-50">
          <div className="space-y-1 mb-3">
             <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-600">المجموع الفرعي</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            {orderType === "delivery" && (
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-600">رسوم التوصيل</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-600">الضريبة (١٥٪)</span>
              <span>{formatCurrency(cartTax)}</span>
            </div>
            <div className="flex justify-between text-lg font-black pt-2 border-t-2 border-neo-border mt-2">
              <span>الإجمالي</span>
              <span className="text-brand-orange">{formatCurrency(cartGrandTotal)}</span>
            </div>
          </div>
          
          <button 
            disabled={cart.length === 0 || !customerName || !selectedBranch || (orderType === "delivery" && !selectedAddress && !newAddress)}
            className="neo-btn bg-brand-green w-full py-4 flex items-center justify-center gap-2 text-lg font-black border-2 border-neo-border shadow-[4px_4px_0px_#1A1A1A] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1A1A1A] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#1A1A1A]"
          >
            <CreditCard size={24} strokeWidth={2.5} />
            تأكيد الطلب
          </button>
        </div>

      </div>
    </div>
  );
}
