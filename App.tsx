
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MENU_ITEMS, DOCTOR_ADS, ADMIN_PASSWORD } from './constants';
import { Drink, Order, OrderItem, CLINICS, DoctorAd } from './types';

const LOGO_URL = "https://archive.org/download/t-401769435886279/__ia_thumb.jpg";
// معرف سحابي فريد جداً لضمان عدم التداخل مع أي بيانات سابقة
const SYNC_KEY = "bal_hana_final_sync_v3_88"; 
const API_BASE = `https://kvdb.io/6E3qV3pE9yU5vH7N9w4G9x/${SYNC_KEY}`;

const Icons = {
  Coffee: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>
  ),
  Admin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Note: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/><line x1="9" x2="15" y1="13" y2="13"/><line x1="9" x2="15" y1="17" y2="17"/></svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Cart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
  ),
  Minus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>
  ),
  ChevronLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
  ),
  Bell: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
  ),
  BellOff: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h9"/><path d="m2 2 20 20"/><path d="M18 8a2 2 0 1 1-4 0"/></svg>
  ),
  Wifi: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>
  ),
  CloudSync: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m16 2.5 1.5 1.5"/><path d="M21 12h-4"/><path d="m16 21.5-1.5-1.5"/><path d="M12 22v-4"/><path d="m8 21.5-1.5-1.5"/><path d="M3 12h4"/><path d="m8 2.5-1.5 1.5"/><circle cx="12" cy="12" r="3"/></svg>
  )
};

interface CartItem {
  drink: Drink;
  quantity: number;
}

const App: React.FC = () => {
  const [view, setView] = useState<'menu' | 'cart' | 'admin'>('menu');
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [selectedClinic, setSelectedClinic] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("-");
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('bel_hana_sound');
    return saved === null ? true : saved === 'true';
  });
  
  const [notificationSound] = useState(() => new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));
  const prevOrdersCount = useRef(0);

  // جلب البيانات من السحابة مع تعطيل التخزين المؤقت تماماً
  const fetchLatestOrders = async (): Promise<Order[]> => {
    try {
      setIsSyncing(true);
      const res = await fetch(`${API_BASE}?cb=${Date.now()}_${Math.random()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setLastSyncTime(new Date().toLocaleTimeString('ar-EG'));
          return data;
        }
      }
    } catch (e) {
      console.warn("فشل الاتصال بالسحابة، قد تكون الخدمة مؤقتة.");
    } finally {
      setIsSyncing(false);
    }
    return [];
  };

  // رفع البيانات للسحابة
  const pushOrders = async (data: Order[]) => {
    try {
      setIsSyncing(true);
      await fetch(API_BASE, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      console.error("فشل إرسال البيانات.");
    } finally {
      setIsSyncing(false);
    }
  };

  // تحديث الطلبات في الحالة المحلية
  const sync = async () => {
    const latest = await fetchLatestOrders();
    if (latest.length > 0 || (latest.length === 0 && orders.length > 0)) {
        setOrders(latest);
    }
  };

  // دورة التحديث التلقائي
  useEffect(() => {
    sync(); // جلب عند التشغيل
    const interval = setInterval(sync, view === 'admin' ? 4000 : 20000); 
    return () => clearInterval(interval);
  }, [view]);

  // التنبيه الصوتي عند وجود طلبات جديدة معلقة
  useEffect(() => {
    const currentPending = orders.filter(o => o.status === 'pending').length;
    if (isSoundEnabled && orders.length > prevOrdersCount.current && currentPending > 0) {
      if (view === 'admin') {
        notificationSound.play().catch(() => {});
      }
    }
    prevOrdersCount.current = orders.length;
  }, [orders, view, isSoundEnabled]);

  const cartItemsCount = useMemo(() => 
    (Object.values(cart) as CartItem[]).reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const cartTotalPrice = useMemo(() => 
    (Object.values(cart) as CartItem[]).reduce((sum, item) => sum + (item.drink.price * item.quantity), 0), [cart]);

  const updateCart = (drink: Drink, delta: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      const current = newCart[drink.id] || { drink, quantity: 0 };
      const newQuantity = Math.max(0, current.quantity + delta);
      if (newQuantity === 0) delete newCart[drink.id];
      else newCart[drink.id] = { ...current, quantity: newQuantity };
      return newCart;
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedClinic || !contactInfo.trim()) {
      alert("الرجاء اختيار العيادة وإدخال الاسم");
      return;
    }

    const orderItems: OrderItem[] = (Object.values(cart) as CartItem[]).map(item => ({
      drinkId: item.drink.id,
      drinkName: item.drink.name,
      quantity: item.quantity,
      price: item.drink.price
    }));

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      items: orderItems,
      totalPrice: cartTotalPrice,
      clinicName: selectedClinic,
      contactInfo: contactInfo.trim(),
      status: 'pending',
      timestamp: Date.now(),
      notes: orderNote.trim() || undefined
    };

    // خطوة حرجة: جلب أحدث الطلبات من السيرفر قبل الإضافة لضمان عدم الكتابة فوق طلبات الآخرين
    const currentFromCloud = await fetchLatestOrders();
    const finalOrdersList = [...(Array.isArray(currentFromCloud) ? currentFromCloud : []), newOrder];
    
    setOrders(finalOrdersList);
    await pushOrders(finalOrdersList);
    
    setCart({});
    setSelectedClinic("");
    setContactInfo("");
    setOrderNote("");
    setShowOrderSuccess(true);
    setView('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setShowOrderSuccess(false), 5000);
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    // جلب أحدث نسخة أولاً لضمان عدم حدوث تعارض
    const current = await fetchLatestOrders();
    const updated = current.map(order => 
      order.id === id ? { ...order, status } : order
    );
    setOrders(updated);
    await pushOrders(updated);
  };

  const handleAdminLogin = () => {
    const pass = prompt("الرجاء إدخال رمز الدخول للمسؤول:");
    if (pass === ADMIN_PASSWORD) {
      setView('admin');
      sync();
    } else if (pass !== null) {
      alert("الرمز غير صحيح!");
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-amber-50/20 text-gray-800 font-['Cairo']">
      <header className="bg-amber-950 text-white shadow-2xl sticky top-0 z-50 border-b-2 border-orange-500/30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('menu')}>
            <div className="bg-white p-1 rounded-2xl shadow-xl w-14 h-14 overflow-hidden flex items-center justify-center border-2 border-orange-500/20">
              <img src={LOGO_URL} alt="بالهنا" className="w-full h-full object-contain scale-110" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight leading-none text-orange-50">بالهنا</h1>
              <p className="text-[10px] text-orange-300 mt-1 font-bold">خدمة مشروبات مجمع هنا</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => view === 'admin' ? setView('menu') : handleAdminLogin()}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-2xl transition-all text-xs font-bold border border-white/10 active:scale-95"
            >
              {view === 'admin' ? (
                <><Icons.Coffee /> <span>القائمة</span></>
              ) : (
                <><Icons.Admin /> <span>لوحة الإدارة</span></>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {view === 'menu' && (
          <div className="space-y-12 animate-fadeIn">
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black flex items-center gap-3 text-amber-950">
                  <span className="w-2.5 h-10 bg-orange-600 rounded-full shadow-sm"></span>
                  قائمة اليوم
                </h2>
                <div className="text-[10px] bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-bold">متوفر الآن ✅</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {MENU_ITEMS.map(drink => {
                  const qty = cart[drink.id]?.quantity || 0;
                  return (
                    <div key={drink.id} className={`group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border-2 ${qty > 0 ? 'border-orange-500 bg-orange-50/5' : 'border-gray-50'}`}>
                      <div className="relative h-52 overflow-hidden">
                        <img src={drink.image} alt={drink.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-2xl text-sm font-black text-amber-950 shadow-xl border border-white/50">
                          {drink.price} ج.م
                        </div>
                        <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-2xl text-[10px] font-black text-white shadow-xl ${drink.category === 'hot' ? 'bg-orange-600' : 'bg-blue-600'}`}>
                          {drink.category === 'hot' ? '☕ ساخن' : '🥤 بارد'}
                        </div>
                      </div>
                      <div className="p-6 flex justify-between items-center">
                        <h3 className="font-black text-lg text-amber-950">{drink.name}</h3>
                        <div className="flex items-center gap-4">
                          {qty > 0 && (
                            <>
                              <button onClick={() => updateCart(drink, -1)} className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-900 hover:bg-orange-100 transition-colors border border-amber-100"><Icons.Minus /></button>
                              <span className="font-black text-xl min-w-[20px] text-center text-amber-950">{qty}</span>
                            </>
                          )}
                          <button onClick={() => updateCart(drink, 1)} className="w-10 h-10 rounded-2xl bg-amber-950 flex items-center justify-center text-white hover:bg-orange-600 shadow-xl transition-all active:scale-90"><Icons.Plus /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="pt-12 border-t border-amber-100">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-amber-950">
                <span className="w-2.5 h-10 bg-amber-800 rounded-full shadow-sm"></span>
                دكاترة مجمع هنا
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DOCTOR_ADS.map(doctor => (
                  <div key={doctor.id} className="bg-white p-5 rounded-[28px] shadow-sm border border-amber-50 flex items-center gap-5 hover:bg-amber-50/30 transition-colors">
                    <div className="relative">
                        <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-100 shadow-md" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-amber-950 text-base leading-none mb-1">{doctor.name}</div>
                      <div className="text-xs text-orange-600 font-bold mb-2">{doctor.specialty}</div>
                      <div className="text-[10px] text-gray-400 flex items-center gap-1.5 font-bold">
                        <Icons.Check /> {doctor.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
            <button onClick={() => setView('menu')} className="flex items-center gap-2 text-amber-800 font-black hover:text-orange-600 transition-colors mb-2 text-sm">
              <Icons.ChevronLeft /> اختيار مشروبات أخرى
            </button>
            
            <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-amber-100">
              <div className="bg-amber-50/50 px-8 py-6 border-b border-amber-100 font-black text-xl text-amber-950 flex items-center gap-3">
                <Icons.Cart /> طلباتك الحالية
              </div>
              <div className="divide-y divide-amber-50">
                {(Object.values(cart) as CartItem[]).map(item => (
                  <div key={item.drink.id} className="p-6 flex items-center justify-between hover:bg-amber-50/20 transition-colors">
                    <div className="flex items-center gap-5">
                      <img src={item.drink.image} className="w-16 h-16 rounded-2xl object-cover shadow-md border border-amber-50" alt="" />
                      <div>
                        <div className="font-black text-amber-950 text-base">{item.drink.name}</div>
                        <div className="text-xs text-gray-400 font-bold">{item.drink.price} ج.م للواحد</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="font-black text-orange-600 text-lg">{item.drink.price * item.quantity} ج.م</div>
                      <div className="flex items-center gap-3 bg-amber-50 rounded-2xl p-1.5 border border-amber-100">
                        <button onClick={() => updateCart(item.drink, -1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 transition-colors"><Icons.Minus /></button>
                        <span className="font-black text-amber-950 text-base min-w-[20px] text-center">{item.quantity}</span>
                        <button onClick={() => updateCart(item.drink, 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-orange-700 transition-colors"><Icons.Plus /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-amber-950 text-white flex justify-between items-center">
                <span className="font-bold text-lg">الإجمالي المطلوب:</span>
                <span className="font-black text-3xl text-orange-400">{cartTotalPrice} ج.م</span>
              </div>
            </div>

            <section className="bg-white p-8 rounded-[40px] shadow-2xl border border-amber-100 space-y-8">
              <h2 className="text-xl font-black text-amber-950 flex items-center gap-3">
                 📍 حدد مكان التوصيل
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {CLINICS.map(clinic => (
                  <button
                    key={clinic}
                    onClick={() => setSelectedClinic(clinic)}
                    className={`p-4 text-xs rounded-2xl border-2 transition-all font-black shadow-sm ${
                      selectedClinic === clinic 
                      ? 'border-orange-500 bg-orange-50 text-orange-800 scale-105 z-10' 
                      : 'border-amber-50 hover:border-amber-200 bg-amber-50/20 text-gray-500'
                    }`}
                  >
                    {clinic}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-black text-amber-900 flex items-center gap-2">
                    <Icons.User /> اسم الدكتور / الموظف:
                  </label>
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="اكتب اسمك هنا..."
                    className="w-full p-5 rounded-[20px] border-2 border-amber-50 focus:border-orange-500 focus:bg-white outline-none transition-all text-base font-bold bg-amber-50/30"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black text-amber-900 flex items-center gap-2">
                    <Icons.Note /> ملاحظات التجهيز:
                  </label>
                  <input
                    type="text"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="سكر زيادة، خفيف، بدون مكسرات..."
                    className="w-full p-5 rounded-[20px] border-2 border-amber-50 focus:border-orange-500 focus:bg-white outline-none transition-all text-base font-bold bg-amber-50/30"
                  />
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={!selectedClinic || !contactInfo.trim() || isSyncing}
                className={`w-full py-6 rounded-[24px] font-black text-2xl shadow-2xl transition-all flex items-center justify-center gap-4 ${selectedClinic && contactInfo.trim() && !isSyncing ? 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95' : 'bg-amber-100 text-amber-300 cursor-not-allowed'}`}
              >
                {isSyncing ? (
                   <span className="flex items-center gap-3 animate-pulse">
                      <Icons.CloudSync /> جاري إرسال الطلب...
                   </span>
                ) : (
                   <>تأكيد وإرسال ({cartTotalPrice} ج.م) <Icons.Check /></>
                )}
              </button>
            </section>
          </div>
        )}

        {view === 'admin' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[40px] border border-amber-100 shadow-xl">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-amber-950 flex items-center gap-3">
                  <span className="w-3 h-12 bg-orange-600 rounded-full shadow-lg"></span>
                  إدارة طلبات المجمع
                </h2>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 text-xs font-black ${isSyncing ? 'text-orange-500' : 'text-emerald-600'}`}>
                    <Icons.Wifi /> {isSyncing ? 'تحديث السحابة...' : `متصل • آخر تحديث: ${lastSyncTime}`}
                  </div>
                  <div className={`w-3 h-3 rounded-full ${isSyncing ? 'bg-orange-500 animate-ping' : 'bg-emerald-500'}`}></div>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={sync}
                  className="flex-1 md:flex-none p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 hover:bg-amber-100 font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Icons.CloudSync /> تحديث فوري
                </button>
                <button 
                  onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border-2 transition-all font-black text-xs ${isSoundEnabled ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                >
                  {isSoundEnabled ? <Icons.Bell /> : <Icons.BellOff />}
                  <span>{isSoundEnabled ? 'جرس منبه' : 'تنبيه صامت'}</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-amber-100">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-amber-950 text-white">
                      <th className="p-6 font-black text-xs uppercase tracking-widest">المعرف</th>
                      <th className="p-6 font-black text-xs">العيادة / القسم</th>
                      <th className="p-6 font-black text-xs">الاسم</th>
                      <th className="p-6 font-black text-xs">المشروبات</th>
                      <th className="p-6 font-black text-xs">وقت الطلب</th>
                      <th className="p-6 font-black text-xs">الحساب</th>
                      <th className="p-6 font-black text-xs">الحالة</th>
                      <th className="p-6 font-black text-xs text-center">التحكم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-50">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-24 text-center text-amber-200 font-black italic bg-amber-50/5">
                          لا يوجد أي طلبات حالياً في السحابة..
                        </td>
                      </tr>
                    ) : (
                      orders.sort((a, b) => b.timestamp - a.timestamp).map((order) => (
                        <tr key={order.id} className={`group hover:bg-orange-50/30 transition-all duration-300 ${order.status === 'pending' ? 'bg-orange-50/40 font-bold' : ''}`}>
                          <td className="p-6 text-[10px] font-mono text-gray-300 group-hover:text-amber-900 transition-colors">#{order.id}</td>
                          <td className="p-6 font-black text-amber-900 text-base">{order.clinicName}</td>
                          <td className="p-6">
                            <div className="flex flex-col">
                              <span className="font-black text-gray-800 text-sm">{order.contactInfo}</span>
                              {order.notes && (
                                <span className="text-[10px] text-orange-600 font-black bg-orange-100/50 px-3 py-1 rounded-xl w-fit mt-1.5 flex items-center gap-1.5">
                                  📝 {order.notes}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex flex-wrap gap-1.5">
                              {order.items.map((item, idx) => (
                                <span key={idx} className="bg-white text-amber-950 text-[10px] px-3 py-1 rounded-xl font-black border border-amber-100 shadow-sm">
                                  {item.drinkName} (x{item.quantity})
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-6 text-[11px] font-black text-gray-400">
                            {new Date(order.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-6 font-black text-amber-950 text-base">{order.totalPrice} ج.م</td>
                          <td className="p-6">
                            <span className={`text-[10px] font-black px-4 py-2 rounded-2xl inline-block shadow-sm ${
                              order.status === 'pending' ? 'bg-orange-500 text-white animate-pulse' :
                              order.status === 'completed' ? 'bg-emerald-500 text-white' :
                              'bg-red-500 text-white'
                            }`}>
                              {order.status === 'pending' ? 'قيد التحضير' :
                               order.status === 'completed' ? 'تم التوصيل' : 'ملغي'}
                            </span>
                          </td>
                          <td className="p-6">
                            <div className="flex justify-center gap-3">
                              {order.status === 'pending' ? (
                                <>
                                  <button 
                                    onClick={() => updateOrderStatus(order.id, 'completed')}
                                    className="w-10 h-10 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 shadow-lg active:scale-90 transition-all flex items-center justify-center"
                                  >
                                    <Icons.Check />
                                  </button>
                                  <button 
                                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                    className="w-10 h-10 bg-red-500 text-white rounded-2xl hover:bg-red-600 shadow-lg active:scale-90 transition-all flex items-center justify-center"
                                  >
                                    <Icons.Trash />
                                  </button>
                                </>
                              ) : (
                                <button 
                                  onClick={() => updateOrderStatus(order.id, 'pending')}
                                  className="text-[10px] font-black text-amber-600 hover:bg-white px-4 py-2 rounded-xl transition-all border border-amber-100 shadow-sm"
                                >
                                  إعادة فتح
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {view === 'menu' && cartItemsCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 p-5 bg-white/95 backdrop-blur-2xl border-t border-amber-100 shadow-[0_-15px_40px_rgba(0,0,0,0.15)] z-[60] animate-fadeIn">
           <div className="container mx-auto flex items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                 <div className="relative">
                    <div className="bg-amber-950 text-white p-4 rounded-[24px] shadow-2xl scale-110">
                       <Icons.Cart />
                    </div>
                    <span className="absolute -top-3 -right-3 bg-orange-600 text-white text-xs font-black w-7 h-7 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                       {cartItemsCount}
                    </span>
                 </div>
                 <div>
                    <div className="font-black text-amber-950 text-lg leading-tight">سلة المشروبات</div>
                    <div className="text-xs text-orange-600 font-black tracking-wide">الإجمالي: {cartTotalPrice} ج.م</div>
                 </div>
              </div>
              <button 
                onClick={() => setView('cart')}
                className="bg-orange-600 text-white px-10 py-4 rounded-[22px] font-black text-lg shadow-2xl hover:bg-amber-950 active:scale-95 transition-all flex items-center gap-4"
              >
                تأكيد الطلب
                <Icons.ChevronLeft />
              </button>
           </div>
        </div>
      )}

      {showOrderSuccess && (
        <div className="fixed inset-0 bg-amber-950/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white text-amber-950 px-8 py-12 rounded-[50px] shadow-[0_40px_80px_rgba(0,0,0,0.3)] font-black text-center flex flex-col items-center gap-6 w-full max-w-sm border-4 border-orange-500">
            <div className="w-28 h-28 bg-amber-50 rounded-[35px] p-3 shadow-inner border-4 border-orange-100 animate-bounce">
               <img src={LOGO_URL} className="w-full h-full object-contain scale-110" alt="" />
            </div>
            <div>
              <div className="text-3xl mb-2 text-orange-600">أبشر!</div>
              <p className="text-sm font-bold text-gray-500 opacity-90 leading-relaxed px-6">تم إرسال طلبك للسحابة بنجاح.. مشروبك المفضل في طريقه الآن إلى {selectedClinic}.</p>
            </div>
            <button 
               onClick={() => setShowOrderSuccess(false)}
               className="bg-amber-950 text-white px-12 py-3 rounded-full text-sm font-black hover:bg-orange-600 transition-all shadow-xl active:scale-90"
            >
               شكراً لك
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95) translateY(30px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        body { background-color: #fff9f2; -webkit-tap-highlight-color: transparent; }
        * { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #eab308; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
