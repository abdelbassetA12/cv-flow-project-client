// src/pages/Profile.jsx
import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaRocket, FaCrown, FaGem, FaClock, FaUserCircle, FaShieldAlt} from 'react-icons/fa';
import {  toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const SubscriptionStatusCard = ({ plan, user }) => {
 const { t } = useTranslation();


   
  const planData = {
    basic: {
      title:  t("profile.subscription.basic"),
     
      color: "#2ecc71",
      icon: <FaRocket size={30} color="#2ecc71" />
    },
    pro: {
      title: t("profile.subscription.pro"),
     
      color: "#3498db",
      icon: <FaCrown size={30} color="#3498db" />
    },
    premium: {
      title:  t("profile.subscription.premium"),
    
      color: "#9b59b6",
      icon: <FaGem size={30} color="#9b59b6" />
    }
  };

  const data = planData[plan] || planData["basic"];

  return (
    <div style={{ ...styles.card, border: `2px solid ${data.color}` }}>
      <h1 style={{ ...styles.title, color: data.color }}>{data.icon} {data.title}</h1>
     

      {user.subscriptionStartDate && (
        <p style={styles.subInfo}>
          <FaRocket style={styles.icon} /> {t("profile.subscription.start")} <strong>{new Date(user.subscriptionStartDate).toLocaleDateString()}</strong>
        </p>
      )}
      {user.subscriptionExpiresAt && (
        <p style={styles.subInfo}>
          <FaClock style={styles.icon} /> {t("profile.subscription.end")} <strong>{new Date(user.subscriptionExpiresAt).toLocaleDateString()}</strong>
        </p>
      )}
    </div>
  );
};

function Profile() {
 
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const firstInputRef = useRef(null);
   const API_URL = process.env.REACT_APP_API_URL;
   const { t } = useTranslation();

  useEffect(() => {
    if (showModal && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [showModal]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
         credentials: "include", // 🔥 إرسال الكوكي تلقائيًا
        headers: {
          'Content-Type': 'application/json',
          //Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(t("profile.success"));
        setOldPassword('');
        setNewPassword('');
        setShowModal(false);
       toast.success(t("profile.success"));
      } else {
        setMessage(`❌ ${data.message}`);
        toast.error(t("profile.error_wrong"));
      }
    } catch (err) {
      setMessage(t("profile.error_general"));
    }
  };

  return (
    <div style={styles.wrapper}>
      <SubscriptionStatusCard plan={user?.subscriptionPlan || 'basic'} user={user} />

      <div style={styles.section}>
        <h2 style={styles.heading}><FaUserCircle size={30} color="#2ecc71" marginRight="8px"/>   {t("profile.title")}</h2>
        <p><strong>{t("profile.name")} </strong> {user?.username}</p>
        <p><strong> {t("profile.email")}</strong> {user?.email}</p>
        <p><strong>{t("profile.plan")}</strong> {user?.subscriptionPlan === 'basic' ? 'basic' : user.subscriptionPlan}</p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.heading}><FaShieldAlt size={30} color="#2ecc71" />{t("profile.security_title")} </h3>
        <button onClick={() => setShowModal(true)} style={styles.primaryBtn}>{t("profile.change_password")}</button>
      </div>

      {message && (
        <p style={{ marginTop: '15px', color: message.includes('✅') ? 'green' : 'red' }}>
          {message}
        </p>
      )}

      {/* Modal */}
      {showModal && (
        <>
          <div style={styles.backdrop} onClick={() => setShowModal(false)} />
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}> {t("profile.modal_title")}</h2>
            <form onSubmit={handleChangePassword}>
              <label> {t("profile.current_password")}</label>
              <input
                ref={firstInputRef}
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                style={styles.input}
              />
              <label> {t("profile.new_password")}</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={styles.input}
              />
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.secondaryBtn}>{t("profile.cancel")}</button>
                <button type="submit" style={styles.primaryBtn}>{t("profile.submit")}</button>
                
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: '600px',
    margin: '40px auto',
    fontFamily: 'Tajawal, sans-serif',
    background: '#fdfdfd',
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 0 15px rgba(0,0,0,0.08)',
  
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "2rem",
    marginBottom: "30px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    textAlign: "center"
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "1rem",
  },
  text: {
    fontSize: "1.1rem",
    color: "#555",
    marginBottom: ".5rem"
  },
  icon: {
    color: '#3498db',
    marginRight: '8px'
  },
  subInfo: {
    fontSize: "0.95rem",
    color: "#666",
    textAlign: 'left'
  },
  section: {
    marginTop: '30px'
  },
  heading: {
    fontSize: '1.4rem',
    color: '#444',
    marginBottom: '15px',
    borderBottom: '1px solid #ddd',
    paddingBottom: '5px'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: 8,
    marginBottom: 16,
    borderRadius: '6px',
    border: '1px solid #ccc'
  },
  primaryBtn: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '10px',
    transition: '0.3s ease',
  },
  secondaryBtn: {
    background: '#6c757d',
     color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '10px',
    transition: '0.3s ease',
  },
  backdrop: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.4)', zIndex: 1000
  },
  modal: {
    position: 'fixed', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)', background: '#fff',
    padding: 30, borderRadius: 12, width: 360,
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)', zIndex: 1001
  },
  modalTitle: { marginBottom: 16, fontSize: 22 },
  modalActions: { marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: '10px' }
};

export default Profile;



























