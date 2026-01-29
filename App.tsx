
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MENU_ITEMS, DOCTOR_ADS, ADMIN_PASSWORD, ORDER_WHATSAPP, ADS_WHATSAPP, ADMIN_EMAIL } from './constants';
import { Drink, Order, OrderItem, CLINICS, DoctorAd, DrinkCategory } from './types';

const LOGO_URL = "https://archive.org/download/t-401769435886279/__ia_thumb.jpg";
const GLOBAL_SYNC_ID = "bal_hana_v7_final_secure_sync_2025"; 
const API_URL = `https://kvdb.io/6E3qV3pE9yU5vH7N9w4G9x/${GLOBAL_SYNC_ID}`;

const COLORS = {
  primary: 'bg-[#2D1B14]',       // Deep Coffee / Espresso
  primaryHover: 'hover:bg-[#3D261C]',
  secondary: 'bg-[#D97706]',     // Rich Orange / Gold from Logo
  secondaryHover: 'hover:bg-[#B45309]',
  accent: 'text-[#D97706]',
  accentBg: 'bg-[#D97706]/10',
  border: 'border-[#D97706]/30',
  borderFocus: 'border-[#D97706]',
  bgLight: 'bg-[#FDF8F3]',       // Warm Cream background
  surface: 'bg-white',
  textMain: 'text-[#2D1B14]',
  textMuted: 'text-[#2D1B14]/60'
};

const Icons = {
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  WhatsApp: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Minus: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Mail: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  XCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  ChevronLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  ShoppingCart: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
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
  const [selectedClinic, setSelectedClinic] = useState("");
  const [clinicNumber, setClinicNumber] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("-");
  const [adminFilter, setAdminFilter] = useState<'pending' | 'completed' | 'all' | 'cancelled'>('pending');
  const [activeAdIndex, setActiveAdIndex] = useState(0);
  
  const prevOrdersRef = useRef<string[]>([]);
  const adCarouselTimerRef = useRef<number | null>(null);

  const filteredMenuItems = useMemo(() => {
    if (activeCategory === 'all') return MENU_ITEMS;
    return MENU_ITEMS.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const stats = useMemo(() => ({
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    total: orders.length
  }), [orders]);

  const getRoomsForFloor = (floor: string) => {
    if (floor === "0") return Array.from({ length: 21 }, (_, i) => `G${(i + 1).toString().padStart(2, '0')}`);
    if (floor === "1") return Array.from({ length: 25 }, (_, i) => `F${(i + 1).toString().padStart(2, '0')}`);
    if (floor === "2") return Array.from({ length: 25 }, (_, i) => `S${(i + 1).toString().padStart(2, '0')}`);
    if (floor === "3") return Array.from({ length: 25 }, (_, i) => (301 + i).toString());
    return [];
  };

  const availableRooms = useMemo(() => getRoomsForFloor(floorNumber), [floorNumber]);

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

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}?cb=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const validData = Array.isArray(data) ? data : [];
        setOrders(validData);
        setLastSyncTime(new Date().toLocaleTimeString('ar-EG'));
        return validData;
      }
    } catch (e) { console.warn("Sync error"); }
    return null;
  };

  const saveOrders = async (data: Order[]) => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(data.slice(-100)),
        headers: { 'Content-Type': 'application/json' }
      });
      return true;
    } catch (e) { return false; }
  };

  useEffect(() => {
    fetchOrders();
    const timer = setInterval(fetchOrders, view === 'admin' ? 5000 : 30000);
    return () => clearInterval(timer);
  }, [view]);

  // Ad Carousel Logic
  useEffect(() => {
    adCarouselTimerRef.current = window.setInterval(() => {
      setActiveAdIndex(prev => (prev + 1) % DOCTOR_ADS.length);
    }, 5000);
    return () => { if (adCarouselTimerRef.current) clearInterval(adCarouselTimerRef.current); };
  }, []);

  const cartTotalPrice = useMemo(() => 
    (Object.values(cart) as CartItem[]).reduce((sum: number, item) => sum + (item.drink.price * item.quantity), 0), [cart]);

  const cartTotalItems = useMemo(() =>
    (Object.values(cart) as CartItem[]).reduce((sum: number, item) => sum + item.quantity, 0), [cart]);

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

  const handlePlaceOrder = async () => {
    if (!floorNumber || !clinicNumber || !contactInfo.trim()) { 
      alert("يرجى إكمال بيانات الموقع والاسم."); return; 
    }
    setIsPlacingOrder(true);
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 5).toUpperCase(),
      items: (Object.values(cart) as CartItem[]).map(i => ({ 
        drinkId: i.drink.id, 
        drinkName: i.drink.name, 
        quantity: i.quantity, 
        price: i.drink.price 
      })),
      totalPrice: cartTotalPrice,
      clinicName: selectedClinic || "غير محدد",
      clinicNumber,
      floorNumber,
      contactInfo,
      status: 'pending',
      timestamp: Date.now(),
      notes: orderNote
    };

    const currentOrders = await fetchOrders() || orders;
    const success = await saveOrders([...currentOrders, newOrder]);
    
    setIsPlacingOrder(false);
    if (success) {
      setCart({});
      setShowSuccessModal(true);
    } else {
      alert("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
    }
  };

  const handleWhatsAppConfirm = () => {
    const itemsText = (Object.values(cart) as CartItem[]).map(i => `${i.drink.name} x${i.quantity}`).join('\n');
    const text = `طلب جديد من تطبيق "بالهنا":\n\nالطلبات:\n${itemsText}\n\nالإجمالي: ${cartTotalPrice} ج.م\n\nالمكان:\nالدور: ${floorNumber}\nالعيادة/الغرفة: ${clinicNumber}\nالاسم: ${contactInfo}\nملاحظات: ${orderNote || 'لا يوجد'}`;
    window.open(`https://wa.me/${ORDER_WHATSAPP}?text=${encodeURIComponent(text)}`);
    handlePlaceOrder();
  };

  const updateOrderStatus = async (orderId: string, newStatus: 'completed' | 'cancelled') => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
    await saveOrders(updated);
  };

  const clearCompletedOrders = async () => {
    if (!confirm("هل أنت متأكد من مسح جميع الطلبات المكتملة والملغاة؟")) return;
    const pendingOnly = orders.filter(o => o.status === 'pending');
    setOrders(pendingOnly);
    await saveOrders(pendingOnly);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassInput === ADMIN_PASSWORD) {
      setView('admin');
      setShowAdminLogin(false);
      setAdminPassInput("");
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  if (view === 'admin') {
    const filteredOrders = orders
      .filter(o => adminFilter === 'all' ? true : o.status === adminFilter)
      .sort((a, b) => b.timestamp - a.timestamp);

    return (
      <div className={`min-h-screen ${COLORS.bgLight} p-4 md:p-8`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setView('menu')}
                className={`p-2 rounded-full ${COLORS.surface} shadow-sm border ${COLORS.border} ${COLORS.accent}`}
              >
                <Icons.ArrowRight />
              </button>
              <div>
                <h1 className={`text-2xl font-bold ${COLORS.textMain}`}>لوحة التحكم - بالهنا</h1>
                <p className={COLORS.textMuted}>آخر مزامنة: {lastSyncTime}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={clearCompletedOrders}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold border border-red-100 flex items-center gap-2"
              >
                <Icons.Trash /> مسح السجل
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'قيد التنفيذ', count: stats.pending, key: 'pending', color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'مكتمل', count: stats.completed, key: 'completed', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'ملغي', count: stats.cancelled, key: 'cancelled', color: 'text-gray-500', bg: 'bg-gray-50' },
              { label: 'الكل', count: stats.total, key: 'all', color: COLORS.accent, bg: COLORS.accentBg }
            ].map(s => (
              <button 
                key={s.key}
                onClick={() => setAdminFilter(s.key as any)}
                className={`p-4 rounded-xl border transition-all ${s.bg} ${adminFilter === s.key ? 'ring-2 ring-offset-2 ring-amber-400 border-transparent shadow-md' : 'border-transparent shadow-sm opacity-80'}`}
              >
                <div className={`text-sm font-semibold mb-1 ${s.color}`}>{s.label}</div>
                <div className="text-2xl font-bold">{s.count}</div>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className={`p-12 text-center rounded-2xl ${COLORS.surface} border-2 border-dashed ${COLORS.border}`}>
                <div className="text-4xl mb-4">📜</div>
                <p className={COLORS.textMuted}>لا توجد طلبات في هذا القسم حالياً</p>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className={`${COLORS.surface} rounded-2xl p-6 shadow-sm border ${COLORS.border} transition-all`}>
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${COLORS.primary} text-white`}>#{order.id}</span>
                        <span className={`text-sm ${COLORS.textMuted}`}>{new Date(order.timestamp).toLocaleTimeString('ar-EG')}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                        <Icons.User /> {order.contactInfo}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-1 rounded-full w-fit">
                        <Icons.MapPin />
                        الدور {order.floorNumber} - غرفة/عيادة {order.clinicNumber}
                      </div>
                    </div>
                    
                    <div className="text-left">
                      <div className={`text-2xl font-bold ${COLORS.accent}`}>{order.totalPrice} <span className="text-sm font-normal">ج.م</span></div>
                      {order.status === 'pending' && (
                        <div className="flex gap-2 mt-3">
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="bg-emerald-500 text-white p-2 rounded-lg shadow-sm hover:bg-emerald-600 transition-colors"
                          >
                            <Icons.Check />
                          </button>
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="bg-red-500 text-white p-2 rounded-lg shadow-sm hover:bg-red-600 transition-colors"
                          >
                            <Icons.Trash />
                          </button>
                        </div>
                      )}
                      {order.status !== 'pending' && (
                         <span className={`text-sm px-3 py-1 rounded-full font-bold ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                           {order.status === 'completed' ? 'تم التوصيل' : 'تم الإلغاء'}
                         </span>
                      )}
                    </div>
                  </div>

                  <div className={`border-t ${COLORS.border} pt-4`}>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center text-sm">
                          <span className="font-semibold">{item.drinkName} <span className="text-amber-600">×{item.quantity}</span></span>
                          <span className={COLORS.textMuted}>{item.price * item.quantity} ج.م</span>
                        </li>
                      ))}
                    </ul>
                    {order.notes && (
                      <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-100 italic">
                        " {order.notes} "
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${COLORS.bgLight} flex flex-col pb-20`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${COLORS.primary} text-white shadow-xl`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Logo" className="w-12 h-12 rounded-full border-2 border-amber-500 shadow-lg object-cover" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">بالهنا</h1>
              <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-widest">Hana Medical Center</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowAdminLogin(true)}
              className="p-2.5 rounded-full hover:bg-white/10 transition-colors"
              title="لوحة الإدارة"
            >
              <Icons.User />
            </button>
            <button 
              onClick={() => setView('cart')}
              className={`relative ${COLORS.secondary} p-2.5 rounded-full shadow-lg ${COLORS.secondaryHover} transition-transform active:scale-90`}
            >
              <Icons.ShoppingCart />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-amber-700 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {cartTotalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {view === 'menu' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Ad Carousel */}
            <div className="relative overflow-hidden rounded-2xl shadow-xl border border-white/50 h-32 md:h-40 bg-white">
              <div className="absolute inset-0 transition-opacity duration-1000 flex items-center">
                <img 
                  src={DOCTOR_ADS[activeAdIndex].image} 
                  alt={DOCTOR_ADS[activeAdIndex].name} 
                  className="w-24 h-full object-cover"
                />
                <div className="p-4 flex-1">
                  <div className="text-[10px] text-amber-600 font-bold mb-1">إعلان عيادة</div>
                  <h3 className="font-bold text-lg leading-tight">{DOCTOR_ADS[activeAdIndex].name}</h3>
                  <p className="text-xs text-gray-500 mb-1">{DOCTOR_ADS[activeAdIndex].specialty}</p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Icons.MapPin /> {DOCTOR_ADS[activeAdIndex].location}
                  </p>
                </div>
                <div className="px-4 border-r flex flex-col justify-center items-center">
                   <button 
                    onClick={() => window.open(`https://wa.me/${ADS_WHATSAPP}`)}
                    className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                   >
                     <Icons.WhatsApp />
                   </button>
                   <span className="text-[8px] mt-1 text-emerald-700 font-bold">احجز</span>
                </div>
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {DOCTOR_ADS.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeAdIndex ? 'bg-amber-600 w-4' : 'bg-gray-200'}`} />
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar -mx-4 px-4 sticky top-16 z-40 bg-[#FDF8F3]/80 backdrop-blur-sm">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
                    activeCategory === cat.id 
                    ? `${COLORS.secondary} text-white scale-105 shadow-amber-200` 
                    : `${COLORS.surface} ${COLORS.textMain} border ${COLORS.border} hover:border-amber-400`
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredMenuItems.map(item => (
                <div key={item.id} className={`${COLORS.surface} rounded-2xl overflow-hidden shadow-md border ${COLORS.border} group hover:shadow-xl transition-all hover:-translate-y-1`}>
                  <div className="relative h-32 md:h-44 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-2 left-2 bg-white/95 px-2 py-1 rounded-lg text-xs font-bold shadow-md">
                      {item.price} ج.م
                    </div>
                  </div>
                  <div className="p-3 md:p-4 text-center">
                    <h3 className="font-bold text-sm md:text-base mb-3 line-clamp-1">{item.name}</h3>
                    {cart[item.id] ? (
                      <div className="flex items-center justify-between bg-amber-50 p-1 rounded-xl border border-amber-100">
                        <button 
                          onClick={() => updateCart(item, -1)}
                          className={`${COLORS.secondary} text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-sm`}
                        >
                          <Icons.Minus />
                        </button>
                        <span className="font-bold text-amber-800">{cart[item.id].quantity}</span>
                        <button 
                          onClick={() => updateCart(item, 1)}
                          className={`${COLORS.secondary} text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-sm`}
                        >
                          <Icons.Plus />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => updateCart(item, 1)}
                        className={`w-full py-2 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${COLORS.primary} text-white shadow-md active:scale-95`}
                      >
                        <Icons.Plus /> أضف للسلة
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="animate-slideIn max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <button 
                onClick={() => setView('menu')}
                className={`p-2 rounded-full ${COLORS.surface} shadow-sm border ${COLORS.border} ${COLORS.accent}`}
              >
                <Icons.ArrowRight />
              </button>
              <h2 className="text-2xl font-bold">مراجعة الطلب</h2>
            </div>

            {Object.values(cart).length === 0 ? (
              <div className={`p-12 text-center rounded-2xl ${COLORS.surface} border-2 border-dashed ${COLORS.border}`}>
                <div className="text-6xl mb-6 grayscale">☕</div>
                <h3 className="text-xl font-bold mb-2">سلة المشتريات فارغة</h3>
                <p className={`${COLORS.textMuted} mb-8`}>لم تقم بإضافة أي مشروبات بعد.</p>
                <button 
                  onClick={() => setView('menu')}
                  className={`${COLORS.primary} text-white px-8 py-3 rounded-2xl font-bold shadow-lg`}
                >
                  العودة للقائمة
                </button>
              </div>
            ) : (
              <>
                <div className={`${COLORS.surface} rounded-2xl shadow-lg border ${COLORS.border} overflow-hidden`}>
                  <div className="p-6 space-y-4">
                    {(Object.values(cart) as CartItem[]).map(item => (
                      <div key={item.drink.id} className="flex items-center justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-4">
                          <img src={item.drink.image} alt={item.drink.name} className="w-14 h-14 rounded-xl object-cover shadow-sm border border-gray-100" />
                          <div>
                            <h4 className="font-bold">{item.drink.name}</h4>
                            <p className="text-xs text-amber-600 font-bold">{item.drink.price} ج.م</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl">
                          <button onClick={() => updateCart(item.drink, -1)} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-red-500 font-bold hover:bg-red-50 transition-colors">
                            <Icons.Minus />
                          </button>
                          <span className="font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateCart(item.drink, 1)} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-emerald-500 font-bold hover:bg-emerald-50 transition-colors">
                            <Icons.Plus />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`${COLORS.accentBg} p-4 flex justify-between items-center px-6`}>
                    <span className="font-bold">الإجمالي الكلي</span>
                    <span className={`text-2xl font-black ${COLORS.accent}`}>{cartTotalPrice} <span className="text-sm">ج.م</span></span>
                  </div>
                </div>

                <div className={`${COLORS.surface} rounded-2xl shadow-lg border ${COLORS.border} p-6 space-y-5`}>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Icons.MapPin /> تفاصيل التوصيل
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 block mr-1">الدور</label>
                      <select 
                        value={floorNumber} 
                        onChange={(e) => { setFloorNumber(e.target.value); setClinicNumber(""); }}
                        className={`w-full p-4 rounded-xl border ${COLORS.border} ${COLORS.textMain} font-bold focus:ring-2 focus:ring-amber-500 outline-none appearance-none bg-white`}
                      >
                        <option value="">اختر الدور</option>
                        <option value="0">الدور الأرضي</option>
                        <option value="1">الدور الأول</option>
                        <option value="2">الدور الثاني</option>
                        <option value="3">الدور الثالث</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 block mr-1">الغرفة / العيادة</label>
                      <select 
                        disabled={!floorNumber}
                        value={clinicNumber}
                        onChange={(e) => setClinicNumber(e.target.value)}
                        className={`w-full p-4 rounded-xl border ${COLORS.border} ${COLORS.textMain} font-bold focus:ring-2 focus:ring-amber-500 outline-none appearance-none disabled:opacity-50 bg-white`}
                      >
                        <option value="">اختر الرقم</option>
                        {availableRooms.map(room => (
                          <option key={room} value={room}>{room}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 block mr-1">الاسم / المكان (مثال: عيادة الرمد)</label>
                    <input 
                      type="text" 
                      placeholder="من فضلك أدخل الاسم أو اسم العيادة..."
                      value={contactInfo} 
                      onChange={(e) => setContactInfo(e.target.value)}
                      className={`w-full p-4 rounded-xl border ${COLORS.border} focus:ring-2 focus:ring-amber-500 outline-none font-semibold`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 block mr-1">ملاحظات إضافية (اختياري)</label>
                    <textarea 
                      placeholder="مثلاً: سكر زيادة، بارد جداً، بدون غطاء..."
                      value={orderNote} 
                      onChange={(e) => setOrderNote(e.target.value)}
                      className={`w-full p-4 rounded-xl border ${COLORS.border} focus:ring-2 focus:ring-amber-500 outline-none font-semibold h-24 resize-none`}
                    />
                  </div>

                  <div className="pt-2 flex flex-col gap-3">
                    <button 
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder || !floorNumber || !clinicNumber || !contactInfo}
                      className={`w-full py-4 rounded-2xl text-white font-black text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 ${COLORS.primary}`}
                    >
                      {isPlacingOrder ? 'جاري الإرسال...' : 'تأكيد الطلب الآن'}
                    </button>
                    
                    <button 
                      onClick={handleWhatsAppConfirm}
                      disabled={!floorNumber || !clinicNumber || !contactInfo}
                      className="w-full py-3 rounded-2xl text-emerald-600 font-bold border-2 border-emerald-500/30 flex items-center justify-center gap-2 hover:bg-emerald-50 disabled:opacity-50"
                    >
                      <Icons.WhatsApp /> تأكيد عبر واتساب (أسرع)
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Cart Quick Access Bar */}
      {view === 'menu' && cartTotalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-bounceIn">
          <button 
            onClick={() => setView('cart')}
            className={`max-w-xl mx-auto w-full ${COLORS.primary} text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border-2 border-amber-500/30 active:scale-95 transition-transform`}
          >
            <div className="flex items-center gap-4">
              <div className="bg-amber-500 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black">
                {cartTotalItems}
              </div>
              <div className="text-right">
                <div className="font-black">عرض سلة المشتريات</div>
                <div className="text-[10px] text-amber-400 font-bold">جاهز لإرسال الطلب</div>
              </div>
            </div>
            <div className="text-xl font-black">{cartTotalPrice} ج.م</div>
          </button>
        </div>
      )}

      {/* Modals */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full text-center shadow-2xl border border-amber-100">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icons.Check />
            </div>
            <h2 className="text-2xl font-black mb-2">تم استلام طلبك!</h2>
            <p className="text-gray-500 mb-8 font-semibold">مشروبك المفضل في طريقه إليك الآن بكل حب.</p>
            <button 
              onClick={() => { setShowSuccessModal(false); setView('menu'); }}
              className={`w-full py-4 rounded-2xl ${COLORS.primary} text-white font-bold shadow-lg shadow-amber-900/20 active:scale-95 transition-transform`}
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      )}

      {showAdminLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">دخول المشرف</h2>
              <button onClick={() => {setShowAdminLogin(false); setLoginError(false);}} className="text-gray-400 hover:text-red-500 transition-colors">
                <Icons.XCircle />
              </button>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 mr-1">كلمة المرور الخاصة بالإدارة</label>
                <input 
                  autoFocus
                  type="password" 
                  value={adminPassInput} 
                  onChange={(e) => {setAdminPassInput(e.target.value); setLoginError(false);}}
                  className={`w-full p-4 rounded-2xl border ${loginError ? 'border-red-500 animate-shake' : COLORS.border} focus:ring-2 focus:ring-amber-500 outline-none font-bold text-center tracking-widest`}
                  placeholder="••••••••"
                />
                {loginError && <p className="text-red-500 text-[10px] font-bold mt-1 text-center">كلمة المرور غير صحيحة، حاول مجدداً.</p>}
              </div>
              <button 
                type="submit"
                className={`w-full py-4 rounded-2xl ${COLORS.primary} text-white font-bold shadow-xl active:scale-95 transition-transform`}
              >
                تأكيد الدخول
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="mt-auto py-12 px-4 text-center">
        <div className="flex flex-col items-center gap-4 mb-6">
          <img src={LOGO_URL} alt="Bal Hana" className="w-16 grayscale opacity-20" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400">جميع الحقوق محفوظة &copy; {new Date().getFullYear()}</p>
            <p className="text-[10px] font-black tracking-widest text-amber-500/50 uppercase">Created by Dr Ahmed Elmosalamy</p>
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
           <a href={`mailto:${ADMIN_EMAIL}`} className="text-gray-400 hover:text-amber-600 transition-colors"><Icons.Mail /></a>
           <a href={`https://wa.me/${ADS_WHATSAPP}`} className="text-gray-400 hover:text-emerald-500 transition-colors"><Icons.WhatsApp /></a>
        </div>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounceIn { 
          0% { transform: scale(0.9); opacity: 0; } 
          70% { transform: scale(1.05); } 
          100% { transform: scale(1); opacity: 1; } 
        }
        @keyframes shake { 
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-slideIn { animation: slideIn 0.5s ease-out; }
        .animate-bounceIn { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default App;
