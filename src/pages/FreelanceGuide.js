








import React, { useContext } from 'react';
import Footer from '../components/Footer';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // ✅ عدل المسار حسب ملفك
import { useTranslation, Trans } from "react-i18next";





function FreelanceGuide() {
  const navigate = useNavigate();
   const { user } = useContext(AuthContext); // ✅ الحصول على حالة تسجيل الدخول
   const { t } = useTranslation();

  return (
    

    <div>
      <style>{`
       /* ✅ جعل الصفحة مرنة ومتجاوبة على جميع الأجهزة */

@media (max-width: 992px) {
  .freelance-box {
    padding: 1.5rem !important;
  }

  h1 {
    font-size: 2rem !important;
  }

  h2 {
    font-size: 1.4rem !important;
  }

  p, li, ol, ul {
    font-size: 0.95rem !important;
  }

  .freelance-btn {
    font-size: 1rem !important;
    padding: 12px 28px !important;
  }
}

@media (max-width: 768px) {
  body {
    overflow-x: hidden;
  }

  .freelance-box {
    padding: 1.2rem !important;
    border-radius: 8px !important;
  }

  h1 {
    font-size: 1.8rem !important;
  }

  h2 {
    font-size: 1.3rem !important;
  }

  p, li {
    font-size: 0.9rem !important;
    line-height: 1.6 !important;
  }

  .freelance-btn {
    width: 100%;
    max-width: 280px;
    font-size: 1rem;
    padding: 12px 0;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.6rem !important;
  }

  h2 {
    font-size: 1.1rem !important;
  }

  p, li {
    font-size: 0.85rem !important;
  }

  .freelance-btn {
    width: 100%;
    max-width: 250px;
    font-size: 0.95rem;
  }
}

/* ✨ تحسين الزر */
.freelance-btn {
  background-color: #6a11cb;
  background-image: linear-gradient(to right, #6a11cb, #2575fc);
  color: #fff;
  padding: 14px 32px;
  font-size: 1.1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.freelance-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

     



        
      `}</style>

      <div style={{
      fontFamily: "'Tajawal', Arial, sans-serif",
      backgroundColor: '#f9f9f9',
      padding: '4rem 2rem',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>
       
        {t("freelanceGuide.title")}
      </h1>
      <p style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '3rem', color: '#555' }}>
       
        {t("freelanceGuide.subtitle")}
      </p>

      <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#333' }}>💡 {t("freelanceGuide.idea_title")}</h2>
        
        <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#555' }}>
          {t("freelanceGuide.idea_text")}
        
        </p>

        <h2 style={{ fontSize: '1.8rem', margin: '2rem 0 1rem', color: '#333' }}>🚀 {t("freelanceGuide.steps_title")}</h2>
        <ol style={{ fontSize: '1rem', lineHeight: '1.8', color: '#555', paddingLeft: '1.5rem' }}>
           {t("freelanceGuide.steps_list", { returnObjects: true }).map((step, idx) => (
    <li key={idx}>{step}</li>
  ))}
         
        </ol>

        <h2 style={{ fontSize: '1.8rem', margin: '2rem 0 1rem', color: '#333' }}>💰 {t("freelanceGuide.pricing_title")}</h2>
       
        <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#555' }}>
  <Trans i18nKey="freelanceGuide.pricing_text">
   
  </Trans>
</p>





        <h2 style={{ fontSize: '1.8rem', margin: '2rem 0 1rem', color: '#333' }}> 🎯 {t("freelanceGuide.where_title")}</h2>
        <ul style={{ fontSize: '1rem', lineHeight: '1.8', color: '#555', paddingLeft: '1.5rem' }}>
          {t("freelanceGuide.where_list", { returnObjects: true }).map((item, idx) => (
    <li key={idx}>{item}</li>
  ))}
         
        </ul>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>



          
         


            {/* ✅ إظهار الزر فقط إذا لم يكن المستخدم مسجل الدخول */}
      {!user && (
        
         


          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              backgroundColor: '#6a11cb',
              backgroundImage: 'linear-gradient(to right, #6a11cb, #2575fc)',
              color: '#fff',
              padding: '14px 32px',
              fontSize: '1.1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
       
            {t("freelanceGuide.cta_button")}
          </button>
        </div>
        




        
      )}
      





        </div>
      </div>
       
    </div>
    <Footer />

    </div>
  );
}

export default FreelanceGuide;
