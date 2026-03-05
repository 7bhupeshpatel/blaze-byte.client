import React, { useEffect, useState, useRef } from 'react';
import { useStaff } from '../../hooks/useStaff';
import { ChevronDown, ChevronUp, User, Phone, Printer } from 'lucide-react'; // ✅ Imported Printer icon
import { PaymentStatus } from '../../services/staff.service'; 
import { useReactToPrint } from 'react-to-print'; // ✅ Imported react-to-print
import Receipt from '../../components/staff/Receipt'; // ✅ Imported Receipt component
import styles from '../../styles/pages/staff/SalesHistory.module.css';

const SalesHistory = () => {
  const { sales, fetchMySales, loading, updateSalePaymentStatus } = useStaff();
  const [expanded, setExpanded] = useState<string | null>(null);
  
  // ✅ Print-related states and refs
  const [saleToPrint, setSaleToPrint] = useState<any>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: receiptRef });

  useEffect(() => {
    fetchMySales();
  }, [fetchMySales]);

  const toggleExpand = (id: string) => {
    setExpanded(prev => (prev === id ? null : id));
  };

  // ✅ Trigger print function
  const triggerPrint = (sale: any) => {
    setSaleToPrint(sale); // Load the specific sale data into the hidden component
    setTimeout(() => {
      if (handlePrint) handlePrint();
    }, 100); // Brief delay ensures React renders the new data before printing
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
          {sales.map(sale => {
            const remainingEdits = 3 - (sale.paymentUpdateCount || 0);
            const canEdit = remainingEdits > 0;

            return (
              <div key={sale.id} className={styles.saleCard}>
                
                {/* SUMMARY ROW */}
                <div
                  className={styles.saleHeader}
                  onClick={() => toggleExpand(sale.id)}
                  style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                >
                  <div>
                    <strong>
                      ${sale.totalAmount.toFixed(2)}
                    </strong>
                    <span className={styles.date} style={{ marginLeft: '10px', color: '#666' }}>
                      {new Date(sale.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className={styles.metaInfo} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      backgroundColor: sale.paymentStatus === 'PAID' ? '#dcfce7' : sale.paymentStatus === 'FAILED' ? '#fee2e2' : '#fef9c3',
                      color: sale.paymentStatus === 'PAID' ? '#166534' : sale.paymentStatus === 'FAILED' ? '#991b1b' : '#854d0e'
                    }}>
                      {sale.paymentStatus}
                    </span>
                    <span>{sale.items.length} items</span>
                    {expanded === sale.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                  </div>
                </div>

                {/* EXPANDED DETAILS */}
                {expanded === sale.id && (
                  <div className={styles.saleDetails} style={{ padding: '15px', borderTop: '1px solid #eee' }}>

                    {/* Customer Info */}
                    <div className={styles.customerBlock}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={16}/>
                        <span>
                          {sale.customerName || 'Walk-in Customer'}
                        </span>
                      </div>

                      {sale.customerPhone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                          <Phone size={16}/>
                          <span>{sale.customerPhone}</span>
                        </div>
                      )}
                    </div>

                    {/* Staff */}
                    <div className={styles.staffInfo} style={{ margin: '15px 0' }}>
                      Sold By: <strong>{sale.staff?.email}</strong>
                    </div>

                    {/* Items */}
                    <div className={styles.itemsList}>
                      {sale.items.map(item => (
                        <div key={item.id} className={styles.itemRow} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span>{item.product.name}</span>
                          <span>
                            {item.quantity} × ${item.product.price.toFixed(2)}
                          </span>
                          <strong>
                            ${(item.quantity * item.product.price).toFixed(2)}
                          </strong>
                        </div>
                      ))}

                      <hr style={{ margin: '15px 0', borderColor: '#eee' }} />

                      <div className={styles.discountPercentage} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span>Discount ({sale.discountPercent}%)</span> 
                          <span className={styles.discountPercentageNumber}>-${sale.discountAmount.toFixed(2)}</span>
                      </div>

                      <div className={styles.totalamount} style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '8px' }}>
                          <span>Total Amount</span> 
                          <span className={styles.totalAmountNumber}>${sale.totalAmount.toFixed(2)}</span>
                      </div>

                      <div className={styles.discountPercentage} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span>Payment Method</span> 
                          <span className={styles.discountPercentageNumber}>{sale.paymentMethod}</span>
                      </div>

                      {/* PAYMENT STATUS CONTROLS */}
                      <div className={styles.discountPercentage} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginTop: '15px',
                        paddingTop: '15px',
                        borderTop: '1px dashed #ccc'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong>Payment Status</strong>
                          <span style={{ fontSize: '0.8rem', color: canEdit ? '#666' : '#ef4444' }}>
                            {canEdit ? `(${remainingEdits} edits left)` : '(Max edits reached)'}
                          </span>
                        </div>
                        
                        <div className={styles.paymentStatus} style={{ display: 'flex', gap: '8px' }}>
                          {(Object.values(PaymentStatus) as PaymentStatus[]).map(status => {
                            const isActive = sale.paymentStatus === status;
                            const isDisabled = !canEdit || isActive;

                            return (
                              <button
                                key={status}
                                disabled={isDisabled}
                                onClick={() => updateSalePaymentStatus(sale.id, status)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: `1px solid ${isActive ? '#3b82f6' : '#d1d5db'}`,
                                  background: isActive ? '#3b82f6' : '#ffffff',
                                  color: isActive ? '#ffffff' : '#374151',
                                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                                  opacity: (!canEdit && !isActive) ? 0.5 : 1,
                                  fontSize: '0.85rem',
                                  fontWeight: isActive ? 'bold' : 'normal',
                                  transition: 'all 0.2s'
                                }}
                              >
                                {status}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 🔥 NEW: PRINT BILL BUTTON 🔥 */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        marginTop: '20px' 
                      }}>
                        <button 
                          onClick={() => triggerPrint(sale)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            backgroundColor: '#10b981', // green shade matching typical POS buttons
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                        >
                          <Printer size={18} />
                          Print Receipt
                        </button>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ Hidden Receipt Component for Printing */}
      <div style={{ display: 'none' }}>
        {saleToPrint && <Receipt ref={receiptRef} sale={saleToPrint} />}
      </div>
    </div>
  );
};

export default SalesHistory;