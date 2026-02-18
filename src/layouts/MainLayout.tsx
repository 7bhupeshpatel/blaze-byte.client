import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import LogoutConfirmModal from '../components/modals/LogoutConfirmModal'; // New Import
import styles from '../styles/pages/admin/Admin.module.css';

const MainLayout = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Modal state
  const userRole = localStorage.getItem('blaze_role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className={styles.dashboardShell}>
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        onLogout={() => setShowLogoutModal(true)} // Open modal instead of logging out
      />

      <main className={styles.mainContainer}>
        <Header userRole={userRole} />

        <section className={styles.scrollArea}>
          <Outlet />
        </section>
      </main>

      {/* Confirmation Modal */}
      {showLogoutModal && (
        <LogoutConfirmModal 
          onConfirm={handleLogout} 
          onCancel={() => setShowLogoutModal(false)} 
        />
      )}
    </div>
  );
};

export default MainLayout;