import React, { forwardRef } from 'react';
import { Sale } from '../../services/staff.service';
import styles from '../../styles/pages/staff/Receipt.module.css';

interface Props {
  sale: Sale;
}

const Receipt = forwardRef<HTMLDivElement, Props>(({ sale }, ref) => {

  return (
    <div ref={ref} className={styles.receipt}>
      
      <h2 className={styles.storeName}>Your Store Name</h2>
      <p className={styles.center}>Sales Receipt</p>
      <hr />

      <p><strong>Date:</strong> {new Date(sale.createdAt).toLocaleString()}</p>
      <p><strong>Staff:</strong> {sale.staff?.email}</p>

      {sale.customerName && (
        <p><strong>Customer:</strong> {sale.customerName}</p>
      )}

      {sale.customerPhone && (
        <p><strong>Phone:</strong> {sale.customerPhone}</p>
      )}

      <hr />

      {sale.items.map(item => (
        <div key={item.id} className={styles.itemRow}>
          <span>{item.product.name}</span>
          <span>{item.quantity} × {item.product.price}</span>
          <span>
            {(item.quantity * item.product.price).toFixed(2)}
          </span>
        </div>
      ))}

     <hr />

<p>Subtotal: ${sale.subtotalAmount.toFixed(2)}</p>

{sale.discountPercent && sale.discountPercent > 0 && (
  <>
    <p>Discount ({sale.discountPercent}%): -${sale.discountAmount?.toFixed(2)}</p>
  </>
)}

<h3>Total: ${sale.totalAmount.toFixed(2)}</h3>


      <h3 className={styles.total}>
        Total: ${sale.totalAmount.toFixed(2)}
      </h3>

      <p className={styles.center}>Thank you for your purchase!</p>
    </div>
  );
});

export default Receipt;
