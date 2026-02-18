import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { UserPlus, X, Edit2, Trash2, ShieldCheck } from 'lucide-react';
import styles from '../../styles/pages/workspace/Staff.module.css';

const Staff = () => {
  const { 
    createStaff, 
    fetchStaff, 
    staff, 
    loading, 
    updateStaff, 
    deleteStaff 
  } = useWorkspace();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    isActive: true 
  });

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const openEditModal = (member: any) => {
    setEditingId(member.id);
    setFormData({
      email: member.email,
      password: '', // Leave blank unless changing
      isActive: member.isActive
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ email: '', password: '', isActive: true });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;

    if (editingId) {
      // Logic for Update
      success = await updateStaff(editingId, formData);
    } else {
      // Logic for Create
      success = await createStaff(formData);
    }

    if (success) {
      closeModal();
      fetchStaff();
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this staff member? This will revoke their access immediately.")) {
      await deleteStaff(id);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Workspace Staff</h1>
          <p className={styles.subtitle}>Manage your team members and their access</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
          <UserPlus size={18} /> Add Staff
        </button>
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.summaryInfo}>
          <ShieldCheck size={24} className={styles.summaryIcon} />
          <div>
            <h3>Total Staff</h3>
            <span>{staff.length} Active Accounts</span>
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.loading}>Updating team data...</div>
        ) : staff.length === 0 ? (
          <div className={styles.emptyState}>No staff members added yet.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(member => (
                <tr key={member.id}>
                  <td className={styles.emailCell}>{member.email}</td>
                  <td>
                    <span className={member.isActive ? styles.badgeActive : styles.badgeInactive}>
                      {member.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{member.isVerified ? "✅" : "❌"}</td>
                  <td>{new Date(member.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className={styles.actionGroup}>
                      <button className={styles.editBtn} onClick={() => openEditModal(member)}>
                        <Edit2 size={16} />
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDeleteStaff(member.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? "Update Staff Profile" : "Add Staff Member"}</h2>
              <X className={styles.closeIcon} onClick={closeModal} />
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  disabled={!!editingId} // Usually emails shouldn't be changed for unique auth
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>{editingId ? "Reset Password (Optional)" : "Temporary Password"}</label>
                <input
                  type="password"
                  required={!editingId}
                  placeholder={editingId ? "Leave empty to keep current" : "*******"}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {editingId && (
                <div className={styles.toggleGroup}>
                  <label>Account Access</label>
                  <select 
                    value={formData.isActive ? "true" : "false"}
                    onChange={(e) => setFormData({...formData, isActive: e.target.value === "true"})}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive / Suspended</option>
                  </select>
                </div>
              )}

              <div className={styles.modalActions}>
                <button type="submit" className={styles.primaryBtn}>
                  {editingId ? "Update Member" : "Create Account"}
                </button>
                <button type="button" onClick={closeModal} className={styles.secondaryBtn}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;