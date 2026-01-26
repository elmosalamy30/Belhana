
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MENU_ITEMS, DOCTOR_ADS, ADMIN_PASSWORD } from './constants';
import { Drink, Order, OrderItem, CLINICS, DoctorAd } from './types';

const LOGO_URL = "https://archive.org/download/t-401769435886279/__ia_thumb.jpg";
// معرف مخصص للمجمع لضمان الخصوصية والمزامنة الصحيحة
const SYNC_BUCKET_ID = "bal_hana_v2_clinic_room_99"; 
const SYNC_API_URL = `https://kvdb.io/6E3qV3pE9yU5vH7N9w4G9x/${SYNC_BUCKET_ID}`;

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
  const prevPendingCount = useRef(0);

  // وظيفة لجلب أحدث البيانات مع منع التخزين المؤقت (Cache Busting)
  const fetchOrdersFromCloud = async () => {
    try {
      setIsSyncing(true);
      // إضافة باراميتر عشوائي لضمان عدم استلام نسخة قديمة من الكاش
      const response = await fetch(`${SYNC_API_URL}?t=${Date.now()}`, {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      
      if (response.ok) {
        const cloudOrders = await response.json();
        if (Array.isArray(cloudOrders)) {
          setOrders(cloudOrders);
          localStorage.setItem('bel_hana_orders', JSON.stringify(cloudOrders));
          setLastSyncTime(new Date().toLocaleTimeString('ar-EG'));
        }
      }
    } catch (e) {
      console.warn("جاري محاولة المزامنة...");
    } finally {
      setIsSyncing(false);
    }
  };

  // وظيفة لرفع البيانات للسحابة
  const pushOrdersToCloud = async (updatedOrders: Order[]) => {
    try {
      setIsSyncing(true);
      await fetch(SYNC_API_URL, {
        method: 'POST',
        body: JSON.stringify(updatedOrders),
        headers: { 'Content-Type': 'application/json' }
      });
      setLastSyncTime(new Date().toLocaleTimeString('ar-EG'));
    } catch (e) {
      console.error("فشل إرسال البيانات");
    } finally {
      setIsSyncing(false);
    }
  };

  // المزامنة التلقائية (كل 5 ثوانٍ للمسؤول، وكل 30 ثانية للمستخدم)
  useEffect(() => {
    fetchOrdersFromCloud();
    const intervalTime = view === 'admin' ? 5000 : 30000;
    const interval = setInterval(fetchOrdersFromCloud, intervalTime);
    return () => clearInterval(interval);
  }, [view]);

  // التنبيه الصوتي
  useEffect(() => {
    const currentPendingCount = orders.filter(o => o.status === 'pending').length;
    if (isSoundEnabled && currentPendingCount > prevPendingCount.current) {
      if (view === 'admin') {
        notificationSound.play().catch(() => {});
      }
    }
    prevPendingCount.current = currentPendingCount;
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

    // المزامنة قبل الإرسال لضمان عدم مسح طلبات الآخرين
    setIsSyncing(true);
    let currentOrders: Order[] = [];
    try {
        const response = await fetch(`${SYNC_API_URL}?t=${Date.now()}`);
        if (response.ok) currentOrders = await response.json();
    } catch(e) {}

    const updatedOrders = [...(Array.isArray(currentOrders) ? currentOrders : []), newOrder];
    setOrders(updatedOrders);
    await pushOrdersToCloud(updatedOrders);
    
    setCart({});
    setSelectedClinic("");
    setContactInfo("");
    setOrderNote("");
    setShowOrderSuccess(true);
    setView('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setShowOrderSuccess(false), 4000);
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === id ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    await pushOrdersToCloud(updatedOrders);
  };

  const handleAdminLogin = () => {
    const pass = prompt("الرجاء إدخال كلمة المرور السرية للمسؤول:");
    if (pass === ADMIN_PASSWORD) {
      setView('admin');
      fetchOrdersFromCloud();
    } else if (pass !== null) {
      alert("كلمة مرور خاطئة!");
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-amber-50/30 text-gray-800 font-['Cairo']">
      <header className="bg-amber-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('menu')}>
            <div className="bg-white p-1 rounded-xl shadow-inner w-14 h-14 overflow-hidden flex items-center justify-center">
              <img src={LOGO_URL} alt="بالهنا" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-black leading-none">بالهنا</h1>
              <p className="text-[10px] text-amber-200 mt-1 font-bold">مجمع هنا الطبي • مشروبات</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => view === 'admin' ? setView('menu') : handleAdminLogin()}
              className="flex items-center gap-2 bg-amber-800 hover:bg-amber-700 px-4 py-2 rounded-xl transition-all text-xs font-bold border border-amber-700/50 active:scale-95"
            >
              {view === 'admin' ? (
                <><Icons.Coffee /> <span>القائمة</span></>
              ) : (
                <><Icons.Admin /> <span>المسؤول</span></>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {view === 'menu' && (
          <div className="space-y-10 animate-fadeIn">
            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-amber-950">
                <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                اطلب مشروبك الآن
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {MENU_ITEMS.map(drink => {
                  const qty = cart[drink.id]?.quantity || 0;
                  return (
                    <div key={drink.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border-2 ${qty > 0 ? 'border-orange-500 bg-orange-50/10' : 'border-gray-100'}`}>
                      <div className="relative h-44 overflow-hidden">
                        <img src={drink.image} alt={drink.name} className="w-full h-full object-cover" />
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-black text-amber-950 shadow-sm border border-amber-100">
                          {drink.price} ج.م
                        </div>
                        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm ${drink.category === 'hot' ? 'bg-orange-600' : 'bg-blue-600'}`}>
                          {drink.category === 'hot' ? 'ساخن' : 'بارد'}
                        </div>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <h3 className="font-bold text-base text-amber-950">{drink.name}</h3>
                        <div className="flex items-center gap-3">
                          {qty > 0 && (
                            <>
                              <button onClick={() => updateCart(drink, -1)} className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-900 hover:bg-amber-100 border border-amber-100"><Icons.Minus /></button>
                              <span className="font-black text-base min-w-[15px] text-center text-amber-950">{qty}</span>
                            </>
                          )}
                          <button onClick={() => updateCart(drink, 1)} className="w-8 h-8 rounded-full bg-amber-800 flex items-center justify-center text-white hover:bg-amber-900 shadow-md transition-all active:scale-90"><Icons.Plus /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="pt-8 border-t border-amber-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-amber-950">
                <span className="w-2 h-8 bg-amber-700 rounded-full"></span>
                أطباؤنا في المجمع
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DOCTOR_ADS.map(doctor => (
                  <div key={doctor.id} className="bg-white p-4 rounded-2xl shadow-sm border border-amber-50 flex items-center gap-4">
                    <img src={doctor.image} alt={doctor.name} className="w-14 h-14 rounded-full object-cover border-2 border-amber-100 shadow-inner" />
                    <div className="flex-1">
                      <div className="font-bold text-amber-950 text-sm">{doctor.name}</div>
                      <div className="text-[10px] text-orange-600 font-bold mb-0.5">{doctor.specialty}</div>
                      <div className="text-[9px] text-gray-400 flex items-center gap-1">
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
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <button onClick={() => setView('menu')} className="flex items-center gap-2 text-amber-800 font-bold hover:underline mb-2 text-sm">
              <Icons.ChevronLeft /> العودة واختيار المزيد
            </button>
            
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-100">
              <div className="bg-amber-50/50 px-6 py-4 border-b border-amber-100 font-black text-lg text-amber-900 flex items-center gap-2">
                <Icons.Cart /> سلة الطلبات
              </div>
              <div className="divide-y divide-amber-50">
                {(Object.values(cart) as CartItem[]).map(item => (
                  <div key={item.drink.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={item.drink.image} className="w-14 h-14 rounded-xl object-cover shadow-sm" alt="" />
                      <div>
                        <div className="font-bold text-amber-950 text-sm">{item.drink.name}</div>
                        <div className="text-xs text-gray-400">{item.drink.price} ج.م للواحد</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-black text-orange-600 text-sm">{item.drink.price * item.quantity} ج.م</div>
                      <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-1 border border-amber-100">
                        <button onClick={() => updateCart(item.drink, -1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500"><Icons.Minus /></button>
                        <span className="font-bold text-amber-900 text-sm min-w-[15px] text-center">{item.quantity}</span>
                        <button onClick={() => updateCart(item.drink, 1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-amber-700"><Icons.Plus /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-5 bg-amber-900 text-white flex justify-between items-center">
                <span className="font-bold">إجمالي المبلغ:</span>
                <span className="font-black text-2xl">{cartTotalPrice} ج.م</span>
              </div>
            </div>

            <section className="bg-white p-6 rounded-3xl shadow-xl border border-amber-100 space-y-6">
              <h2 className="text-lg font-black text-amber-950 flex items-center gap-2">
                 📍 أين نرسل الطلب؟
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {CLINICS.map(clinic => (
                  <button
                    key={clinic}
                    onClick={() => setSelectedClinic(clinic)}
                    className={`p-3 text-[11px] rounded-xl border-2 transition-all font-bold ${
                      selectedClinic === clinic 
                      ? 'border-orange-500 bg-orange-50 text-orange-800 shadow-md' 
                      : 'border-amber-50 hover:border-amber-200 bg-amber-50/20 text-gray-500'
                    }`}
                  >
                    {clinic}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-amber-900 flex items-center gap-2">
                    <Icons.User /> اسمك (صاحب الطلب):
                  </label>
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="اكتب اسم الدكتور أو الموظف..."
                    className="w-full p-4 rounded-2xl border border-amber-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-sm bg-amber-50/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-amber-900 flex items-center gap-2">
                    <Icons.Note /> ملاحظات إضافية:
                  </label>
                  <input
                    type="text"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="مثلاً: سكر زيادة، بارد جداً..."
                    className="w-full p-4 rounded-2xl border border-amber-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-sm bg-amber-50/10"
                  />
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={!selectedClinic || !contactInfo.trim() || isSyncing}
                className={`w-full py-5 rounded-2xl font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-3 ${selectedClinic && contactInfo.trim() && !isSyncing ? 'bg-amber-900 text-white hover:bg-black active:scale-95' : 'bg-amber-100 text-amber-300 cursor-not-allowed'}`}
              >
                {isSyncing ? (
                   <span className="flex items-center gap-2 animate-pulse">
                      <Icons.CloudSync /> جاري إرسال الطلب...
                   </span>
                ) : (
                   <>تأكيد الطلب ({cartTotalPrice} ج.م) <Icons.Check /></>
                )}
              </button>
            </section>
          </div>
        )}

        {view === 'admin' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-amber-100 shadow-sm">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-amber-950 flex items-center gap-2">
                  <span className="w-2 h-8 bg-orange-600 rounded-full"></span>
                  لوحة التحكم المركزية
                </h2>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${isSyncing ? 'text-orange-500' : 'text-emerald-600'}`}>
                    <Icons.Wifi /> {isSyncing ? 'جاري التحديث...' : `متصل بالسحابة • تحديث: ${lastSyncTime}`}
                  </div>
                  <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-orange-500 animate-ping' : 'bg-emerald-500 shadow-sm shadow-emerald-200'}`}></div>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={fetchOrdersFromCloud}
                  className="flex-1 md:flex-none p-3 bg-white rounded-xl border border-amber-100 text-amber-800 hover:bg-amber-50 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Icons.CloudSync /> تحديث يدوي
                </button>
                <button 
                  onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all font-bold text-xs ${isSoundEnabled ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                >
                  {isSoundEnabled ? <Icons.Bell /> : <Icons.BellOff />}
                  <span>تنبيه: {isSoundEnabled ? 'يعمل' : 'صامت'}</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-100">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-amber-950 text-white">
                      <th className="p-4 font-bold text-xs">ID</th>
                      <th className="p-4 font-bold text-xs">الموقع (العيادة)</th>
                      <th className="p-4 font-bold text-xs">صاحب الطلب</th>
                      <th className="p-4 font-bold text-xs">مكونات الطلب</th>
                      <th className="p-4 font-bold text-xs">الوقت</th>
                      <th className="p-4 font-bold text-xs">المبلغ</th>
                      <th className="p-4 font-bold text-xs">الحالة</th>
                      <th className="p-4 font-bold text-xs text-center">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-50">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-16 text-center text-amber-200 font-bold italic bg-amber-50/10">
                          لا توجد طلبات في السجل حالياً
                        </td>
                      </tr>
                    ) : (
                      orders.sort((a, b) => b.timestamp - a.timestamp).map((order) => (
                        <tr key={order.id} className={`hover:bg-amber-50/50 transition-colors ${order.status === 'pending' ? 'bg-orange-50/20' : ''}`}>
                          <td className="p-4 text-[10px] font-mono text-gray-400">#{order.id}</td>
                          <td className="p-4 font-black text-amber-900 text-sm">{order.clinicName}</td>
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-800 text-xs">{order.contactInfo}</span>
                              {order.notes && (
                                <span className="text-[9px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full w-fit mt-1">
                                  📌 {order.notes}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {order.items.map((item, idx) => (
                                <span key={idx} className="bg-amber-100 text-amber-900 text-[9px] px-2 py-1 rounded-lg font-bold">
                                  {item.drinkName} (x{item.quantity})
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-[10px] font-bold text-gray-500">
                            {new Date(order.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-4 font-black text-amber-950 text-sm">{order.totalPrice} ج.م</td>
                          <td className="p-4">
                            <span className={`text-[9px] font-black px-3 py-1.5 rounded-full inline-block ${
                              order.status === 'pending' ? 'bg-orange-600 text-white animate-pulse' :
                              order.status === 'completed' ? 'bg-emerald-500 text-white' :
                              'bg-red-500 text-white'
                            }`}>
                              {order.status === 'pending' ? 'انتظار' :
                               order.status === 'completed' ? 'تم' : 'ملغي'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              {order.status === 'pending' ? (
                                <>
                                  <button 
                                    onClick={() => updateOrderStatus(order.id, 'completed')}
                                    className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 shadow-sm active:scale-90 transition-all"
                                  >
                                    <Icons.Check />
                                  </button>
                                  <button 
                                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                    className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-sm active:scale-90 transition-all"
                                  >
                                    <Icons.Trash />
                                  </button>
                                </>
                              ) : (
                                <button 
                                  onClick={() => updateOrderStatus(order.id, 'pending')}
                                  className="text-[10px] font-bold text-amber-600 hover:bg-amber-50 px-3 py-1 rounded-lg transition-all"
                                >
                                  إعادة
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
        <div className="fixed bottom-0 inset-x-0 p-4 bg-white/95 backdrop-blur-lg border-t border-amber-100 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-[60] animate-fadeIn">
           <div className="container mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <div className="bg-amber-900 text-white p-3 rounded-2xl shadow-lg">
                       <Icons.Cart />
                    </div>
                    <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                       {cartItemsCount}
                    </span>
                 </div>
                 <div>
                    <div className="font-black text-amber-950 text-sm leading-tight">سلة المشروبات</div>
                    <div className="text-[10px] text-orange-600 font-black">المجموع: {cartTotalPrice} ج.م</div>
                 </div>
              </div>
              <button 
                onClick={() => setView('cart')}
                className="bg-amber-900 text-white px-8 py-3.5 rounded-2xl font-black text-base shadow-xl hover:bg-black active:scale-95 transition-all flex items-center gap-3"
              >
                مراجعة الطلب
                <Icons.ChevronLeft />
              </button>
           </div>
        </div>
      )}

      {showOrderSuccess && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-950 text-white px-8 py-10 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.4)] z-[100] animate-fadeIn font-black border-4 border-orange-500 text-center flex flex-col items-center gap-4 w-[90%] max-w-sm">
          <div className="w-24 h-24 bg-white rounded-3xl p-2 shadow-2xl border-4 border-amber-800 animate-bounce">
             <img src={LOGO_URL} className="w-full h-full object-contain" alt="" />
          </div>
          <div>
            <div className="text-2xl mb-1">بالهنا والشفاء!</div>
            <p className="text-xs font-bold text-amber-200 opacity-80 leading-relaxed px-4">تم إرسال طلبك للبوفيه بنجاح، المشروب في طريقه إليك الآن في {selectedClinic}.</p>
          </div>
          <button 
             onClick={() => setShowOrderSuccess(false)}
             className="bg-orange-500 text-white px-8 py-2 rounded-full text-xs hover:bg-orange-600 transition-all"
          >
             حسناً
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        body { background-color: #fffaf5; -webkit-tap-highlight-color: transparent; }
        * { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
};

export default App;
