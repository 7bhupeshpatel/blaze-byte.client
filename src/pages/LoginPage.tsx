import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import PasswordField from '../components/auth/PasswordField';
import styles from '../styles/components/auth/Auth.module.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Call the centralized auth service
      const response = await authService.loginUser(formData);
      
      if (response.success && response.token) {
        // 2. Fetch the role we just saved in localStorage via the service
        const userRole = localStorage.getItem('blaze_role');
        
        // 3. Redirect based on authorization level
        if (userRole === 'SUPERADMIN' ) {
          navigate('/admin/dashboard');
        }
        else if (userRole === 'ADMIN'){
            navigate('/workspace/dashboard')
        }
        else if (userRole === 'VISITOR'){
          navigate('/pos/dashboard');
        }
      }
    } catch (err: any) {
      // Handles backend "AppError" messages or generic network errors
      setError(err.message || "Invalid credentials or unauthorized access.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Animated Rainbow Border Top (CSS handles this) */}
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Enter your arena credentials</p>
        
        {/* Error Alert Box */}
        {error && (
          <div className={styles.errorMsg}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address</label>
            <input 
              type="email" 
              className={styles.input} 
              placeholder="commander@blazebyte.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
              autoComplete="email"
            />
          </div>
          
          {/* Password Input with Eye Toggle */}
          <PasswordField 
            label="Password" 
            value={formData.password} 
            placeholder="••••••••" 
            onChange={(val) => setFormData({...formData, password: val})} 
          />

          {/* Forgot Password Link - Aligned Right */}
          <div className={styles.forgotPasswordContainer}>
            <Link to="/forgot-password" className={styles.forgotLink}>
              Forgot Password?
            </Link>
          </div>

          {/* Dynamic Action Button */}
          <button 
            type="submit" 
            className={styles.button} 
            disabled={loading}
          >
            {loading ? "AUTHENTICATING..." : "INITIATE LOGIN"}
          </button>
        </form>

        <p className={styles.footerText}>
          New recruit? <Link to="/signup" className={styles.link}>Join the Fleet</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;