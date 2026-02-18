import React, { useState } from 'react';
import styles from '../../styles/components/modals/LogoutConfirmModal.module.css';
import { LogOut, AlertTriangle, X } from 'lucide-react';

interface LogoutConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({ onConfirm, onCancel }) => {
  const [isShaking, setIsShaking] = useState(false);

  const handleOutsideClick = () => {
    setIsShaking(true);
    // Reset shake state so it can be triggered again
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOutsideClick}>
      <div 
        className={`${styles.modalContent} ${isShaking ? styles.shake : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.titleGroup}>
            <LogOut size={20} color="#ff4d4d" />
            <h3>TERMINATE SESSION?</h3>
          </div>
          <button onClick={onCancel} className={styles.closeBtn}><X size={20} /></button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.warningIconWrapper}>
             <AlertTriangle size={48} color="#ffcc00" />
          </div>
          <p className={styles.modalText}>
            Are you sure you want to disconnect from the <strong>System Overwatch</strong>? 
            Your administrative session will be purged.
          </p>
        </div>

        <div className={styles.modalActions}>
          <button onClick={onCancel} className={styles.cancelBtn}>
            CANCEL
          </button>
          <button onClick={onConfirm} className={styles.confirmLogoutBtn}>
            CONFIRM LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;