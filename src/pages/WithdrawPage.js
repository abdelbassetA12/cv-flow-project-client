




import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
// اجعل جميع الطلبات ترسل الكوكي تلقائيًا
axios.defaults.withCredentials = true;


function Withdraw({ user }) {
  const { t } = useTranslation();
   const API_URL = process.env.REACT_APP_API_URL;
  const [earnings, setEarnings] = useState(0);
  const [method, setMethod] = useState("");
  const [accountInfo, setAccountInfo] = useState("");
  const [bankProof, setBankProof] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
      
        const res = await axios.get(`${API_URL}/api/referral/my-earnings`, {
         
        });
        setEarnings(res.data.earnings);
      } catch (err) {
        console.error("Error fetching earnings:", err);
        
        setError(t("withdraw.errors.fetch_failed"));

      }
    };

    fetchEarnings();
  }, []);

  const handleWithdraw = async () => {
    setError("");
    setSuccess("");

    if (earnings < 5) {
     
      setError(t("withdraw.errors.min_withdrawal"));
      return;
    }

    if (!method || !accountInfo.trim()) {
   
      setError(t("withdraw.errors.missing_fields"));
      return;
    }

   

    try {
      setLoading(true);

      if (method === "paypal") {
        const response = await axios.post(`${API_URL}/api/withdraw`,
          { method, accountInfo, amount: earnings },
        
        );

        if (response.data.success) {
          
          setSuccess(t("withdraw.success.paypal"));

          setAccountInfo("");
          setEarnings(0);
        } else {
          setError(response.data.message || t("withdraw.errors.withdraw_failed"));
        }
      } else if (method === "bank") {
        if (!bankProof) {
           setError(t("withdraw.errors.upload_proof"));
          return;
        }

        const formData = new FormData();
        formData.append("accountInfo", accountInfo);
        formData.append("amount", earnings);
        formData.append("bankProof", bankProof);

        const response = await axios.post(`${API_URL}/api/manual-withdrawals`,
          formData,
          {
            headers: {
              
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          setSuccess(t("withdraw.success.bank"));
          setAccountInfo("");
          setBankProof(null);
          setEarnings(0);
        } else {
          
           setError(response.data.message || t("withdraw.errors.withdraw_failed"));
        }
      }
    } catch (err) {
      console.error("Withdrawal Error:", err);
        setError(t("withdraw.errors.general_error"));
    } finally {
      setLoading(false);
    }
  };

  return ( 
    <div  
      style={{
        maxWidth: "600px",
        margin: "3rem auto",
        padding: "2.5rem",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0 6px 25px rgba(0, 0, 0, 0.08)",
        fontFamily: "Tajawal, sans-serif",
        color: "#333",
      }}
     >
      
   
      <h1 style={{ color: "#2ecc71", textAlign: "center", marginBottom: "1.5rem", fontSize: "28px" }}>
        {t("withdraw.title")}
      </h1>

      <p style={{ fontSize: "18px", textAlign: "center", marginBottom: "1.5rem" }}>
        {t("withdraw.balance")} <strong>{earnings.toFixed(2)} $</strong>
       
      </p>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontWeight: "bold", marginBottom: "6px", display: "block" }}>
          {t("withdraw.method_label")}
        </label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "15px",
            background: "#f9f9f9",
          }}
        >
          <option value="">{t("withdraw.choose")}</option>
          <option value="paypal">{t("withdraw.paypal")}</option>
          <option value="bank">{t("withdraw.bank")}</option>
        </select>
      </div>

      {method === "paypal" && (
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>
              {t("withdraw.paypal_email")}
          </label>
          <input
            type="email"
            value={accountInfo}
            onChange={(e) => setAccountInfo(e.target.value)}
            placeholder="example@email.com"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "15px",
              background: "#fefefe",
            }}
          />
        </div>
      )}

      {method === "bank" && (
        <>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>
             {t("withdraw.bank_account")}
            </label>
            <input
              type="text"
              value={accountInfo}
              onChange={(e) => setAccountInfo(e.target.value)}
              placeholder="e.g., 1234567890"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "15px",
                background: "#fefefe",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>
                {t("withdraw.bank_proof")}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBankProof(e.target.files[0])}
              style={{
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: "#f1f1f1",
                width: "100%",
                border: "1px dashed #ccc",
              }}
            />
          </div>
        </>
      )}

      {error && <p style={{ color: "#e74c3c", marginBottom: "1rem", textAlign: "center" }}>{error}</p>}
      {success && <p style={{ color: "#2ecc71", marginBottom: "1rem", textAlign: "center" }}>{success}</p>}

      <button
        onClick={handleWithdraw}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#bdc3c7" : "#2ecc71",
          color: "#fff",
          padding: "14px",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          width: "100%",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.3s ease",
        }}
      >
        {loading ? t("withdraw.button.loading") : t("withdraw.button.confirm")}
      </button>

      <p style={{ marginTop: "1.5rem", color: "#7f8c8d", fontSize: "14px", textAlign: "center" }}>
        
         {t("withdraw.note")}
      </p>
    </div>
  );
}

export default Withdraw;






