
import React, { useState, useEffect, useCallback } from 'react';
import { MENU_ITEMS, ADMIN_PASSWORD } from './constants';
import { Drink, Order, CLINICS } from './types';

// Icons using SVG strings for better compatibility
const Icons = {
  Coffee: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>
  ),
  Admin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
  History: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Note: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/><line x1="9" x2="15" y1="13" y2="13"/><line x1="9" x2="15" y1="17" y2="17"/></svg>
  )
};

const App: React.FC = () => {
  const [view, setView] = useState<'menu' | 'admin'>('menu');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedClinic, setSelectedClinic] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [notificationSound] = useState(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('bel_hana_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save orders to localStorage when updated
  useEffect(() => {
    localStorage.setItem('bel_hana_orders', JSON.stringify(orders));
    
    // Check if there's a new pending order to play sound in admin view
    const lastOrder = orders[orders.length - 1];
    if (view === 'admin' && lastOrder?.status === 'pending') {
      notificationSound.play().catch(e => console.log("Audio play blocked"));
    }
  }, [orders, view, notificationSound]);

  const handlePlaceOrder = (drink: Drink) => {
    if (!selectedClinic) {
      alert("الرجاء اختيار العيادة أولاً");
      return;
    }

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      drinkName: drink.name,
      clinicName: selectedClinic,
      status: 'pending',
      timestamp: Date.now(),
      notes: orderNote.trim() || undefined
    };

    setOrders(prev => [...prev, newOrder]);
    setOrderNote(""); // Clear note after ordering
    setShowOrderSuccess(true);
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
    <div className="min-h-screen pb-20 bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-emerald-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white p-2 rounded-full shadow-inner">
              <Icons.Coffee />
            </div>
            <div>
              <h1 className="text-2xl font-bold">بالهنا</h1>
              <p className="text-xs text-emerald-100">مجمع هنا الطبي</p>
            </div>
          </div>
          <button 
            onClick={() => view === 'menu' ? handleAdminLogin() : setView('menu')}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 px-4 py-2 rounded-lg transition-colors"
          >
            {view === 'menu' ? (
              <><Icons.Admin /> <span>لوحة المسؤول</span></>
            ) : (
              <><Icons.Coffee /> <span>القائمة</span></>
            )}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {view === 'menu' ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Clinic Selection Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 space-y-6">
              <div>
                <h2 className="text-lg font-bold mb-4 text-emerald-800">الخطوة 1: اختر مكانك</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {CLINICS.map(clinic => (
                    <button
                      key={clinic}
                      onClick={() => setSelectedClinic(clinic)}
                      className={`p-3 text-sm rounded-xl border-2 transition-all ${
                        selectedClinic === clinic 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold' 
                        : 'border-gray-100 hover:border-emerald-200'
                      }`}
                    >
                      {clinic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-2 text-emerald-800 flex items-center gap-2">
                  <Icons.Note />
                  ملاحظات إضافية (اختياري)
                </h2>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="مثلاً: سكر زيادة، بدون ثلج، شاي خفيف..."
                  className="w-full p-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm resize-none h-20"
                ></textarea>
              </div>
            </div>

            {/* Menu Items */}
            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-emerald-500 rounded-full inline-block"></span>
                قائمة المشروبات
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MENU_ITEMS.map(drink => (
                  <div key={drink.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-gray-100">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={drink.image} 
                        alt={drink.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-emerald-700">
                        {drink.price} ج.م
                      </div>
                      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${drink.category === 'hot' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                        {drink.category === 'hot' ? 'ساخن' : 'غازي'}
                      </div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">{drink.name}</h3>
                      </div>
                      <button 
                        onClick={() => handlePlaceOrder(drink)}
                        disabled={!selectedClinic}
                        className={`px-6 py-2 rounded-xl font-bold transition-all ${
                          selectedClinic 
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        اطلب الآن
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-2 h-8 bg-orange-500 rounded-full inline-block"></span>
                إدارة الطلبات
              </h2>
              <div className="text-sm bg-gray-200 px-3 py-1 rounded-full font-medium">
                إجمالي الطلبات: {orders.length}
              </div>
            </div>

            {/* Order Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Active Orders */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-emerald-700">طلبات جديدة</h3>
                <div className="space-y-3">
                  {orders.filter(o => o.status === 'pending').length === 0 && (
                    <div className="bg-white p-12 text-center rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                      لا توجد طلبات معلقة حالياً
                    </div>
                  )}
                  {orders.filter(o => o.status === 'pending').map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border-r-4 border-orange-500 flex flex-col gap-3 animate-pulse-slow">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-lg">{order.drinkName}</div>
                          <div className="text-emerald-600 font-semibold">{order.clinicName}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(order.timestamp).toLocaleTimeString('ar-EG')}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 transition-colors"
                            title="تم التحضير"
                          >
                            <Icons.Check />
                          </button>
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100 transition-colors text-xs font-bold"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                      
                      {order.notes && (
                        <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 flex items-start gap-2">
                          <div className="text-orange-600 mt-1"><Icons.Note /></div>
                          <div className="text-sm text-orange-800 italic">{order.notes}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-500">سجل الطلبات المكتملة</h3>
                <div className="max-h-[600px] overflow-y-auto space-y-2 pr-2">
                  {orders.filter(o => o.status !== 'pending').sort((a,b) => b.timestamp - a.timestamp).map(order => (
                    <div key={order.id} className={`p-3 rounded-lg border flex flex-col gap-1 text-sm ${order.status === 'completed' ? 'bg-gray-50 border-gray-100' : 'bg-red-50 border-red-100 opacity-60'}`}>
                      <div className="flex justify-between">
                        <div>
                          <span className="font-bold">{order.drinkName}</span> - <span>{order.clinicName}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {order.status === 'completed' ? 'تم التوصيل' : 'ملغي'}
                        </div>
                      </div>
                      {order.notes && (
                        <div className="text-[11px] text-gray-500 italic flex items-center gap-1">
                          <Icons.Note /> {order.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Success Toast */}
      {showOrderSuccess && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-800 text-white px-8 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 animate-bounce">
          <Icons.Check />
          <span className="font-bold">تم إرسال طلبك بنجاح! جاري التحضير...</span>
        </div>
      )}

      {/* Footer / App-like Navigation Bar */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 px-6 py-2 flex justify-around items-center md:hidden">
         <button 
           onClick={() => setView('menu')}
           className={`flex flex-col items-center gap-1 ${view === 'menu' ? 'text-emerald-600' : 'text-gray-400'}`}
         >
           <Icons.Coffee />
           <span className="text-[10px]">المنيو</span>
         </button>
         <button 
           onClick={() => handleAdminLogin()}
           className={`flex flex-col items-center gap-1 ${view === 'admin' ? 'text-emerald-600' : 'text-gray-400'}`}
         >
           <Icons.Admin />
           <span className="text-[10px]">المسؤول</span>
         </button>
      </nav>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
