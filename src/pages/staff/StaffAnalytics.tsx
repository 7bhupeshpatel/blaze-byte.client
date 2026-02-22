import React, { useEffect } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import styles from '../../styles/pages/staff/StaffAnalytics.module.css';
import {
  CalendarDays,
  TrendingUp,
  BarChart3,
  Wallet,
  CreditCard
} from 'lucide-react';

const StaffAnalytics = () => {

  const {
    staffData,
    fetchStaffAnalytics,
  } = useAnalytics();

  useEffect(() => {
    fetchStaffAnalytics();
  }, [fetchStaffAnalytics]);

  if (!staffData) return null;

  return (
    <div className={styles.container}>

      {/* ================= HEADER ================= */}
      <div className={styles.header}>
        <h1>My Sales Performance</h1>
        <p>Track revenue & payment breakdown</p>
      </div>

      {/* ================= MAIN STATS ================= */}
      <div className={styles.statsGrid}>

        <div className={styles.card}>
          <CalendarDays size={22}/>
          <div>
            <p>Today</p>
            <h3>${staffData.daily.toFixed(2)}</h3>
          </div>
        </div>

        <div className={styles.card}>
          <TrendingUp size={22}/>
          <div>
            <p>This Week</p>
            <h3>${staffData.weekly.toFixed(2)}</h3>
          </div>
        </div>

        <div className={styles.card}>
          <BarChart3 size={22}/>
          <div>
            <p>This Month</p>
            <h3>${staffData.monthly.toFixed(2)}</h3>
          </div>
        </div>

      </div>

      {/* ================= PAYMENT SPLIT ================= */}

      <div className={styles.splitSection}>

        <h2>Payment Breakdown (Today)</h2>

        <div className={styles.splitGrid}>

          <div className={`${styles.splitCard} ${styles.cash}`}>
            <Wallet size={22}/>
            <div>
              <p>Cash</p>
              <h3>${staffData.dailyCash.toFixed(2)}</h3>
            </div>
          </div>

          <div className={`${styles.splitCard} ${styles.online}`}>
            <CreditCard size={22}/>
            <div>
              <p>Online</p>
              <h3>${staffData.dailyOnline.toFixed(2)}</h3>
            </div>
          </div>

        </div>

      </div>


      {/* ================= MONTHLY SPLIT ================= */}

      <div className={styles.splitSection}>

        <h2>Payment Breakdown (This Month)</h2>

        <div className={styles.splitGrid}>

          <div className={`${styles.splitCard} ${styles.cash}`}>
            <Wallet size={22}/>
            <div>
              <p>Cash</p>
              <h3>${staffData.monthlyCash.toFixed(2)}</h3>
            </div>
          </div>

          <div className={`${styles.splitCard} ${styles.online}`}>
            <CreditCard size={22}/>
            <div>
              <p>Online</p>
              <h3>${staffData.monthlyOnline.toFixed(2)}</h3>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default StaffAnalytics;
