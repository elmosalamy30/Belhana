
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MENU_ITEMS, DOCTOR_ADS, ADMIN_PASSWORD, ADMIN_WHATSAPP } from './constants';
import { Drink, Order, OrderItem, CLINICS, DoctorAd } from './types';

const LOGO_URL = "https://archive.org/download/t-401769435886279/__ia_thumb.jpg";
const GLOBAL_SYNC_ID = "bal_hana_v6_messaging_system"; 
const API_URL = `https://kvdb.io/6E3qV3pE9yU5vH7N9w4G9x/${GLOBAL_SYNC_ID}`;

const Icons = {
  Coffee: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>,
  Admin: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  WhatsApp: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Bell: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Note: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/></svg>
};

interface CartItem { drink: Drink; quantity: number; }

const App: React.FC = () => {
  const [view, setView] = useState<'menu' | 'cart' | 'admin'>('menu');
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [selectedClinic, setSelectedClinic] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("-");
  const [isSyncing, setIsSyncing] = useState(false);
  const [adminFilter, setAdminFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('pending');
  
  const notificationSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3')); // صوت رنة رسالة
  const prevOrdersRef = useRef<string[]>([]);

  // مزامنة البيانات مع السحابة
  const fetchOrders = async (): Promise<Order[]> => {
    try {
      setIsSyncing(true);
      const response = await fetch(`${API_URL}?cb=${Date.now()}`, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setLastSyncTime(new Date().toLocaleTimeString('ar-EG'));
        return Array.isArray(data) ? data : [];
      }
    } catch (e) { console.error("خطأ في الاتصال"); }
    finally { setIsSyncing(false); }
    return [];
  };

  const saveOrders = async (data: Order[]) => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) { console.error("خطأ في الحفظ"); }
  };

  // المزامنة التلقائية
  useEffect(() => {
    const sync = async () => {
      const latest = await fetchOrders();
      setOrders(latest);

      // تنبيه صوتي للطلبات الجديدة فقط
      if (view === 'admin' && latest.length > 0) {
        const newOrderIds = latest.filter(o => o.status === 'pending').map(o => o.id);
        const hasNew = newOrderIds.some(id => !prevOrdersRef.current.includes(id));
        if (hasNew) {
          notificationSound.current.play().catch(() => {});
          prevOrdersRef.current = newOrderIds;
        }
      }
    };
    sync();
    const timer = setInterval(sync, view === 'admin' ? 4000 : 20000);
    return () => clearInterval(timer);
  }, [view]);

  const cartTotalPrice = useMemo(() => 
    Object.values(cart).reduce((sum, item) => sum + (item.drink.price * item.quantity), 0), [cart]);

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
    if (!selectedClinic || !contactInfo.trim()) { alert("أكمل البيانات"); return; }

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 5).toUpperCase(),
      items: Object.values(cart).map(i => ({ drinkId: i.drink.id, drinkName: i.drink.name, quantity: i.quantity, price: i.drink.price })),
      totalPrice: cartTotalPrice,
      clinicName: selectedClinic,
      contactInfo: contactInfo.trim(),
      status: 'pending',
      timestamp: Date.now(),
      notes: orderNote.trim() || undefined
    };

    // 1. تسجيل في السحابة
    const latest = await fetchOrders();
    const updated = [...latest, newOrder];
    await saveOrders(updated);
    setOrders(updated);

    // 2. إرسال واتساب (اختياري لكنه يضمن التوصيل)
    const whatsappMsg = encodeURIComponent(
      `☕ *طلب جديد من تطبيق بالهنا*\n` +
      `--------------------------\n` +
      `📍 *العيادة:* ${newOrder.clinicName}\n` +
      `👤 *الاسم:* ${newOrder.contactInfo}\n` +
      `🥤 *الطلبات:* ${newOrder.items.map(i => `${i.drinkName} (x${i.quantity})`).join('، ')}\n` +
      `💰 *الإجمالي:* ${newOrder.totalPrice} ج.م\n` +
      (newOrder.notes ? `📝 *ملاحظات:* ${newOrder.notes}` : '')
    );
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${whatsappMsg}`, '_blank');

    setCart({});
    setShowOrderSuccess(true);
    setView('menu');
  };

  const updateStatus = async (id: string, s: Order['status']) => {
    const latest = await fetchOrders();
    const updated = latest.map(o => o.id === id ? { ...o, status: s } : o);
    setOrders(updated);
    await saveOrders(updated);
  };

  const filteredOrders = useMemo(() => {
    let list = orders.filter(o => adminFilter === 'all' ? true : o.status === adminFilter);
    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [orders, adminFilter]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-['Cairo'] pb-24">
      <header className="bg-amber-950 text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-lg border-b-2 border-orange-500">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-xl w-10 h-10"><img src={LOGO_URL} className="w-full h-full object-contain" /></div>
          <h1 className="font-black text-lg">بالهنا</h1>
        </div>
        <button onClick={() => view === 'admin' ? setView('menu') : (prompt("كلمة السر") === ADMIN_PASSWORD && setView('admin'))} className="text-[10px] bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
          {view === 'admin' ? 'القائمة' : 'لوحة المسؤول'}
        </button>
      </header>

      <main className="p-4 container mx-auto">
        {view === 'menu' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MENU_ITEMS.map(drink => (
                <div key={drink.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-amber-50 flex">
                  <img src={drink.image} className="w-24 h-24 object-cover" />
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h3 className="font-bold text-amber-950 text-sm">{drink.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-600 font-black text-xs">{drink.price} ج.م</span>
                      <div className="flex gap-2">
                        {cart[drink.id] && <button onClick={() => updateCart(drink, -1)} className="w-6 h-6 bg-amber-50 rounded-lg flex items-center justify-center">-</button>}
                        {cart[drink.id] && <span className="text-xs font-bold">{cart[drink.id].quantity}</span>}
                        <button onClick={() => updateCart(drink, 1)} className="w-6 h-6 bg-amber-950 text-white rounded-lg flex items-center justify-center">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* إعلانات الأطباء */}
            <div className="pt-6 border-t border-amber-50">
                <h2 className="text-sm font-black mb-4 opacity-50">دكاترة مجمع هنا الطبي 🏥</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {DOCTOR_ADS.map(d => (
                        <div key={d.id} className="min-w-[200px] bg-white p-3 rounded-2xl border border-amber-50 flex items-center gap-3 shadow-sm">
                            <img src={d.image} className="w-10 h-10 rounded-full object-cover" />
                            <div className="text-[10px]">
                                <div className="font-black text-amber-950">{d.name}</div>
                                <div className="text-gray-400">{d.specialty}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-xl space-y-4">
                <h2 className="font-black text-center text-xl">تأكيد الطلب 🧾</h2>
                <div className="space-y-2">
                    {Object.values(cart).map(i => (
                        <div key={i.drink.id} className="flex justify-between text-sm">
                            <span>{i.drink.name} (x{i.quantity})</span>
                            <span className="font-bold">{i.drink.price * i.quantity} ج.م</span>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-2 flex justify-between font-black text-orange-600">
                    <span>الإجمالي</span>
                    <span>{cartTotalPrice} ج.م</span>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-xl space-y-4">
                <div className="space-y-4">
                    <select value={selectedClinic} onChange={e => setSelectedClinic(e.target.value)} className="w-full p-4 rounded-xl bg-amber-50 border-none font-bold text-sm">
                        <option value="">اختر العيادة / المكان</option>
                        {CLINICS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input value={contactInfo} onChange={e => setContactInfo(e.target.value)} placeholder="اسم الدكتور / الموظف" className="w-full p-4 rounded-xl bg-amber-50 border-none font-bold text-sm" />
                    <input value={orderNote} onChange={e => setOrderNote(e.target.value)} placeholder="ملاحظات (سكر، نوع البن..)" className="w-full p-4 rounded-xl bg-amber-50 border-none font-bold text-sm" />
                </div>
                <button onClick={handlePlaceOrder} className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-amber-950 transition-all">تأكيد وإرسال للمسؤول</button>
            </div>
          </div>
        )}

        {view === 'admin' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="font-black text-amber-950">مركز استقبال الطلبات الحية</h2>
                    <p className="text-[10px] text-emerald-600 flex items-center gap-1">● متصل الآن • آخر تحديث: {lastSyncTime}</p>
                </div>
                <div className="flex gap-2">
                    {['pending', 'completed', 'all'].map(f => (
                        <button key={f} onClick={() => setAdminFilter(f as any)} className={`px-4 py-2 rounded-xl text-[10px] font-black ${adminFilter === f ? 'bg-orange-600 text-white' : 'bg-amber-50 text-amber-900'}`}>
                            {f === 'pending' ? 'الواردة' : f === 'completed' ? 'المنتهية' : 'الكل'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
              {filteredOrders.length === 0 ? <div className="text-center py-20 opacity-20 font-black">لا توجد رسائل جديدة..</div> : 
               filteredOrders.map(o => (
                <div key={o.id} className={`bg-white p-5 rounded-3xl shadow-md border-r-8 relative overflow-hidden transition-all ${o.status === 'pending' ? 'border-orange-500 animate-pulse-subtle' : 'border-gray-200 opacity-60'}`}>
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <div className="font-black text-lg text-amber-950">{o.clinicName}</div>
                            <div className="text-xs font-bold text-orange-600 flex items-center gap-1"><Icons.User /> {o.contactInfo}</div>
                        </div>
                        <div className="text-[10px] bg-amber-50 px-2 py-1 rounded-lg">#{o.id}</div>
                    </div>
                    <div className="bg-amber-50/50 p-3 rounded-2xl mb-4 space-y-1">
                        {o.items.map((i, idx) => (
                            <div key={idx} className="text-sm font-bold flex justify-between">
                                <span>{i.drinkName}</span>
                                <span>x{i.quantity}</span>
                            </div>
                        ))}
                        {o.notes && <div className="text-[11px] text-blue-600 pt-2 border-t mt-2 flex items-center gap-1"><Icons.Note /> {o.notes}</div>}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-black text-amber-950">{o.totalPrice} ج.م</span>
                        <div className="flex gap-2">
                            {o.status === 'pending' ? (
                                <>
                                    <button onClick={() => updateStatus(o.id, 'completed')} className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg">تم التوصيل ✔</button>
                                    <button onClick={() => updateStatus(o.id, 'cancelled')} className="bg-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-black">إلغاء</button>
                                </>
                            ) : (
                                <button onClick={() => updateStatus(o.id, 'pending')} className="text-[10px] text-gray-400">إعادة فتح</button>
                            )}
                        </div>
                    </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {view === 'menu' && Object.keys(cart).length > 0 && (
        <div className="fixed bottom-0 inset-x-0 p-4 bg-white/80 backdrop-blur-md border-t border-amber-50 flex justify-between items-center">
            <div className="font-black">الإجمالي: {cartTotalPrice} ج.م</div>
            <button onClick={() => setView('cart')} className="bg-orange-600 text-white px-8 py-3 rounded-xl font-black shadow-lg">إتمام الطلب 🛒</button>
        </div>
      )}

      {showOrderSuccess && (
        <div className="fixed inset-0 bg-amber-950/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-[40px] text-center max-w-sm space-y-6">
                <div className="text-5xl">✅</div>
                <h2 className="text-2xl font-black text-orange-600">تم إرسال طلبك!</h2>
                <p className="text-sm font-bold opacity-60">تم تسجيل طلبك في النظام وفتح واتساب المسؤول للتأكيد.</p>
                <button onClick={() => setShowOrderSuccess(false)} className="w-full bg-amber-950 text-white py-4 rounded-2xl font-black">حسناً</button>
            </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-subtle { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.01); box-shadow: 0 10px 30px rgba(249, 115, 22, 0.1); } }
        .animate-pulse-subtle { animation: pulse-subtle 2s infinite ease-in-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default App;
