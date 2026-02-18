import React, { useState } from 'react';
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import PasswordField from '../components/auth/PasswordField';
import styles from '../styles/components/auth/Auth.module.css';

  const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Pass
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setStep(2);
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return alert("Passwords don't match");
    setLoading(true);
    try {
      // Create this in authService: apiService.post('/auth/reset-password', { email, otp, newPassword: passwords.new })
      await authService.resetPasswordConfirm({ email, otp, newPassword: passwords.new });
      alert("Success! Password changed.");
      navigate('/login');
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Reset Password</h1>
        <form onSubmit={step === 1 ? handleRequest : handleReset}>
          {step === 1 ? (
            <div className={styles.inputGroup}>
              <label className={styles.label}>Registered Email</label>
              <input type="email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          ) : (
            <>
              <div className={styles.inputGroup}>
                <label className={styles.label}>OTP Code</label>
                <input type="text" className={styles.input} value={otp} onChange={(e) => setOtp(e.target.value)} required />
              </div>
              <PasswordField label="New Password" value={passwords.new} placeholder="••••••••" onChange={(val) => setPasswords({...passwords, new: val})} />
              <PasswordField label="Confirm New Password" value={passwords.confirm} placeholder="••••••••" onChange={(val) => setPasswords({...passwords, confirm: val})} />
            </>
          )}
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'PROCESSING...' : step === 1 ? 'SEND RESET OTP' : 'UPDATE PASSWORD'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;