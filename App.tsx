
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MENU_ITEMS, DOCTOR_ADS, ADMIN_PASSWORD, ORDER_WHATSAPP, ADMIN_EMAIL } from './constants';
import { Drink, Order, OrderItem, DrinkCategory } from './types';

const LOGO_URL = "https://archive.org/download/t-401769435886279/__ia_thumb.jpg";
const GLOBAL_SYNC_ID = "bal_hana_v7_final_secure_sync_2025"; 
const API_URL = `https://kvdb.io/6E3qV3pE9yU5vH7N9w4G9x/${GLOBAL_SYNC_ID}`;

const COLORS = {
  primary: 'bg-[#2D1B14]',       
  primaryHover: 'hover:bg-[#3D261C]',
  secondary: 'bg-[#D97706]',     
  secondaryHover: 'hover:bg-[#B45309]',
  accent: 'text-[#D97706]',
  accentBg: 'bg-[#D97706]/10',
  border: 'border-[#D97706]/30',
  borderFocus: 'border-[#D97706]',
  bgLight: 'bg-[#FDF8F3]',       
  surface: 'bg-white',
  textMain: 'text-[#2D1B14]',
  textMuted: 'text-[#2D1B14]/60'
};

const Icons = {
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  WhatsApp: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Minus: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  ShoppingCart: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  Stethoscope: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2a.3.3 0 0 0-.2.3Z"/><path d="M10 2v2"/><path d="M14 2v2"/><path d="M3 10a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7a5 5 0 0 1-10 0v-2"/><path d="M11 15v2a3 3 0 1 1-6 0v-2"/></svg>
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

  // Swipe logic
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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
    const timer = setInterval(nextAd, 8000);
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

  const handleConfirmOrder = async () => {
    if (!floorNumber || !clinicNumber || !contactInfo.trim()) { 
      alert("يرجى إكمال جميع بيانات التوصيل.");
      return; 
    }
    setIsPlacingOrder(true);
    try {
      const orderId = Math.random().toString(36).substr(2, 5).toUpperCase();
      const currentCartItems = Object.values(cart) as CartItem[];
      const itemsList = currentCartItems.map((i: CartItem) => `${i.drink.name} (×${i.quantity})`).join(', ');
      
      // 1. Send to FormSubmit (Email Inventory Archive)
      const emailBody = {
        _subject: `جرد طلبات بالهنا - طلب #${orderId}`,
        "رقم الدور": floorNumber,
        "رقم العيادة": clinicNumber,
        "اسم صاحب الطلب": contactInfo,
        "الطلبات": itemsList,
        "السعر الإجمالي": `${cartTotalPrice} ج.م`,
        "ملاحظات": orderNote || "لا يوجد",
        _captcha: "false"
      };

      try {
        await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailBody)
        });
      } catch (e) { console.error("FormSubmit Archive Failed"); }

      // 2. Open WhatsApp for Action
      const whatsappMsg = `*طلب جديد من بالهنا (#${orderId})*\n\n` +
                        `*الموقع:*\n` +
                        `- الدور: ${floorNumber}\n` +
                        `- عيادة/غرفة: ${clinicNumber}\n` +
                        `- الاسم: ${contactInfo}\n\n` +
                        `*الطلبات:*\n${currentCartItems.map((i: CartItem) => `• ${i.drink.name} (×${i.quantity})`).join('\n')}\n\n` +
                        `*الإجمالي:* ${cartTotalPrice} ج.م\n` +
                        (orderNote ? `*ملاحظات:* ${orderNote}` : '');

      window.open(`https://wa.me/${ORDER_WHATSAPP}?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
      
      // 3. Sync with KVDB
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

  if (view === 'admin') {
    return (
      <div className={`min-h-screen ${COLORS.bgLight} p-8`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
               <button onClick={() => setView('menu')} className="p-2 rounded-full bg-white shadow-sm text-amber-600"><Icons.ArrowRight /></button>
               <h1 className="text-2xl font-black text-[#2D1B14]">لوحة الجرد المركزية</h1>
            </div>
            <p className="text-xs font-bold text-amber-700">آخر مزامنة: {lastSyncTime}</p>
          </div>
          <div className="space-y-4">
             {orders.length === 0 ? <div className="p-20 text-center bg-white rounded-3xl text-gray-400">لا يوجد سجلات حالياً</div> : 
             orders.slice().reverse().map(o => (
               <div key={o.id} className="bg-white p-6 rounded-3xl shadow-sm border border-amber-50">
                  <div className="flex justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-600">كود الجرد: #{o.id}</span>
                      <h3 className="font-black text-lg">{o.clinicName}</h3>
                      <p className="text-xs text-gray-500">الدور {o.floorNumber} - عيادة {o.clinicNumber}</p>
                    </div>
                    <div className="text-left">
                      <p className="font-black text-amber-600">{o.totalPrice} ج.م</p>
                      <p className="text-[10px] text-gray-400">{new Date(o.timestamp).toLocaleString('ar-EG')}</p>
                    </div>
                  </div>
                  <ul className="text-sm bg-gray-50 p-4 rounded-2xl">
                    {o.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between py-1">
                        <span>{item.drinkName}</span>
                        <span className="font-bold">×{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
               </div>
             ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${COLORS.bgLight} flex flex-col pb-24`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${COLORS.primary} text-white shadow-2xl`}>
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={LOGO_URL} alt="Logo" className="w-12 h-12 rounded-full border-2 border-amber-500/50 object-cover shadow-lg" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#2D1B14] rounded-full"></div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">بالهنا</h1>
              <p className="text-[10px] text-amber-400 font-black uppercase tracking-[0.2em]">Hana Medical Center</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowAdminLogin(true)} className="p-2.5 rounded-full hover:bg-white/10 transition-colors"><Icons.User /></button>
            <button onClick={() => setView('cart')} className={`relative ${COLORS.secondary} p-3 rounded-2xl shadow-xl transition-all active:scale-90 hover:shadow-amber-500/20`}>
              <Icons.ShoppingCart />
              {cartTotalItems > 0 && <span className="absolute -top-2 -right-2 bg-white text-amber-800 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">{cartTotalItems}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-5 py-8">
        {view === 'menu' && (
          <div className="space-y-10 animate-fadeIn">
            
            {/* Modern Doctor Ads Carousel */}
            <div 
              className="relative overflow-hidden rounded-[2.5rem] shadow-2xl bg-white h-52 group touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="absolute inset-0 flex items-center">
                {DOCTOR_ADS.map((ad, idx) => (
                  <div 
                    key={ad.id} 
                    className={`absolute inset-0 flex items-center px-6 md:px-12 transition-all duration-700 ease-in-out ${idx === activeAdIndex ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-full scale-95'}`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full"></div>
                      <img src={ad.image} className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-2xl relative z-10" />
                    </div>
                    <div className="pr-8 flex-1">
                      <div className="inline-flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full mb-2">
                        <Icons.Stethoscope />
                        <span className="text-[11px] font-black text-amber-800 uppercase tracking-tighter">نخبة مجمع هنا</span>
                      </div>
                      <h3 className="font-black text-xl md:text-2xl text-[#2D1B14] mb-1">{ad.name}</h3>
                      <p className="text-[14px] text-gray-500 font-bold mb-3">{ad.specialty}</p>
                      <div className="flex items-center gap-2 text-amber-700">
                         <Icons.MapPin />
                         <span className="text-[12px] font-black">{ad.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5">
                {DOCTOR_ADS.map((_, i) => (
                  <button key={i} onClick={() => setActiveAdIndex(i)} className={`h-2 rounded-full transition-all duration-500 ${i === activeAdIndex ? 'bg-amber-600 w-8' : 'bg-amber-100 w-2'}`} />
                ))}
              </div>

              {/* Swipe Hints */}
              <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white/30 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/30 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar -mx-5 px-5 sticky top-[76px] z-40 bg-[#FDF8F3]/90 backdrop-blur-xl py-2">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-black transition-all shadow-sm active:scale-95 ${activeCategory === cat.id ? `${COLORS.secondary} text-white shadow-amber-500/20` : `${COLORS.surface} border border-amber-100 text-amber-900`}`}>
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredMenuItems.map(item => (
                <div key={item.id} className={`${COLORS.surface} rounded-[2.5rem] overflow-hidden shadow-sm border border-amber-50 group transition-all hover:shadow-2xl hover:-translate-y-1`}>
                  <div className="relative h-40 overflow-hidden">
                    <img src={item.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-[12px] font-black shadow-lg text-amber-800 border border-amber-50">{item.price} ج.م</div>
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-black text-[14px] mb-4 truncate text-[#2D1B14]">{item.name}</h3>
                    {cart[item.id] ? (
                      <div className="flex items-center justify-between bg-amber-50 p-2 rounded-2xl border border-amber-100">
                        <button onClick={() => updateCart(item, -1)} className={`${COLORS.secondary} text-white w-8 h-8 rounded-xl flex items-center justify-center`}><Icons.Minus /></button>
                        <span className="font-black text-sm text-amber-900">{cart[item.id].quantity}</span>
                        <button onClick={() => updateCart(item, 1)} className={`${COLORS.secondary} text-white w-8 h-8 rounded-xl flex items-center justify-center`}><Icons.Plus /></button>
                      </div>
                    ) : (
                      <button onClick={() => updateCart(item, 1)} className={`w-full py-3 rounded-2xl text-[13px] font-black ${COLORS.primary} text-white active:scale-95 shadow-lg`}>أضف للسلة</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
            <div className="flex items-center gap-5">
              <button onClick={() => setView('menu')} className={`p-3 rounded-full ${COLORS.surface} border border-amber-100 text-amber-700 shadow-md active:scale-90`}><Icons.ArrowRight /></button>
              <h2 className="text-2xl font-black text-[#2D1B14]">قائمة طلباتك</h2>
            </div>

            {cartTotalItems === 0 ? (
              <div className="p-20 text-center rounded-[3rem] bg-white border-4 border-dashed border-amber-50 shadow-sm">
                <h3 className="font-black text-gray-400 text-lg">سلتك بانتظار مشروباتك</h3>
                <button onClick={() => setView('menu')} className={`mt-8 py-4 px-12 rounded-2xl ${COLORS.primary} text-white font-black shadow-xl`}>تصفح المنيو</button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Cart Summary Card */}
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-amber-50 p-8">
                  <div className="space-y-5">
                    {(Object.values(cart) as CartItem[]).map((item: CartItem) => (
                      <div key={item.drink.id} className="flex justify-between items-center py-4 border-b border-amber-50 last:border-0">
                        <div className="flex flex-col">
                           <span className="font-black text-base text-[#2D1B14]">{item.drink.name}</span>
                           <span className="text-[11px] text-gray-400 font-bold">× {item.quantity}</span>
                        </div>
                        <span className="text-amber-700 font-black text-lg">{item.drink.price * item.quantity} ج.م</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-8 border-t-2 border-dashed border-amber-100 flex justify-between items-center font-black text-2xl text-[#2D1B14]">
                    <span className="text-base text-gray-400">الإجمالي النهائي</span>
                    <span>{cartTotalPrice} <span className="text-xs">ج.م</span></span>
                  </div>
                </div>

                {/* Delivery Info Card */}
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-amber-50 p-8 space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center"><Icons.MapPin /></div>
                     <h3 className="font-black text-lg text-[#2D1B14]">بيانات الموقع والطلب</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <select value={floorNumber} onChange={(e) => { setFloorNumber(e.target.value); setClinicNumber(""); }} className="w-full p-4 rounded-2xl border-2 border-amber-50 bg-amber-50/20 text-[13px] font-black outline-none focus:border-amber-500 appearance-none">
                            <option value="">اختر الدور...</option>
                            <option value="0">الدور الأرضي (0)</option>
                            <option value="1">الدور الأول (1)</option>
                            <option value="2">الدور الثاني (2)</option>
                            <option value="3">الدور الثالث (3)</option>
                        </select>
                        <select disabled={!floorNumber} value={clinicNumber} onChange={(e) => setClinicNumber(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-amber-50 bg-amber-50/20 text-[13px] font-black outline-none focus:border-amber-500 disabled:opacity-30 appearance-none">
                            <option value="">رقم العيادة...</option>
                            {availableRooms.map(room => <option key={room} value={room}>{room}</option>)}
                        </select>
                    </div>
                    <input type="text" placeholder="اسم صاحب الطلب / العيادة" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-amber-50 bg-amber-50/20 text-[13px] font-black outline-none focus:border-amber-500" />
                    <textarea placeholder="إضافات وملاحظات الطلب (سكر، نوع حليب...)" value={orderNote} onChange={(e) => setOrderNote(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-amber-50 bg-amber-50/20 text-[13px] font-black h-24 outline-none focus:border-amber-500 resize-none" />
                  </div>
                  
                  <button onClick={handleConfirmOrder} disabled={isPlacingOrder} className={`w-full py-5 rounded-2xl text-white font-black text-lg shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 ${COLORS.primary} disabled:opacity-50`}>
                    {isPlacingOrder ? (
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>تأكيد الطلب <Icons.Check /></>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Checkout Button */}
      {view === 'menu' && cartTotalItems > 0 && (
        <div className="fixed bottom-6 left-6 right-6 z-50 animate-bounceIn">
          <button onClick={() => setView('cart')} className={`max-w-2xl mx-auto w-full ${COLORS.primary} text-white p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between`}>
            <div className="flex items-center gap-4">
                <div className="bg-amber-500 text-white px-4 py-1.5 rounded-2xl font-black text-base">{cartTotalItems}</div>
                <span className="font-black text-base uppercase">استكمال الطلب</span>
            </div>
            <div className="font-black text-xl">{cartTotalPrice} ج.م</div>
          </button>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-[#2D1B14]/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[3.5rem] p-12 max-w-sm w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 scale-125"><Icons.Check /></div>
            <h2 className="text-2xl font-black mb-3 text-[#2D1B14]">تمت العملية!</h2>
            <p className="text-gray-500 text-[14px] font-bold mb-8">تم تأكيد طلبك وأرشفته بنجاح. سنصلك في أسرع وقت.</p>
            <button onClick={() => { setShowSuccessModal(false); setView('menu'); }} className={`w-full py-5 rounded-[2rem] ${COLORS.primary} text-white font-black shadow-2xl transition-all active:scale-95`}>العودة للرئيسية</button>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/70 backdrop-blur-xl">
          <div className="bg-white rounded-[3rem] p-8 max-w-sm w-full shadow-2xl">
            <h2 className="font-black text-xl text-[#2D1B14] mb-8">دخول الإدارة</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (adminPassInput === ADMIN_PASSWORD) {
                setView('admin');
                setShowAdminLogin(false);
                setAdminPassInput("");
              } else {
                alert("كلمة المرور غير صحيحة");
              }
            }} className="space-y-5">
              <input autoFocus type="password" value={adminPassInput} onChange={(e) => setAdminPassInput(e.target.value)} className="w-full p-5 rounded-[1.5rem] border-2 border-amber-50 bg-amber-50/20 font-black text-center tracking-[0.5em] focus:border-amber-500 outline-none" placeholder="********" />
              <button type="submit" className={`w-full py-5 rounded-[1.5rem] ${COLORS.primary} text-white font-black shadow-2xl`}>دخول</button>
              <button type="button" onClick={() => setShowAdminLogin(false)} className="w-full py-2 text-gray-400 font-bold text-xs">إغلاق</button>
            </form>
          </div>
        </div>
      )}

      <footer className="mt-auto py-12 text-center opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-900">بالهنا — مجمع هنا الطبي</p>
          <p className="text-[9px] font-bold text-amber-800">Developed by Dr. Ahmed Elmosalamy</p>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        @keyframes bounceIn { 0% { transform: scale(0.9); opacity: 0; } 70% { transform: scale(1.03); } 100% { transform: scale(1); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .animate-bounceIn { animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
};

export default App;
