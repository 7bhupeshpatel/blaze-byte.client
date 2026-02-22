import React, { useEffect, useRef, useState } from 'react';
import { useStaff } from '../../hooks/useStaff';
import { 
  ShoppingCart, Plus, Minus, Trash2, 
  CreditCard, X, Search, Filter, 
  Delete
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import Receipt from '../../components/staff/Receipt';
import styles from '../../styles/pages/staff/POS.module.css';
import { Sale } from '../../services/staff.service';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const POSDashboard = () => {
  const { products, fetchProducts, createSale, loading } = useStaff();
  
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "ONLINE">("CASH");

  const receiptRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: receiptRef });

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const addToCart = (product: any) => {
    if ((product.stock || 0) <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === id 
      ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const finalTotal = subtotal - discountAmount;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const confirmSale = async () => {
    if (cart.length === 0) return;
    const sale = await createSale(
      cart.map(i => ({ productId: i.id, quantity: i.quantity })),
      customer.name || undefined,
      customer.phone || undefined,
      discount || 0,
      paymentMethod
    );

    if (sale) {
      setLastSale(sale);
      setCart([]);
      setCustomer({ name: '', phone: '' });
      setDiscount(0);
      setShowCheckout(false);
      setTimeout(() => handlePrint(), 100);
    }
  };

  return (
    <div className={styles.container}>
      {/* Product Section */}
      <div className={styles.productsSection}>
        <div className={styles.topBar}>
          <div className={styles.searchWrapper}>
            <Search size={18} />
            <input 
              placeholder="Search products or categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.grid}>
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className={`${styles.card} ${product.stock <= 0 ? styles.disabled : ''}`}
              onClick={() => addToCart(product)}
            >
              <div className={styles.cardBadge}>${product.price.toFixed(2)}</div>
              <div className={styles.cardContent}>
                <h3>{product.name}</h3>
                <p>{product.category}</p>
                <div className={styles.cardFooter}>
                  <span>Stock: {product.stock}</span>
                  {product.stock > 0 ? (
                    <div className={styles.addIcon}><Plus size={16}/></div>
                  ) : (
                    <span className={styles.outText}>Empty</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className={styles.cartSection}>
        <div className={styles.cartHeader}>
          <ShoppingCart size={20} />
          <h2>Current Order</h2>
          <span className={styles.itemCount}>{cart.length} items</span>
        </div>

        <div className={styles.cartList}>
          {cart.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🛒</div>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemInfo}>
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)}</p>
                </div>
                <div className={styles.itemActions}>
                  <div className={styles.qtyBox}>
                    <button onClick={() => updateQuantity(item.id, -1)}><Minus size={12}/></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}><Plus size={12}/></button>
                  </div>
                  <button className={styles.delBtn} onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={18}
                    color='red'
                    />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.cartFooter}>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <button 
            className={styles.checkoutBtn} 
            disabled={cart.length === 0}
            onClick={() => setShowCheckout(true)}
          >
            Checkout — ${subtotal.toFixed(2)}
          </button>
        </div>
      </div>

      {/* Checkout Modal Overlay */}
      {showCheckout && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <h3>Finalize Sale</h3>
                <p>Enter customer and payment details</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowCheckout(false)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label>Customer Name</label>
                <input 
                  placeholder="Guest Customer"
                  value={customer.name}
                  onChange={e => setCustomer({...customer, name: e.target.value})}
                />
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Payment Method</label>
                  <select 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                  >
                    <option value="CASH">💵 Cash</option>
                    <option value="ONLINE">💳 Online/Card</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Discount (%)</label>
                  <input 
                    type="number" 
                    value={discount} 
                    onChange={e => setDiscount(Number(e.target.value))} 
                  />
                </div>
              </div>

              <div className={styles.billSummary}>
                <div className={styles.billRow}><span>Subtotal</span> <span>${subtotal.toFixed(2)}</span></div>
                <div className={styles.billRow}><span>Discount</span> <span>-${discountAmount.toFixed(2)}</span></div>
                <div className={`${styles.billRow} ${styles.billTotal}`}>
                  <span>Payable Amount</span> 
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button className={styles.confirmBtn} onClick={confirmSale} disabled={loading}>
                {loading ? 'Processing...' : 'Complete & Print Receipt'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'none' }}>
        {lastSale && <Receipt ref={receiptRef} sale={lastSale} />}
      </div>
    </div>
  );
};

export default POSDashboard;