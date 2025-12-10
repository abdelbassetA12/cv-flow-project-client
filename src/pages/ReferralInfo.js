


import React from "react";
import Footer from '../components/Footer';
import { useTranslation, Trans} from "react-i18next";
import './ReferralInfo.css';

import {
 

  FaCreditCard,
  
} from 'react-icons/fa';

function ReferralInfo() {
   const { t } = useTranslation();
  return (
   

    <div   style={{ maxWidth: '100%' }}>


      <style>{`
      
        .strong1 strong{
        color: red;
        
        
        }
       
        .strong2 strong {
        color: #27ae60;
   
        }
    
       
      `}</style>





       <div style={{ maxWidth: '1200px',   margin: '40px  0', padding: "2rem 0", fontFamily: 'Tajawal, sans-serif' }}>
      <h1 style={{ color: "#2ecc71", textAlign: "center", marginBottom: "1rem", padding: "0 1rem" }}> {t("referralInfo.main_title")}</h1>

      <p style={{ fontSize: "1.2rem", textAlign: "center", marginBottom: "3rem", color: "#555", padding: "0 1rem" }}>
        {t("referralInfo.main_subtitle")}
      </p>

     
        {/* مراحل الاستخدام */}
<div
  style={{
    background: "linear-gradient(135deg, #f0f4f7, #ffffff)",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    padding: "1rem",
    maxWidth: "1200px",
    margin: "auto",
  }}
>
        <h2 style={{ color: "#3498db", textAlign: "center", marginBottom: "2rem"  }}>{t("referralInfo.stages_title")}</h2>

        <div style={{
          

          gap: "2rem",
          justifyItems: "center",
          
        }}>
          {/* المرحلة 1 */}
          <div style={{
            background: "#fff",
            borderRadius: "10px",
            
           
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: "1rem",
            textAlign: "center",
            transition: "transform 0.3s ease"
          }}>
            <img src="/images/af-copylink.png" alt=" Copy link" style={{ width: "100%", borderRadius: "8px", marginBottom: "0.8rem" }} />
            <h4 style={{ color: "#2ecc71", margin: "0.5rem 0" }}>{t("referralInfo.stage1_title")}</h4>
            <p style={{ fontSize: "0.95rem", color: "#666" }}>{t("referralInfo.stage1_desc")}</p>
          </div>

          {/* المرحلة 2 */}
          <div style={{
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: "1rem",
            textAlign: "center",
            transition: "transform 0.3s ease"
          }}>
            <img src="/images/tap1c.png" alt="Share the link" style={{ width: "100%", borderRadius: "8px", marginBottom: "0.8rem" }} />
            <h4 style={{ color: "#3498db", margin: "0.5rem 0" }}>{t("referralInfo.stage2_title")}</h4>
            <p style={{ fontSize: "0.95rem", color: "#666" }}>{t("referralInfo.stage2_desc")}</p>
          </div>

          {/* المرحلة 3 */}
          <div style={{
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: "1rem",
            textAlign: "center",
            transition: "transform 0.3s ease"
          }}>
            <img src="/images/af-rgstr-link.png" alt=" Friend link" style={{ width: "100%", borderRadius: "8px", marginBottom: "0.8rem" }} />
            <h4 style={{ color: "#9b59b6", margin: "0.5rem 0" }}>{t("referralInfo.stage3_title")}</h4>
            <p style={{ fontSize: "0.95rem", color: "#666" }}>{t("referralInfo.stage3_desc")}</p>
          </div>

          {/* المرحلة 4 */}
          <div style={{
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: "1rem",
            textAlign: "center",
            transition: "transform 0.3s ease"
          }}>
            <img src="/images/af-sub-link.png" alt=" Commission calculation" style={{ width: "100%", borderRadius: "8px", marginBottom: "0.8rem" }} />
            <h4 style={{ color: "#e67e22", margin: "0.5rem 0" }}>{t("referralInfo.stage4_title")}</h4>
            <p style={{ fontSize: "0.95rem", color: "#666" }}>{t("referralInfo.stage4_desc")}</p>
          </div>

          {/* المرحلة 5 */}
          <div style={{
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: "1rem",
            textAlign: "center",
            transition: "transform 0.3s ease"
          }}>
            <img src="/images/af-withlink.png" alt=" Withdraw profits" style={{ width: "100%", borderRadius: "8px", marginBottom: "0.8rem" }} />
            <h4 style={{ color: "#27ae60", margin: "0.5rem 0" }}>{t("referralInfo.stage5_title")}</h4>
            <p style={{ fontSize: "0.95rem", color: "#666" }}>{t("referralInfo.stage5_desc")}</p>
          </div>

           {/* المرحلة 6 */}
          <div style={{
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: "1rem",
            textAlign: "center",
            transition: "transform 0.3s ease"
          }}>
            <img src="/images/af-cmplt-wit.png" alt=" Withdraw profits" style={{ width: "100%", borderRadius: "8px", marginBottom: "0.8rem" }} />
            <h4 style={{ color: "#27ae60", margin: "0.5rem 0" }}>{t("referralInfo.stage6_title")}</h4>
            <p style={{ fontSize: "0.95rem", color: "#666" }}> {t("referralInfo.stage6_desc")}</p>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <button
            style={{
              background: "linear-gradient(45deg, #2ecc71, #27ae60)",
              color: "#fff",
              border: "none",
              padding: "0.9rem 2.5rem",
              fontSize: "1.2rem",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              transition: "background 0.3s ease"
            }}
            onClick={() => window.location.href = "/referral"}
          >
            {t("referralInfo.start_now")}
          </button>
        </div>
      </div>





      <div style={{ background: "#fefefe", padding: "3rem 1rem", }}>
  <div style={{ maxWidth: "900px", margin: "0 auto" }}>
    <h2 style={{ color: "#e67e22", textAlign: "center", fontSize: "2rem", marginBottom: "1rem" }}>
      {t("referralInfo.rewards_title")}
    </h2>
    <p className="strong1" style={{
      fontSize: "1.2rem",
      textAlign: "center",
      color: "#333",
      marginBottom: "3rem",
      maxWidth: "700px",
      marginInline: "auto"
    }}>
      

        <Trans i18nKey="referralInfo.rewards_text">
           
          </Trans>
    </p>

    <div style={{
      background: "#f9f9f9",
      padding: "2rem",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      marginBottom: "3rem"
    }}>
      <h2 style={{ color: "#9b59b6", textAlign: "center", fontSize: "1.8rem", marginBottom: "1rem" }}>
        {t("referralInfo.conditions_title")}
      </h2>
      <ul style={{
        lineHeight: "1.8",
        color: "#555",
        fontSize: "1.1rem",
        maxWidth: "600px",
        margin: "0 auto",
        listStyle: "none",
        padding: "0"
      }}>
        <li style={{ marginBottom: ".8rem" }}> {t("referralInfo.condition1")}</li>
        <li style={{ marginBottom: ".8rem" }}> {t("referralInfo.condition2")}</li>
        <li style={{ marginBottom: ".8rem" }}> {t("referralInfo.condition3")}</li>
      </ul>
    </div>

    <div style={{
      background: "#fff6f6",
      padding: "1.5rem",
      border: "1px solid #f5c6cb",
      borderRadius: "10px",
      marginBottom: "3rem"
    }}>
      <h3 style={{ color: "#e74c3c", textAlign: "center", fontSize: "1.6rem", marginBottom: "1rem" }}> {t("referralInfo.notes_title")}</h3>
      <ul style={{
        color: "#555",
        fontSize: "1.1rem",
        lineHeight: "1.8",
        listStyle: "none",
        padding: "0",
        maxWidth: "600px",
        margin: "0 auto"
      }}>
        <li style={{ marginBottom: ".8rem" }}>{t("referralInfo.note1")}</li>
        <li style={{ marginBottom: ".8rem" }}>{t("referralInfo.note2")}</li>
        <li style={{ marginBottom: ".8rem" }}>{t("referralInfo.note3")}</li>
      </ul>
    </div>

    


     {/* ✅ طرق سحب الأرباح دائمًا */}
          <div  >
    
            
    
            <div
        style={{
         display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px", // تباعد جميل بين العنوان والأيقونة
      marginBottom: "1rem",
        }}
      >
        
        <h2
          style={{
            color: "#000",
            fontSize: "1.9rem",
            margin: 0, // إزالة المسافة السفلية الافتراضية
          }}
        >
         {t("referralInfo.withdraw_title")}
        </h2>
        <FaCreditCard size={30} style={{ color: "#2ecc71" }} />
      </div>
            
            <p className="strong2" style={{
              fontSize: "1.2rem",
              textAlign: "center",
              color: "#333",
              maxWidth: "700px",
              margin: "0 auto 2rem"
            }}>
             <Trans  i18nKey="referralInfo.withdraw_text"></Trans>
            </p>
    
            <div style={{
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "2.5rem"
    }}>
      {[
        {
          label: t("referralInfo.withdraw_method_paypal"),
          icon: (
            <svg width="60" height="auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <title>PayPal</title>
              <path d="..." /> {<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>PayPal</title><path d="M7.016 19.198h-4.2a.562.562 0 0 1-.555-.65L5.093.584A.692.692 0 0 1 5.776 0h7.222c3.417 0 5.904 2.488 5.846 5.5-.006.25-.027.5-.066.747A6.794 6.794 0 0 1 12.071 12H8.743a.69.69 0 0 0-.682.583l-.325 2.056-.013.083-.692 4.39-.015.087zM19.79 6.142c-.01.087-.01.175-.023.261a7.76 7.76 0 0 1-7.695 6.598H9.007l-.283 1.795-.013.083-.692 4.39-.134.843-.014.088H6.86l-.497 3.15a.562.562 0 0 0 .555.65h3.612c.34 0 .63-.249.683-.585l.952-6.031a.692.692 0 0 1 .683-.584h2.126a6.793 6.793 0 0 0 6.707-5.752c.306-1.95-.466-3.744-1.89-4.906z"/></svg>}
            </svg>
          )
        },
        
        
        
    
    
    
        {
      label: t("referralInfo.withdraw_method_bank"),
      icon: (
        <svg
          width="60"
          height="auto"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="black"
        >
          <title>Bank Transfer</title>
          <path d="M3 10V7l9-6 9 6v3H3zM5 12h14v6H5v-6zM2 17h20v2H2v-2zM17 14h-3v2h3v-2z" />
          <path d="M9.5 16l-3-3m0 6l3-3" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14.5 8l3 3m0-6l-3 3" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    }
    
    
    
    
    
     
    
      ].map((method, index) => (
        <div key={index} style={{
          textAlign: "center",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          padding: "1rem",
          borderRadius: "8px",
          background: "#f9f9f9",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          cursor: "pointer"
        }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
          }}
        >
          {method.icon}
          <p style={{ fontWeight: "bold", color: "#333", marginTop: ".5rem" }}>{method.label}</p>
        </div>
      ))}
          </div>
    
           
          </div>



  </div>
</div>


      {/* باقي محتوى الصفحة */}
     
      
    </div>
     <Footer />



    </div>
  );
}

export default ReferralInfo;





