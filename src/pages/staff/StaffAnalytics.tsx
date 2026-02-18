import React, { useEffect } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import styles from '../../styles/pages/staff/StaffAnalytics.module.css';
import { CalendarDays, TrendingUp, BarChart3 } from 'lucide-react';

const StaffAnalytics = () => {

  const {
    staffData,
    fetchStaffAnalytics,
    loading
  } = useAnalytics();

  useEffect(() => {
    fetchStaffAnalytics();
  }, [fetchStaffAnalytics]);

  if (loading) {
    return <div className={styles.loader}>Loading analytics...</div>;
  }

  if (!staffData) return null;

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <h1>My Sales Performance</h1>
        <p>Track your personal revenue</p>
      </div>

      <div className={styles.statsGrid}>

        <div className={styles.card}>
          <CalendarDays size={20}/>
          <div>
            <p>Today</p>
            <h3>${staffData.daily.toFixed(2)}</h3>
          </div>
        </div>

        <div className={styles.card}>
          <TrendingUp size={20}/>
          <div>
            <p>This Week</p>
            <h3>${staffData.weekly.toFixed(2)}</h3>
          </div>
        </div>

        <div className={styles.card}>
          <BarChart3 size={20}/>
          <div>
            <p>This Month</p>
            <h3>${staffData.monthly.toFixed(2)}</h3>
          </div>
        </div>

      </div>

    </div>
  );
};

export default StaffAnalytics;
