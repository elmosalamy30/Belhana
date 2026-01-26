
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MENU_ITEMS, DOCTOR_ADS, ADMIN_PASSWORD } from './constants';
import { Drink, Order, OrderItem, CLINICS, DoctorAd } from './types';

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
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('bel_hana_sound');
    return saved === null ? true : saved === 'true';
  });
  
  const [notificationSound] = useState(() => new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));
  const prevPendingCount = useRef(0);

  useEffect(() => {
    const savedOrders = localStorage.getItem('bel_hana_orders');
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        setOrders(parsed);
        prevPendingCount.current = parsed.filter((o: Order) => o.status === 'pending').length;
      } catch (e) {
        console.error("فشل تحميل الطلبات");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bel_hana_orders', JSON.stringify(orders));
    localStorage.setItem('bel_hana_sound', String(isSoundEnabled));

    const currentPendingCount = orders.filter(o => o.status === 'pending').length;
    
    // Play sound only if new orders arrived and sound is enabled and we are in admin view
    if (view === 'admin' && isSoundEnabled && currentPendingCount > prevPendingCount.current) {
      notificationSound.play().catch(() => {});
    }
    
    prevPendingCount.current = currentPendingCount;
  }, [orders, view, isSoundEnabled, notificationSound]);

  const cartItemsCount = useMemo(() => 
    (Object.values(cart) as CartItem[]).reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const cartTotalPrice = useMemo(() => 
    (Object.values(cart) as CartItem[]).reduce((sum, item) => sum + (item.drink.price * item.quantity), 0), [cart]);

  const updateCart = (drink: Drink, delta: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      const current = newCart[drink.id] || { drink, quantity: 0 };
      const newQuantity = Math.max(0, current.quantity + delta);
      
      if (newQuantity === 0) {
        delete newCart[drink.id];
      } else {
        newCart[drink.id] = { ...current, quantity: newQuantity };
      }
      return newCart;
    });
  };

  const handlePlaceOrder = () => {
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
      id: Math.random().toString(36).substr(2, 9),
      items: orderItems,
      totalPrice: cartTotalPrice,
      clinicName: selectedClinic,
      contactInfo: contactInfo.trim(),
      status: 'pending',
      timestamp: Date.now(),
      notes: orderNote.trim() || undefined
    };

    setOrders(prev => [...prev, newOrder]);
    setCart({});
    setSelectedClinic("");
    setContactInfo("");
    setOrderNote("");
    setShowOrderSuccess(true);
    setView('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setShowOrderSuccess(false), 3000);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status } : order
    ));
  };

  const handleAdminLogin = () => {
    const pass = prompt("الرجاء إدخال كلمة المرور السرية:");
    if (pass === ADMIN_PASSWORD) {
      setView('admin');
    } else {
      alert("كلمة مرور خاطئة!");
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-gray-50 text-gray-800">
      <header className="bg-emerald-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('menu')}>
            <div className="bg-white p-2 rounded-full shadow-inner">
              <Icons.Coffee />
            </div>
            <div>
              <h1 className="text-2xl font-bold">بالهنا</h1>
              <p className="text-xs text-emerald-100">مجمع هنا الطبي</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => view === 'admin' ? setView('menu') : handleAdminLogin()}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 px-4 py-2 rounded-lg transition-colors text-sm font-bold"
            >
              {view === 'admin' ? (
                <><Icons.Coffee /> <span>العودة للمنيو</span></>
              ) : (
                <><Icons.Admin /> <span>المسؤول</span></>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {view === 'menu' && (
          <div className="space-y-12 animate-fadeIn">
            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                قائمة المشروبات
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MENU_ITEMS.map(drink => {
                  const qty = cart[drink.id]?.quantity || 0;
                  return (
                    <div key={drink.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border-2 ${qty > 0 ? 'border-emerald-500' : 'border-gray-100'}`}>
                      <div className="relative h-48 overflow-hidden">
                        <img src={drink.image} alt={drink.name} className="w-full h-full object-cover" />
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-emerald-700 shadow-sm">
                          {drink.price} ج.م
                        </div>
                        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${drink.category === 'hot' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                          {drink.category === 'hot' ? 'ساخن' : 'غازي'}
                        </div>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <h3 className="font-bold text-lg">{drink.name}</h3>
                        <div className="flex items-center gap-3">
                          {qty > 0 && (
                            <>
                              <button onClick={() => updateCart(drink, -1)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"><Icons.Minus /></button>
                              <span className="font-bold text-lg min-w-[20px] text-center">{qty}</span>
                            </>
                          )}
                          <button onClick={() => updateCart(drink, 1)} className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-600"><Icons.Plus /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                أطباؤنا المتميزون بالمجمع
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DOCTOR_ADS.map(doctor => (
                  <div key={doctor.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all">
                    <img src={doctor.image} alt={doctor.name} className="w-20 h-20 rounded-full object-cover border-2 border-emerald-50" />
                    <div className="flex-1">
                      <div className="font-black text-gray-800">{doctor.name}</div>
                      <div className="text-sm text-emerald-600 font-bold mb-1">{doctor.specialty}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Icons.Check /> {doctor.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-700 p-6 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg overflow-hidden relative">
                <div className="absolute -right-10 -top-10 opacity-10 transform rotate-12">
                   <Icons.Coffee />
                </div>
                <div className="z-10">
                  <h3 className="text-xl font-black mb-1">ضع إعلان عيادتك هنا!</h3>
                  <p className="text-emerald-50 text-sm font-bold">للتواصل بخصوص الإعلانات داخل تطبيق "بالهنا"، يرجى التواصل مع إدارة المجمع.</p>
                </div>
                <button className="z-10 bg-white text-emerald-700 px-8 py-3 rounded-xl font-black hover:bg-emerald-50 transition-colors shadow-md text-sm whitespace-nowrap">
                   تواصل معنا الآن
                </button>
              </div>
            </section>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
            <button onClick={() => setView('menu')} className="flex items-center gap-2 text-emerald-600 font-bold hover:underline mb-4">
              <Icons.ChevronLeft /> العودة للقائمة
            </button>
            
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b font-bold text-lg flex items-center gap-2">
                <Icons.Cart /> ملخص السلة
              </div>
              <div className="divide-y divide-gray-100">
                {(Object.values(cart) as CartItem[]).map(item => (
                  <div key={item.drink.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={item.drink.image} className="w-16 h-16 rounded-xl object-cover" alt="" />
                      <div>
                        <div className="font-bold">{item.drink.name}</div>
                        <div className="text-sm text-gray-500">{item.drink.price} ج.م × {item.quantity}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-bold text-emerald-700">{item.drink.price * item.quantity} ج.م</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateCart(item.drink, -1)} className="p-1 hover:text-red-500 transition-colors"><Icons.Minus /></button>
                        <span className="font-bold">{item.quantity}</span>
                        <button onClick={() => updateCart(item.drink, 1)} className="p-1 hover:text-emerald-500 transition-colors"><Icons.Plus /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-emerald-50 flex justify-between items-center">
                <span className="text-emerald-800 font-bold text-lg">إجمالي السلة:</span>
                <span className="text-emerald-700 font-black text-2xl">{cartTotalPrice} ج.م</span>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 space-y-8">
              <h2 className="text-xl font-bold text-emerald-800 border-b pb-4">بيانات التوصيل والتواصل</h2>
              
              <div>
                <label className="block text-gray-700 font-bold mb-4">أين أنت الآن؟ (العيادة/القسم):</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {CLINICS.map(clinic => (
                    <button
                      key={clinic}
                      onClick={() => setSelectedClinic(clinic)}
                      className={`p-3 text-sm rounded-xl border-2 transition-all ${
                        selectedClinic === clinic 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold shadow-sm' 
                        : 'border-gray-100 hover:border-emerald-200 bg-gray-50'
                      }`}
                    >
                      {clinic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                    <Icons.User /> اسم صاحب الطلب:
                  </label>
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="اكتب اسمك هنا..."
                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                    <Icons.Note /> ملاحظات (مثلاً: سكر خفيف):
                  </label>
                  <textarea
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="أي تعليمات إضافية..."
                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm resize-none h-24"
                  ></textarea>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={!selectedClinic || !contactInfo.trim()}
                className={`w-full py-5 rounded-2xl font-bold text-xl shadow-lg transition-all flex items-center justify-center gap-3 ${selectedClinic && contactInfo.trim() ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                تأكيد وإرسال الطلب ( {cartTotalPrice} ج.م )
                <Icons.Check />
              </button>
            </section>
          </div>
        )}

        {view === 'admin' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-2 h-8 bg-orange-500 rounded-full inline-block"></span>
                طلبات البوفيه الجارية
              </h2>
              <button 
                onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all font-bold text-sm ${isSoundEnabled ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                title={isSoundEnabled ? "تنبيهات الصوت مفعلة" : "تنبيهات الصوت صامتة"}
              >
                {isSoundEnabled ? <><Icons.Bell /> صوت التنبيه: يعمل</> : <><Icons.BellOff /> صوت التنبيه: صامت</>}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="font-bold text-lg text-emerald-700 flex items-center gap-2">
                  🔔 طلبات جديدة {orders.filter(o => o.status === 'pending').length > 0 && `(${orders.filter(o => o.status === 'pending').length})`}
                </h3>
                {orders.filter(o => o.status === 'pending').length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-bold italic">كل شيء هادئ الآن..</div>
                ) : (
                  orders.filter(o => o.status === 'pending').map(order => (
                    <div key={order.id} className="bg-white p-5 rounded-2xl shadow-md border-r-8 border-emerald-500 relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-emerald-700 font-black text-xl mb-1">{order.clinicName}</div>
                          <div className="flex items-center gap-2 text-gray-700 font-bold bg-gray-100 px-3 py-1 rounded-full w-fit">
                            <Icons.User /> {order.contactInfo}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs text-gray-400">{new Date(order.timestamp).toLocaleTimeString('ar-EG')}</span>
                          <span className="font-black text-emerald-600 text-lg">{order.totalPrice} ج.م</span>
                        </div>
                      </div>
                      
                      <div className="bg-emerald-50 rounded-xl p-4 space-y-2 mb-4 border border-emerald-100">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm font-bold">
                            <span>{item.drinkName} × {item.quantity}</span>
                            <span className="text-emerald-600">{item.price * item.quantity} ج.م</span>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <div className="bg-orange-50 p-3 rounded-xl border border-orange-200 text-sm text-orange-800 italic flex items-center gap-2 mb-4">
                          <Icons.Note /> {order.notes}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button onClick={() => updateOrderStatus(order.id, 'completed')} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 shadow-sm flex items-center justify-center gap-2">
                          <Icons.Check /> تم التحضير
                        </button>
                        <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="px-4 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition-colors">
                          <Icons.Trash />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-500">سجل اليوم</h3>
                <div className="space-y-3">
                  {orders.filter(o => o.status !== 'pending').sort((a,b) => b.timestamp - a.timestamp).slice(0, 10).map(order => (
                    <div key={order.id} className={`p-4 rounded-xl border-2 flex justify-between items-center ${order.status === 'completed' ? 'bg-white border-gray-100' : 'bg-red-50 border-red-100 opacity-60'}`}>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-700">{order.clinicName} - {order.contactInfo}</span>
                        <span className="text-xs text-gray-500">{order.items.length} منتجات • {order.totalPrice} ج.م</span>
                      </div>
                      <div className={`text-xs font-black px-3 py-1 rounded-full ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {order.status === 'completed' ? '✓ اكتمل' : '✗ ألغي'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Cart for Menu View */}
      {view === 'menu' && cartItemsCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 p-4 bg-white/95 backdrop-blur-md border-t border-emerald-100 shadow-2xl z-[60] animate-fadeIn">
           <div className="container mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                 <div className="relative">
                    <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg">
                       <Icons.Cart />
                    </div>
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                       {cartItemsCount}
                    </span>
                 </div>
                 <div>
                    <div className="font-black text-emerald-800 text-lg">سلتك الحالية</div>
                    <div className="text-sm text-emerald-600 font-bold">المجموع: {cartTotalPrice} ج.م</div>
                 </div>
              </div>
              <button 
                onClick={() => setView('cart')}
                className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-3"
              >
                مراجعة الطلب
                <Icons.ChevronLeft />
              </button>
           </div>
        </div>
      )}

      {showOrderSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-emerald-800 text-white px-10 py-5 rounded-3xl shadow-2xl z-[100] animate-bounce font-black border-4 border-emerald-400 text-center">
          ☕ تم استلام طلبك بنجاح!<br/>
          <span className="text-sm font-bold opacity-80">سيصلك المشروب إلى {selectedClinic} خلال دقائق</span>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        body { background-color: #f9fafb; -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
};

export default App;
