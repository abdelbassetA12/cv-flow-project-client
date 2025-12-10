import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import {FaKey} from 'react-icons/fa';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
    const API_URL = process.env.REACT_APP_API_URL;  // ⬅️ هنا نقرأ env
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      setMessage(res.data.message);
    } catch (err) {
      const msg = err?.response?.data?.message || 'حدث خطأ، يرجى المحاولة لاحقًا.';
      setError(msg);
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
        <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>  {t("forgot_password.title")} <FaKey size={25} color="#26a69a" /></h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ textAlign: 'right', fontWeight: 'bold', color: '#34495e' }}>
            {t("forgot_password.instruction")}
          </label>
          <input
            type="email"
            placeholder={t("forgot_password.placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '0.8rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
              direction: "ltr"
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
            
         
            {t("forgot_password.button")}
          </button>

          {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{t("forgot_password.success")}</p>}
          {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{t("forgot_password.error")}</p>}
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;


