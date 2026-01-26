
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MENU_ITEMS, DOCTOR_ADS, ADMIN_PASSWORD, ADMIN_WHATSAPP } from './constants';
import { Drink, Order, OrderItem, CLINICS, DoctorAd } from './types';

const LOGO_URL = "https://archive.org/download/t-401769435886279/__ia_thumb.jpg";
// معرف فريد جداً لضمان استقلالية البيانات
const GLOBAL_SYNC_ID = "bal_hana_v7_final_secure_sync_2025"; 
const API_URL = `https://kvdb.io/6E3qV3pE9yU5vH7N9w4G9x/${GLOBAL_SYNC_ID}`;

const Icons = {
  Coffee: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>,
  Admin: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  WhatsApp: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Bell: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
};

interface CartItem { drink: Drink; quantity: number; }

const App: React.FC = () => {
  const [view, setView] = useState<'menu' | 'cart' | 'admin'>('menu');
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [selectedClinic, setSelectedClinic] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastOrderLink, setLastOrderLink] = useState("");
  const [lastSyncTime, setLastSyncTime] = useState("-");
  const [adminFilter, setAdminFilter] = useState<'pending' | 'completed' | 'all'>('pending');
  
  const notificationSound = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3'));
  const prevOrdersRef = useRef<string[]>([]);

  // مزامنة البيانات
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
      const res = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(data.slice(-50)), // حفظ آخر 50 طلب فقط لسرعة الأداء
        headers: { 'Content-Type': 'application/json' }
      });
      return res.ok;
    } catch (e) { return false; }
  };

  useEffect(() => {
    fetchOrders();
    const timer = setInterval(fetchOrders, view === 'admin' ? 5000 : 30000);
    return () => clearInterval(timer);
  }, [view]);

  // صوت التنبيه للمسؤول
  useEffect(() => {
    if (view === 'admin' && orders.length > 0) {
      const pendingIds = orders.filter(o => o.status === 'pending').map(o => o.id);
      const hasNew = pendingIds.some(id => !prevOrdersRef.current.includes(id));
      if (hasNew) {
        notificationSound.current.play().catch(() => {});
        prevOrdersRef.current = pendingIds;
      }
    }
  }, [orders, view]);

  const cartTotalPrice = useMemo(() => 
    Object.values(cart).reduce((sum, item) => sum + (item.drink.price * item.quantity), 0), [cart]);

  // إضافة وتحديث عناصر السلة
  const updateCart = (drink: Drink, delta: number) => {
    setCart(prev => {
      const existing = prev[drink.id];
      const newQuantity = (existing ? existing.quantity : 0) + delta;
      
      if (newQuantity <= 0) {
        const next = { ...prev };
        delete next[drink.id];
        return next;
      }
      
      return {
        ...prev,
        [drink.id]: { drink, quantity: newQuantity }
      };
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedClinic || !contactInfo.trim()) { alert("يرجى اختيار العيادة والاسم"); return; }
    
    setIsPlacingOrder(true);
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

    const currentOrders = await fetchOrders() || orders;
    const updated = [...currentOrders, newOrder];
    
    const saved = await saveOrders(updated);
    if (!saved) {
      alert("عذراً، فشل الاتصال بالنظام. سنحاول الإرسال عبر الواتساب فقط.");
    }

    // تجهيز رابط الواتساب
    const msg = encodeURIComponent(
      `☕ *طلب مشروبات من تطبيق بالهنا*\n` +
      `--------------------------\n` +
      `📍 *العيادة:* ${newOrder.clinicName}\n` +
      `👤 *الاسم:* ${newOrder.contactInfo}\n` +
      `🥤 *الطلبات:* ${newOrder.items.map(i => `${i.drinkName} (x${i.quantity})`).join('، ')}\n` +
      `💰 *الإجمالي:* ${newOrder.totalPrice} ج.م\n` +
      (newOrder.notes ? `📝 *ملاحظات:* ${newOrder.notes}` : '')
    );
    setLastOrderLink(`https://wa.me/${ADMIN_WHATSAPP}?text=${msg}`);
    
    setCart({});
    setIsPlacingOrder(false);
    setShowSuccessModal(true);
  };

  const updateStatus = async (id: string, s: Order['status']) => {
    const current = await fetchOrders() || orders;
    const updated = current.map(o => o.id === id ? { ...o, status: s } : o);
    setOrders(updated);
    await saveOrders(updated);
  };

  const clearHistory = async () => {
    if (confirm("هل تريد مسح جميع الطلبات المنتهية لتسريع النظام؟")) {
      const active = orders.filter(o => o.status === 'pending');
      setOrders(active);
      await saveOrders(active);
    }
  };

  const filteredOrders = orders.filter(o => adminFilter === 'all' ? true : o.status === adminFilter).sort((a,b) => b.timestamp - a.timestamp);

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-gray-800 font-['Cairo'] pb-20">
      <header className="bg-amber-950 text-white p-4 sticky top-0 z-50 flex justify-between items-center border-b-4 border-orange-500 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-xl w-10 h-10 shadow-inner">
            <img src={LOGO_URL} className="w-full h-full object-contain" alt="بالهنا" />
          </div>
          <h1 className="font-black text-xl tracking-tight">بالهنا</h1>
        </div>
        <button 
          onClick={() => view === 'admin' ? setView('menu') : (prompt("كلمة السر") === ADMIN_PASSWORD && setView('admin'))}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-[11px] font-bold border border-white/5 transition-all"
        >
          {view === 'admin' ? 'الرجوع للمنيو' : 'لوحة الإدارة'}
        </button>
      </header>

      <main className="p-4 container mx-auto max-w-5xl">
        {view === 'menu' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {MENU_ITEMS.map(drink => (
                <div key={drink.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-amber-50 flex h-32 hover:shadow-md transition-shadow">
                  <img src={drink.image} className="w-32 h-full object-cover" alt={drink.name} />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="font-black text-amber-950">{drink.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-600 font-black">{drink.price} ج.م</span>
                      <div className="flex items-center gap-3 bg-amber-50 rounded-2xl p-1">
                        {cart[drink.id] && (
                          <button onClick={() => updateCart(drink, -1)} className="w-8 h-8 flex items-center justify-center font-bold text-lg">-</button>
                        )}
                        {cart[drink.id] && <span className="font-black text-sm">{cart[drink.id].quantity}</span>}
                        <button onClick={() => updateCart(drink, 1)} className="w-8 h-8 bg-amber-950 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-amber-50">
              <h2 className="text-sm font-black text-amber-900/40 mb-6 flex items-center gap-2">دكاترة مجمع هنا الطبي 🏥</h2>
              <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                {DOCTOR_ADS.map(d => (
                  <div key={d.id} className="min-w-[240px] bg-white p-4 rounded-3xl border border-amber-50 flex items-center gap-4 shadow-sm">
                    <img src={d.image} className="w-12 h-12 rounded-2xl object-cover" alt={d.name} />
                    <div className="leading-tight">
                      <div className="font-black text-amber-950 text-xs">{d.name}</div>
                      <div className="text-[10px] text-gray-400 font-bold">{d.specialty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-md mx-auto space-y-6 animate-in zoom-in-95 duration-300">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-amber-50">
              <h2 className="text-center font-black text-2xl mb-6">ملخص الطلب 🧺</h2>
              <div className="space-y-3 mb-6">
                {Object.values(cart).map(i => (
                  <div key={i.drink.id} className="flex justify-between items-center text-sm font-bold border-b border-amber-50 pb-2">
                    <span>{i.drink.name} <span className="text-orange-600">×{i.quantity}</span></span>
                    <span>{i.drink.price * i.quantity} ج.م</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center font-black text-xl text-amber-950">
                <span>الإجمالي</span>
                <span className="text-orange-600">{cartTotalPrice} ج.م</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-amber-50 space-y-5">
              <select value={selectedClinic} onChange={e => setSelectedClinic(e.target.value)} className="w-full p-4 rounded-2xl bg-amber-50 border-none font-black text-sm outline-none focus:ring-2 ring-orange-500">
                <option value="">أين أنت الآن؟ (اختر العيادة)</option>
                {CLINICS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input value={contactInfo} onChange={e => setContactInfo(e.target.value)} placeholder="اسم الدكتور أو الموظف" className="w-full p-4 rounded-2xl bg-amber-50 border-none font-black text-sm outline-none focus:ring-2 ring-orange-500" />
              <input value={orderNote} onChange={e => setOrderNote(e.target.value)} placeholder="ملاحظات (مثلاً: سكر زيادة)" className="w-full p-4 rounded-2xl bg-amber-50 border-none font-black text-sm outline-none focus:ring-2 ring-orange-500" />
              
              <button 
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className={`w-full py-5 rounded-2xl font-black text-xl shadow-lg transition-all ${isPlacingOrder ? 'bg-gray-400' : 'bg-orange-600 text-white hover:bg-amber-950 active:scale-95'}`}
              >
                {isPlacingOrder ? 'جاري الإرسال...' : 'تأكيد الطلب 🚀'}
              </button>
            </div>
          </div>
        )}

        {view === 'admin' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-5 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 border border-amber-100">
              <div className="text-center md:text-right">
                <h2 className="font-black text-amber-950 text-lg">مركز الطلبات الحية</h2>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 justify-center md:justify-start">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  تحديث تلقائي نشط • {lastSyncTime}
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {['pending', 'completed', 'all'].map(f => (
                  <button key={f} onClick={() => setAdminFilter(f as any)} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${adminFilter === f ? 'bg-orange-600 text-white shadow-md' : 'bg-amber-50 text-amber-900'}`}>
                    {f === 'pending' ? 'الواردة' : f === 'completed' ? 'المنتهية' : 'الكل'}
                  </button>
                ))}
                <button onClick={clearHistory} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"><Icons.Trash /></button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.length === 0 ? (
                <div className="col-span-full py-20 text-center opacity-20 font-black italic">لا توجد طلبات لعرضها..</div>
              ) : (
                filteredOrders.map(o => (
                  <div key={o.id} className={`bg-white p-6 rounded-[2rem] shadow-md border-r-8 transition-all ${o.status === 'pending' ? 'border-orange-500 scale-[1.02] shadow-orange-100' : 'border-gray-200 opacity-60'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-black text-xl text-amber-950 leading-tight">{o.clinicName}</div>
                        <div className="text-xs font-bold text-orange-600 mt-1 flex items-center gap-1"><Icons.User /> {o.contactInfo}</div>
                      </div>
                      <span className="text-[9px] font-black bg-amber-50 px-2 py-1 rounded-lg">#{o.id}</span>
                    </div>
                    
                    <div className="bg-amber-50/30 p-4 rounded-2xl mb-5 space-y-2">
                      {o.items.map((i, idx) => (
                        <div key={idx} className="text-sm font-black flex justify-between">
                          <span>{i.drinkName}</span>
                          <span className="text-orange-600">x{i.quantity}</span>
                        </div>
                      ))}
                      {o.notes && <div className="text-[10px] text-blue-600 pt-3 border-t mt-3 font-bold italic">📝 {o.notes}</div>}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="font-black text-lg">{o.totalPrice} ج.م</span>
                      <div className="flex gap-2">
                        {o.status === 'pending' ? (
                          <button onClick={() => updateStatus(o.id, 'completed')} className="bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-emerald-600 transition-colors flex items-center gap-2">
                            تم التوصيل <Icons.Check />
                          </button>
                        ) : (
                          <button onClick={() => updateStatus(o.id, 'pending')} className="text-[10px] font-black text-amber-900/40 underline">إعادة فتح</button>
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

      {view === 'menu' && Object.keys(cart).length > 0 && (
        <div className="fixed bottom-6 inset-x-4 max-w-lg mx-auto z-[60] animate-in slide-in-from-bottom-10 duration-500">
          <button onClick={() => setView('cart')} className="w-full bg-amber-950 text-white p-5 rounded-3xl shadow-2xl flex justify-between items-center border-b-4 border-orange-600 active:scale-95 transition-transform">
            <div className="flex items-center gap-4">
              <div className="bg-orange-600 w-10 h-10 rounded-xl flex items-center justify-center font-black">{Object.values(cart).reduce((a,b)=>a+b.quantity,0)}</div>
              <div className="text-right">
                <div className="text-xs opacity-60 font-bold">عرض السلة</div>
                <div className="font-black text-lg">إتمام الطلب</div>
              </div>
            </div>
            <div className="font-black text-xl">{cartTotalPrice} ج.م</div>
          </button>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-amber-950/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-[3rem] text-center max-w-sm w-full space-y-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-t-8 border-orange-500">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-4xl animate-bounce">☕</div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-amber-950">شكراً لك!</h2>
              <p className="text-sm font-bold text-gray-400">تم تسجيل طلبك في نظام المجمع.</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-[11px] font-bold text-emerald-700">
              يرجى الضغط على الزر أدناه لإرسال الطلب عبر واتساب لضمان سرعة التوصيل ⬇️
            </div>
            <div className="flex flex-col gap-3">
              <a 
                href={lastOrderLink} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setShowSuccessModal(false)}
                className="bg-emerald-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
              >
                تأكيد عبر واتساب <Icons.WhatsApp />
              </a>
              <button onClick={() => setShowSuccessModal(false)} className="text-xs font-black text-gray-400 py-2">إغلاق وتصفح المنيو</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-bottom { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-in { animation-fill-mode: forwards; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-4 { animation-name: slide-in-bottom; }
      `}</style>
    </div>
  );
};

export default App;
