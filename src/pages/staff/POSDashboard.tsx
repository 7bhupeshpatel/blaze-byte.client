import React, { useEffect, useRef, useState } from 'react';
import { useStaff } from '../../hooks/useStaff';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  X
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
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [discount, setDiscount] = useState<number>(0);

  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ============================= */
  /* ===== CART LOGIC ============ */
  /* ============================= */

  const addToCart = (product: any) => {
    if ((product.stock || 0) <= 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);

      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        }
      ];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeFromCart = (id: string) =>
    setCart(prev => prev.filter(i => i.id !== id));

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  /* ============================= */
  /* ===== CONFIRM SALE ========== */
  /* ============================= */

  const confirmSale = async () => {
    if (cart.length === 0) return;

    const sale = await createSale(
      cart.map(i => ({
        productId: i.id,
        quantity: i.quantity
      })),
      customer.name || undefined,
      customer.phone || undefined,
      discount || 0
    );

    if (sale) {
      setLastSale(sale);

      setCart([]);
      setCustomer({ name: '', phone: '' });
      setDiscount(0);
      setShowCheckout(false);

      setTimeout(() => {
        handlePrint();
      }, 100);
    }
  };

  /* ============================= */
  /* ===== RENDER ================ */
  /* ============================= */

  return (
    <div className={styles.container}>

      {/* ============================= */}
      {/* ===== PRODUCTS SECTION ====== */}
      {/* ============================= */}

      <div className={styles.productsSection}>

        {/* Fixed Header */}
        <div className={styles.productsHeader}>
          <h1>Sales Terminal</h1>
        </div>

        {/* Scrollable Content */}
        <div className={styles.productsContent}>
          <div className={styles.grid}>
            {products.map(product => (
              <div
                key={product.id}
                className={styles.card}
                onClick={() => addToCart(product)}
              >
                <div className={styles.price}>
                  ${product.price.toFixed(2)}
                </div>
                <h3>{product.name}</h3>
                <span>{product.category}</span>
                <div className={styles.stock}>
                  Stock: {product.stock}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================= */}
      {/* ===== CART SECTION ========== */}
      {/* ============================= */}

      <div className={styles.cartSection}>

        {/* Fixed Header */}
        <div className={styles.cartHeader}>
          <h2>Current Order</h2>
        </div>

        {/* Scrollable Cart Items */}
        <div className={styles.cartContent}>

          {cart.length === 0 ? (
            <div className={styles.empty}>Cart is empty</div>
          ) : (
            cart.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div>
                  <strong>{item.name}</strong>
                  <small>${item.price.toFixed(2)}</small>
                </div>

                <div className={styles.controls}>
                  <button onClick={() => updateQuantity(item.id, -1)}>
                    <Minus size={14} />
                  </button>

                  <span>{item.quantity}</span>

                  <button onClick={() => updateQuantity(item.id, 1)}>
                    <Plus size={14} />
                  </button>

                  <button onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Fixed Footer */}
        <div className={styles.cartFooter}>
          <div className={styles.total}>
            Total: ${subtotal.toFixed(2)}
          </div>

          <button
            className={styles.checkoutBtn}
            disabled={cart.length === 0}
            onClick={() => setShowCheckout(true)}
          >
            <CreditCard size={18} />
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* ============================= */}
      {/* ===== CHECKOUT MODAL ======== */}
      {/* ============================= */}

      {showCheckout && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Checkout</h3>
              <X onClick={() => setShowCheckout(false)} />
            </div>

            <input
              placeholder="Customer Name (Optional)"
              value={customer.name}
              onChange={e =>
                setCustomer({ ...customer, name: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Discount % (Optional)"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />

            <input
              placeholder="Customer Phone (Optional)"
              value={customer.phone}
              onChange={e =>
                setCustomer({ ...customer, phone: e.target.value })
              }
            />

            <button
              className={styles.confirmBtn}
              disabled={loading}
              onClick={confirmSale}
            >
              {loading ? 'Processing...' : 'Confirm Sale'}
            </button>
          </div>
        </div>
      )}

      {/* Hidden Receipt for Printing */}
      <div style={{ display: 'none' }}>
        {lastSale && (
          <Receipt
            ref={receiptRef}
            sale={lastSale}
          />
        )}
      </div>

    </div>
  );
};

export default POSDashboard;
