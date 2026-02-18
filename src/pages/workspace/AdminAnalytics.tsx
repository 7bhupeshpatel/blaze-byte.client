import React, { useEffect } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import styles from '../../styles/pages/workspace/AdminAnalytics.module.css';
import {
  TrendingUp,
  CalendarDays,
  BarChart3,
  Package
} from 'lucide-react';

const AdminAnalytics = () => {

  const {
    adminData,
    fetchAdminAnalytics,
    loading
  } = useAnalytics();

  useEffect(() => {
    fetchAdminAnalytics();
  }, [fetchAdminAnalytics]);

  if (loading) {
    return <div className={styles.loader}>Loading analytics...</div>;
  }

  if (!adminData) return null;

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <h1>Business Analytics</h1>
        <p>Overview of your company performance</p>
      </div>

      {/* Revenue Cards */}
      <div className={styles.statsGrid}>

        <div className={styles.card}>
          <div className={styles.icon}><CalendarDays size={20} /></div>
          <div>
            <p>Today</p>
            <h3>${adminData.daily.toFixed(2)}</h3>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.icon}><TrendingUp size={20} /></div>
          <div>
            <p>This Week</p>
            <h3>${adminData.weekly.toFixed(2)}</h3>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.icon}><BarChart3 size={20} /></div>
          <div>
            <p>This Month</p>
            <h3>${adminData.monthly.toFixed(2)}</h3>
          </div>
        </div>

      </div>

      {/* Insights Section */}
      <div className={styles.insightsSection}>

        <div className={styles.insightCard}>
          <Package size={22}/>
          <div>
            <p>Most Sold Product</p>
            <h4>
              {adminData.mostSoldProduct?.name || 'N/A'}
            </h4>
          </div>
        </div>

        <div className={styles.insightCard}>
          <BarChart3 size={22}/>
          <div>
            <p>Top Category</p>
            <h4>
              {adminData.mostSoldCategory || 'N/A'}
            </h4>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminAnalytics;
