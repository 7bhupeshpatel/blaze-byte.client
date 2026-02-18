import React from 'react';
import { Bell } from 'lucide-react';
import styles from '../../styles/pages/admin/Admin.module.css';

interface HeaderProps {
  userRole: string | null;
}

const Header: React.FC<HeaderProps> = ({ userRole }) => {
  return (
    <header className={styles.header}>
      <div className={styles.breadcrumb}>System / {userRole} / Dashboard</div>
      <div className={styles.headerActions}>
        <div className={styles.notificationWrapper}>
          <Bell size={20} className={styles.bellIcon} />
          <span className={styles.notifBadge} />
        </div>
        <div className={styles.roleTag}>{userRole}</div>
      </div>
    </header>
  );
};

export default Header;