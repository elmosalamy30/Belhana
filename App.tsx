
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MENU_ITEMS, DOCTOR_ADS, ADMIN_PASSWORD, ADS_WHATSAPP, ORDER_WHATSAPP, ADMIN_EMAIL } from './constants';
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
  
  const adCarouselTimerRef = useRef<number | null>(null);

  const filteredMenuItems = useMemo(() => {
    if (activeCategory === 'all') return MENU_ITEMS;
    return MENU_ITEMS.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => o.status === 'completed' ? sum + o.totalPrice : sum, 0);
    return {
      pending: orders.filter(o => o.status === 'pending').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      total: orders.length,
      revenue: totalRevenue
    };
  }, [orders]);

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
        body: JSON.stringify(data.slice(-500)), // حفظ سجل أكبر للجرد
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

  const resetAdTimer = () => {
    if (adCarouselTimerRef.current) clearInterval(adCarouselTimerRef.current);
    adCarouselTimerRef.current = window.setInterval(() => {
      setActiveAdIndex(prev => (prev + 1) % DOCTOR_ADS.length);
    }, 5000);
  };

  useEffect(() => {
    resetAdTimer();
    return () => { if (adCarouselTimerRef.current) clearInterval(adCarouselTimerRef.current); };
  }, []);

  const cartTotalPrice = useMemo(() => 
    (Object.values(cart) as CartItem[]).reduce((sum, item) => sum + (item.drink.price * item.quantity), 0), [cart]);

  const cartTotalItems = useMemo(() =>
    (Object.values(cart) as CartItem[]).reduce((sum, item) => sum + item.quantity, 0), [cart]);

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
      alert("يرجى إكمال جميع بيانات التوصيل قبل التأكيد.");
      return; 
    }

    const currentCartItems = Object.values(cart) as CartItem[];
    if (currentCartItems.length === 0) return;

    setIsPlacingOrder(true);

    try {
      const orderId = Math.random().toString(36).substr(2, 5).toUpperCase();
      
      const newOrder: Order = {
        id: orderId,
        items: currentCartItems.map(i => ({ 
          drinkId: i.drink.id, 
          drinkName: i.drink.name, 
          quantity: i.quantity, 
          price: i.drink.price 
        })),
        totalPrice: cartTotalPrice,
        clinicName: contactInfo,
        clinicNumber,
        floorNumber,
        contactInfo,
        status: 'pending',
        timestamp: Date.now(),
        notes: orderNote
      };

      const currentOrders = await fetchOrders() || orders;
      const success = await saveOrders([...currentOrders, newOrder]);

      if (success) {
        const itemsText = currentCartItems.map(i => `• ${i.drink.name} (عدد ${i.quantity})`).join('\n');
        const summary = `*طلب جديد من تطبيق بالهنا (#${orderId})*\n\n` +
                        `*التفاصيل:*\n${itemsText}\n\n` +
                        `*الإجمالي:* ${cartTotalPrice} ج.م\n\n` +
                        `*الموقع:*\n` +
                        `- الدور: ${floorNumber}\n` +
                        `- الرقم: ${clinicNumber}\n` +
                        `- الاسم/المكان: ${contactInfo}\n` +
                        (orderNote ? `- ملاحظات: ${orderNote}` : '');

        // إرسال واتساب
        const whatsappUrl = `https://wa.me/${ORDER_WHATSAPP}?text=${encodeURIComponent(summary)}`;
        window.open(whatsappUrl, '_blank');

        // إرسال بريد
        const subject = `طلب جديد - بالهنا - #${orderId}`;
        const mailtoLink = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary.replace(/\*/g, ''))}`;
        
        setTimeout(() => { window.location.href = mailtoLink; }, 1000);
        
        setCart({});
        setIsPlacingOrder(false);
        setShowSuccessModal(true);
      }
    } catch (e) {
      alert("حدث خطأ، حاول مرة أخرى.");
      setIsPlacingOrder(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: 'completed' | 'cancelled') => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
    await saveOrders(updated);
  };

  const exportInventory = () => {
    const headers = ["رقم الطلب", "التاريخ", "الاسم/المكان", "الدور", "الغرفة", "التفاصيل", "الإجمالي", "الحالة"];
    const rows = orders.map(o => [
        o.id,
        new Date(o.timestamp).toLocaleString('ar-EG'),
        o.contactInfo,
        o.floorNumber,
        o.clinicNumber,
        o.items.map(i => `${i.drinkName} x${i.quantity}`).join(' | '),
        o.totalPrice,
        o.status === 'completed' ? 'مكتمل' : o.status === 'pending' ? 'قيد التنفيذ' : 'ملغي'
    ]);

    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `جرد_بالهنا_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassInput === ADMIN_PASSWORD) {
      setView('admin');
      setShowAdminLogin(false);
      setAdminPassInput("");
      setLoginError(false);
    } else { setLoginError(true); }
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
              <button onClick={() => setView('menu')} className={`p-2 rounded-full ${COLORS.surface} shadow-sm border ${COLORS.border} ${COLORS.accent}`}><Icons.ArrowRight /></button>
              <div>
                <h1 className={`text-2xl font-bold ${COLORS.textMain}`}>نظام إدارة بالهنا</h1>
                <p className={COLORS.textMuted}>آخر مزامنة: {lastSyncTime}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={exportInventory} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg"><Icons.Download /> تحميل سجل الجرد</button>
              <button onClick={() => { if(confirm("مسح السجل المكتمل؟")) saveOrders(orders.filter(o => o.status === 'pending')); }} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2"><Icons.Trash /> مسح السجل</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className={`p-4 rounded-2xl shadow-sm border border-transparent ${COLORS.surface}`}>
              <div className="text-xs font-bold text-gray-400 mb-1">إجمالي المبيعات</div>
              <div className="text-2xl font-black text-amber-700">{stats.revenue} <span className="text-xs">ج.م</span></div>
            </div>
            {[
              { label: 'قيد التنفيذ', count: stats.pending, key: 'pending', color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'مكتمل', count: stats.completed, key: 'completed', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'ملغي', count: stats.cancelled, key: 'cancelled', color: 'text-gray-500', bg: 'bg-gray-50' },
              { label: 'الكل', count: stats.total, key: 'all', color: COLORS.accent, bg: COLORS.accentBg }
            ].map(s => (
              <button key={s.key} onClick={() => setAdminFilter(s.key as any)} className={`p-4 rounded-2xl border transition-all text-right ${s.bg} ${adminFilter === s.key ? 'ring-2 ring-amber-400' : 'opacity-80'}`}>
                <div className={`text-xs font-bold mb-1 ${s.color}`}>{s.label}</div>
                <div className="text-xl font-black">{s.count}</div>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className={`p-12 text-center rounded-2xl ${COLORS.surface} border-2 border-dashed ${COLORS.border}`}><p className={COLORS.textMuted}>لا توجد بيانات حالياً</p></div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className={`${COLORS.surface} rounded-2xl p-6 shadow-sm border ${COLORS.border}`}>
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${COLORS.primary} text-white`}>#{order.id}</span>
                        <span className={`text-[11px] ${COLORS.textMuted}`}>{new Date(order.timestamp).toLocaleString('ar-EG')}</span>
                      </div>
                      <h3 className="text-lg font-bold flex items-center gap-2"><Icons.User /> {order.contactInfo}</h3>
                      <div className="text-sm text-amber-700 bg-amber-50 px-3 py-1 rounded-full w-fit mt-1">الدور {order.floorNumber} - غرفة {order.clinicNumber}</div>
                    </div>
                    <div className="text-left">
                      <div className="text-xl font-black text-amber-600">{order.totalPrice} ج.م</div>
                      {order.status === 'pending' && (
                        <button onClick={() => updateOrderStatus(order.id, 'completed')} className="mt-2 bg-emerald-500 text-white p-2 rounded-lg shadow-sm hover:bg-emerald-600 transition-colors"><Icons.Check /></button>
                      )}
                    </div>
                  </div>
                  <div className={`border-t ${COLORS.border} pt-4`}>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-sm"><span className="font-bold">{item.drinkName} <span className="text-amber-600">×{item.quantity}</span></span></li>
                      ))}
                    </ul>
                    {order.notes && <div className="mt-3 p-3 bg-blue-50 text-blue-800 text-xs rounded-lg italic">"{order.notes}"</div>}
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
      <header className={`sticky top-0 z-50 ${COLORS.primary} text-white shadow-xl`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Logo" className="w-10 h-10 rounded-full border-2 border-amber-500 object-cover" />
            <div><h1 className="text-lg font-bold">بالهنا</h1><p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest">Hana Medical Center</p></div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAdminLogin(true)} className="p-2 rounded-full hover:bg-white/10"><Icons.User /></button>
            <button onClick={() => setView('cart')} className={`relative ${COLORS.secondary} p-2 rounded-full shadow-lg`}>
              <Icons.ShoppingCart />
              {cartTotalItems > 0 && <span className="absolute -top-1 -right-1 bg-white text-amber-700 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">{cartTotalItems}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {view === 'menu' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="relative overflow-hidden rounded-2xl shadow-lg border border-white h-28 bg-white group">
              <div className="absolute inset-0 flex items-center px-6">
                <img src={DOCTOR_ADS[activeAdIndex].image} className="w-16 h-16 rounded-full object-cover border-2 border-amber-100" />
                <div className="p-4 flex-1">
                  <h3 className="font-bold text-sm leading-tight">{DOCTOR_ADS[activeAdIndex].name}</h3>
                  <p className="text-[10px] text-gray-500">{DOCTOR_ADS[activeAdIndex].specialty}</p>
                </div>
                <button onClick={() => window.open(`https://wa.me/${ADS_WHATSAPP}`)} className="p-2 rounded-full bg-emerald-50 text-emerald-600"><Icons.WhatsApp /></button>
              </div>
            </div>

            <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar -mx-4 px-4 sticky top-14 z-40 bg-[#FDF8F3]/90 backdrop-blur-md">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${activeCategory === cat.id ? `${COLORS.secondary} text-white` : `${COLORS.surface} border ${COLORS.border}`}`}>{cat.label}</button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {filteredMenuItems.map(item => (
                <div key={item.id} className={`${COLORS.surface} rounded-xl overflow-hidden shadow-sm border ${COLORS.border} group`}>
                  <div className="relative h-28 overflow-hidden"><img src={item.image} className="w-full h-full object-cover" /><div className="absolute top-1 left-1 bg-white/95 px-2 py-0.5 rounded text-[10px] font-bold">{item.price} ج.م</div></div>
                  <div className="p-2 text-center">
                    <h3 className="font-bold text-[11px] mb-2 truncate">{item.name}</h3>
                    {cart[item.id] ? (
                      <div className="flex items-center justify-between bg-amber-50 p-1 rounded-lg">
                        <button onClick={() => updateCart(item, -1)} className={`${COLORS.secondary} text-white w-6 h-6 rounded flex items-center justify-center`}><Icons.Minus /></button>
                        <span className="font-bold text-xs">{cart[item.id].quantity}</span>
                        <button onClick={() => updateCart(item, 1)} className={`${COLORS.secondary} text-white w-6 h-6 rounded flex items-center justify-center`}><Icons.Plus /></button>
                      </div>
                    ) : (
                      <button onClick={() => updateCart(item, 1)} className={`w-full py-1.5 rounded-lg text-[10px] font-bold ${COLORS.primary} text-white`}>إضافة</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-4"><button onClick={() => setView('menu')} className={`p-2 rounded-full ${COLORS.surface} border ${COLORS.border}`}><Icons.ArrowRight /></button><h2 className="text-xl font-bold">مراجعة الطلب</h2></div>
            {Object.values(cart).length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white border-2 border-dashed"><h3 className="font-bold">السلة فارغة</h3></div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    {(Object.values(cart) as CartItem[]).map(item => (
                      <div key={item.drink.id} className="flex justify-between py-2 border-b last:border-0">
                        <span className="font-bold text-sm">{item.drink.name} (x{item.quantity})</span>
                        <span className="text-amber-600 font-bold text-sm">{item.drink.price * item.quantity} ج.م</span>
                      </div>
                    ))}
                    <div className="mt-4 pt-4 border-t flex justify-between font-black text-lg"><span>الإجمالي</span><span>{cartTotalPrice} ج.م</span></div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <h3 className="font-bold text-sm flex items-center gap-2"><Icons.MapPin /> بيانات التوصيل</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <select value={floorNumber} onChange={(e) => { setFloorNumber(e.target.value); setClinicNumber(""); }} className="p-3 rounded-xl border border-gray-100 text-xs font-bold">
                        <option value="">اختر الدور</option><option value="0">الأرضي</option><option value="1">الأول</option><option value="2">الثاني</option><option value="3">الثالث</option>
                    </select>
                    <select disabled={!floorNumber} value={clinicNumber} onChange={(e) => setClinicNumber(e.target.value)} className="p-3 rounded-xl border border-gray-100 text-xs font-bold">
                        <option value="">اختر الرقم</option>{availableRooms.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <input type="text" placeholder="الاسم / المكان (مثال: عيادة الرمد)" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} className="w-full p-3 rounded-xl border border-gray-100 text-xs font-bold" />
                  <textarea placeholder="ملاحظات الطلب..." value={orderNote} onChange={(e) => setOrderNote(e.target.value)} className="w-full p-3 rounded-xl border border-gray-100 text-xs font-bold h-16" />
                  
                  <button onClick={handleConfirmOrder} disabled={isPlacingOrder} className={`w-full py-4 rounded-xl text-white font-black text-lg shadow-xl flex flex-col items-center gap-1 ${COLORS.primary}`}>
                    <span>تأكيد الطلب وإرسال التنبيهات</span>
                    <div className="flex gap-2 opacity-70"><Icons.WhatsApp /><Icons.Mail /></div>
                  </button>
                  <p className="text-[10px] text-center text-gray-400 font-bold">سيتم إرسال نسخة عبر واتساب وبريد الإدارة تلقائياً</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {view === 'menu' && cartTotalItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <button onClick={() => setView('cart')} className={`max-w-xl mx-auto w-full ${COLORS.primary} text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between`}>
            <div className="flex items-center gap-3"><div className="bg-amber-500 text-white px-3 py-1 rounded-lg font-black">{cartTotalItems}</div><span className="font-bold text-sm">عرض السلة</span></div>
            <div className="font-black">{cartTotalPrice} ج.م</div>
          </button>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"><Icons.Check /></div>
            <h2 className="text-xl font-black mb-2">تم تسجيل طلبك!</h2>
            <p className="text-gray-500 text-xs font-bold mb-6">تم إرسال التنبيهات اللازمة وجاري التحضير.</p>
            <button onClick={() => { setShowSuccessModal(false); setView('menu'); }} className={`w-full py-3 rounded-xl ${COLORS.primary} text-white font-bold`}>العودة للرئيسية</button>
          </div>
        </div>
      )}

      {showAdminLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4"><h2 className="font-bold">دخول الإدارة</h2><button onClick={() => setShowAdminLogin(false)}><Icons.XCircle /></button></div>
            <form onSubmit={handleAdminLogin} className="space-y-3">
              <input autoFocus type="password" value={adminPassInput} onChange={(e) => setAdminPassInput(e.target.value)} className="w-full p-3 rounded-xl border font-bold text-center" placeholder="كلمة المرور" />
              <button type="submit" className={`w-full py-3 rounded-xl ${COLORS.primary} text-white font-bold`}>دخول</button>
            </form>
          </div>
        </div>
      )}

      <footer className="mt-auto py-8 text-center text-gray-400">
        <p className="text-[10px] font-bold uppercase tracking-widest">Created by Dr Ahmed Elmosalamy</p>
      </footer>
    </div>
  );
};

export default App;
