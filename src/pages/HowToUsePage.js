import { AuthContext } from '../context/AuthContext';
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer';
import { useTranslation } from "react-i18next";
import './HowToUsePage.css';

function HowToUsePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleStartClick = () => {
    if (user) {
      navigate("/");       // المستخدم مسجّل الدخول → الصفحة الرئيسية
    } else {
      navigate("/register"); // غير مسجّل الدخول → صفحة التسجيل
    }
  };

  const steps = [
    {
      title: t("howto.steps.create_account.title"),
      description: t("howto.steps.create_account.description"),
      image: "/images/sinup-image.png",
    },
    {
      title: t("howto.steps.choose_template.title"),
      description: t("howto.steps.choose_template.description"),
      image: "/images/tmplt-image.png",
    },
    {
      title: t("howto.steps.customize_start.title"),
      description: t("howto.steps.customize_start.description"),
      image: "/images/edit-image.png",
    },
  ];

  return (
    <div>
      <style>{`
        button {
          background: #9b59b6;
          color: #fff;
          padding: 14px 28px;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: 0.3s;
        }
        button:hover { 
          background: #f0f0f0; 
          color: #9b59b6;
          border: 1px solid #9b59b6;
        }



        
      `}</style>

      <div style={{padding: "2rem", fontFamily: "'Tajawal', sans-serif" }}>
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
          {t("howto.title")}
        </h1>

        <div className='cart' >
          {steps.map((step, index) => (
            <div 
              key={index}
              
            >
              <img className='images'
                src={step.image}
                alt={step.title}
                
              />
              <div className='discrep'>
                <h2>{step.title}</h2>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", margin: "2rem 0" }}>
          <button onClick={handleStartClick}>{t("howto.cta")}</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HowToUsePage;




