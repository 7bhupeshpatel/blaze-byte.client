import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useOrders } from '../hooks/useOrder';
import { OrderStatus, Sale } from '../services/order.service';
import styles from '../styles/pages/OrderManager.module.css';
import {
  Clock,
  CheckCircle2,
  User,
  Phone,
  PackageCheck,
  XCircle,
  Timer,
  ChefHat,
  CheckCircle
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import Receipt from '../components/staff/Receipt';

const OrdersManager: React.FC = () => {
  const {
    orders,
    fetchOrders,
    confirmOrder,
    changeStatus,
    loading
  } = useOrders();

  type ReceiptSale = {
  id: string;
  customerName: string | null;
  customerPhone: string | null;
  totalAmount: number;
  subtotalAmount: number;
  discountPercent: number | null;
  discountAmount: number | null;
  paymentMethod: "CASH" | "ONLINE";
  status: OrderStatus;
  orderNumber: string | null;
  createdAt: string;
  staff?: any;
  items: any[];
};
  const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.PENDING);
  const [lastCompletedSale, setLastCompletedSale] = useState<Sale | null>(null);

  const receiptRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: receiptRef });

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const segmentedOrders = useMemo(() => {
    const base: Record<OrderStatus, typeof orders> = {
      [OrderStatus.PENDING]: [],
      [OrderStatus.CONFIRMED]: [],
      [OrderStatus.PREPARING]: [],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.CANCELLED]: []
    };

    orders.forEach(order => {
      base[order.status]?.push(order);
    });

    return base;
  }, [orders]);

  const currentOrders = segmentedOrders[activeTab] || [];

  const handleConfirm = async (orderId: string) => {
    await confirmOrder(orderId);
  };

  const handleStatusChange = async (
    orderId: string,
    status: OrderStatus
  ) => {
    const updated = await changeStatus(orderId, status);

    // 🔥 If marked COMPLETED → print receipt
    if (updated && status === OrderStatus.COMPLETED) {
      setLastCompletedSale(updated);
      setTimeout(() => handlePrint(), 100);
    }
  };

  const renderActions = (order: any) => {
    switch (order.status) {
      case OrderStatus.PENDING:
        return (
          <>
            <button
              onClick={() => handleConfirm(order.id)}
              className={styles.approveBtn}
              disabled={loading}
            >
              <CheckCircle2 size={18} /> CONFIRM
            </button>

            <button
              onClick={() =>
                handleStatusChange(order.id, OrderStatus.CANCELLED)
              }
              className={styles.cancelBtn}
              disabled={loading}
            >
              <XCircle size={18} />
            </button>
          </>
        );

      case OrderStatus.CONFIRMED:
        return (
          <button
            onClick={() =>
              handleStatusChange(order.id, OrderStatus.PREPARING)
            }
            className={styles.prepareBtn}
            disabled={loading}
          >
            <ChefHat size={18} /> START PREPARING
          </button>
        );

      case OrderStatus.PREPARING:
        return (
          <button
            onClick={() =>
              handleStatusChange(order.id, OrderStatus.COMPLETED)
            }
            className={styles.completeBtn}
            disabled={loading}
          >
            <CheckCircle size={18} /> MARK COMPLETED
          </button>
        );

      default:
        return (
          <span className={styles.statusLabel}>
            {order.status}
          </span>
        );
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Order Pipeline
          </h1>
          <p className="text-slate-400 text-sm flex items-center gap-2">
            <Timer size={14} className="text-orange-400" />
            Live Workshop Status
          </p>
        </div>

        <div className={styles.tabsWrapper}>
          <div className={styles.tabs}>
            {Object.values(OrderStatus).map(status => (
              <button
                key={status}
                className={`${styles.tab} ${
                  activeTab === status ? styles.activeTab : ''
                }`}
                onClick={() => setActiveTab(status)}
              >
                {status}
                {segmentedOrders[status]?.length > 0 && (
                  <span className={styles.badge}>
                    {segmentedOrders[status].length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className={styles.grid}>
        {currentOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <PackageCheck size={48} className="text-slate-700 mb-2" />
            <p>No {activeTab.toLowerCase()} orders</p>
          </div>
        ) : (
          currentOrders.map(order => (
            <div
              key={order.id}
              className={`${styles.orderCard} ${
                styles[order.status.toLowerCase()]
              }`}
            >
              <div className={styles.cardHeader}>
                <div className={styles.customerInfo}>
                  <div className={styles.avatar}>
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white">
                      {order.customerName || 'Guest'}
                    </h3>
                    <span className={styles.timeTag}>
                      <Clock size={10} />
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className={styles.orderMeta}>
  <div className={styles.orderNum}>
    #{order.orderNumber}
  </div>

  <div
    className={`${styles.paymentBadge} ${
      order.paymentMethod === "ONLINE"
        ? styles.online
        : styles.cash
    }`}
  >
    {order.paymentMethod}
  </div>
</div>
              </div>

              <div className={styles.itemList}>
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className={styles.item}>
                    <span>
                      <span className={styles.qty}>
                        {item.quantity}x
                      </span>{' '}
                      {item.product.name}
                    </span>
                    <span className={styles.itemPrice}>
                      $
                      {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.footer}>
                <div className={styles.total}>
                  <span className="text-2xl font-black text-white">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                  {order.customerPhone && (
                    <span className={styles.phoneLink}>
                      <Phone size={12} />
                      {order.customerPhone}
                    </span>
                  )}
                </div>
                <div className={styles.actions}>
                  {renderActions(order)}
                </div>
              </div>
            </div>
          ))
        )}
      </main>

     {/* Hidden Printable Receipt */}
<div style={{ display: 'none' }}>
  {lastCompletedSale && (
    <Receipt
      ref={receiptRef}
      sale={{
        ...lastCompletedSale,
        paymentUpdateCount: (lastCompletedSale as any).paymentUpdateCount ?? 0,

        subtotalAmount:
          (lastCompletedSale as any).subtotalAmount ?? lastCompletedSale.totalAmount,

        discountPercent:
          (lastCompletedSale as any).discountPercent ?? 0,

        discountAmount:
          (lastCompletedSale as any).discountAmount ?? 0,

        paymentMethod:
          (lastCompletedSale as any).paymentMethod ?? "CASH",

        staff:
          (lastCompletedSale as any).staff ?? { id: "", email: "" },

        // 🔥 THIS IS THE IMPORTANT PART
        items: lastCompletedSale.items.map(item => ({
  id: item.id,
  quantity: item.quantity,
  product: {
    id: "N/A",
    name: item.product.name,
    price: item.product.price,
    category: item.product.category ?? undefined, // ✅ FIX HERE
    stock: 0,
    createdAt: new Date().toISOString()
  }
}))
      }}
    />
  )}
</div>
    </div>
  );
};

export default OrdersManager;