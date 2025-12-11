import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import {
 

 
  FaLock,
   

} from 'react-icons/fa';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
   const API_URL = process.env.REACT_APP_API_URL;
    const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post(`${API_URL}/api/auth/reset-password`, {
        token,
        newPassword: password,
      });
       setMessage(res.data.message || t("success_message"));
    } catch (err) {
      setError(err?.response?.data?.message || t("error_message")); 
    }
  };

  return (
    <div style={{
      fontFamily: 'Tajawal, sans-serif',
   
      padding: '2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f7f9fc'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>    {t("ResetPassword.title")} <FaLock size={25} color="#26a69a"  /></h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ textAlign: 'right', fontWeight: 'bold', color: '#34495e' }}>
            {t("ResetPassword.label")}
          </label>
          <input
            type="password"
            placeholder={t("ResetPassword.placeholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '0.8rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          />

          <button
            type="submit"
            style={{
              padding: '0.8rem',
              backgroundColor: '#26a69a',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1e887d'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#26a69a'}
          >
           {t("ResetPassword.submit_button")}
          </button>

          {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
          {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;



