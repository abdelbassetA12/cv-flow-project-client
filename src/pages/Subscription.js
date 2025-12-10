import React from 'react';
import PricingCards from "../components/PricingCards";
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import {  toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import './Subscription.css';


import {
 

  FaCreditCard,
  FaCrown,
  FaRocket, 
   FaGem,
   FaClock,
   

} from 'react-icons/fa';






const SubscriptionStatusCard = ({ plan, user }) => {
  
  const { t } = useTranslation();





  if (!user) {
    return (

      
      <div  style={{
        fontFamily: 'Tajawal, sans-serif',
        maxWidth: "700px",
        margin: "2rem auto",
        padding: "2rem ",
        borderRadius: "16px",
        backgroundColor: "#fff",
        border: "2px solid 'linear-gradient(to right, #7b2ff7, #f107a3)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: "1.8rem", color: "#7b2ff7", marginBottom: "1rem" }}>
          {t("subscription.welcome_title")}
          
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: ".5rem" }}>
      
        {t("subscription.welcome_text")}
        </p>




        
      </div>
    );
  }









  const planData = {
    basic: {
      title: t("subscription.plans.basic_title"),
      description: t("subscription.plans.basic_desc"),
      note: t("subscription.plans.basic_note"),
      color: "#2ecc71",
      icon: <FaRocket size={30} color="#2ecc71" />
    },
    pro: {
      title:  t("subscription.plans.pro_title"),
      description:  t("subscription.plans.pro_desc"),
      note:  t("subscription.plans.pro_note"),
      color: "#3498db",
      icon: <FaCrown size={30} color="#3498db" />
    },
    premium: {
      title:  t("subscription.plans.premium_title"),
      description:  t("subscription.plans.premium_desc"),
      note:  t("subscription.plans.premium_note"),
      color: "#9b59b6",
       icon: <FaGem size={30} color="#9b59b6" />
    }
  };

  const data = planData[plan] || planData["basic"];



return (
    <div className='sub-cart' style={{
      fontFamily: 'Tajawal, sans-serif',
      maxWidth: "700px",
      margin: "2rem auto",
      padding: "2rem ",
      borderRadius: "16px",
      backgroundColor: "#fff",
      border: `2px solid ${data.color}`,
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      textAlign: "center"
    }}>
      
      <h1 style={{ fontSize: "1.8rem", color: data.color, marginBottom: "1rem" }}>
       {data.icon} {data.title}
      </h1>
      <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: ".5rem" }}>{data.description}</p>
      <p style={{ fontSize: "1rem", color: "#777" }}>{data.note}</p>




         {/* ✅ عرض التواريخ إذا كانت متوفرة */}
        
      {user.subscriptionStartDate && (
        <p style={{ fontSize: "0.95rem", color: "#666", textAlign: 'left' }}>
           <FaRocket   style={{ color: '#3498db', marginRight: '8px' }} />   {t("subscription.dates.start")} <strong>{new Date(user.subscriptionStartDate).toLocaleDateString()}</strong>
        </p>
      )}

      {user.subscriptionExpiresAt && (
        <p style={{ fontSize: "0.95rem", color: "#666", textAlign: 'left' }}>
           <FaClock  style={{ color: '#3498db', marginRight: '8px',  }} />  {t("subscription.dates.end")} <strong>{new Date(user.subscriptionExpiresAt).toLocaleDateString()}</strong>
        </p>
      )}
    </div>
  );
};



function Subscription({ user }) {
  const navigate = useNavigate();
    const { t } = useTranslation();



  const handlePlanSelection = (plan) => {
  if (!user) {
    navigate('/login');
    return;
  }

  if (user.subscriptionPlan === plan && user.isSubscribed) {
   
    toast.success(t("subscription.errors.already_subscribed", { plan }));

   
    return;
  }

  navigate(`/checkout?plan=${plan}`);
};



 

  return (
    <div  className="subscription-page" style={{ fontFamily: 'Tajawal, sans-serif', padding: "2rem 0" }}>
       {/* ✅ عرض حالة الاشتراك دائمًا في الأعلى */}
      <SubscriptionStatusCard plan={user?.subscriptionPlan || 'basic'} user={user} />
     
    

      {/* ✅ خطط الاشتراك دائمًا */}
      <PricingCards user={user} onPlanSelect={handlePlanSelection} />

      {/* ✅ طرق سحب الأرباح دائمًا */}
      <div  style={{
    
      marginBottom: "3rem",
    }}>

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
      {t("subscription.payment_methods_title")}
    
    </h2>
    <FaCreditCard size={30} style={{ color: "#2ecc71" }} />
  </div>
        
        <p style={{
          fontSize: "1.2rem",
          textAlign: "center",
          color: "#333",
          maxWidth: "700px",
          margin: "0 auto 2rem"
        }}>
          {t("subscription.payment_methods_text")}
       
        </p>

        <div style={{
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "2.5rem"
}}>
  {[
    {
      label:  t("subscription.methods.paypal"),
      icon: (
        <svg width="60" height="auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>PayPal</title>
          <path d="..." /> {<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>PayPal</title><path d="M7.016 19.198h-4.2a.562.562 0 0 1-.555-.65L5.093.584A.692.692 0 0 1 5.776 0h7.222c3.417 0 5.904 2.488 5.846 5.5-.006.25-.027.5-.066.747A6.794 6.794 0 0 1 12.071 12H8.743a.69.69 0 0 0-.682.583l-.325 2.056-.013.083-.692 4.39-.015.087zM19.79 6.142c-.01.087-.01.175-.023.261a7.76 7.76 0 0 1-7.695 6.598H9.007l-.283 1.795-.013.083-.692 4.39-.134.843-.014.088H6.86l-.497 3.15a.562.562 0 0 0 .555.65h3.612c.34 0 .63-.249.683-.585l.952-6.031a.692.692 0 0 1 .683-.584h2.126a6.793 6.793 0 0 0 6.707-5.752c.306-1.95-.466-3.744-1.89-4.906z"/></svg>}
        </svg>
      )
    },
    {
      label:  t("subscription.methods.visa"),
      icon: (
        <svg width="60" height="auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>Visa</title>
          <path d="..." /> {<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Visa</title><path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z"/></svg>}
        </svg>
      )
    },
    {
      label: t("subscription.methods.mastercard"),
      icon: (
        <svg width="60" height="auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>MasterCard</title>
          <path d="..." /> {<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>MasterCard</title><path d="M11.343 18.031c.058.049.12.098.181.146-1.177.783-2.59 1.238-4.107 1.238C3.32 19.416 0 16.096 0 12c0-4.095 3.32-7.416 7.416-7.416 1.518 0 2.931.456 4.105 1.238-.06.051-.12.098-.165.15C9.6 7.489 8.595 9.688 8.595 12c0 2.311 1.001 4.51 2.748 6.031zm5.241-13.447c-1.52 0-2.931.456-4.105 1.238.06.051.12.098.165.15C14.4 7.489 15.405 9.688 15.405 12c0 2.31-1.001 4.507-2.748 6.031-.058.049-.12.098-.181.146 1.177.783 2.588 1.238 4.107 1.238C20.68 19.416 24 16.096 24 12c0-4.094-3.32-7.416-7.416-7.416zM12 6.174c-.096.075-.189.15-.28.231C10.156 7.764 9.169 9.765 9.169 12c0 2.236.987 4.236 2.551 5.595.09.08.185.158.28.232.096-.074.189-.152.28-.232 1.563-1.359 2.551-3.359 2.551-5.595 0-2.235-.987-4.236-2.551-5.595-.09-.08-.184-.156-.28-.231z"/></svg>}
        </svg>
      )
    },
    


    {
  label:  t("subscription.methods.bank"),
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
      padding: "1rem ",
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

      
      


      <Footer />
    </div>
  );
}

export default Subscription;









