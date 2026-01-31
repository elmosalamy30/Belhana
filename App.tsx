
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MENU_ITEMS, DOCTOR_ADS, ADMIN_PASSWORD, ORDER_WHATSAPP, ADMIN_EMAIL } from './constants';
import { Drink, Order, OrderItem, DrinkCategory } from './types';

const LOGO_URL = "https://archive.org/download/t-401769435886279/__ia_thumb.jpg";
const GLOBAL_SYNC_ID = "bal_hana_v7_final_secure_sync_2025"; 
const API_URL = `https://kvdb.io/6E3qV3pE9yU5vH7N9w4G9x/${GLOBAL_SYNC_ID}`;

const COLORS = {
  primary: 'bg-[#2D1B14]',       
  secondary: 'bg-[#D97706]',     
  bgLight: 'bg-[#FDF8F3]',       
  surface: 'bg-white',
  textMain: 'text-[#2D1B14]',
};

const Icons = {
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  WhatsApp: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Minus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  ShoppingCart: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  ChevronLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
};

interface CartItem { drink: Drink; quantity: number; }
type ViewState = 'menu' | 'cart' | 'admin';

const CATEGORIES: { id: 'all' | DrinkCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'الكل', icon: '🍽️' },
  { id: 'hot', label: 'مشروبات ساخنة', icon: '☕' },
  { id: 'coffee', label: 'قهوة', icon: '🤎' },
  { id: 'cold', label: 'مشروبات غازية', icon: '🥤' },
  { id: 'juice', label: 'عصائر', icon: '🧃' },
  { id: 'food', label: 'مأكولات جاهزة', icon: '🍜' },
];

const App: React.FC = () => {
  const [view, setViewInternal] = useState<ViewState>('menu');
  const [activeCategory, setActiveCategory] = useState<'all' | DrinkCategory>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [clinicNumber, setClinicNumber] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState("");
  const [lastSyncTime, setLastSyncTime] = useState("-");
  const [activeAdIndex, setActiveAdIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Swipe logic
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Scroll detection for shrinking ad
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredMenuItems = useMemo(() => {
    if (activeCategory === 'all') return MENU_ITEMS;
    return MENU_ITEMS.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const availableRooms = useMemo(() => {
    if (floorNumber === "0") return Array.from({ length: 21 }, (_, i) => `G${(i + 1).toString().padStart(2, '0')}`);
    if (floorNumber === "1") return Array.from({ length: 25 }, (_, i) => `F${(i + 1).toString().padStart(2, '0')}`);
    if (floorNumber === "2") return Array.from({ length: 25 }, (_, i) => `S${(i + 1).toString().padStart(2, '0')}`);
    if (floorNumber === "3") return Array.from({ length: 25 }, (_, i) => (301 + i).toString());
    return [];
  }, [floorNumber]);

  const setView = (newView: ViewState) => {
    window.history.pushState({ view: newView }, '', '');
    setViewInternal(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => setViewInternal(e.state?.view || 'menu');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}?cb=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : []);
          setLastSyncTime(new Date().toLocaleTimeString('ar-EG'));
        }
      } catch (e) { console.warn("Sync error"); }
    };
    fetchOrders();
    const timer = setInterval(fetchOrders, view === 'admin' ? 5000 : 30000);
    return () => clearInterval(timer);
  }, [view]);

  const nextAd = () => setActiveAdIndex((prev) => (prev + 1) % DOCTOR_ADS.length);
  const prevAd = () => setActiveAdIndex((prev) => (prev - 1 + DOCTOR_ADS.length) % DOCTOR_ADS.length);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.targetTouches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) nextAd();
    if (distance < -50) prevAd();
    touchStartX.current = 0; touchEndX.current = 0;
  };

  useEffect(() => {
    const timer = setInterval(nextAd, 10000);
    return () => clearInterval(timer);
  }, []);

  const cartTotalPrice = useMemo(() => 
    Object.values(cart).reduce((sum: number, item: CartItem) => sum + (item.drink.price * item.quantity), 0), [cart]);

  const cartTotalItems = useMemo(() =>
    Object.values(cart).reduce((sum: number, item: CartItem) => sum + item.quantity, 0), [cart]);

  const updateCart = (drink: Drink, delta: number) => {
    setCart(prev => {
      const existing = prev[drink.id];
      const newQuantity = (existing ? existing.quantity : 0) + delta;
      if (newQuantity <= 0) {
        const next = { ...prev };
        delete next[drink.id];
        return next;
      }
      return { ...prev, [drink.id]: { drink, quantity: newQuantity } };
    });
  };

  const cancelOrder = () => {
    if (confirm("هل أنت متأكد من إلغاء الطلب بالكامل؟")) {
      setCart({});
      setView('menu');
    }
  };

  const handleConfirmOrder = async () => {
    if (!floorNumber || !clinicNumber || !contactInfo.trim()) { 
      alert("يرجى إكمال بيانات التوصيل.");
      return; 
    }
    setIsPlacingOrder(true);
    try {
      const orderId = Math.random().toString(36).substr(2, 5).toUpperCase();
      const currentCartItems = Object.values(cart) as CartItem[];
      const itemsList = currentCartItems.map((i: CartItem) => `${i.drink.name} (×${i.quantity})`).join(', ');
      
      const inventoryData = {
        _subject: `جرد بالهنا - طلب #${orderId}`,
        order_id: orderId,
        floor: floorNumber,
        room: clinicNumber,
        customer: contactInfo,
        items: itemsList,
        total: `${cartTotalPrice} ج.م`,
        notes: orderNote || "لا يوجد",
        _captcha: "false"
      };

      // 1. Silent Email Archive
      try {
        await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inventoryData)
        });
      } catch (e) { console.error("Archive failure"); }

      // 2. WhatsApp Delivery
      const whatsappMsg = `*تأكيد طلب بالهنا (#${orderId})*\n\n` +
                        `*العميل:* ${contactInfo}\n` +
                        `*المكان:* الدور ${floorNumber} - عيادة ${clinicNumber}\n\n` +
                        `*الطلبات:*\n${currentCartItems.map((i: CartItem) => `• ${i.drink.name} (×${i.quantity})`).join('\n')}\n\n` +
                        `*المبلغ المستحق:* ${cartTotalPrice} ج.م\n` +
                        (orderNote ? `*ملاحظات:* ${orderNote}` : '');

      window.open(`https://wa.me/${ORDER_WHATSAPP}?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
      
      // 3. Database Sync
      const newOrder: Order = {
        id: orderId,
        items: currentCartItems.map((i: CartItem) => ({ drinkId: i.drink.id, drinkName: i.drink.name, quantity: i.quantity, price: i.drink.price })),
        totalPrice: cartTotalPrice,
        clinicName: contactInfo,
        clinicNumber,
        floorNumber,
        contactInfo,
        status: 'pending',
        timestamp: Date.now(),
        notes: orderNote
      };
      
      await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify([...orders, newOrder].slice(-100)),
        headers: { 'Content-Type': 'application/json' }
      });

      setCart({});
      setIsPlacingOrder(false);
      setShowSuccessModal(true);
    } catch (e) {
      alert("حدث خطأ، حاول مرة أخرى.");
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className={`min-h-screen ${COLORS.bgLight} flex flex-col pb-24 font-sans`} dir="rtl">
      {/* Header */}
      <header className={`sticky top-0 z-[60] ${COLORS.primary} text-white shadow-xl`}>
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} className="w-10 h-10 rounded-full border-2 border-amber-500 shadow-md" alt="Logo" />
            <div className="flex flex-col">
              <h1 className="text-lg font-black leading-none">بالهنا</h1>
              <span className="text-[9px] text-amber-400 font-bold uppercase tracking-widest">Hana Center</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAdminLogin(true)} className="p-2.5 rounded-full hover:bg-white/10"><Icons.User /></button>
            <button onClick={() => setView('cart')} className={`relative ${COLORS.secondary} p-2.5 rounded-xl shadow-lg active:scale-95`}>
              <Icons.ShoppingCart />
              {cartTotalItems > 0 && <span className="absolute -top-2 -right-2 bg-white text-amber-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">{cartTotalItems}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-5 py-6">
        {view === 'menu' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Floating & Shrinking Doctor Ads Carousel */}
            <div 
              className={`relative overflow-hidden transition-all duration-700 ease-in-out z-50 rounded-[2.5rem] shadow-2xl bg-white group ${isScrolled ? 'h-32 opacity-90 scale-95 sticky top-20' : 'h-56'}`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="absolute inset-0 flex items-center">
                {DOCTOR_ADS.map((ad, idx) => (
                  <div 
                    key={ad.id} 
                    className={`absolute inset-0 flex items-center px-6 md:px-12 transition-all duration-700 ease-in-out ${idx === activeAdIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-1/2'}`}
                  >
                    <div className="relative flex-shrink-0">
                      <img src={ad.image} className={`rounded-full object-cover border-4 border-white shadow-xl transition-all duration-500 ${isScrolled ? 'w-20 h-20' : 'w-28 h-28 md:w-36 md:h-36'}`} alt={ad.name} />
                      {!isScrolled && <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[8px] font-black px-2 py-1 rounded-full shadow-lg">إعلان</div>}
                    </div>
                    <div className="pr-6 flex-1 overflow-hidden">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] text-gray-400 font-bold tracking-tighter">مجمع هنا الطبي</span>
                      </div>
                      <h3 className={`font-black text-[#2D1B14] truncate transition-all ${isScrolled ? 'text-lg' : 'text-xl md:text-3xl mb-1'}`}>{ad.name}</h3>
                      <p className={`text-gray-500 font-bold truncate opacity-80 ${isScrolled ? 'text-xs' : 'text-sm mb-2'}`}>{ad.specialty}</p>
                      {!isScrolled && (
                        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full w-fit border border-amber-100">
                          <Icons.MapPin />
                          <span className="text-[11px] font-black">{ad.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); prevAd(); }} className="w-10 h-10 rounded-full bg-white/90 shadow-xl flex items-center justify-center pointer-events-auto active:scale-90 text-amber-700 hover:bg-amber-700 hover:text-white transition-all"><Icons.ChevronRight /></button>
                <button onClick={(e) => { e.stopPropagation(); nextAd(); }} className="w-10 h-10 rounded-full bg-white/90 shadow-xl flex items-center justify-center pointer-events-auto active:scale-90 text-amber-700 hover:bg-amber-700 hover:text-white transition-all"><Icons.ChevronLeft /></button>
              </div>

              {/* Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {DOCTOR_ADS.map((_, i) => (
                  <button key={i} onClick={() => setActiveAdIndex(i)} className={`h-1.5 rounded-full transition-all duration-500 ${i === activeAdIndex ? 'bg-amber-600 w-6' : 'bg-gray-200 w-1.5'}`} />
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto gap-3 pb-3 no-scrollbar -mx-5 px-5 sticky top-[72px] z-40 bg-[#FDF8F3]/80 backdrop-blur-lg py-2">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-black transition-all shadow-sm active:scale-95 ${activeCategory === cat.id ? `${COLORS.secondary} text-white shadow-amber-500/20` : `${COLORS.surface} border border-amber-100 text-amber-900`}`}>
                  <span className="text-lg">{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {filteredMenuItems.map(item => (
                <div key={item.id} className={`${COLORS.surface} rounded-[2rem] overflow-hidden shadow-sm border border-amber-50 group transition-all hover:shadow-xl hover:-translate-y-1`}>
                  <div className="relative h-36 overflow-hidden">
                    <img src={item.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.name} />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[11px] font-black shadow-lg text-amber-800">{item.price} ج.م</div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-[13px] mb-3 truncate text-[#2D1B14]">{item.name}</h3>
                    {cart[item.id] ? (
                      <div className="flex items-center justify-between bg-amber-50 p-1.5 rounded-xl border border-amber-100">
                        <button onClick={() => updateCart(item, -1)} className={`${COLORS.secondary} text-white w-7 h-7 rounded-lg flex items-center justify-center active:scale-75 shadow-sm`}><Icons.Minus /></button>
                        <span className="font-black text-[13px] text-amber-900">{cart[item.id].quantity}</span>
                        <button onClick={() => updateCart(item, 1)} className={`${COLORS.secondary} text-white w-7 h-7 rounded-lg flex items-center justify-center active:scale-75 shadow-sm`}><Icons.Plus /></button>
                      </div>
                    ) : (
                      <button onClick={() => updateCart(item, 1)} className={`w-full py-2.5 rounded-xl text-[12px] font-black ${COLORS.primary} text-white active:scale-95 shadow-md`}>أضف للسلة</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setView('menu')} className={`p-2.5 rounded-full ${COLORS.surface} border border-amber-100 text-amber-700 shadow-md active:scale-90`}><Icons.ArrowRight /></button>
                <h2 className="text-xl font-black text-[#2D1B14]">قائمة طلباتك</h2>
              </div>
              {cartTotalItems > 0 && (
                <button onClick={cancelOrder} className="flex items-center gap-2 text-red-500 font-bold text-xs bg-red-50 px-4 py-2 rounded-xl border border-red-100 active:scale-95 transition-all">
                  <Icons.Trash /> إلغاء الطلب
                </button>
              )}
            </div>

            {cartTotalItems === 0 ? (
              <div className="p-20 text-center rounded-[2.5rem] bg-white border-2 border-dashed border-amber-100 shadow-sm">
                <div className="text-6xl mb-4 opacity-20">🛒</div>
                <h3 className="font-black text-gray-400">سلتك فارغة</h3>
                <button onClick={() => setView('menu')} className={`mt-6 py-3 px-10 rounded-xl ${COLORS.primary} text-white font-black shadow-lg`}>تصفح المنيو</button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-[2rem] shadow-xl border border-amber-50 p-6">
                  <div className="space-y-4">
                    {(Object.values(cart) as CartItem[]).map((item: CartItem) => (
                      <div key={item.drink.id} className="flex justify-between items-center py-4 border-b border-amber-50 last:border-0">
                        <div className="flex flex-col">
                           <span className="font-bold text-sm text-[#2D1B14]">{item.drink.name}</span>
                           <span className="text-[11px] text-amber-700 font-black">{item.drink.price * item.quantity} ج.م</span>
                        </div>
                        <div className="flex items-center gap-4 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                          <button onClick={() => updateCart(item.drink, -1)} className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-amber-800 active:scale-75"><Icons.Minus /></button>
                          <span className="font-black text-xs min-w-[20px] text-center">{item.quantity}</span>
                          <button onClick={() => updateCart(item.drink, 1)} className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-amber-800 active:scale-75"><Icons.Plus /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t-2 border-dashed border-amber-100 flex justify-between items-center">
                    <span className="text-gray-400 font-bold text-sm">الإجمالي</span>
                    <span className="font-black text-2xl text-amber-800">{cartTotalPrice} <span className="text-xs">ج.م</span></span>
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] shadow-xl border border-amber-50 p-6 space-y-5">
                  <h3 className="font-black text-sm flex items-center gap-2"><Icons.MapPin /> معلومات التوصيل</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <select value={floorNumber} onChange={(e) => { setFloorNumber(e.target.value); setClinicNumber(""); }} className="w-full p-4 rounded-xl border-2 border-amber-50 bg-amber-50/20 text-[12px] font-black outline-none focus:border-amber-500 appearance-none">
                            <option value="">الدور...</option>
                            <option value="0">الأرضي (0)</option>
                            <option value="1">الأول (1)</option>
                            <option value="2">الثاني (2)</option>
                            <option value="3">الثالث (3)</option>
                        </select>
                        <select disabled={!floorNumber} value={clinicNumber} onChange={(e) => setClinicNumber(e.target.value)} className="w-full p-4 rounded-xl border-2 border-amber-50 bg-amber-50/20 text-[12px] font-black outline-none focus:border-amber-500 disabled:opacity-30 appearance-none">
                            <option value="">العيادة/الغرفة...</option>
                            {availableRooms.map(room => <option key={room} value={room}>{room}</option>)}
                        </select>
                    </div>
                    <input type="text" placeholder="اسم صاحب الطلب / العيادة" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} className="w-full p-4 rounded-xl border-2 border-amber-50 bg-amber-50/20 text-[12px] font-black outline-none focus:border-amber-500" />
                    <textarea placeholder="أي ملاحظات إضافية..." value={orderNote} onChange={(e) => setOrderNote(e.target.value)} className="w-full p-4 rounded-xl border-2 border-amber-50 bg-amber-50/20 text-[12px] font-black h-20 outline-none focus:border-amber-500 resize-none" />
                  </div>
                  
                  <button onClick={handleConfirmOrder} disabled={isPlacingOrder} className={`w-full py-4 rounded-xl text-white font-black text-base shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95 ${COLORS.primary} disabled:opacity-50`}>
                    {isPlacingOrder ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "تأكيد الطلب"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Check Button */}
      {view === 'menu' && cartTotalItems > 0 && (
        <div className="fixed bottom-6 left-6 right-6 z-[70] animate-bounceIn">
          <button onClick={() => setView('cart')} className={`max-w-2xl mx-auto w-full ${COLORS.primary} text-white p-4 rounded-[1.5rem] shadow-2xl flex items-center justify-between`}>
            <div className="flex items-center gap-3">
                <div className="bg-amber-500 text-white px-3 py-1 rounded-xl font-black text-xs">{cartTotalItems}</div>
                <span className="font-bold text-sm">استكمال الطلب</span>
            </div>
            <div className="font-black text-lg">{cartTotalPrice} ج.م</div>
          </button>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-[#2D1B14]/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5"><Icons.Check /></div>
            <h2 className="text-xl font-black mb-2">تم التأكيد!</h2>
            <p className="text-gray-400 text-xs font-bold mb-6">تم إرسال الطلب وحفظه في سجلات الجرد المركزية. سيصلك المندوب قريباً.</p>
            <button onClick={() => { setShowSuccessModal(false); setView('menu'); }} className={`w-full py-4 rounded-xl ${COLORS.primary} text-white font-black shadow-lg transition-all active:scale-95`}>العودة للرئيسية</button>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl">
            <h2 className="font-black text-lg text-[#2D1B14] mb-6">دخول الإدارة</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (adminPassInput === ADMIN_PASSWORD) {
                setView('admin');
                setShowAdminLogin(false);
                setAdminPassInput("");
              } else {
                alert("خطأ في كلمة المرور");
              }
            }} className="space-y-4">
              <input autoFocus type="password" value={adminPassInput} onChange={(e) => setAdminPassInput(e.target.value)} className="w-full p-4 rounded-xl border-2 border-amber-50 bg-amber-50/20 font-black text-center tracking-widest focus:border-amber-500 outline-none" placeholder="********" />
              <button type="submit" className={`w-full py-4 rounded-xl ${COLORS.primary} text-white font-black shadow-lg`}>دخول</button>
              <button type="button" onClick={() => setShowAdminLogin(false)} className="w-full py-2 text-gray-300 font-bold text-[10px] uppercase">إغلاق</button>
            </form>
          </div>
        </div>
      )}

      <footer className="mt-auto py-10 text-center opacity-20">
          <p className="text-[9px] font-black uppercase tracking-widest text-amber-900">بالهنا — مجمع هنا الطبي</p>
          <p className="text-[8px] font-bold text-amber-800">Developed by Dr. Ahmed Elmosalamy</p>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes bounceIn { 0% { transform: scale(0.8); opacity: 0; } 70% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-bounceIn { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
};

export default App;
