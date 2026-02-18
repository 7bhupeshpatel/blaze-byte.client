import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import styles from '../styles/components/auth/Auth.module.css';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Info, 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');

  // Phase 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // We call your signup endpoint which triggers the email
      await authService.registerUser({
        email: formData.email,
        password: formData.password
      });
      setStep(2); // Move to OTP field
    } catch (err: any) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Phase 2: Verify and Complete Signup
  const handleVerifyAndSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.verifyOtp({
        email: formData.email,
        otp: otp
      });

      if (response.success) {
        setShowSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* SUCCESS POPUP OVERLAY */}
      {showSuccess && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <div className={styles.rainbowRing}></div>
            <h2>MISSION ACCOMPLISHED</h2>
            <p>Your account is active. Redirecting to the arena...</p>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <h1 className={styles.title}>Join Blaze-Byte</h1>
        <p className={styles.subtitle}>
          {step === 1 ? "Create your guest account" : `Enter the code sent to ${formData.email}`}
        </p>
        
        {error && <div className={styles.errorMsg}>{error}</div>}

        <form onSubmit={step === 1 ? handleRequestOtp : handleVerifyAndSignup}>
          {/* STEP 1 FIELDS */}
          <div className={step === 1 ? styles.show : styles.hide}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address</label>
              <input 
                type="email" 
                className={styles.input} 
                placeholder="gamer@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required={step === 1}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Create Password</label>
              <input 
                type="password" 
                className={styles.input} 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required={step === 1}
              />
            </div>
          </div>

          {/* STEP 2 FIELD (OTP) */}
          {step === 2 && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>Security Code (OTP)</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="6-Digit Code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                autoFocus
              />
            </div>
          )}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "PROCESSING..." : step === 1 ? "SEND OTP" : "VERIFY & SIGNUP"}
          </button>
          
          {step === 2 && (
            <button 
              type="button" 
              className={styles.link} 
              style={{ background: 'none', border: 'none', marginTop: '10px', width: '100%', cursor: 'pointer' }}
              onClick={() => setStep(1)}
            >
              ← Edit Email
            </button>
          )}
        </form>

        <p className={styles.footerText}>
          Already a member? <Link to="/login" className={styles.link}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;