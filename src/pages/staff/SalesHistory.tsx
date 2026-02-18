import React, { useEffect, useState } from 'react';
import { useStaff } from '../../hooks/useStaff';
import { ChevronDown, ChevronUp, User, Phone } from 'lucide-react';
import styles from '../../styles/pages/staff/SalesHistory.module.css';

const SalesHistory = () => {
  const { sales, fetchMySales, loading } = useStaff();
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetchMySales();
  }, [fetchMySales]);

  const toggleExpand = (id: string) => {
    setExpanded(prev => (prev === id ? null : id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Sales History</h1>
        <p>Detailed record of your processed transactions</p>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading sales...</div>
      ) : sales.length === 0 ? (
        <div className={styles.emptyState}>
          No sales recorded yet.
        </div>
      ) : (
        <div className={styles.salesList}>
          {sales.map(sale => (
            <div key={sale.id} className={styles.saleCard}>
              
              {/* SUMMARY ROW */}
              <div
                className={styles.saleHeader}
                onClick={() => toggleExpand(sale.id)}
              >
                <div>
                  <strong>
                    ${sale.totalAmount.toFixed(2)}
                  </strong>
                  <span className={styles.date}>
                    {new Date(sale.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className={styles.metaInfo}>
                  <span>{sale.items.length} items</span>
                  {expanded === sale.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                </div>
              </div>

              {/* EXPANDED DETAILS */}
              {expanded === sale.id && (
                <div className={styles.saleDetails}>

                  {/* Customer Info */}
                  <div className={styles.customerBlock}>
                    <div>
                      <User size={16}/>
                      <span>
                        {sale.customerName || 'Walk-in Customer'}
                      </span>
                    </div>

                    {sale.customerPhone && (
                      <div>
                        <Phone size={16}/>
                        <span>{sale.customerPhone}</span>
                      </div>
                    )}
                  </div>

                  {/* Staff */}
                  <div className={styles.staffInfo}>
                    Sold By: <strong>{sale.staff?.email}</strong>
                  </div>

                  {/* Items */}
                  <div className={styles.itemsList}>
                    {sale.items.map(item => (
                      <div key={item.id} className={styles.itemRow}>
                        <span>{item.product.name}</span>
                        <span>
                          {item.quantity} × ${item.product.price.toFixed(2)}
                        </span>
                        <strong>
                          ${(item.quantity * item.product.price).toFixed(2)}
                        </strong>
                      </div>
                    ))}

                    <div className={styles.discountPercentage}>
                        <span>Discount Percentage/Discount Amount</span> <span className={styles.discountPercentageNumber}>{sale.discountPercent}%  :::  ${sale.discountAmount}</span>
                    </div>
                    <div className={styles.totalamount}>
                        <span>Total Amount</span> <span className={styles.totalAmountNumber}>${sale.totalAmount}</span>
                    </div>
                    
                  </div>

                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesHistory;
