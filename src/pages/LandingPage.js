
//لجلب القوالب 
import axios from "axios";




import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import PricingCards from '../components/PricingCards';
import { useTranslation,Trans } from "react-i18next";
import Footer from '../components/Footer';

import './LandingPage.css';


//لجلب القوالب 
axios.defaults.withCredentials = true;

/*
const scrollBtnStyleLeft = {
  position: 'absolute',
  left: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  cursor: 'pointer',
  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
};

const scrollBtnStyleRight = {
  ...scrollBtnStyleLeft,
  left: 'unset',
  right: '10px',
};
*/


function scrollRow(distance) {


  const row = document.getElementById('card-row');
  if (row) {
    row.scrollBy({ left: distance, behavior: 'smooth' });
  }
}

function LandingPage() {

  //لجلب القوالب 
   const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;

   





  const { t } = useTranslation();
  const user = null;

    const navigate = useNavigate(); // ✅ إضافة هذا السطر


   const sectionRef = useRef(null);

//لجلب القوالب 
    useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/templates`, {withCredentials: false     });
        setTemplates(res.data.templates || []);
      } catch (err) {
        console.error("Error fetching templates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);




  useEffect(() => {
    const section = sectionRef.current;
    const cards = section.querySelectorAll(".team-card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cards.forEach((card, index) => {
              card.style.transition = `all 0.6s ease ${index * 0.2}s`;
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            });
          } else {
            cards.forEach((card) => {
              card.style.opacity = "0";
              card.style.transform = "translateY(40px)";
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);
 

  return (
    <div style={{
       //fontFamily: 'Tajawal, sans-serif',

      overflowX: 'hidden',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e90ff, #9b59b6)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: '#fff',
      justifyContent: "center",
      
    }}>
      
      

      {/* بطل الصفحة */}
      <section style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', }}>{t("landingPage.hero.title")}</h1>
        <p style={{ fontSize: '1.4rem', maxWidth: '600px', lineHeight: '1.6' }}>
        
           {t("landingPage.hero.subtitle")}
        
        </p>
        <button onClick={() => navigate('/register')} style={ctaButtonStyle}>
        {t("landingPage.hero.button")}
        </button>

        
      </section>









{/*  قسم مثل Canva: ماذا ستُنشئ؟ بقوالب حقيقية  */}




<section style={{
  width: '90vw',
  padding: '3rem 1rem',
  background: '#fff',
  borderRadius: '15px',
  color: '#333',
  textAlign: 'center',
  overflowX: 'hidden',
  marginBottom: '2rem',
}}>
  <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
    {t("landingPage.templatesSection.title")}
  </h2>
  <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
    {t("landingPage.templatesSection.subtitle")}
  </p>

  {/* الحاوية */}
  <div style={{ position: 'relative', maxWidth: '100%', overflow: 'hidden', marginBottom: '2rem' }}>
    {/* زر يسار */}
    <button className="scrollBtnStyleLeft" onClick={() => scrollRow(-300)}>◀</button>

    {/* الشريط القابل للتمرير */}
    <div
      id="card-row"
      style={{
        display: 'flex',
        gap: '1rem',
        overflowX: 'auto',
        padding: '1rem 2rem',
        scrollBehavior: 'smooth',
        scrollbarWidth: 'none',
      }}
    >
      {loading ? (
        <p>جاري التحميل...</p>
      ) : templates.length === 0 ? (
        <p>لا توجد قوالب متاحة</p>
      ) : (
        templates.map((tpl) => {
          // قائمة الألوان لاختيار لون عشوائي لكل قالب
          const colors = ['#f44336', '#00bcd4', '#ff9800', '#2196f3', '#e91e63', '#9c27b0', '#4caf50', '#ff5722'];
          const bgColor = colors[Math.floor(Math.random() * colors.length)];

          return (
            <div
              key={tpl._id}
              style={{
                flex: '0 0 180px',
                minWidth: '180px',
                borderRadius: '20px',
                background: bgColor, // اللون العشوائي
                color: '#fff',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                cursor: 'pointer',
              }}
              onClick={() => window.open(`/editor/${tpl.slug}`, "_blank")}
            >
              <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '5px',
              
                backgroundColor: 'rgba(255,255,255,0.2)', // طبقة شفافة للتباين
              }}>
                <img
                  /*src={`http://localhost:5000${tpl.thumbnailUrl}`}*/ //للصورة المخزنة محليا
                  src={tpl.thumbnailUrl}
                  alt={tpl.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h3 style={{ fontSize: '1rem', marginTop: '0.5rem', textAlign: 'center' }}>
                {tpl.name}
              </h3>
            </div>
          );
        })
      )}
    </div>

    {/* زر يمين */}
    <button className="scrollBtnStyleRight" onClick={() => scrollRow(300)}>▶</button>
  </div>

  <button onClick={() => navigate('/register')} style={{
    backgroundColor: '#9b59b6',
    color: '#fff',
    padding: '10px 20px',
    fontSize: '1rem',
    fontFamily: 'Tajawal, sans-serif',
    fontWeight: 'bold',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '2rem'
  }}>
    {t("landingPage.templatesSection.button")}
  </button>
</section>




























{/* قسم Hero مع فيديو توضيحي بخلفية Canva Gradient */}
<section style={{
 
  minHeight: '100vh',
  background: 'linear-gradient(to right, #00c6ff, #0072ff, #6a11cb, #2575fc)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 1rem',
  boxSizing: 'border-box',
}}>

  {/* العنوان والوصف */}
  <h1 style={{
    fontSize: '3rem',
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1rem',
  }}>
   
     {t("landingPage.videoHero.title")}
     

  </h1>

  <p style={{
    fontSize: '1.2rem',
    color: '#f0f0f0',
    textAlign: 'center',
    maxWidth: '600px',
    marginBottom: '2rem',
  }}>
    
         {t("landingPage.videoHero.subtitle")}
 
  </p>

  {/* زر CTA */}
  <button onClick={() => navigate('/register')}  style={{
    fontFamily: 'Tajawal, sans-serif',
    backgroundColor: '#fff',
    color: '#0072ff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: 'bold',
    
    cursor: 'pointer',
    marginBottom: '3rem',
  }}>
  
   {t("landingPage.videoHero.button")}
  </button>

  {/* إطار الفيديو */}
  <div style={{
    maxWidth: '1000px',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  }}>
    <video
      autoPlay
      loop
      muted
      playsInline
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
      }}
    >
      <source src="https://media.istockphoto.com/id/2163386568/video/business-person-hands-and-documents-with-resume-for-hiring-recruiting-or-interview-of.mp4?s=mp4-640x640-is&k=20&c=HCEeJ-wYnvyr6M5g4zfCh9OuszDr3V25KAN4zJ36eyA=" type="video/mp4" />
    
      {t("landingPage.videoHero.subEnd")}
    </video>
  </div>

</section>










{/* قسم إقناعي: لماذا CV Master مهم؟ */} 
<section style={{
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '2rem',
  padding: '4rem 2rem',
  background: 'linear-gradient(135deg, #ffffff, #f0f3f7)',
}}>

  {/* صورة على اليسار */}
  <div style={{
    flex: '1 1 400px',
    maxWidth: '500px',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  }}>
    <img
      src="https://s3u.tmimgcdn.com/800x0/u78289881/f4ee541c0bba93d255a49790adf66b70.jpg"
      alt="Professional CV Example"
      style={{ width: '100%', display: 'block' }}
    />
  </div>

  {/* النصوص على اليمين */}
  <div style={{ flex: '1 1 400px', maxWidth: '600px' }}>
    <h2 style={{ fontSize: '2.8rem', color: '#333', marginBottom: '1rem' }}>
   
     
     {t("landingPage.whySection.title")}
    </h2>
    <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#555', marginBottom: '1.5rem' }}>
      
     {t("landingPage.whySection.subtitle")}
    </p>

    <ul style={{ paddingLeft: '1.2rem', marginBottom: '2rem', color: '#333', lineHeight: '1.6', }}>
     {t("landingPage.whySection.bullets", { returnObjects: true }).map((item, i) => (
    <li key={i}>{item}</li>
  ))}

    </ul>

    <button onClick={() => navigate('/register')} style={{
      backgroundColor: '#9b59b6',
      
      color: '#fff',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'Tajawal, sans-serif',
      
    fontWeight: 'bold',
      cursor: 'pointer',
    }}>
   
     {t("landingPage.whySection.button")}
    </button>
  </div>
</section>


<PricingCards user={user} />








{/* قسم برنامج الإحالة */} 
<section style={{
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '2rem',
  padding: '4rem 2rem',
  background: 'linear-gradient(135deg, #f6f9fc, #ffffff)',
}}>

  {/* النصوص على اليسار */}
  <div style={{ flex: '1 1 400px', maxWidth: '600px' }}>
    <h2 style={{ fontSize: '2.8rem', color: '#333', marginBottom: '1rem' }}>
  
    {t("landingPage.referralSection.title")}
    </h2>
    <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#555', marginBottom: '1.5rem' }}>
   
 {t("landingPage.referralSection.subtitle")}
    </p>

    <ul style={{ paddingLeft: '1.2rem', marginBottom: '2rem', color: '#333', lineHeight: '1.6' }}>
      {t("landingPage.referralSection.bullets", { returnObjects: true }).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
    
    </ul>

    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <button onClick={() => navigate('/register')}  style={{
        fontFamily: 'Tajawal, sans-serif',
        backgroundColor: '#9b59b6',
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '1rem',
        
    fontWeight: 'bold',
        cursor: 'pointer',
      }}>
      
        {t("landingPage.referralSection.buttons.start")}
      </button>
      <button onClick={() => navigate('/referral-info')} style={{
        fontFamily: 'Tajawal, sans-serif',
        backgroundColor: '#fff',
        color: '#9b59b6',
        border: '2px solid #9b59b6',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '1rem',
        
    fontWeight: 'bold',
        cursor: 'pointer',
      }}>
     
       {t("landingPage.referralSection.buttons.learnMore")}
      </button>
       
    </div>
  </div>

  {/* صورة أو معاينة على اليمين */}
  <div style={{
    flex: '1 1 400px',
    maxWidth: '500px',
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  }}>
    <img
      src="https://eq-cdn.equiti-me.com/website/images/SYC_Refer_A_Friend_AR_2025.original.png"
      alt="Referral preview"
      style={{ width: '100%', display: 'block' }}
    />
    
  </div>
</section>



{/* Team */}

   <section
      ref={sectionRef}
      style={{
        width: "100%",
        textAlign: "center",
        padding: "50px 20px",
        backgroundColor: "#fafafa",
      }}
    >
      <h2
        style={{
          fontSize: "26px",
          color: "purple",
          marginBottom: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
       
        {t("landingPage.teamSection.title")}

      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        {/* Card 1 */}
        <div
          className="team-card"
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "200px",
            textAlign: "center",
            opacity: 0,
            transform: "translateY(40px)",
          }}
        >
          <img
            src="/images/mepro.jpg"
            alt="Ali Ahmed"
            style={{
              width: "100%",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "0.8rem",
            }}
          />
          <h4
            style={{
              margin: "0 0 8px",
              fontWeight: "bold",
              fontSize: "16px",
              color: "#222",
            }}
          >
        
            {t("landingPage.teamSection.members.me.name")}
          </h4>
          <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
            
             {t("landingPage.teamSection.members.me.role")}
          </p>
        </div>

        {/* Card 2 */}
        <div
          className="team-card"
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "200px",
            textAlign: "center",
            opacity: 0,
            transform: "translateY(40px)",
          }}
        >
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Sara Khan"
            style={{
              width: "100%",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "0.8rem",
            }}
          />
          <h4
            style={{
              margin: "0 0 8px",
              fontWeight: "bold",
              fontSize: "16px",
              color: "#222",
            }}
          >
          
             {t("landingPage.teamSection.members.sara.name")}
          </h4>
          <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
           
             {t("landingPage.teamSection.members.sara.role")}
          </p>
        </div>

        {/* Card 3 */}
        <div
          className="team-card"
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "200px",
            textAlign: "center",
            opacity: 0,
            transform: "translateY(40px)",
          }}
        >
          <img
            src="https://randomuser.me/api/portraits/men/65.jpg"
            alt="Mohamed Ali"
            style={{
              width: "100%",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "0.8rem",
            }}
          />
          <h4
            style={{
              margin: "0 0 8px",
              fontWeight: "bold",
              fontSize: "16px",
              color: "#222",
            }}
          >
          
             {t("landingPage.teamSection.members.mohamed.name")}
          </h4>
          <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
         
             {t("landingPage.teamSection.members.mohamed.role")}
          </p>
        </div>
      </div>
  </section>


<section style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '4rem 8%',
  width: '100%',
  background: 'linear-gradient(to bottom, #2e0062, #3b00a8, #4c00ff)',
  color: '#fff',
  flexWrap: 'wrap'
}}>
  {/* Left Side */}
  <div style={{
    flex: '1 1 400px',
    maxWidth: '600px',
    marginBottom: '2rem'
  }}>
    <h1 style={{
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      lineHeight: '1.2'
    }}>
   
    {t("landingPage.freelanceSection.title")}
    </h1>

   
    <p style={{
  fontSize: '1.2rem',
  marginBottom: '2rem'
}}>
  <Trans i18nKey="landingPage.freelanceSection.freelance_intro" components={{ bold: <b /> }}/>
</p>
 


  

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <button onClick={() => navigate('/register')}  style={{
      backgroundColor: '#fff',
      color: '#9b59b6',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'Tajawal, sans-serif',
    
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    }}>
      
      {t("landingPage.freelanceSection.buttons.start")}
    </button>
      <button onClick={() => navigate('/freelance-guide')} style={{
    backgroundColor: '#fff',
    fontFamily: 'Tajawal, sans-serif',
    color: '#0072ff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  }}>

   {t("landingPage.freelanceSection.buttons.learnMore")}
  </button>

       
    </div>
  </div>

  {/* Right Side */}
  <div style={{
    flex: '1 1 400px',
    display: 'flex',
    justifyContent: 'center'
  }}>
    <img
      src="https://3codx.com/wp-content/uploads/2023/03/design.png"
      alt="Collection preview"
      style={{
        width: '100%',
        maxWidth: '500px',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
      }}
    />
  </div>
</section>


<section style={{
  width: '100%',
  minHeight: '80vh',
  background: 'linear-gradient(to right, #00c6ff, #0072ff, #6a11cb, #2575fc)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: '#fff',
  padding: '2rem',
}}>
  <h1 style={{
    fontSize: '2.8rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
  }}>
   {t("landingPage.finalCta.title")}<span style={{ fontStyle: 'italic' }}>{t("landingPage.finalCta.titleSpan")}</span>
  </h1>

  <button onClick={() => navigate('/register')}  style={{
    backgroundColor: '#fff',
    color: '#0072ff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  }}>
      
         {t("landingPage.finalCta.button")}
  </button>
</section>





<Footer />








    </div>
  );
}





const ctaButtonStyle = {
  fontFamily: 'Tajawal, sans-serif',
 
  backgroundColor: '#fff',
    color: '#0072ff',
  padding: '14px 28px',
  fontSize: '1.1rem',
 
    fontWeight: 'bold',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  marginTop: '1.5rem',
};

export default LandingPage;



