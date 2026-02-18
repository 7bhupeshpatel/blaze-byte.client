import React, { useState, useEffect } from 'react';
import { User, Lock, Building, Mail, Shield, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import styles from '../../styles/pages/common/Settings.module.css';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const userRole = localStorage.getItem('blaze_role') || 'GUEST';
  
  // Mocking initial data - replace with your auth context/hook
  const [profile, setProfile] = useState({
    email: 'user@blazebyte.com',
    fullName: 'John Doe',
    companyName: 'Blaze Byte Demo',
    joinedDate: '2023-10-12',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Logic: await authService.updateProfile(profile);
    setTimeout(() => {
      toast.success('Profile information updated');
      setLoading(false);
    }, 1000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords don't match");
    }
    toast.success('Security settings updated successfully');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Account Settings</h1>
        <p>Manage your profile, security, and preferences</p>
      </div>

      <div className={styles.settingsGrid}>
        {/* Left Column: Profile Info */}
        <section className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <User size={20} className={styles.icon} />
            <h2>Personal Information</h2>
          </div>
          
          <form onSubmit={handleUpdateProfile} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input 
                type="text" 
                value={profile.fullName} 
                onChange={e => setProfile({...profile, fullName: e.target.value})}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input type="email" value={profile.email} disabled />
              <small>Email cannot be changed manually. Contact support.</small>
            </div>
            
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </section>

        {/* Right Column: Role Specific & Security */}
        <div className={styles.sideColumn}>
          
          {/* Role Badge Section */}
          <div className={`${styles.settingsCard} ${styles.infoCard}`}>
            <div className={styles.cardHeader}>
              <Shield size={20} className={styles.icon} />
              <h2>Your Role</h2>
            </div>
            <div className={styles.roleBadge}>
              <CheckCircle size={16} />
              <span>{userRole.replace('_', ' ')}</span>
            </div>
            
            {/* Contextual Info */}
            {userRole !== 'SUPERADMIN' && (
              <div className={styles.contextInfo}>
                <div className={styles.infoRow}>
                  <Building size={16} />
                  <span>{profile.companyName}</span>
                </div>
                <div className={styles.infoRow}>
                  <Mail size={16} />
                  <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Security Section */}
          <section className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <Lock size={20} className={styles.icon} />
              <h2>Security</h2>
            </div>
            <form onSubmit={handlePasswordChange} className={styles.form}>
              <div className={styles.formGroup}>
                <input 
                  type="password" 
                  placeholder="Current Password" 
                  onChange={e => setPasswords({...passwords, current: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <input 
                  type="password" 
                  placeholder="New Password" 
                  onChange={e => setPasswords({...passwords, new: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <input 
                  type="password" 
                  placeholder="Confirm New Password" 
                  onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                />
              </div>
              <button type="submit" className={styles.secondaryBtn}>Change Password</button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;