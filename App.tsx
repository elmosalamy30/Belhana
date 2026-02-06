
import { Drink, Order, OrderItem, DrinkCategory } from './types';
import { MENU_ITEMS, DOCTOR_ADS, ADMIN_PASSWORD, ORDER_WHATSAPP, ADMIN_EMAIL, IS_SITE_CLOSED } from './constants';
import React, { useState, useEffect, useMemo, useRef } from 'react';

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
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Lock: () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
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

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
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
    if (IS_SITE_CLOSED) return; 
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

      try {
        await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inventoryData)
        });
      } catch (e) { console.error("Archive failure"); }

      const whatsappMsg = `*تأكيد طلب بالهنا (#${orderId})*\n\n` +
                        `*العميل:* ${contactInfo}\n` +
                        `*المكان:* الدور ${floorNumber} - عيادة ${clinicNumber}\n\n` +
                        `*الطلبات:*\n${currentCartItems.map((i: CartItem) => `• ${i.drink.name} (×${i.quantity})`).join('\n')}\n\n` +
                        `*المبلغ المستحق:* ${cartTotalPrice} ج.م\n` +
                        (orderNote ? `*ملاحظات:* ${orderNote}` : '');

      window.open(`https://wa.me/${ORDER_WHATSAPP}?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
      
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

  if (IS_SITE_CLOSED) {
    return (
      <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-6 ${COLORS.primary} overflow-hidden`} dir="rtl">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-[-15%] right-[-15%] w-[60%] h-[60%] bg-amber-600 rounded-full blur-[140px]"></div>
          <div className="absolute bottom-[-15%] left-[-15%] w-[60%] h-[60%] bg-amber-950 rounded-full blur-[140px]"></div>
        </div>

        <div className="relative z-10 max-w-md w-full text-center space-y-10 animate-lockIn">
          <div className="inline-block p-1.5 rounded-full bg-white/5 backdrop-blur-md mb-2 shadow-2xl">
             <img src={LOGO_URL} className="w-28 h-28 rounded-full border-2 border-amber-600/50 grayscale-[0.5] mx-auto" alt="Logo" />
          </div>

          <div className="space-y-4">
             <div className="flex justify-center text-amber-500 mb-2 scale-110 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
               <Icons.Lock />
             </div>
             <h1 className="text-4xl font-black text-white tracking-tight leading-tight">الموقع مغلق الآن</h1>
             <p className="text-amber-500/80 font-bold text-sm tracking-[0.3em] uppercase">SYSTEM LOCKED</p>
             <div className="h-1.5 w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6">
            <p className="text-amber-100/60 text-lg font-medium leading-relaxed px-4">
              نأسف، الموقع متوقف عن استقبال الطلبات <br/>
              <span className="text-white/40 text-sm mt-1 inline-block">بناءً على تعليمات الإدارة</span>
            </p>
            
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl ring-1 ring-white/5">
               <h3 className="text-amber-500/60 font-black text-xs uppercase tracking-[0.2em] mb-3">مواعيد العمل الرسمية</h3>
               <p className="text-white font-black text-3xl mb-1">09:00 ص - 10:00 م</p>
               <p className="text-white/20 text-[10px] font-bold mt-4 border-t border-white/5 pt-4 uppercase tracking-widest">Hana Medical Center Branch</p>
            </div>
          </div>

          <footer className="pt-8 opacity-40">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-2">SECURE ACCESS ONLY</p>
            <p className="text-[9px] font-extrabold text-white uppercase tracking-widest">Full Management by Dr. Ahmed Elmosalamy</p>
          </footer>
        </div>

        <style>{`
          @keyframes lockIn { 
            0% { opacity: 0; transform: scale(0.9) translateY(30px); filter: blur(10px); } 
            100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); } 
          }
          .animate-lockIn { animation: lockIn 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${COLORS.bgLight} flex flex-col pb-24 font-sans`} dir="rtl">
      <header className={`sticky top-0 z-[60] ${COLORS.primary} text-white shadow-xl`}>
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} className="w-10 h-10 rounded-full border-2 border-amber-500 shadow-md" alt="Logo" />
            <div className="flex flex-col">
              <h1 className="text-lg font-black leading-none text-white">بالهنا</h1>
              <span className="text-[9px] text-amber-400 font-bold uppercase tracking-widest">Hana Center</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAdminLogin(true)} className="p-2.5 rounded-full hover:bg-white/10"><Icons.User /></button>
            <button onClick={() => setView('cart')} className={`relative ${COLORS.secondary} p-2.5 rounded-xl shadow-lg active:scale-95 transition-transform`}>
              <Icons.ShoppingCart />
              {cartTotalItems > 0 && <span className="absolute -top-2 -right-2 bg-white text-amber-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">{cartTotalItems}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-5 py-6">
        {view === 'menu' && (
          <div className="space-y-8 animate-fadeIn">
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
                    <div className="pr-6 flex-1 overflow-hidden text-right">
                      <div className="flex items-center gap-2 mb-1 justify-end">
                        <span className="text-[10px] text-gray-400 font-bold tracking-tighter">مجمع هنا الطبي</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      </div>
                      <h3 className={`font-black text-[#2D1B14] truncate transition-all ${isScrolled ? 'text-lg' : 'text-xl md:text-3xl mb-1'}`}>{ad.name}</h3>
                      <p className={`text-gray-500 font-bold truncate opacity-80 ${isScrolled ? 'text-xs' : 'text-sm mb-2'}`}>{ad.specialty}</p>
                      {!isScrolled && (
                        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full w-fit border border-amber-100 mr-auto ml-0">
                          <Icons.MapPin />
                          <span className="text-[11px] font-black">{ad.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex overflow-x-auto gap-3 pb-3 no-scrollbar -mx-5 px-5 sticky top-[72px] z-40 bg-[#FDF8F3]/80 backdrop-blur-lg py-2">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-black transition-all shadow-sm active:scale-95 ${activeCategory === cat.id ? `${COLORS.secondary} text-white shadow-amber-500/20` : `${COLORS.surface} border border-amber-100 text-amber-900`}`}>
                  <span className="text-lg">{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {filteredMenuItems.map(item => (
                <div key={item.id} className={`${COLORS.surface} rounded-[2rem] overflow-hidden shadow-sm border border-amber-50 group transition-all hover:shadow-xl hover:-translate-y-1`}>
                  <div className="relative h-36 overflow-hidden">
                    <img src={item.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.name} />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-[13px] mb-3 truncate text-[#2D1B14]">{item.name}</h3>
                    <button onClick={() => updateCart(item, 1)} className={`w-full py-2.5 rounded-xl text-[12px] font-black ${COLORS.primary} text-white active:scale-95 shadow-md`}>أضف للسلة</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto py-10 text-center opacity-40 px-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-900 mb-2">بالهنا — مجمع هنا الطبي</p>
          <p className="text-[9px] font-extrabold text-amber-800 uppercase tracking-widest">Full Management by Dr. Ahmed Elmosalamy</p>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
