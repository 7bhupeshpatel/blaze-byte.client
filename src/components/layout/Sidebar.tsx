import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  History,
  Utensils, // For Product/Menu management
  UserPlus,
  ShoppingCart  // For Staff management
} from 'lucide-react';
import styles from '../../styles/pages/admin/Admin.module.css';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, onLogout }) => {
  const location = useLocation();
  
  // In a real app, get this from your AuthContext or Redux store
  const userRole = localStorage.getItem('blaze_role') || 'GUEST'; 
  console.log('user role for sidebar', userRole);

  // Define Navigation based on Role
  const navigation = {
    SUPERADMIN: [
      { path: '/admin/dashboard', label: 'System Dashboard', icon: LayoutDashboard },
      { path: '/admin/users', label: 'User Control', icon: Users },
      { path: '/admin/logs', label: 'Audit Logs', icon: History },
    ],
    ADMIN: [
      { path: '/workspace/dashboard', label: 'Business Overview', icon: LayoutDashboard },
      { path: '/workspace/inventory', label: 'Menu & Products', icon: Utensils },
      { path: '/workspace/staff', label: 'Manage Staff', icon: UserPlus },
    ],
    // Visitors/Staff might have their own small set of links later
    VISITOR: [
      { path: '/pos/dashboard', label: 'Sales Terminal', icon: ShoppingCart },
      { path: '/pos/history', label: 'My Sales History', icon: History },
    ]
  };

  // Select the appropriate links array
  const activeLinks = navigation[userRole as keyof typeof navigation] || [];

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsedSidebar : ''}`}>
      <div className={styles.logoSection}>
        {isCollapsed ? 'BB' : 'BLAZE BYTE'}
      </div>

      <button 
        className={styles.collapseBtn} 
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      <nav className={styles.navLinks}>
        {activeLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          return (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`${styles.navItem} ${isActive ? styles.activeNavItem : ''}`}
            >
              <Icon size={20} /> 
              {!isCollapsed && <span>{link.label}</span>}
            </Link>
          );
        })}

        {/* Common links for all authenticated users */}
        <div className={styles.navDivider} />
        
        <Link 
          to="/settings" 
          className={`${styles.navItem} ${location.pathname === '/settings' ? styles.activeNavItem : ''}`}
        >
          <Settings size={20} /> 
          {!isCollapsed && <span>Settings</span>}
        </Link>
      </nav>

      <button onClick={onLogout} className={styles.logoutBtn}>
        <LogOut size={20} /> 
        {!isCollapsed && <span>Logout</span>}
      </button>
    </aside>
  );
};

export default Sidebar;