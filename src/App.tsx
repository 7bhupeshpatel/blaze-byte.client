import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {Toaster} from 'react-hot-toast'
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';
import ForgotPassword from './pages/ForgotPassword';
import './styles/Variables.css'; // The variables we created earlier
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import MainLayout from './layouts/MainLayout';
import UserManagement from './pages/admin/UserManagement';
import AuditLogs from './pages/admin/AuditLogs';
import Products from './pages/workspace/Products'
import Staff from './pages/workspace/staff';
import WorkspaceDashboard from './pages/workspace/WorkspaceDashboard';
import POSDashboard from './pages/staff/POSDashboard';
import SalesHistory from './pages/staff/SalesHistory';
import Settings from './pages/common/Settings';
import StaffAnalytics from './pages/staff/StaffAnalytics';
import AdminAnalytics from './pages/workspace/AdminAnalytics';



const App: React.FC = () => {
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <Router>
      <Routes>
        {/* Redirect root to login for now */}
        <Route path="/" element={<Navigate to="/login" />} />
        
       {/* Public Auth Pages (No Sidebar/Header) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

{/* Authenticated Dashboard Pages (With Sidebar/Header) */}

{/* --- SUPERADMIN ROUTES --- */}

  <Route element={<ProtectedRoute allowedRoles={['SUPERADMIN']} />}>
    <Route element={<MainLayout />}>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/logs" element={<AuditLogs />} />
      
    </Route>
  </Route>


{/* --- WORKSPACE ADMIN ROUTES --- */}

  <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
    <Route element={<MainLayout />}>
    <Route path="/workspace/dashboard" element={<WorkspaceDashboard />} />
      <Route path="/workspace/inventory" element={<Products />} />
      <Route path="/workspace/staff" element={<Staff />} />
      <Route path="/analytics/admin" element={<AdminAnalytics />} />
    </Route>
  </Route>
    
    {/* --- WORKSPACE STAFF ROUTES --- */}
    <Route element={<ProtectedRoute allowedRoles={['VISITOR']} />}>
    <Route element={<MainLayout />}>
    <Route path="/pos/dashboard" element={<POSDashboard />} />
      <Route path="/pos/history" element={<SalesHistory />} />
      <Route path="/analytics/staff" element={<StaffAnalytics />} />
    </Route>
  </Route>

  <Route element={<MainLayout />}>
  <Route path="settings" element={<Settings />} />
  </Route>
  

{/* Standard User Pages */}
  {/* <Route element={<ProtectedRoute allowedRoles={['GUEST', 'VISITOR']} />}>
     <Route element={<MainLayout />}>
        <Route path="/home" element={<UserHome />} />
     </Route>
  </Route> */}


        {/* Future routes for OTP and Dashboard can go here */}
        <Route path="*" element={<div style={{padding: '20px'}}>404 - Arena Not Found</div>} />
      </Routes>
      
    </Router>
    </>
  );
};

export default App;