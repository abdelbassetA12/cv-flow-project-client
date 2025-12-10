
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
    const { t } = useTranslation();
  const API_URL = process.env.REACT_APP_API_URL;  // ⬅️ هنا نقرأ env
const isVerified = new URLSearchParams(location.search).get('verified') === '1';
// اجعل جميع الطلبات ترسل الكوكي تلقائيًا
axios.defaults.withCredentials = true;


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password },
        // مهم جدًا للكوكي
      //{ withCredentials: true }
        );
     



      const me = await axios.get(`${API_URL}/api/auth/me`, {
  //headers: { Authorization: `Bearer ${res.data.token}` },
 //withCredentials: true
});
onLogin(me.data); // ✅ بيانات دقيقة





      setTimeout(() => {
        navigate('/');
      }, 300);
    } catch (err) {
      console.log("⚠️ Axios Error:", err.response || err.message || err);
      const message = err?.response?.data?.message || '⚠️ حدث خطأ أثناء تسجيل الدخول';
      setErrorMsg(message);
    }
  };

  const styles = {
    page: {
      fontFamily: 'Cairo, sans-serif',
      background: 'linear-gradient(to right, #e0f7fa, #f1f8e9)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      margin: 0,
      padding: '1rem',
      
    },
    form: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '20px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    input: {
      padding: '0.75rem 1rem',
      border: '1px solid #ccc',
      borderRadius: '12px',
      fontSize: '1rem',
      transition: '0.3s ease',
    },
    button: {
      padding: '0.75rem',
      backgroundColor: '#26a69a',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
    },
    message: {
      textAlign: 'center',
      marginTop: '1rem',
      fontWeight: 'bold',
      color: 'red',
    },
    link: {
      textAlign: 'center',
      marginTop: '1rem',
      fontSize: '0.95rem',
      color: '#00796b',
      textDecoration: 'none',
    },
    linkHover: {
      textDecoration: 'underline',
    }
  };

  return (
     
    <div style={styles.page}>

       
    

      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', color: '#333' }}> {t("login.title")}</h2>

        {isVerified && (
  <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold' }}>
     {t("login.verified")}
  </p>
)}
        <input
          type="email"
          placeholder={t("login.email_placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder={t("login.password_placeholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>{t("login.button")}</button>

        {errorMsg && <p style={styles.message}>{errorMsg}</p>}
        <Link to="/forgot-password" style={styles.link}>
    {t("login.forgot_password")}
</Link>


        <Link to="/register" style={styles.link}>
        {t("login.no_account")}
        </Link>
      </form>
    </div>
  );
}

export default Login;
