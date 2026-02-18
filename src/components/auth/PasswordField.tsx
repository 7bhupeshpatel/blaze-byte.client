import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from '../../styles/components/auth/Auth.module.css';

interface Props {
  label: string;
  value: string;
  placeholder: string;
  onChange: (val: string) => void;
}

const PasswordField: React.FC<Props> = ({ label, value, placeholder, onChange }) => {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input 
          type={show ? "text" : "password"} 
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required 
        />
        <button 
          type="button"
          onClick={() => setShow(!show)}
          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;