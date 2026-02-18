import React, { useEffect } from 'react';
import { useWorkspace } from '../../hooks/useWorkspace';
import {
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import styles from '../../styles/pages/workspace/WorkspaceDashboard.module.css';

const WorkspaceDashboard = () => {
  const { products, loading, fetchInventory } = useWorkspace();

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const totalStock = products.reduce(
    (acc, curr) => acc + (curr.stock || 0),
    0
  );

  const lowStockItems = products.filter(
    p => (p.stock || 0) < 10
  ).length;

  const categories = new Set(
    products.map(p => p.category)
  ).size;

  return (
    <div className={styles.container}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Business Overview</h1>
          <p className={styles.subtitle}>
            Monitor performance and inventory insights
          </p>
        </div>

        <div className={styles.dateDisplay}>
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className={styles.statsGrid}>

        <div className={styles.statCard}>
          <div className={`${styles.icon} ${styles.blue}`}>
            <Package size={22} />
          </div>
          <div>
            <p>Total Products</p>
            <h3>{products.length}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.icon} ${styles.green}`}>
            <TrendingUp size={22} />
          </div>
          <div>
            <p>Categories</p>
            <h3>{categories}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.icon} ${styles.purple}`}>
            <Users size={22} />
          </div>
          <div>
            <p>Total Inventory</p>
            <h3>{totalStock} Units</h3>
          </div>
        </div>

        <div className={`${styles.statCard} ${lowStockItems > 0 ? styles.warning : ''}`}>
          <div className={`${styles.icon} ${styles.orange}`}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <p>Low Stock</p>
            <h3>{lowStockItems} Items</h3>
          </div>
        </div>

      </div>

      {/* Content Grid */}
      <div className={styles.grid}>

        {/* Product Preview */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Recent Products</h3>
            <button className={styles.linkBtn}>
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>
              No products added yet.
            </div>
          ) : (
            <div className={styles.productList}>
              {products.slice(0, 5).map(product => (
                <div key={product.id} className={styles.productItem}>
                  <div className={styles.avatar}>
                    {product.name.charAt(0)}
                  </div>
                  <div className={styles.productInfo}>
                    <strong>{product.name}</strong>
                    <span>{product.category}</span>
                  </div>
                  <div className={styles.price}>
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={styles.card}>
          <h3>Quick Actions</h3>
          <div className={styles.actions}>
            <button>Generate Report</button>
            <button>Update Pricing</button>
            <button>Manage Staff</button>
            <button>Export Inventory</button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default WorkspaceDashboard;
