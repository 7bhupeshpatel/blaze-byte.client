import React, { useState } from 'react';
import styles from '../../styles/pages/admin/Admin.module.css';
import { X, Save, ShieldAlert } from 'lucide-react';

interface EditUserModalProps {
    user: any;
    onClose: () => void;
    onUpdate: (id: string, data: any) => Promise<any>;
}

const EditUserModal = ({ user, onClose, onUpdate }: EditUserModalProps) => {
    const [formData, setFormData] = useState({
        email: user.email,
        password: '', // Kept empty unless changing
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
        isValidTill: user.isValidTill ? user.isValidTill.split('T')[0] : ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Destructure password out, collect everything else in 'rest'
        // 1. Create a clone and cast it as Partial so properties are optional
        const payload: Partial<typeof formData> = { ...formData };
        // Only add password back to the payload if it actually has a value
        // 2. Now 'delete' is allowed because password is considered optional here
        if (!payload.password) {
        delete payload.password;
        }
        
        const result = await onUpdate(user.id, payload);
        if (result.success) onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3><ShieldAlert size={20} /> EDIT PILOT CORE: {user.email}</h3>
                    <button onClick={onClose} className={styles.closeBtn}><X /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.editForm}>
                    <div className={styles.inputGroup}>
                        <label>Email Address</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Override Password (Leave blank to keep current)</label>
                        <input type="password" placeholder="New Secure Password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>

                    <div className={styles.gridInputs}>
                        <div className={styles.inputGroup}>
                            <label>System Role</label>
                            <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                                <option value="GUEST">GUEST</option>
                                <option value="VISITOR">VISITOR</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="SUPERADMIN">SUPERADMIN</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Valid Until</label>
                            <input type="date" value={formData.isValidTill} onChange={(e) => setFormData({...formData, isValidTill: e.target.value})} />
                        </div>
                    </div>

                    <div className={styles.checkboxGroup}>
                        <label className={styles.switch}>
                            <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} />
                            <span className={styles.slider}></span>
                            Account Active
                        </label>

                        <label className={styles.switch}>
                            <input type="checkbox" checked={formData.isVerified} onChange={(e) => setFormData({...formData, isVerified: e.target.checked})} />
                            <span className={styles.slider}></span>
                            Manual Verification
                        </label>
                    </div>

                    <button type="submit" className={styles.saveBtn}>
                        <Save size={18} /> COMMIT CHANGES
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;