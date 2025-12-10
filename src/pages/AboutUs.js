


import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import React, { useContext,  useEffect } from "react";
import { useTranslation } from "react-i18next";



function AboutUs() {
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



  useEffect(() => {
    const sections = document.querySelectorAll(
      ".fade-in, .slide-left, .slide-right, .slide-up, .zoom-in"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          } else {
            entry.target.classList.remove("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-container">
      <style>{`
        .about-container {
          font-family: "Tajawal", sans-serif;
          line-height: 1.6;
          color: #333;
        }

        /* 🔹 Animations Base */
        .fade-in, .slide-left, .slide-right, .slide-up, .zoom-in {
          opacity: 0;
          transition: all 0.8s ease-out;
        }

        .fade-in.show { opacity: 1; transform: translateY(0); }
        .slide-left { transform: translateX(-50px); }
        .slide-left.show { opacity: 1; transform: translateX(0); }
        .slide-right { transform: translateX(50px); }
        .slide-right.show { opacity: 1; transform: translateX(0); }
        .slide-up { transform: translateY(50px); }
        .slide-up.show { opacity: 1; transform: translateY(0); }
        .zoom-in { transform: scale(0.9); }
        .zoom-in.show { opacity: 1; transform: scale(1); }

       
       















        /* Hero */
.about-hero {
  position: relative;
  background: url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f")
    center/cover no-repeat;   /* 🔹 غيّر اللينك بصورة الهيرو الخاصة بك */
  color: #fff;
  padding: 6rem 2rem;
  display: flex;
  align-items: center;
  min-height: 70vh;
  border-radius: 12px;
  overflow: hidden;
}

.about-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4); /* 🔹 تظليل خفيف فوق الصورة */
}

.about-hero-content {
  position: relative;
  max-width: 600px;
  z-index: 2;
 
}

.about-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.about-hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.about-hero button {
 


  background: #fff;
          color: #9b59b6;
          
          padding: 14px 28px;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: 0.3s;
}
.about-hero button:hover {
  background: #f0f0f0;
}
   .about-hero button:hover { background: #f0f0f0; }


       

       



















          /* Section General */
        .about-section {
          padding: 3rem 2rem;
          background: #f9f9f9;
          margin-bottom: 2rem;
          border-radius: 12px;
          text-align: center;
        }
        .about-section h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #6a11cb;
        }
        .about-section-content {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 2rem;
        }
        .about-section-content img {
          max-width: 220px;  /* 🔹 مضبوط */
          border-radius: 12px;
        }
        .about-section-content p {
          flex: 1;
          min-width: 260px;
        }

        /* Grid */
        .grid-2 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
        }
        .card {
          background: #fff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        }
        .card img {
          width: 80px;   /* 🔹 أيقونة صغيرة */
          height: 80px;
          margin-bottom: 1rem;
          object-fit: contain;
        }

        



         /* Values */
        .values ul {
          list-style: none;
          padding: 0;
          max-width: 600px;
          margin: auto;
          text-align: left;
        }
        .values li {
          font-size: 1.1rem;
          margin-bottom: 0.8rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .values img {
          width: 30px;
          height: 30px;
        }

        /* Team */
        .team-grid {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .team-card {
          background: #fff;
          padding: 1rem;
          border-radius: 12px;
          width: 200px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s ease-out;
        }
        .team.show .team-card {
          opacity: 1;
          transform: translateY(0);
        }
        .team-card:nth-child(1) { transition-delay: 0.2s; }
        .team-card:nth-child(2) { transition-delay: 0.4s; }
        .team-card:nth-child(3) { transition-delay: 0.6s; }

        .team-card:hover { transform: translateY(-8px) scale(1.05); }
        .team-card img {
          width: 100%;
          border-radius: 50%;
          margin-bottom: 0.8rem;
        }

      


























           /* Testimonials */
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
        }
        .testimonial {
          background: #fff;
          padding: 1.5rem;
          border-radius: 12px;
          font-style: italic;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .testimonial img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-bottom: 1rem;
        }



        .testimonials.show .testimonial {
          opacity: 1;
          transform: translateY(0);
        }
        .testimonial:nth-child(1) { transition-delay: 0.2s; }
        .testimonial:nth-child(2) { transition-delay: 0.4s; }
        .testimonial span {
          display: block;
          margin-top: 1rem;
          font-weight: bold;
          color: #0072ff;
        }

        /* CTA */
        .about-cta {
          background: linear-gradient(135deg, #9b59b6, #1e90ff);
          text-align: center;
          padding: 4rem 2rem;
          color: #fff;
          border-radius: 12px;
          margin: 3rem 0;
        }
        .about-cta h2 {
          font-size: 2.2rem;
          margin-bottom: 1.5rem;
        }
        .about-cta button {
          background: #fff;
          color: #9b59b6;
          padding: 14px 28px;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: 0.3s;
        }
        .about-cta button:hover { background: #f0f0f0; }




        @media (max-width: 768px){
        .about-section {
          padding: 3rem 1rem;
         
        }
        
        
        }
      `}</style>

    



      {/* Hero */}
<section className="about-hero fade-in">
  <div className="about-hero-content">
    <h1> {t("about.about_hero_title")}</h1>
    <p>
      
      {t("about.about_hero_text")}
    </p>
   

    <button onClick={handleStartClick}>{t("about.about_hero_button")} 🚀</button>

  </div>
</section>



    


      {/* Story */}
      <section className="about-section slide-left">
        <h2>  {t("about.about_story_title")} 📖  </h2>
        <p>
        
          {t("about.about_story_text")}
           
        </p>
      </section>

     






        {/* Vision & Mission */}
      <section className="about-section grid-2 slide-right">
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/865/865020.png" alt="Vision" />
          <h3>  {t("about.about_vision_title")} 🌍</h3>
          <p>
            
            {t("about.about_vision_text")}
          </p>
        </div>
        <div className="card">
          <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="Mission" />
          <h3> {t("about.about_mission_title")} 🎯 </h3>
          <p>
            
            {t("about.about_mission_text")}
          </p>
        </div>
      </section>

    

       {/* Values */}
      <section className="about-section values fade-in">
        <h2>{t("about.about_values_title")}💡</h2>
        <ul>
          <li><img src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="" />  {t("about.about_values_simplicity")}</li>
          <li><img src="https://cdn-icons-png.flaticon.com/512/4332/4332512.png" alt="" />  {t("about.about_values_creativity")}</li>
          <li><img src="https://cdn-icons-png.flaticon.com/512/929/929610.png" alt="" /> {t("about.about_values_trust")}</li>
          <li><img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="" />  {t("about.about_values_growth")}</li>
        </ul>
      </section>

      {/* Team */}
      <section className="about-section team slide-up">
        <h2>  {t("about.about_team_title")}👥</h2>
        <div className="team-grid">
          <div className="team-card">
            <img src="images/mepro.jpg   " alt="" />
            <h4>Abdelbasset El Hajiri</h4>
            <p> {t("about.about_team_founder")}</p>
          </div>
          
        </div>
      </section>

    



       {/* Testimonials */}
      <section className="about-section testimonials slide-left">
        <h2> {t("about.about_testimonials_title")} ⭐</h2>
        <div className="testimonials-grid">
          <div className="testimonial">
            <img src="https://randomuser.me/api/portraits/women/21.jpg" alt="" />
            <p>
             
              "{t("about.about_testimonial_1")}"
            </p>
            <span>{t("about.about_testimonial_1_author")}</span>
          </div>
          <div className="testimonial">
            <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="" />
            <p>
              
              "{t("about.about_testimonial_2")}""
            </p>
            <span> {t("about.about_testimonial_2_author")}</span>
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="about-cta zoom-in">
        <h2> {t("about.about_cta_title")}</h2>
       
         <button onClick={handleStartClick}>{t("about.about_cta_button")} 🚀</button>
      </section>


      <Footer />
    </div>
  );
}

export default AboutUs;





