import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useStaff } from '../../hooks/useStaff';
import { 
  ShoppingCart, Plus, Minus, Trash2, 
  X, Search, Filter, ShoppingBag
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import Receipt from '../../components/staff/Receipt';
import styles from '../../styles/pages/staff/POS.module.css';
import { PaymentStatus, Sale } from '../../services/staff.service';

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
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false); // NEW: Mobile cart state
  const [searchQuery, setSearchQuery] = useState('');
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "ONLINE">("CASH");
  const [isPaid, setIsPaid] = useState<boolean>(true); 
  
  const receiptRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: receiptRef });

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const groupedProducts = useMemo(() => {
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groups: { [key: string]: any[] } = {};

    filtered.forEach(product => {
      const category = (product.category || 'Uncategorized').trim();
      const groupKey = category.toUpperCase(); 
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(product);
    });

    const sortedGroupKeys = Object.keys(groups).sort();
    
    return sortedGroupKeys.map(key => ({
      categoryName: groups[key][0].category || 'Uncategorized',
      items: groups[key].sort((a, b) => a.price - b.price) 
    }));
  }, [products, searchQuery]);


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

  const confirmSale = async () => {
    if (cart.length === 0) return;
    const currentPaymentStatus = isPaid ? PaymentStatus.PAID : PaymentStatus.PENDING;

    const sale = await createSale(
      cart.map(i => ({ productId: i.id, quantity: i.quantity })),
      customer.name || undefined,
      customer.phone || undefined,
      discount || 0,
      paymentMethod,
      currentPaymentStatus
    );

    if (sale) {
      setLastSale(sale);
      setCart([]);
      setCustomer({ name: '', phone: '' });
      setDiscount(0);
      setIsPaid(true); 
      setPaymentMethod("CASH");
      setShowCheckout(false);
      setIsMobileCartOpen(false);
      
      setTimeout(() => handlePrint(), 100);
    }
  };

  return (
    <div className={styles.container}>
      {/* Product Section */}
      <div className={styles.productsSection}>
        <div className={styles.topBar}>
          <div className={styles.searchWrapper}>
            <Search size={20} className={styles.searchIcon} />
            <input 
              placeholder="Search products or categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.productsScrollArea}>
          {groupedProducts.length === 0 ? (
            <div className={styles.noResults}>
              <ShoppingBag size={48} className={styles.emptyIcon} />
              <p>No products found matching your search.</p>
            </div>
          ) : (
            groupedProducts.map(group => (
              <div key={group.categoryName} className={styles.categoryBlock}>
                <div className={styles.categoryDivider}>
                  <Filter size={16} />
                  <span>{group.categoryName}</span>
                  <div className={styles.dividerLine}></div>
                </div>

                <div className={styles.grid}>
                  {group.items.map(product => (
                    <div 
                      key={product.id} 
                      className={`${styles.card} ${product.stock <= 0 ? styles.disabled : ''}`}
                      onClick={() => addToCart(product)}
                    >
                      <div className={styles.cardHeader}>
                        <div className={styles.cardBadge}>${product.price.toFixed(2)}</div>
                      </div>
                      <div className={styles.cardContent}>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <div className={styles.cardFooter}>
                          <span className={styles.stockText}>Stock: {product.stock}</span>
                          {product.stock > 0 ? (
                            <button className={styles.addBtn}><Plus size={16}/></button>
                          ) : (
                            <span className={styles.outText}>Out of Stock</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile Floating Cart Trigger */}
      {cart.length > 0 && !isMobileCartOpen && (
        <div className={styles.mobileCartTrigger} onClick={() => setIsMobileCartOpen(true)}>
          <div className={styles.triggerLeft}>
            <div className={styles.triggerBadge}>{cart.length}</div>
            <span>View Cart</span>
          </div>
          <div className={styles.triggerRight}>
            ${subtotal.toFixed(2)}
          </div>
        </div>
      )}

      {/* Mobile Overlay for Cart */}
      {isMobileCartOpen && (
        <div className={styles.mobileCartOverlay} onClick={() => setIsMobileCartOpen(false)} />
      )}

      {/* Cart Sidebar / Bottom Sheet */}
      <div className={`${styles.cartSection} ${isMobileCartOpen ? styles.cartOpen : ''}`}>
        <div className={styles.cartHeader}>
          <div className={styles.cartHeaderTitle}>
            <ShoppingCart size={22} className={styles.primaryText} />
            <h2>Current Order</h2>
            <span className={styles.itemCount}>{cart.length}</span>
          </div>
          <button className={styles.closeCartMobile} onClick={() => setIsMobileCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.cartList}>
          {cart.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyCartIcon}>🛒</div>
              <p>Your cart is empty</p>
              <span>Tap on products to add them to your order.</span>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemInfo}>
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)}</p>
                </div>
                <div className={styles.itemActions}>
                  <div className={styles.qtyControls}>
                    <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14}/></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14}/></button>
                  </div>
                  <button className={styles.delBtn} onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.cartFooter}>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span className={styles.summaryValue}>${subtotal.toFixed(2)}</span>
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
                <p>Complete customer and payment details</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowCheckout(false)}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label>Customer Name (Optional)</label>
                <input 
                  placeholder="e.g. John Doe"
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
                    <option value="ONLINE">💳 Online / Card</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label>Discount (%)</label>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    placeholder="0"
                    value={discount === 0 ? '' : discount} 
                    onChange={e => setDiscount(Number(e.target.value))} 
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Payment Status</label>
                <div 
                  className={`${styles.statusToggle} ${isPaid ? styles.statusPaid : styles.statusPending}`} 
                  onClick={() => setIsPaid(!isPaid)}
                >
                  <div className={`${styles.toggleKnob} ${isPaid ? styles.knobPaid : styles.knobPending}`} />
                  <span className={styles.toggleText}>{isPaid ? 'PAID IN FULL' : 'PAYMENT PENDING'}</span>
                </div>
              </div>

              <div className={styles.billSummary}>
                <div className={styles.billRow}><span>Subtotal</span> <span>${subtotal.toFixed(2)}</span></div>
                {discount > 0 && (
                  <div className={`${styles.billRow} ${styles.discountRow}`}>
                    <span>Discount ({discount}%)</span> 
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className={`${styles.billRow} ${styles.billTotal}`}>
                  <span>Payable Amount</span> 
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
               <button className={styles.confirmBtn} onClick={confirmSale} disabled={loading}>
                {loading ? 'Processing...' : 'Complete Sale & Print'}
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