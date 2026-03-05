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
  Utensils, 
  UserPlus,
  ShoppingCart,
  LucideGitGraph,
  ChefHat, 
  WarehouseIcon 
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
  
  const navigation = {
    SUPERADMIN: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/admin/users', label: 'Users', icon: Users },
      { path: '/admin/logs', label: 'Logs', icon: History },
    ],
    ADMIN: [
      { path: '/workspace/dashboard', label: 'Overview', icon: LayoutDashboard },
      { path: '/workspace/inventory', label: 'Products', icon: Utensils },
      { path: '/workspace/orders', label: 'Live Orders', icon: ChefHat },
      { path: '/workspace/staff', label: 'Staff', icon: UserPlus },
      { path: '/analytics/admin', label: 'Analytics', icon: LucideGitGraph },
      { path: '/inventory', label: 'Inventory', icon: WarehouseIcon },
    ],
    VISITOR: [
      { path: '/pos/dashboard', label: 'Terminal', icon: ShoppingCart },
      { path: '/staff/orders', label: 'Live Orders', icon: ChefHat },
      { path: '/pos/history', label: 'History', icon: History },
      { path: '/analytics/staff', label: 'Analytics', icon: LucideGitGraph },
      { path: '/inventory', label: 'Inventory', icon: WarehouseIcon },
    ]
  };

  const activeLinks = navigation[userRole as keyof typeof navigation] || [];

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsedSidebar : ''}`}>
      {/* Desktop Logo */}
      <div className={styles.logoSection}>
        {isCollapsed ? 'BB' : 'BLAZE BYTE'}
      </div>

      {/* Desktop Collapse Button */}
      <button 
        className={styles.collapseBtn} 
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Navigation Links */}
      <nav className={styles.navLinks}>
        {activeLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          return (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`${styles.navItem} ${isActive ? styles.activeNavItem : ''}`}
              title={link.label} // Helpful tooltip on hover
            >
              <div className={styles.iconWrapper}>
                <Icon size={22} />
                {link.label === 'Live Orders' && (
                  <span className={styles.sidebarBadge} /> 
                )}
              </div>
              <span className={styles.navLabel}>{link.label}</span>
            </Link>
          );
        })}

        <div className={styles.navDivider} />
        
        {/* Settings Link */}
        <Link 
          to="/settings" 
          className={`${styles.navItem} ${location.pathname === '/settings' ? styles.activeNavItem : ''}`}
          title="Settings"
        >
          <div className={styles.iconWrapper}>
             <Settings size={22} /> 
          </div>
          <span className={styles.navLabel}>Settings</span>
        </Link>
      </nav>

      {/* Logout Button */}
      <button onClick={onLogout} className={styles.logoutBtn} title="Logout">
        <div className={styles.iconWrapper}>
          <LogOut size={22} /> 
        </div>
        <span className={styles.navLabel}>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;