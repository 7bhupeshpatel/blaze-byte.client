import React, { useEffect, useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import EditUserModal from '../../components/admin/EditUserModal';
import styles from '../../styles/pages/admin/Admin.module.css';
import { Search, Trash2, Edit3, ShieldCheck, ShieldX, Users } from 'lucide-react';

const UserManagement = () => {
    const { users, fetchUsers, deleteUsers, updateUser, loading, error } = useAdmin();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Handle Search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers(searchTerm);
    };

    // Quick Toggle Status (Active/Suspended)
    const toggleStatus = (id: string, currentStatus: boolean) => {
        updateUser(id, { isActive: !currentStatus });
    };

    // Bulk Selection Logic
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(users.map(u => u.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        await deleteUsers(selectedIds);
        setSelectedIds([]); // Clear selection after delete
    };

    return (
        <div className={styles.userManagementContainer}>
            <div className={styles.actionHeader}>
                <div className={styles.titleArea}>
                    <h2><Users size={24} /> User Control Center</h2>
                    <p>Total Pilots Found: {users.length}</p>
                </div>

                <div className={styles.headerTools}>
                    {selectedIds.length > 0 && (
                        <button className={styles.bulkDeleteBtn} onClick={handleBulkDelete}>
                            <Trash2 size={16} /> PURGE {selectedIds.length} SELECTED
                        </button>
                    )}
                    <form onSubmit={handleSearch} className={styles.searchBox}>
                        <input 
                            type="text" 
                            placeholder="Search by Email or ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit"><Search size={18} /></button>
                    </form>
                </div>
            </div>

            {error && <div className={styles.errorBanner}>{error}</div>}

            <div className={styles.tableWrapper}>
                <table className={styles.userTable}>
                    <thead>
                        <tr>
                            <th>
                                <input 
                                    type="checkbox" 
                                    onChange={handleSelectAll}
                                    checked={selectedIds.length === users.length && users.length > 0} 
                                />
                            </th>
                            <th>EMAIL</th>
                            <th>ROLE</th>
                            <th>STATUS</th>
                            <th>VERIFIED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className={`${styles.tableRow} ${selectedIds.includes(user.id) ? styles.rowSelected : ''}`}>
                                <td>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedIds.includes(user.id)}
                                        onChange={() => handleSelectOne(user.id)}
                                    />
                                </td>
                                <td className={styles.emailCell}>{user.email}</td>
                                <td><span className={styles.roleTag}>{user.role}</span></td>
                                <td>
                                    <span className={user.isActive ? styles.statusActive : styles.statusInactive}>
                                        {user.isActive ? '🟢 ACTIVE' : '🔴 SUSPENDED'}
                                    </span>
                                </td>
                                <td>{user.isVerified ? '🛡️ YES' : '⚠️ NO'}</td>
                                <td className={styles.actionCells}>
                                    <button 
                                        onClick={() => toggleStatus(user.id, user.isActive)}
                                        title={user.isActive ? "Suspend User" : "Activate User"}
                                        className={styles.iconBtn}
                                    >
                                        {user.isActive ? <ShieldX size={18} color="#ff4d4d" /> : <ShieldCheck size={18} color="#00ffcc" />}
                                    </button>
                                    
                                    <button 
                                        className={styles.iconBtn} 
                                        title="Edit User"
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        <Edit3 size={18} color="#7a00ff" />
                                    </button>

                                    <button 
                                        className={styles.iconBtn} 
                                        onClick={() => deleteUsers([user.id])}
                                        title="Delete User"
                                    >
                                        <Trash2 size={18} color="#888" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && !loading && (
                    <div className={styles.emptyState}>No pilots found in the database.</div>
                )}
            </div>

            {/* GOD MODE MODAL */}
            {selectedUser && (
                <EditUserModal 
                    user={selectedUser} 
                    onClose={() => setSelectedUser(null)} 
                    onUpdate={updateUser} 
                />
            )}
        </div>
    );
};

export default UserManagement;