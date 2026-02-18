import React, { useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import styles from '../../styles/pages/admin/Admin.module.css';
import { Users, Activity, Clock, ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
    const { stats, fetchStats, loading, error } = useAdmin();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading && !stats) return <div className={styles.loader}>Synchronizing System Cores...</div>;
    if (error) return <div className={styles.errorText}>Critical Error: {error}</div>;

    return (
        <div className={styles.adminContainer}>
            <div className={styles.pageHeader}>
                <h1>SYSTEM OVERWATCH</h1>
                <div className={styles.badge}>LEVEL: SUPERADMIN</div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <Users size={24} color="#a855f7" />
                    <h3>TOTAL PILOTS</h3>
                    <p className={styles.count}>{stats?.totalUsers || 0}</p>
                </div>
                <div className={styles.statCard}>
                    <Activity size={24} color="#00ffcc" />
                    <h3>ACTIVE CORES</h3>
                    <p className={styles.count} style={{color: '#00ffcc'}}>{stats?.activeUsers || 0}</p>
                </div>
                <div className={styles.statCard}>
                    <Clock size={24} color="#ffcc00" />
                    <h3>PENDING APPROVAL</h3>
                    <p className={styles.count} style={{color: '#ffcc00'}}>{stats?.pendingUsers || 0}</p>
                </div>
            </div>

            {/* Role Distribution Section */}
            <div className={styles.distributionSection}>
                <h3>ROLE DISTRIBUTION</h3>
                <div className={styles.roleGrid}>
                    {stats?.roleDistribution?.map((item: any) => (
                        <div key={item.role} className={styles.roleMiniCard}>
                            <span>{item.role}</span>
                            <strong>{item._count.role}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;