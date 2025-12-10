

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
 

 FaBook,

 FaLink,
 FaChartBar,
 FaRegCopy,
 FaCheckCircle,

  FaInbox,
  FaCreditCard,
  FaMoneyBillWave,
  FaDollarSign,

  FaRegCalendarAlt,
  FaThumbtack,
  FaBan,
  FaRegSmileBeam
 
  
 
  

} from 'react-icons/fa';
// اجعل جميع الطلبات ترسل الكوكي تلقائيًا


axios.defaults.withCredentials = true;




function Referral({ user }) {
   const { t } = useTranslation();
  

  const [referralCode, setReferralCode] = useState('');
  const [earnings, setEarnings] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [paidReferrals, setPaidReferrals] = useState(0);
  const [copied, setCopied] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
const [totalWithdrawn, setTotalWithdrawn] = useState(0);
 const API_URL = process.env.REACT_APP_API_URL;
const tableHeaderStyle = {
  padding: '12px 16px',
  fontWeight: '600',
  borderBottom: '1px solid #ccc',
  fontSize: '1rem',
};

const tableCellStyle = {
  padding: '12px 16px',
  fontSize: '0.95rem',
  color: '#333',
};



 

  useEffect(() => {
    const fetchReferralData = async () => {
      //const token = localStorage.getItem('token');
      //const headers = { Authorization: `Bearer ${token}` };

      const codeRes = await axios.get(`${API_URL}/api/referral/my-code`);
      setReferralCode(codeRes.data.referralCode);

      const earningsRes = await axios.get(`${API_URL}/api/referral/my-earnings`);
      setEarnings(earningsRes.data.earnings);

      const referredRes = await axios.get(`${API_URL}/api/referral/referrals`);
      setTotalReferrals(referredRes.data.totalReferrals || 0);
      setPaidReferrals(referredRes.data.paidReferrals || 0);



  

    

    const withdrawalsRes = await axios.get(`${API_URL}/api/withdraw/my-withdrawals`);
if (withdrawalsRes.data.success) {
  setWithdrawals(withdrawalsRes.data.withdrawals);
  setTotalWithdrawn(withdrawalsRes.data.totalWithdrawn);
  }
};





    fetchReferralData();
  }, []);

  const copyLink = () => {
    const url = `${window.location.origin}/register?ref=${referralCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };



  const navigate = useNavigate();

const handleWithdrawClick = () => {
  if (earnings >= 5) {
    navigate('/withdraw');
  } else {
    
    alert(t("referral.withdraw_min_error"));
  }
};


  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>  {t("referral.title")}  <FaRegSmileBeam style={{ color: '#6c5ce7', marginLeft: '8px' }} /></h1>

      <p style={styles.infoLink}>
        <a href="/referral-info" style={styles.link}> {t("referral.how_it_works")}  <FaBook style={{ color: '#3b82f6', marginLeft: '8px' }} /></a>
      </p>

      <div style={styles.section}>
         <h2 style={styles.subHeading}>   {t("referral.link")}  <FaLink style={{ color: '#6366f1', marginLeft: '8px' }} />
  

</h2>

        <div style={styles.referralBox}>
          <input
            type="text"
            value={`${window.location.origin}/register?ref=${referralCode}`}
            readOnly
            style={styles.input}
          />
          <button onClick={copyLink} style={styles.copyButton}>
           
            {copied ? (
   <>{t("referral.copied")}<FaCheckCircle style={{  marginRight: '5px' }} /> </> 
) : (
  <>{t("referral.copy")} <FaRegCopy style={{ marginRight: '5px' }} /></>
)}

          </button>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subHeading}>   {t("referral.stats")}  <FaChartBar style={{ color: '#3b82f6', marginLeft: '8px' }} />
</h2>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{totalReferrals}</div>
            <div style={styles.statLabel}>  {t("referral.registered")}  <FaInbox style={{ color: '#3b82f6', marginLeft: '8px' }} /></div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{paidReferrals}</div>
            <div style={styles.statLabel}>{t("referral.paid_subs")}  <FaCreditCard style={{ color: '#3b82f6', marginLeft: '8px' }} /></div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>${earnings.toFixed(2)}</div>
            <div style={styles.statLabel}> {t("referral.total_earnings")} < FaDollarSign style={{ color: '#3b82f6', marginLeft: '8px' }} /></div>
          </div>
        </div>
      </div>






<div style={styles.section}>
  <h2 style={styles.subHeading}>  {t("referral.withdraw_history")} <FaMoneyBillWave style={{ color: '#3b82f6', marginLeft: '8px' }} /></h2>
  <p style={{ fontSize: '1rem', marginBottom: '20px' }}>
       {t("referral.total_withdrawn")}: <strong style={{ color: '#0d9488', fontSize: '1.1rem' }}>${totalWithdrawn.toFixed(2)}</strong>
  </p>

  {withdrawals.length === 0 ? (
    <p style={{ color: '#666', fontStyle: 'italic' }}> {t("referral.no_withdrawals")}</p>
  ) : (
    <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '600px',
      }}>
        <thead>
          <tr style={{
            background: 'linear-gradient(to right, #e0f2f1, #b2dfdb)',
            color: '#004d40',
            textAlign: 'left',
          }}>
            <th style={tableHeaderStyle}>{t("referral.history")} < FaRegCalendarAlt style={{ color: '#3b82f6', marginLeft: '8px' }} /></th>
            <th style={tableHeaderStyle}> {t("referral.amount")}< FaDollarSign style={{ color: '#3b82f6', marginLeft: '8px' }} /></th>
            <th style={tableHeaderStyle}> {t("referral.method")}< FaCreditCard style={{ color: '#3b82f6', marginLeft: '8px' }} /></th>
            <th style={tableHeaderStyle}>{t("referral.status")} < FaThumbtack style={{ color: '#3b82f6', marginLeft: '8px' }} /></th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((w) => (
            <tr key={w._id} style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #eee' }}>
              <td style={tableCellStyle}>{new Date(w.createdAt).toLocaleString()}</td>
              <td style={tableCellStyle}>${w.amount.toFixed(2)}</td>
              <td style={tableCellStyle}>{w.method}</td>
              <td style={{
                ...tableCellStyle,
                color: w.status === 'مقبول' ? '#16a34a' : w.status === 'مرفوض' ? '#dc2626' : ' #3b82f6', fontWeight: 'bold'}}>
                {w.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>








      <div style={styles.section}>
  <h2 style={styles.subHeading}>{t("referral.available_balance")}  <FaCreditCard style={{ color: '#3b82f6', marginLeft: '8px' }} /></h2>
  <p style={{ fontSize: 18, marginBottom: 10 }}>
    {earnings.toFixed(2)} $
  </p>
  <button
    onClick={handleWithdrawClick}
    disabled={earnings < 5}
    style={{
      padding: '12px 20px',
      backgroundColor: earnings >= 5 ? '#2ecc71' : '#bdc3c7',
      color: '#fff',
      border: 'none',
      borderRadius: 8,
      fontSize: 16,
      cursor: earnings >= 5 ? 'pointer' : 'not-allowed',
      fontWeight: 'bold'
    }}
  >
      {t("referral.withdraw_now")}
  </button>
  {earnings < 5 && (
    <p style={{ color: '#e74c3c', marginTop: 10 }}>
       {t("referral.withdraw_min_note")} <FaBan style={{ color: '#e74c3c', marginLeft: '8px' }} />
    </p>
  )}
</div>
    </div>



    




  );
}

const styles = {
  container: {
    maxWidth: 900,
    margin: '40px auto',
    padding: '30px',
    fontFamily: "'Segoe UI', sans-serif",
    color: '#2c3e50',
    background: 'linear-gradient(to bottom right, #fdfbfb, #ebedee)',
    borderRadius: 12,
  },
  heading: {
    fontSize: 28,
    marginBottom: 10,
    color: '#6c5ce7',
    textAlign: 'center',
  },
  infoLink: {
    textAlign: 'center',
    marginBottom: 30,
  },
  link: {
    color: '#0984e3',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 40,
  },
  label: {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: 10,
    fontSize: 16,
  },
  referralBox: {
    display: 'flex',
    gap: 10,
  },
  input: {
    flex: 1,
    padding: '12px',
    border: '1px solid #dfe6e9',
    borderRadius: 8,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  copyButton: {
    padding: '12px 18px',
    backgroundColor: '#00b894',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.3s',
  },
  subHeading: {
    fontSize: 20,
    marginBottom: 20,
    color: '#0984e3',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 20,
  },
  statCard: {
    background: '#fff',
    border: '1px solid #dfe6e9',
    borderRadius: 10,
    padding: 20,
    textAlign: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6c5ce7',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 15,
    color: '#636e72',
  },
};

export default Referral;
