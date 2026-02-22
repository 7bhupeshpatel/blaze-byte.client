import React, { forwardRef } from 'react';
import { Sale } from '../../services/staff.service';
import styles from '../../styles/pages/staff/Receipt.module.css';

interface Props {
  sale: Sale;
}

const Receipt = forwardRef<HTMLDivElement, Props>(({ sale }, ref) => {

  const formatCurrency = (value: number) =>
    value.toFixed(2);

  const paymentLabel =
    sale.paymentMethod === "CASH" ? "CASH" : "ONLINE";

  return (
    <div ref={ref} className={styles.thermalContainer}>

      {/* ================= CUSTOMER COPY ================= */}

      <div className={styles.section}>

        <div className={styles.centerBold}>
          WEEKEND RUSH
        </div>

        <div className={styles.center}>
          Sales Invoice
        </div>

        <div className={styles.line} />

        <div>Date: {new Date(sale.createdAt).toLocaleString()}</div>
        <div>Staff: {sale.staff?.email}</div>
        <div>Payment: {paymentLabel}</div>

        {sale.customerName && (
          <div>Customer: {sale.customerName}</div>
        )}

        {sale.customerPhone && (
          <div>Phone: {sale.customerPhone}</div>
        )}

        <div className={styles.line} />

        {/* ITEMS */}
        {sale.items.map(item => (
          <div key={item.id} className={styles.itemBlock}>
            <div>{item.product.name}</div>
            <div className={styles.row}>
              <span>{item.quantity} x {formatCurrency(item.product.price)}</span>
              <span>{formatCurrency(item.quantity * item.product.price)}</span>
            </div>
          </div>
        ))}

        <div className={styles.line} />

        <div className={styles.row}>
          <span>Subtotal</span>
          <span>{formatCurrency(sale.subtotalAmount)}</span>
        </div>

        {sale.discountPercent > 0 && (
          <div className={styles.row}>
            <span>Discount ({sale.discountPercent}%)</span>
            <span>-{formatCurrency(sale.discountAmount)}</span>
          </div>
        )}

        <div className={styles.doubleLine} />

        <div className={styles.rowBold}>
          <span>TOTAL</span>
          <span>{formatCurrency(sale.totalAmount)}</span>
        </div>

        <div className={styles.line} />

        <div className={styles.center}>
          THANK YOU!
        </div>
      </div>


      {/* ================= CUT LINE ================= */}

      <div className={styles.cutLine}>
        - - - - - - - - - - - - - - - - - - - -
      </div>


      {/* ================= KITCHEN COPY ================= */}

      <div className={styles.section}>

        <div className={styles.centerBold}>
          KITCHEN COPY
        </div>

        <div className={styles.line} />

        <div>Time: {new Date(sale.createdAt).toLocaleTimeString()}</div>

        {sale.customerName && (
          <div>Customer: {sale.customerName}</div>
        )}

        <div className={styles.line} />

        {sale.items.map(item => (
          <div key={item.id} className={styles.kitchenRow}>
            <span>{item.product.name}</span>
            <span>x {item.quantity}</span>
          </div>
        ))}

        <div className={styles.line} />

      </div>

    </div>
  );
});

export default Receipt;
