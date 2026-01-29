
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MENU_ITEMS, DOCTOR_ADS, ADMIN_PASSWORD, ADS_WHATSAPP, ORDER_WHATSAPP, ADMIN_EMAIL } from './constants';
import { Drink, Order, OrderItem, CLINICS, DoctorAd, DrinkCategory } from './types';

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
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

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
        body: JSON.stringify(data.slice(-1000)), // زيادة مساحة الجرد التاريخية
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

  const nextAd = () => setActiveAdIndex(prev => (prev + 1) % DOCTOR_ADS.length);
  const prevAd = () => setActiveAdIndex(prev => (prev - 1 + DOCTOR_ADS.length) % DOCTOR_ADS.length);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.targetTouches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) > 50) distance > 0 ? nextAd() : prevAd();
    touchStartX.current = 0; touchEndX.current = 0;
  };

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
      const timestampString = new Date().toLocaleString('ar-EG');
      
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
        const itemsText = currentCartItems.map(i => `${i.drink.name} (×${i.quantity})`).join(', ');
        
        // 1. الإرسال إلى الجيميل عبر FormSubmit (الوجهة: scs.info.official@gmail.com)
        const formPayload = {
          _subject: `📍 طلب جديد من بالهنا - #${orderId}`,
          _template: 'table',
          _captcha: 'false',
          "رقم الطلب": `#${orderId}`,
          "الاسم/العيادة": contactInfo,
          "الموقع": `الدور ${floorNumber} - غرفة ${clinicNumber}`,
          "الطلبات": itemsText,
          "الإجمالي": `${cartTotalPrice} ج.م`,
          "الملاحظات": orderNote || 'لا يوجد',
          "وقت الطلب": timestampString
        };

        try {
          await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(formPayload)
          });
        } catch (mailError) { console.error("Mail service error:", mailError); }

        // 2. إرسال واتساب (لتنبيه مسؤول التوصيل)
        const whatsappMsg = `*طلب جديد من تطبيق بالهنا (#${orderId})*\n\n` +
                        `*التفاصيل:*\n${currentCartItems.map(i => `• ${i.drink.name} (عدد ${i.quantity})`).join('\n')}\n\n` +
                        `*الإجمالي:* ${cartTotalPrice} ج.م\n\n` +
                        `*الموقع:*\n` +
                        `- الدور: ${floorNumber}\n` +
                        `- الرقم: ${clinicNumber}\n` +
                        `- الاسم/المكان: ${contactInfo}\n` +
                        (orderNote ? `- ملاحظات: ${orderNote}` : '');

        const whatsappUrl = `https://wa.me/${ORDER_WHATSAPP}?text=${encodeURIComponent(whatsappMsg)}`;
        window.open(whatsappUrl, '_blank');
        
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
    link.setAttribute("download", `جرد_مبيعات_بالهنا_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassInput === ADMIN_PASSWORD) {
      setView('admin'); setShowAdminLogin(false); setAdminPassInput(""); setLoginError(false);
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
                <h1 className={`text-2xl font-bold ${COLORS.textMain}`}>إدارة بالهنا & الجرد</h1>
                <p className={COLORS.textMuted}>آخر مزامنة: {lastSyncTime}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={exportInventory} className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition-all"><Icons.Download /> تحميل سجل الجرد (Excel)</button>
              <button onClick={() => { if(confirm("هل أنت متأكد من مسح السجل المكتمل فقط؟")) saveOrders(orders.filter(o => o.status === 'pending')); }} className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2"><Icons.Trash /> تنظيف السجل</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8 text-center">
            <div className={`p-5 rounded-3xl shadow-sm border-2 border-amber-100 ${COLORS.surface}`}>
              <div className="text-[10px] font-black text-amber-900/40 uppercase mb-1">إجمالي المبيعات (جرد)</div>
              <div className="text-3xl font-black text-amber-700">{stats.revenue} <span className="text-sm">ج.م</span></div>
            </div>
            {[
              { label: 'قيد التنفيذ', count: stats.pending, key: 'pending', color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'مكتمل', count: stats.completed, key: 'completed', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'ملغي', count: stats.cancelled, key: 'cancelled', color: 'text-gray-500', bg: 'bg-gray-50' },
              { label: 'الكل', count: stats.total, key: 'all', color: COLORS.accent, bg: COLORS.accentBg }
            ].map(s => (
              <button key={s.key} onClick={() => setAdminFilter(s.key as any)} className={`p-5 rounded-3xl border transition-all ${s.bg} ${adminFilter === s.key ? 'ring-4 ring-amber-400/30 border-amber-400' : 'opacity-80'}`}>
                <div className={`text-[11px] font-black mb-1 ${s.color}`}>{s.label}</div>
                <div className="text-2xl font-black">{s.count}</div>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className={`p-20 text-center rounded-3xl ${COLORS.surface} border-4 border-dashed border-gray-100`}><p className={COLORS.textMuted}>لا توجد طلبات في هذا القسم حالياً</p></div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className={`${COLORS.surface} rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all`}>
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${COLORS.primary} text-white`}>طلب #{order.id}</span>
                        <span className={`text-[11px] font-bold ${COLORS.textMuted}`}>{new Date(order.timestamp).toLocaleString('ar-EG')}</span>
                      </div>
                      <h3 className="text-xl font-black flex items-center gap-2 text-amber-900"><Icons.User /> {order.contactInfo}</h3>
                      <div className="text-sm font-bold text-amber-700 bg-amber-50 px-4 py-1.5 rounded-full w-fit mt-2 border border-amber-100">الدور {order.floorNumber} — عيادة/غرفة {order.clinicNumber}</div>
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-black text-amber-600">{order.totalPrice} ج.م</div>
                      {order.status === 'pending' && (
                        <div className="flex gap-2 mt-3">
                            <button onClick={() => updateOrderStatus(order.id, 'completed')} className="bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-emerald-600 flex items-center gap-2 font-bold text-sm"><Icons.Check /> تم التوصيل</button>
                            <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="bg-red-50 text-red-500 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Icons.XCircle /></button>
                        </div>
                      )}
                      {order.status !== 'pending' && <span className={`text-xs font-black uppercase tracking-widest ${order.status === 'completed' ? 'text-emerald-500' : 'text-red-300'}`}>{order.status === 'completed' ? 'مكتمل' : 'ملغي'}</span>}
                    </div>
                  </div>
                  <div className={`border-t border-gray-50 pt-5 mt-2`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <ul className="space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-sm bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                               <span className="font-bold text-gray-700">{item.drinkName}</span>
                               <span className="font-black text-amber-600">×{item.quantity}</span>
                            </li>
                          ))}
                       </ul>
                       {order.notes && (
                         <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl">
                           <p className="text-[10px] text-blue-400 font-black uppercase mb-1">ملاحظات التحضير</p>
                           <p className="text-xs text-blue-800 font-bold leading-relaxed italic">"{order.notes}"</p>
                         </div>
                       )}
                    </div>
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
    <div className={`min-h-screen ${COLORS.bgLight} flex flex-col pb-24`}>
      <header className={`sticky top-0 z-50 ${COLORS.primary} text-white shadow-2xl`}>
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={LOGO_URL} alt="Logo" className="w-11 h-11 rounded-full border-2 border-amber-500/50 object-cover shadow-lg" />
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
          <div className="space-y-8 animate-fadeIn">
            {/* Promo Banner with Swipe */}
            <div 
              className="relative overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white h-32 bg-white group cursor-pointer"
              onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
            >
              <div className="absolute inset-0 flex items-center px-8 transition-all duration-700 ease-in-out">
                <div className="relative">
                  <img src={DOCTOR_ADS[activeAdIndex].image} className="w-18 h-18 rounded-3xl object-cover border-2 border-amber-100 shadow-md" />
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm">NEW</div>
                </div>
                <div className="p-5 flex-1">
                  <div className="text-[9px] text-amber-600 font-black mb-1 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-amber-600"></span> إعلان طبي</div>
                  <h3 className="font-black text-base text-amber-950 leading-tight mb-1">{DOCTOR_ADS[activeAdIndex].name}</h3>
                  <p className="text-[11px] text-gray-500 font-bold opacity-80">{DOCTOR_ADS[activeAdIndex].specialty}</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${ADS_WHATSAPP}`); }} className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"><Icons.WhatsApp /></button>
                  <span className="text-[9px] font-black text-emerald-800 uppercase">احجز</span>
                </div>
              </div>
              {/* Pagination Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {DOCTOR_ADS.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === activeAdIndex ? 'bg-amber-600 w-5' : 'bg-gray-200 w-1.5'}`} />
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar -mx-5 px-5 sticky top-[72px] z-40 bg-[#FDF8F3]/95 backdrop-blur-xl py-2">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex-shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[13px] font-black transition-all shadow-sm active:scale-95 ${activeCategory === cat.id ? `${COLORS.secondary} text-white shadow-amber-500/20` : `${COLORS.surface} border border-amber-100 text-amber-900`}`}>
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {filteredMenuItems.map(item => (
                <div key={item.id} className={`${COLORS.surface} rounded-[2rem] overflow-hidden shadow-sm border border-amber-50 group transition-all hover:shadow-xl hover:-translate-y-1`}>
                  <div className="relative h-32 overflow-hidden">
                    <img src={item.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-2 left-2 bg-white/95 px-3 py-1 rounded-full text-[11px] font-black shadow-lg text-amber-800 border border-amber-50">{item.price} ج.م</div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-black text-[13px] mb-3 truncate text-amber-950">{item.name}</h3>
                    {cart[item.id] ? (
                      <div className="flex items-center justify-between bg-amber-50 p-1.5 rounded-2xl border border-amber-100 shadow-inner">
                        <button onClick={() => updateCart(item, -1)} className={`${COLORS.secondary} text-white w-7 h-7 rounded-xl flex items-center justify-center active:scale-75 shadow-sm`}><Icons.Minus /></button>
                        <span className="font-black text-sm text-amber-900">{cart[item.id].quantity}</span>
                        <button onClick={() => updateCart(item, 1)} className={`${COLORS.secondary} text-white w-7 h-7 rounded-xl flex items-center justify-center active:scale-75 shadow-sm`}><Icons.Plus /></button>
                      </div>
                    ) : (
                      <button onClick={() => updateCart(item, 1)} className={`w-full py-2.5 rounded-2xl text-[12px] font-black ${COLORS.primary} text-white active:scale-95 shadow-lg shadow-amber-900/10 hover:bg-amber-900 transition-colors`}>أضف الآن</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-5"><button onClick={() => setView('menu')} className={`p-3 rounded-full ${COLORS.surface} border border-amber-100 text-amber-700 shadow-md active:scale-90`}><Icons.ArrowRight /></button><h2 className="text-2xl font-black text-amber-950 tracking-tight">مراجعة طلبك</h2></div>
            {Object.values(cart).length === 0 ? (
              <div className="p-20 text-center rounded-[3rem] bg-white border-4 border-dashed border-amber-50">
                <div className="text-7xl mb-6 grayscale opacity-20">☕</div>
                <h3 className="font-black text-gray-400 text-lg">سلتك فارغة، استمتع بطلب مشروبك المفضل!</h3>
                <button onClick={() => setView('menu')} className={`mt-8 py-4 px-12 rounded-2xl ${COLORS.primary} text-white font-black shadow-2xl active:scale-95`}>الذهاب للمنيو</button>
              </div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-amber-50 p-6 overflow-hidden">
                    <div className="space-y-4">
                        {(Object.values(cart) as CartItem[]).map(item => (
                          <div key={item.drink.id} className="flex justify-between items-center py-4 border-b border-amber-50 last:border-0">
                            <div className="flex flex-col">
                               <span className="font-black text-base text-amber-950">{item.drink.name}</span>
                               <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">الكمية: {item.quantity} × {item.drink.price} ج.م</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-amber-700 font-black text-lg">{item.drink.price * item.quantity} ج.م</span>
                              <div className="flex gap-1">
                                 <button onClick={() => updateCart(item.drink, -1)} className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center border border-amber-50 active:scale-90"><Icons.Minus /></button>
                                 <button onClick={() => updateCart(item.drink, 1)} className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center border border-amber-50 active:scale-90"><Icons.Plus /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t-2 border-dashed border-amber-100 flex justify-between items-center font-black text-2xl text-amber-900">
                        <span className="text-base text-amber-900/40 uppercase tracking-widest">المجموع الكلي</span>
                        <span>{cartTotalPrice} <span className="text-xs">ج.م</span></span>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl border border-amber-50 p-8 space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner"><Icons.MapPin /></div>
                     <h3 className="font-black text-lg text-amber-950">بيانات الموقع والتوصيل</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <select value={floorNumber} onChange={(e) => { setFloorNumber(e.target.value); setClinicNumber(""); }} className="p-4 rounded-2xl border-2 border-amber-50 bg-amber-50/20 text-[13px] font-black outline-none focus:border-amber-500 transition-all cursor-pointer">
                        <option value="">اختيار الدور</option><option value="0">الدور الأرضي</option><option value="1">الدور الأول</option><option value="2">الدور الثاني</option><option value="3">الدور الثالث</option>
                    </select>
                    <select disabled={!floorNumber} value={clinicNumber} onChange={(e) => setClinicNumber(e.target.value)} className="p-4 rounded-2xl border-2 border-amber-50 bg-amber-50/20 text-[13px] font-black outline-none focus:border-amber-500 transition-all disabled:opacity-30 cursor-pointer">
                        <option value="">اختيار الرقم</option>{availableRooms.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <input type="text" placeholder="الاسم أو العيادة (مثال: عيادة د. محمد)" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-amber-50 bg-amber-50/20 text-[13px] font-black outline-none focus:border-amber-500 transition-all" />
                  <textarea placeholder="ملاحظات الطلب (مثال: بدون سكر، شاي ثقيل)..." value={orderNote} onChange={(e) => setOrderNote(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-amber-50 bg-amber-50/20 text-[13px] font-black h-20 outline-none focus:border-amber-500 transition-all resize-none" />
                  
                  <div className="space-y-3">
                    <button onClick={handleConfirmOrder} disabled={isPlacingOrder} className={`w-full py-5 rounded-2xl text-white font-black text-lg shadow-2xl flex flex-col items-center gap-1 transition-all active:scale-95 ${COLORS.primary} disabled:opacity-50 hover:bg-amber-950`}>
                      {isPlacingOrder ? (
                          <div className="flex items-center gap-3"><span>جاري المعالجة...</span><div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div></div>
                      ) : (
                          <>
                              <span>إرسال الطلب & الجرد</span>
                              <div className="flex gap-3 opacity-60 text-xs"><Icons.Mail /> <Icons.WhatsApp /></div>
                          </>
                      )}
                    </button>
                    <div className="flex flex-col items-center gap-1 opacity-40">
                       <p className="text-[9px] font-black text-center uppercase tracking-widest">تأكيد الطلب يرسل نسخة آلية فورية للبريد:</p>
                       <p className="text-[10px] font-black text-amber-800">scs.info.official@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Persistent Checkout Button */}
      {view === 'menu' && cartTotalItems > 0 && (
        <div className="fixed bottom-6 left-6 right-6 z-50 animate-bounceIn">
          <button onClick={() => setView('cart')} className={`max-w-2xl mx-auto w-full ${COLORS.primary} text-white p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between transition-transform active:scale-95 hover:bg-amber-950`}>
            <div className="flex items-center gap-4">
                <div className="bg-amber-500 text-white px-4 py-1.5 rounded-2xl font-black text-base shadow-inner ring-4 ring-amber-500/20">{cartTotalItems}</div>
                <span className="font-black text-base uppercase tracking-wider">مراجعة سلة الطلبات</span>
            </div>
            <div className="font-black text-xl flex flex-col items-end">
                <span>{cartTotalPrice} <span className="text-[10px]">ج.م</span></span>
                <span className="text-[8px] font-bold text-amber-400/60 uppercase">إتمام الطلب</span>
            </div>
          </button>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-[#2D1B14]/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[3.5rem] p-10 max-w-sm w-full text-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-4 border-amber-50">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 scale-125 shadow-xl ring-8 ring-emerald-50"><Icons.Check /></div>
            <h2 className="text-2xl font-black mb-3 text-amber-950">تم استلام طلبك!</h2>
            <p className="text-gray-500 text-[13px] font-bold mb-8 leading-relaxed">وصلت تفاصيل الطلب لبريد الإدارة ومسؤول التوصيل (WhatsApp). جاري التحضير...</p>
            <button onClick={() => { setShowSuccessModal(false); setView('menu'); }} className={`w-full py-5 rounded-[2rem] ${COLORS.primary} text-white font-black shadow-2xl transition-all active:scale-95 hover:bg-amber-950`}>العودة للرئيسية</button>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/70 backdrop-blur-xl">
          <div className="bg-white rounded-[3rem] p-8 max-w-sm w-full shadow-2xl border border-white/20">
            <div className="flex justify-between items-center mb-8">
                <h2 className="font-black text-xl text-amber-900">نظام الإدارة</h2>
                <button onClick={() => setShowAdminLogin(false)} className="text-gray-300 hover:text-red-500 transition-colors"><Icons.XCircle /></button>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <input autoFocus type="password" value={adminPassInput} onChange={(e) => setAdminPassInput(e.target.value)} className="w-full p-5 rounded-[1.5rem] border-2 border-amber-50 bg-amber-50/20 font-black text-center tracking-[0.5em] focus:border-amber-500 outline-none transition-all" placeholder="********" />
              <button type="submit" className={`w-full py-5 rounded-[1.5rem] ${COLORS.primary} text-white font-black shadow-2xl hover:bg-amber-900 transition-colors active:scale-95`}>دخول النظام</button>
            </form>
          </div>
        </div>
      )}

      <footer className="mt-auto py-12 text-center">
        <div className="flex flex-col items-center gap-2 opacity-30">
            <img src={LOGO_URL} className="w-6 h-6 grayscale" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-900">بالهنا — مجمع هنا الطبي</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-amber-800">Designed & Developed by Dr. Ahmed Elmosalamy</p>
        </div>
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
