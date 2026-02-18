import React, { useEffect, useState } from 'react';
import { adminService, AuditLog } from '../../services/admin.service';
import styles from '../../styles/pages/admin/Admin.module.css';
import { History, ShieldCheck, Terminal } from 'lucide-react';

const AuditLogs = () => {
    // Fix: Explicitly type the state
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await adminService.getAuditLogs();
                setLogs(data);
            } catch (error) {
                console.error("Audit Fetch Failed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) return <div className={styles.loader}>Accessing Encrypted Logs...</div>;

    return (
        <div className={styles.adminContainer}>
            <div className={styles.pageHeader}>
                <h1><History size={24} /> SYSTEM AUDIT TRAIL</h1>
                <div className={styles.badge}>SECURITY LEVEL: 4</div>
            </div>

            <div className={styles.logList}>
                {logs.length === 0 ? (
                    <div className={styles.emptyState}>No security events recorded.</div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className={styles.logCard}>
                            <div className={styles.logMeta}>
                                <div className={styles.adminIdentity}>
                                    <ShieldCheck size={16} color="#00ffd5" />
                                    <strong>{log.admin.email}</strong>
                                </div>
                                <span className={styles.actionTag}>{log.action}</span>
                                <span className={styles.logTime}>
                                    {new Date(log.createdAt).toLocaleString()}
                                </span>
                            </div>
                            
                            <div className={styles.logBody}>
                                <div className={styles.logLine}>
                                    <Terminal size={14} /> 
                                    <span>TARGET_ID: </span>
                                    <code>{log.targetId || 'SYSTEM'}</code>
                                </div>
                                <div className={styles.detailsBox}>
                                    <p>PAYLOAD_MODIFICATION:</p>
                                    <pre>{log.details || 'No additional data'}</pre>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AuditLogs;