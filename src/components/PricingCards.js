import React from 'react';
import {
  FaCheckCircle,
  FaTimesCircle,
 
  FaExclamationTriangle,
 // FaBan,
  FaCrown,
  FaRocket, 
   FaGem
  
} from 'react-icons/fa';



import { useTranslation } from 'react-i18next';




function PricingCards({ user, onPlanSelect }) {
   const { t } = useTranslation();
  const handlePlanSelection = (plan) => {
    if (onPlanSelect) {
      onPlanSelect(plan);
    }
  };

  return (
    <div style={{
      fontFamily: 'Tajawal, sans-serif',
      backgroundColor: '#fff',
      width: '100%',
      display: "flex",
      flexDirection: 'column',
      justifyContent: "center",
      alignItems: 'center',
      padding: '3rem 0',
    }}>
      <h1 style={{
        fontSize: '3rem',
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
      }}>
      
         {t("pricing.title")}
      </h1>

      <p style={{
        fontSize: '1.2rem',
        color: '#333',
        textAlign: 'center',
        maxWidth: '600px',
        marginBottom: '3rem',
      }}>
       
      
       {t("pricing.subtitle")}
      </p>

      <div style={{
        backgroundColor: '#fff',
        width: '100%',
        display: "flex",
        justifyContent: "center",
        gap: "1.5rem",
     
        flexWrap: "wrap"
      }}>
        {/* Basic Plan */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: "#f0f0f0",
          border: "2px dashed #aaa",
          padding: "2rem",
          borderRadius: "12px",
          width: "280px",
          boxShadow: "0 0 10px rgba(0,0,0,0.05)",
        
        }}>



          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <div style={{
              backgroundColor: "#e8f4fc",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)"
            }}>
              <FaRocket  color="#889197ff" size={30}/>
              
            </div>


            <h3 style={{ color: "#333" }}> {t("pricing.plans.basic.name")}</h3>
            

            
          </div>





          
        


          <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem", color: '#333' }}>

            
          
  <li style={{ display: "flex",alignItems: "flex-start", marginBottom: "0.5rem"}}><i><FaExclamationTriangle size={20} style={{ color: "#FACC15", marginRight: "8px", marginTop: "4px" }}/> </i> <span>{t("pricing.plans.basic.features.templates_free")} </span></li>
  <li style={{ display: "flex",alignItems: "flex-start", marginBottom: "0.5rem"}}> <i><FaCheckCircle size={20} style={{ color: "#2ecc71", marginRight: "8px", marginTop: "4px" }} /></i> <span> {t("pricing.plans.basic.features.Number_projects")}</span> </li>
  <li style={{ display: "flex",alignItems: "flex-start", marginBottom: "0.5rem"}}><i><FaExclamationTriangle size={20} style={{ color: "#FACC15", marginRight: "8px", marginTop: "4px" }}/> </i> <span>{t("pricing.plans.basic.features.templates_limited")}</span></li>
  <li style={{ display: "flex",alignItems: "flex-start", marginBottom: "0.5rem"}}><i><FaCheckCircle size={20} style={{ color: "#2ecc71", marginRight: "8px", marginTop: "4px" }} /></i> <span>{t("pricing.plans.basic.features.quick_customization")} </span></li>
  <li style={{ display: "flex",alignItems: "flex-start", marginBottom: "0.5rem"}}><i><FaCheckCircle size={20} style={{ color: "#2ecc71", marginRight: "8px", marginTop: "4px" }} /></i><span>{t("pricing.plans.basic.features.create_cv")} </span></li>
  <li style={{ display: "flex",alignItems: "flex-start", marginBottom: "0.5rem"}}><i><FaTimesCircle size={20} style={{ color: "#e74c3c", marginRight: "8px", marginTop: "4px" }} /> </i><span>{t("pricing.plans.basic.features.limited_pdf")}</span></li>
  <li style={{ display: "flex",alignItems: "flex-start", marginBottom: "0.5rem"}}><i><FaExclamationTriangle size={20} style={{ color: "#FACC15", marginRight: "8px", marginTop: "4px" }} /></i><span>{t("pricing.plans.basic.features.no_saving")}   </span></li>
  <li style={{ display: "flex",alignItems: "flex-start", marginBottom: "0.5rem"}}><i><FaTimesCircle size={20} style={{ color: "#e74c3c", marginRight: "8px", marginTop: "4px" }} /></i><span>{t("pricing.plans.basic.features.customization_colors")}</span> </li>
</ul >





 
          <button
            style={{
              marginTop: "1rem",
              padding: "0.8rem 1rem",
              background: "#ccc",            // لون رمادي يدل على التعطيل
              color: "#666",  
              fontSize: "20px",
              border: "none",
              borderRadius: "8px",
              cursor: " default",
              pointerEvents: "none",
              fontWeight: "bold",
              width: "100%"
            }}
            
         

          
            
          >
             {t("pricing.plans.basic.button")}
          </button>
        </div>

        {/* Pro Plan */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: "rgba(52, 152, 219, 0.07)",
          border: "2px solid #3498db",
          padding: "2rem",
          borderRadius: "12px",
          width: "280px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
         
        }}>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <div style={{
              backgroundColor: "#e8f4fc",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)"
            }}>
              <FaCrown  color="#3498db" size={30}/>
              
            </div>
            <h3 style={{ color: "#3498db", textAlign: "center" }}> {t("pricing.plans.pro.name")}</h3>

            
          </div>

          <div>
            <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem", color: '#333' }}>
           <li style={{ display: "flex",alignItems: "flex-start", marginBottom: "0.5rem" }}> <i><FaExclamationTriangle size={20} style={{ color: "#FACC15", marginRight: "8px" }}/></i> <span> {t("pricing.plans.pro.features.use_templates")} </span></li>
            <li style={{ display: "flex",alignItems: "flex-start", marginBottom: "0.5rem"}}> <i><FaCheckCircle size={20} style={{ color: "#2ecc71", marginRight: "8px", marginTop: "4px" }} /></i><span> {t("pricing.plans.pro.features.Number_projects_pro")}</span> </li>
           <li style={{ display: "flex",alignItems: "flex-start", marginBottom: "0.5rem"}}> <i><FaExclamationTriangle size={20} style={{ color: "#FACC15", marginRight: "8px", marginTop: "4px" }} /></i>    <span> {t("pricing.plans.pro.features.quick_customization")} </span>      </li>
            <li style={{ display: "flex",alignItems: "flex-start", marginBottom: "0.5rem"}}> <i><FaCheckCircle size={20} style={{ color: "#2ecc71", marginRight: "8px", marginTop: "4px" }} /></i><span> {t("pricing.plans.pro.features.create_cv")}</span> </li>
            <li style={{ display: "flex",alignItems: "flex-start", marginBottom: "0.5rem"}}> <i><FaCheckCircle size={20} style={{ color: "#2ecc71", marginRight: "8px", marginTop: "4px" }} /></i><span>{t("pricing.plans.pro.features.unlimited_pdf")} </span> </li>
            <li style={{ display: "flex",alignItems: "flex-start", marginBottom: "0.5rem"}}> <i><FaTimesCircle size={20} style={{ color: "#e74c3c", marginRight: "8px", marginTop: "4px" }} /></i><span> {t("pricing.plans.pro.features.save_designs")} </span> </li>
            <li style={{ display: "flex",alignItems: "flex-start", marginBottom: "0.5rem"}}> <i><FaExclamationTriangle size={20} style={{ color: "#FACC15", marginRight: "8px", marginTop: "4px" }} /></i><span>{t("pricing.plans.pro.features.customization_colors")} </span> </li>
            <li style={{ display: "flex",alignItems: "flex-start", marginBottom: "0.5rem"}}> <i><FaCheckCircle size={20} style={{ color: "#2ecc71", marginRight: "8px", marginTop: "4px" }} /></i><span> {t("pricing.plans.pro.features.professional_templates")}</span> </li>
           
          </ul>

          </div>
          
          



          




          <button
            style={{
              marginTop: "1rem",
              padding: "0.8rem 1rem",
              background: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "20px",
              cursor: "pointer",
              fontWeight: "bold",
              width: "100%"
            }}
            onClick={() => handlePlanSelection('pro')}
          >
           {t("pricing.plans.pro.button")}
          </button>
        </div>

        {/* Premium Plan */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: "rgba(156, 89, 182, 0.06)",
          border: "2px solid #9b59b6",
          padding: "2rem",
          borderRadius: "12px",
          width: "320px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        
        }}>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <div style={{
              backgroundColor: "#f6eefb",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)"
            }}>
              
              <FaGem   color="#9b59b6" size={30}/>
            </div>
            <h3 style={{ color: "#9b59b6", textAlign: "center" }}>{t("pricing.plans.premium.name")}</h3>
           
          </div>


           <div>
            <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem", color: '#333' }}>
            <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "0.5rem"}}> <i><FaCheckCircle size={20} style={{ color: "#2ecc71", marginRight: "8px", marginTop: "4px"}} /></i><span>{t("pricing.plans.premium.features.all_templates")} </span> </li>
             <li style={{ display: "flex",alignItems: "flex-start", marginBottom: "0.5rem"}}> <i><FaCheckCircle size={20} style={{ color: "#2ecc71", marginRight: "8px", marginTop: "4px" }} /></i><span> {t("pricing.plans.premium.features.Number_projects_premium")}</span> </li>
            <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "0.5rem"}}> <i><FaCheckCircle size={20} style={{ color: "#2ecc71", marginRight: "8px", marginTop: "4px" }} /></i><span>{t("pricing.plans.premium.features.most_professional")} </span> </li>
            <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "0.5rem"}}> <i><FaCheckCircle size={20} style={{ color: "#2ecc71", marginRight: "8px", marginTop: "4px" }} /></i><span> {t("pricing.plans.premium.features.quick_customization")} </span> </li>
            <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "0.5rem"}}> <i><FaCheckCircle size={20} style={{ color: "#2ecc71", marginRight: "8px", marginTop: "4px" }} /></i><span> {t("pricing.plans.premium.features.create_cv")} </span> </li>
            <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "0.5rem"}}> <i><FaCheckCircle size={20} style={{ color: "#2ecc71", marginRight: "8px", marginTop: "4px" }} /></i><span> {t("pricing.plans.premium.features.unlimited_pdf")} </span> </li>
            <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "0.5rem"}}> <i><FaCheckCircle size={20} style={{ color: "#2ecc71", marginRight: "8px", marginTop: "4px" }} /></i><span> {t("pricing.plans.premium.features.save_designs")}</span> </li>
            <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "0.5rem"}}> <i><FaCheckCircle size={20} style={{ color: "#2ecc71", marginRight: "8px", marginTop: "4px" }} /></i><span>{t("pricing.plans.premium.features.customization_colors")} </span> </li>         
          </ul>

          </div>
          
          



          



          <button
            style={{
              marginTop: "1rem",
              padding: "0.8rem 1rem",
              background: "#9b59b6",
              color: "white",
              fontSize: "20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              width: "100%"
            }}
            onClick={() => handlePlanSelection('premium')}
          >
            {t("pricing.plans.premium.button")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PricingCards;


