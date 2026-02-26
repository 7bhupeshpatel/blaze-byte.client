import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useGuest } from '../../hooks/useGuest';
import styles from '../../styles/pages/guest/GuestDashboard.module.css';
import { ShoppingBag, Plus, Minus, Search, ChevronRight, Store, X, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGuestOrderTracking } from "../../hooks/useOrderTracking";

const GuestDashboard: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { menu, loading, placeOrder, getMenu } = useGuest();

  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customer, setCustomer] = useState({ name: '', phone: '' });

  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "ONLINE" | "">("");
  useEffect(() => {
    if (companyId) getMenu(companyId);
  }, [companyId, getMenu]);

  const { status, completed } = useGuestOrderTracking(activeOrderId);
  // Normalized Grouping Logic
  const groupedMenu = useMemo(() => {
    if (!menu) return {};
    return menu.products
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .reduce((acc: any, item) => {
        const catName = (item.category || 'General').trim();
        const key = catName.charAt(0).toUpperCase() + catName.slice(1).toLowerCase();
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});
  }, [menu, searchTerm]);

  const categories = ['All', ...Object.keys(groupedMenu)];

  const handleQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const next = (prev[id] || 0) + delta;
      if (next <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const cartItems = useMemo(() => {
    return Object.entries(cart).map(([id, qty]) => {
      const product = menu?.products.find(p => p.id === id);
      return { ...product, quantity: qty };
    });
  }, [cart, menu]);

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  if (loading && !menu) return <div className={styles.container}>Initializing...</div>;

  return (

    <div className={styles.container}>

      {status && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      background: "#0f172a",
      color: "#fff",
      padding: "12px",
      textAlign: "center",
      fontWeight: "bold",
      zIndex: 9999,
      borderBottom: "3px solid #f97316"
    }}
  >
    🧾 Your Order Status: {status}
  </div>
)}
      {/* HEADER */}
      <header className={styles.header}>
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <h1 className={styles.brandGradient}>{menu?.name || 'Workshop'}</h1>
            <p className="text-[10px] text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
              <Store size={12} className="text-rose-500" /> Digital Order Point
            </p>
          </div>
          <ShoppingBag size={24} className="text-slate-400" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-5">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Search products..."
            className={styles.inputField}
            style={{ paddingLeft: '3.5rem' }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.categoryScroll}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`${styles.catButton} ${activeCategory === cat ? styles.catButtonActive : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {Object.entries(groupedMenu).map(([category, products]: any) => (
          (activeCategory === 'All' || activeCategory === category) && (
            <section key={category} className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>{category}</h2>
              {products.map((p: any) => (
                <div key={p.id} className={styles.productCard}>
                  <div>
                    <h3 className="font-bold text-slate-100">{p.name}</h3>
                    <p className="text-sky-400 font-black text-lg">${p.price.toFixed(2)}</p>
                  </div>
                  {cart[p.id] ? (
                    <div className={styles.quantityControl}>
                      <button onClick={() => handleQuantity(p.id, -1)} className={styles.controlBtn}><Minus size={25}/></button>
                      <span className="font-black text-white w-5 text-center">{cart[p.id]}</span>
                      <button onClick={() => handleQuantity(p.id, 1)} className={styles.controlBtn + " text-rose-500"}><Plus size={25}/></button>
                    </div>
                  ) : (
                    <button onClick={() => handleQuantity(p.id, 1)} className={styles.catButtonActive + " px-5 py-2 rounded-xl font-bold"}>ADD +</button>
                  )}
                </div>
              ))}
            </section>
          )
        ))}
      </main>

      {/* FAB */}
      {totalItems > 0 && (
        <button className={styles.floatingCart} onClick={() => setIsModalOpen(true)}>
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase font-black opacity-70">Total to Pay</span>
            <span className="text-2xl font-black">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl font-bold">
            Review Order <ChevronRight size={20} />
          </div>
        </button>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-black text-white">Review Order</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-800 rounded-full"><X size={20}/></button>
            </div>

            <div className="overflow-y-auto pr-2">
              <div className={styles.receiptContainer}>
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-3 flex items-center gap-1">
                  <Info size={12}/> Order Summary
                </p>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.receiptItem}>
                    <span className="text-slate-300">
                      <span className="text-rose-500 font-bold mr-2">{item.quantity}x</span>
                      {item.name}
                    </span>
                    <span className="font-mono text-slate-400">${((item.price || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 mt-4 pt-4 flex justify-between">
                  <span className="font-bold text-white">Total Amount</span>
                  <span className="font-black text-xl text-orange-400">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Identify your order</label>
                <input 
                  className={styles.inputField}
                  placeholder="Enter your name (e.g. Table 5 or Alex)"
                  value={customer.name}
                  onChange={e => setCustomer({...customer, name: e.target.value})}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Phone (Optional)</label>
                <input 
                  className={styles.inputField}
                  placeholder="For order updates"
                  value={customer.phone}
                  onChange={e => setCustomer({...customer, phone: e.target.value})}
                />
              </div>

              <div className={styles.inputGroup}>
  <label>Payment Method *</label>
  <select
    className={styles.inputField}
    value={paymentMethod}
    onChange={(e) =>
      setPaymentMethod(e.target.value as "CASH" | "ONLINE" | "")
    }
  >
    <option value="">-- Select Payment Method --</option>
    <option value="CASH">💵 Pay at Counter (Cash)</option>
    <option value="ONLINE">💳 Online Payment</option>
  </select>
</div>

              <button 
  onClick={async () => {
    if (!customer.name) {
      toast.error("Please provide a name!");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method!");
      return;
    }

    const res = await placeOrder(
      companyId!,
      customer.name,
      customer.phone,
      cartItems.map(i => ({
        productId: i.id!,
        quantity: i.quantity
      })),
      paymentMethod
    );

    if (res) {
      setCart({});
      setIsModalOpen(false);
       setActiveOrderId(res.id); // Start tracking this order
      toast.success("Order Placed Successfully!");
    }
  }}
  className={styles.confirmBtn}
  disabled={!customer.name || !paymentMethod}
>
  PLACE ORDER NOW
</button>
              <p className="text-center text-[10px] text-slate-500 mt-4">By clicking, you agree to pay at the counter.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestDashboard;