
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MENU_ITEMS, DOCTOR_ADS, ADMIN_PASSWORD } from './constants';
import { Drink, Order, OrderItem, CLINICS, DoctorAd } from './types';

const LOGO_URL = "https://archive.org/download/t-401769435886279/__ia_thumb.jpg";
// معرف سحابي عالمي موحد - كل من يفتح التطبيق بهذا المعرف سيرى نفس البيانات
const GLOBAL_SYNC_ID = "bal_hana_global_live_v5_unique"; 
const API_URL = `https://kvdb.io/6E3qV3pE9yU5vH7N9w4G9x/${GLOBAL_SYNC_ID}`;

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
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [adminFilter, setAdminFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  
  const notificationSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));
  const prevOrdersCount = useRef(0);

  // وظيفة جلب البيانات - مع منع الكاش الصارم
  const fetchGlobalOrders = async (): Promise<Order[]> => {
    try {
      setIsSyncing(true);
      // استخدام بصمة زمنية عشوائية لإجبار المتصفح والسيرفر على جلب نسخة جديدة
      const response = await fetch(`${API_URL}?cache_bust=${Date.now()}&rand=${Math.random()}`, {
        method: 'GET',
        cache: 'no-store', // منع التخزين المحلي
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setLastSyncTime(new Date().toLocaleTimeString('ar-EG'));
          return data;
        }
      }
    } catch (e) {
      console.warn("فشل الاتصال بالسحابة - جاري المحاولة مرة أخرى...");
    } finally {
      setIsSyncing(false);
    }
    return [];
  };

  // وظيفة رفع البيانات للسحابة
  const pushGlobalOrders = async (data: Order[]) => {
    try {
      setIsSyncing(true);
      await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      console.error("خطأ في تحديث البيانات السحابية.");
    } finally {
      setIsSyncing(false);
    }
  };

  // تحديث الحالة المحلية من السحابة
  const syncWithCloud = async () => {
    const latest = await fetchGlobalOrders();
    // فقط نحدث إذا كانت هناك بيانات فعلاً أو إذا كانت القائمة فارغة في السيرفر ولكنها ممتلئة محلياً (مسح)
    if (latest.length >= 0) {
      setOrders(latest);
    }
  };

  // دورة المزامنة التلقائية (المسؤول كل 3 ثوانٍ - المستخدم كل 15 ثانية)
  useEffect(() => {
    syncWithCloud();
    const timer = setInterval(syncWithCloud, view === 'admin' ? 3000 : 15000);
    return () => clearInterval(timer);
  }, [view]);

  // التنبيه الصوتي عند وصول طلبات جديدة للمسؤول
  useEffect(() => {
    if (view === 'admin' && orders.length > prevOrdersCount.current) {
      const hasNewPending = orders.some(o => o.status === 'pending');
      if (hasNewPending && isSoundEnabled) {
        notificationSound.current.play().catch(() => {});
      }
    }
    prevOrdersCount.current = orders.length;
  }, [orders, view, isSoundEnabled]);

  const cartItemsCount = useMemo(() => 
    (Object.values(cart) as CartItem[]).reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const cartTotalPrice = useMemo(() => 
    (Object.values(cart) as CartItem[]).reduce((sum, item) => sum + (item.drink.price * item.quantity), 0), [cart]);

  const filteredOrders = useMemo(() => {
    let list = [...orders];
    if (adminFilter !== 'all') {
      list = list.filter(o => o.status === adminFilter);
    }
    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [orders, adminFilter]);

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

    // جلب أحدث البيانات من السحابة قبل الإضافة لضمان عدم مسح طلبات الآخرين
    const latestFromCloud = await fetchGlobalOrders();
    const finalData = [...(Array.isArray(latestFromCloud) ? latestFromCloud : []), newOrder];
    
    await pushGlobalOrders(finalData);
    setOrders(finalData);
    
    setCart({});
    setSelectedClinic("");
    setContactInfo("");
    setOrderNote("");
    setShowOrderSuccess(true);
    setView('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setShowOrderSuccess(false), 5000);
  };

  const updateStatus = async (id: string, newStatus: Order['status']) => {
    // جلب أحدث نسخة لضمان عدم حدوث تعارض
    const latest = await fetchGlobalOrders();
    const updated = latest.map(o => o.id === id ? { ...o, status: newStatus } : o);
    setOrders(updated);
    await pushGlobalOrders(updated);
  };

  const handleAdminLogin = () => {
    const pass = prompt("أدخل كلمة المرور للدخول للوحة الإدارة:");
    if (pass === ADMIN_PASSWORD) {
      setView('admin');
      syncWithCloud();
    } else if (pass !== null) {
      alert("كلمة مرور خاطئة!");
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-[#fffcf8] text-gray-800 font-['Cairo']">
      <header className="bg-amber-950 text-white shadow-xl sticky top-0 z-50 border-b-2 border-orange-500/20">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('menu')}>
            <div className="bg-white p-1 rounded-2xl shadow-lg w-12 h-12 flex items-center justify-center overflow-hidden">
              <img src={LOGO_URL} alt="بالهنا" className="w-full h-full object-contain scale-110" />
            </div>
            <div>
              <h1 className="text-xl font-black leading-none text-orange-50">بالهنا</h1>
              <p className="text-[9px] text-orange-300 mt-0.5 font-bold">بوفيه مجمع هنا الطبي</p>
            </div>
          </div>
          <button 
            onClick={() => view === 'admin' ? setView('menu') : handleAdminLogin()}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all text-[11px] font-black border border-white/5 active:scale-95 flex items-center gap-2"
          >
            {view === 'admin' ? <><Icons.Coffee /> المنيو</> : <><Icons.Admin /> الإدارة</>}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {view === 'menu' && (
          <div className="space-y-10 animate-fadeIn">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-amber-950 flex items-center gap-2">
                  <span className="w-2 h-8 bg-orange-600 rounded-full"></span>
                  قائمة المشروبات
                </h2>
                <div className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-[10px] font-black border border-orange-100">مفتوح الآن 🟢</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {MENU_ITEMS.map(drink => {
                  const qty = cart[drink.id]?.quantity || 0;
                  return (
                    <div key={drink.id} className={`group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 ${qty > 0 ? 'border-orange-500 bg-orange-50/10' : 'border-gray-50'}`}>
                      <div className="relative h-44 overflow-hidden">
                        <img src={drink.image} alt={drink.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute top-3 right-3 bg-white/95 px-3 py-1 rounded-2xl text-xs font-black text-amber-950 shadow-md">
                          {drink.price} ج.م
                        </div>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <h3 className="font-black text-amber-950">{drink.name}</h3>
                        <div className="flex items-center gap-3">
                          {qty > 0 && (
                            <>
                              <button onClick={() => updateCart(drink, -1)} className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-900 border border-amber-100"><Icons.Minus /></button>
                              <span className="font-black text-base min-w-[15px] text-center">{qty}</span>
                            </>
                          )}
                          <button onClick={() => updateCart(drink, 1)} className="w-8 h-8 rounded-xl bg-amber-900 flex items-center justify-center text-white shadow-lg active:scale-90 transition-all"><Icons.Plus /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="pt-8 border-t border-amber-50">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-amber-950">
                <span className="w-2 h-8 bg-amber-800 rounded-full"></span>
                دكاترة المجمع
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DOCTOR_ADS.map(doctor => (
                  <div key={doctor.id} className="bg-white p-4 rounded-3xl shadow-sm border border-amber-50 flex items-center gap-4">
                    <img src={doctor.image} alt={doctor.name} className="w-12 h-12 rounded-2xl object-cover shadow-inner" />
                    <div className="flex-1">
                      <div className="font-black text-amber-950 text-xs">{doctor.name}</div>
                      <div className="text-[10px] text-orange-600 font-bold">{doctor.specialty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            <button onClick={() => setView('menu')} className="text-amber-900 font-black text-xs flex items-center gap-2 mb-4">
              <Icons.ChevronLeft /> العودة واختيار المزيد
            </button>
            
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-50">
              <div className="bg-amber-50/50 p-5 font-black text-amber-950 border-b border-amber-100 flex items-center gap-2">
                <Icons.Cart /> سلة الطلب
              </div>
              <div className="divide-y divide-amber-50">
                {(Object.values(cart) as CartItem[]).map(item => (
                  <div key={item.drink.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={item.drink.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                      <div>
                        <div className="font-black text-amber-950 text-sm">{item.drink.name}</div>
                        <div className="text-[10px] text-gray-400">{item.drink.price} ج.م</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-black text-orange-600 text-sm">{item.drink.price * item.quantity} ج.م</div>
                      <div className="flex items-center gap-2 bg-amber-50 rounded-xl p-1">
                        <button onClick={() => updateCart(item.drink, -1)} className="p-1 text-gray-400"><Icons.Minus /></button>
                        <span className="font-black text-xs min-w-[15px] text-center">{item.quantity}</span>
                        <button onClick={() => updateCart(item.drink, 1)} className="p-1 text-amber-900"><Icons.Plus /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-amber-950 text-white flex justify-between items-center">
                <span className="font-bold">إجمالي الحساب:</span>
                <span className="font-black text-2xl">{cartTotalPrice} ج.م</span>
              </div>
            </div>

            <section className="bg-white p-6 rounded-3xl shadow-xl border border-amber-50 space-y-6">
              <h3 className="font-black text-amber-950 flex items-center gap-2">📍 التوصيل إلى:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CLINICS.map(clinic => (
                  <button
                    key={clinic}
                    onClick={() => setSelectedClinic(clinic)}
                    className={`p-3 text-[10px] rounded-xl border-2 font-black transition-all ${
                      selectedClinic === clinic ? 'border-orange-500 bg-orange-50 text-orange-800' : 'border-amber-50 text-gray-400 hover:border-amber-200'
                    }`}
                  >
                    {clinic}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-amber-900 flex items-center gap-2"><Icons.User /> اسمك:</label>
                  <input type="text" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="اسم الدكتور أو الموظف..." className="w-full p-4 rounded-2xl border border-amber-100 outline-none focus:border-orange-500 bg-amber-50/20 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-amber-900 flex items-center gap-2"><Icons.Note /> ملاحظات:</label>
                  <input type="text" value={orderNote} onChange={(e) => setOrderNote(e.target.value)} placeholder="سكر خفيف، بارد، إلخ..." className="w-full p-4 rounded-2xl border border-amber-100 outline-none focus:border-orange-500 bg-amber-50/20 text-sm font-bold" />
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={!selectedClinic || !contactInfo.trim() || isSyncing}
                className={`w-full py-5 rounded-2xl font-black text-xl shadow-2xl transition-all ${selectedClinic && contactInfo.trim() && !isSyncing ? 'bg-orange-600 text-white hover:bg-amber-900 active:scale-95' : 'bg-amber-100 text-amber-300 cursor-not-allowed'}`}
              >
                {isSyncing ? 'جاري الإرسال...' : `تأكيد الطلب (${cartTotalPrice} ج.م)`}
              </button>
            </section>
          </div>
        )}

        {view === 'admin' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col gap-1 text-center md:text-right">
                <h2 className="text-2xl font-black text-amber-950 flex items-center justify-center md:justify-start gap-2">
                  <span className="w-2 h-8 bg-orange-600 rounded-full"></span>
                  لوحة الإدارة الحية
                </h2>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <div className={`flex items-center gap-1.5 text-[10px] font-black ${isSyncing ? 'text-orange-500' : 'text-emerald-600'}`}>
                    <Icons.Wifi /> {isSyncing ? 'جاري التحديث...' : `متصل بقاعدة البيانات • ${lastSyncTime}`}
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${isSyncing ? 'bg-orange-500 animate-ping' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}></div>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <button onClick={syncWithCloud} className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-900 font-black text-[10px] flex items-center gap-2 hover:bg-amber-100"><Icons.CloudSync /> تحديث يدوي</button>
                <button onClick={() => setIsSoundEnabled(!isSoundEnabled)} className={`p-3 rounded-xl border font-black text-[10px] flex items-center gap-2 ${isSoundEnabled ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                   {isSoundEnabled ? <Icons.Bell /> : <Icons.Wifi />} جرس: {isSoundEnabled ? 'يعمل' : 'صامت'}
                </button>
              </div>
            </div>

            {/* أزرار التصفية الجديدة */}
            <div className="flex flex-wrap justify-center gap-2 mb-6 bg-white/50 p-2 rounded-2xl border border-amber-50/50 max-w-fit mx-auto">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'pending', label: 'قيد الانتظار' },
                { id: 'completed', label: 'المكتملة' },
                { id: 'cancelled', label: 'الملغاة' }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setAdminFilter(filter.id as any)}
                  className={`px-6 py-2 rounded-xl text-[11px] font-black transition-all ${
                    adminFilter === filter.id 
                    ? 'bg-orange-600 text-white shadow-lg scale-105' 
                    : 'bg-white text-amber-900 border border-amber-100 hover:bg-amber-50'
                  }`}
                >
                  {filter.label}
                  {filter.id !== 'all' && (
                    <span className="mr-2 opacity-60 text-[9px]">
                      ({orders.filter(o => o.status === filter.id).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.length === 0 ? (
                <div className="col-span-full p-20 text-center text-amber-200 font-black italic">
                  {adminFilter === 'all' ? 'لا توجد طلبات واردة حالياً..' : 'لا توجد طلبات تطابق هذا التصنيف..'}
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div key={order.id} className={`bg-white p-5 rounded-[32px] shadow-sm border-2 transition-all relative overflow-hidden ${order.status === 'pending' ? 'border-orange-500 animate-pulse-subtle bg-orange-50/5' : 'border-amber-50 opacity-80'}`}>
                    {order.status === 'pending' && <div className="absolute top-0 right-0 bg-orange-500 text-white text-[8px] font-black px-3 py-1 rounded-bl-xl shadow-md">طلب جديد</div>}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-xl font-black text-amber-950">{order.clinicName}</div>
                        <div className="text-xs font-bold text-gray-500 flex items-center gap-1"><Icons.User /> {order.contactInfo}</div>
                      </div>
                      <div className="text-[10px] font-black text-amber-900 bg-amber-50 px-2 py-1 rounded-lg">#{order.id}</div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-xl border border-amber-50 text-xs">
                          <span className="font-black text-amber-950">{item.drinkName}</span>
                          <span className="font-bold text-orange-600">× {item.quantity}</span>
                        </div>
                      ))}
                      {order.notes && (
                        <div className="text-[10px] font-bold text-blue-600 bg-blue-50 p-2 rounded-xl flex items-center gap-2">
                           <Icons.Note /> {order.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-amber-50 pt-4">
                      <div className="text-sm font-black text-amber-950">{order.totalPrice} ج.م</div>
                      <div className="flex gap-2">
                        {order.status === 'pending' ? (
                          <>
                            <button onClick={() => updateStatus(order.id, 'completed')} className="w-10 h-10 bg-emerald-500 text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-emerald-600"><Icons.Check /></button>
                            <button onClick={() => updateStatus(order.id, 'cancelled')} className="w-10 h-10 bg-red-500 text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-red-600"><Icons.Trash /></button>
                          </>
                        ) : (
                          <button onClick={() => updateStatus(order.id, 'pending')} className="text-[10px] font-black text-amber-600 hover:underline">إعادة فتح</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {view === 'menu' && cartItemsCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 p-5 bg-white/95 backdrop-blur-xl border-t border-amber-100 shadow-[0_-15px_40px_rgba(0,0,0,0.1)] z-[60] animate-fadeIn">
           <div className="container mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                 <div className="relative">
                    <div className="bg-amber-950 text-white p-4 rounded-2xl shadow-xl">
                       <Icons.Cart />
                    </div>
                    <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                       {cartItemsCount}
                    </span>
                 </div>
                 <div>
                    <div className="font-black text-amber-950 text-base">سلة طلباتك</div>
                    <div className="text-[10px] text-orange-600 font-black">الإجمالي: {cartTotalPrice} ج.م</div>
                 </div>
              </div>
              <button 
                onClick={() => setView('cart')}
                className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-base shadow-2xl hover:bg-amber-950 active:scale-95 transition-all flex items-center gap-3"
              >
                مراجعة الطلب
                <Icons.ChevronLeft />
              </button>
           </div>
        </div>
      )}

      {showOrderSuccess && (
        <div className="fixed inset-0 bg-amber-950/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white px-8 py-10 rounded-[45px] shadow-[0_40px_80px_rgba(0,0,0,0.3)] text-center w-full max-w-sm border-4 border-orange-500">
            <div className="w-24 h-24 bg-amber-50 rounded-[35px] p-2 mx-auto mb-6 shadow-inner border-4 border-orange-100 animate-bounce">
               <img src={LOGO_URL} className="w-full h-full object-contain" alt="" />
            </div>
            <h2 className="text-3xl font-black text-orange-600 mb-3">تم بنجاح!</h2>
            <p className="text-sm font-bold text-gray-500 leading-relaxed mb-8">لقد وصل طلبك لبوفيه المجمع.. مشروبك المفضل في طريقه إليك الآن في {selectedClinic}.</p>
            <button onClick={() => setShowOrderSuccess(false)} className="bg-amber-950 text-white px-12 py-3 rounded-full text-sm font-black hover:bg-orange-600 transition-all shadow-xl active:scale-90">حسناً</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9) translateY(40px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.17, 1, 0.2, 1) forwards; }
        @keyframes pulse-subtle { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        .animate-pulse-subtle { animation: pulse-subtle 3s infinite ease-in-out; }
        body { background-color: #fffcf8; -webkit-tap-highlight-color: transparent; }
        * { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
};

export default App;
