import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaSignOutAlt, FaUserCircle, FaCrown, FaRocket, FaGem } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "./LanguageSwitcher";
import './navbar.css';

const planColors = {
  basic: "#2ecc71",
  pro: "#3498db",
  premium: "#9b59b6",
};

const planIcons = {
  basic: <FaRocket style={{ marginLeft: 6 }} />,
  pro: <FaCrown style={{ marginLeft: 6 }} />,
  premium: <FaGem style={{ marginLeft: 6 }} />,
};

const Navbar = ({ user, onLogout }) => {
   
  const { t} = useTranslation();

   
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const [hoverProfile, setHoverProfile] = useState(false);

  const [showHelp, setShowHelp] = useState(false);
  const helpRef = useRef();

  const [menuOpen, setMenuOpen] = useState(false); // حالة القائمة على الموبايل
  const navLinksRef = useRef();
 
  

  const handleMouseEnter = e => {
    e.target.style.color = '#007bff';
  };

  const handleMouseLeave = e => {
    if (!e.target.classList.contains('active-link')) {
      e.target.style.color = '#000';
    }
  };

  const linkStyle = ({ isActive }) => ({
    ...styles.link,
    color: isActive ? '#007bff' : '#000',
    borderBottom: isActive ? '2px solid #007bff' : 'none',
    ...(isActive ? { className: 'active-link' } : {}),
    cursor: 'pointer',
  });

  // إغلاق القوائم (الدروبدون والقائمة الجانبية) إذا تم الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }

      if (navLinksRef.current && !navLinksRef.current.contains(e.target) && !e.target.closest('.menu-toggle')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <nav style={styles.nav}>
      <NavLink to="/" style={styles.logo} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}> CVFlow</NavLink>

      {/* زر الهامبرغر للموبايل */}
      <div className="menu-toggle" onClick={() => setMenuOpen(prev => !prev)}>
        {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </div>

      {/* حاوية الروابط - تُستخدم كقائمة جانبية على الموبايل */}
      <div ref={navLinksRef} className={`nav-links ${menuOpen ? 'open' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, justifyContent: 'center' }}>

      {/* عناصر خاصة بالموبايل داخل القائمة (تُظهر فقط على الشاشات الصغيرة) */}
      <div className="mobile-auth" style={{ display: 'none', flexDirection: 'column', gap: 8 }}>
  {!user ? (
    <>
      <NavLink to="/login" className="mobile-login" style={styles.buttonOutline} onClick={() => setMenuOpen(false)}> 
        {t("navbar.login")} 
      </NavLink>
      <NavLink to="/register" className="mobile-register" style={styles.registerBtn} onClick={() => setMenuOpen(false)}> 
        {t("navbar.register")} 
      </NavLink>
    </>
  ) : (
    <>
      


      <div >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px'}}>

          <div     style={{ ...styles.userCircle, flexShrink: 0   }} >
            {user.username?.[0]?.toUpperCase() || "U"}
           
          </div>
           <strong>{user.username}</strong>
          
          

          
        </div>



        <div style={{ fontSize: 13, color: '#555' }}>{user.email}</div>
        
       <div  style={{ display: 'flex', alignItems: 'center' }}>
        <NavLink to="/profile" onClick={() => {   setShowDropdown(false);   setMenuOpen(false);   }}
              onMouseEnter={() => setHoverProfile(true)}
              onMouseLeave={() => setHoverProfile(false)}
              style={{    ...styles.btnDropdown,   backgroundColor: hoverProfile ? '#f0f0f0' : 'transparent',    color: hoverProfile ? '#007bff' : '#000',   }} >
              <FaUserCircle /> {t("navbar.profile")}
         </NavLink>
         <div style={{
                backgroundColor: `${planColors[user.subscriptionPlan] || '#e74c3c'}20`,
                color: planColors[user.subscriptionPlan] || '#e74c3c',
                padding: '3px 10px',
                borderRadius: '15px',
                fontSize: '1rem',
                fontWeight: 'bold',
                marginLeft: 15,
              }}>
                {user.subscriptionPlan ?       <>
                  {user.subscriptionPlan.toUpperCase()}
                  {planIcons[user.subscriptionPlan]}
                </>          : t("navbar.not_subscribed")}
         </div>
       </div>
      </div>


      {!user.isSubscribed && (
        <NavLink 
          to="/subscription" 
          style={styles.upgradeBtn} 
          onClick={() => setMenuOpen(false)}
        >
          {t("navbar.upgrade")}
        </NavLink>
      )}
    </>
  )}

  
      </div>





        <div style={styles.leftLinks} className='leftlinks'>
          <NavLink className='nav-link' to="/" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => setMenuOpen(false)}>{t("navbar.home")}</NavLink>
          <NavLink className='nav-link' to="/subscription" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => setMenuOpen(false)}>{t("navbar.pricing")} </NavLink>
          <NavLink className='nav-link' to="/editor" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}  target="_blank" onClick={() => setMenuOpen(false)}>  {t("navbar.editor")}  </NavLink>
          <NavLink className='nav-link' to="/referral-info" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => setMenuOpen(false)}> {t("navbar.referral_info")}  </NavLink>
          <NavLink className='nav-link' to="/about" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}   onClick={() => setMenuOpen(false)}>{t("navbar.about")}  </NavLink>

          {/* 🔹 قائمة help */}
          <div 
            ref={helpRef}
            style={{ position: "relative", display: 'inline-block' }}
            onMouseEnter={() => setShowHelp(true)}
            onMouseLeave={() => setShowHelp(false)}
          >
            <span
              onClick={() => { setShowHelp(prev => !prev); setMenuOpen(false); }}
              style={{ ...styles.link, cursor: "pointer" }}
            >
              {t("navbar.help")}
            </span>

            {showHelp && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  backgroundColor: "white",
                  borderRadius: 8,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  padding: "10px 0",
                  minWidth: 180,
                  
                  zIndex: 400,
                }}
              >
                <NavLink
                  to="/freelance-guide"
                  style={({ isActive }) => ({
                    ...styles.dropdownLink,
                    backgroundColor: isActive ? "#f0f0f0" : "transparent",
                    color: isActive ? "#007bff" : "#000",
                  })}
                  onMouseEnter={e => {
                    e.target.style.backgroundColor = "#f0f0f0";
                    e.target.style.color = "#007bff";
                  }}
                  onMouseLeave={e => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#000";
                  }}
                  onClick={() => { setShowHelp(false); setMenuOpen(false); }}
                >
                  {t("navbar.help.freelance")}
                </NavLink>

                <NavLink
                  to="/contact"
                  style={({ isActive }) => ({
                    ...styles.dropdownLink,
                    backgroundColor: isActive ? "#f0f0f0" : "transparent",
                    color: isActive ? "#007bff" : "#000",
                  })}
                  onMouseEnter={e => {
                    e.target.style.backgroundColor = "#f0f0f0";
                    e.target.style.color = "#007bff";
                  }}
                  onMouseLeave={e => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#000";
                  }}
                  onClick={() => { setShowHelp(false); setMenuOpen(false); }}
                >
                 {t("navbar.help.contact")}
                </NavLink>

                <NavLink
                  to="/how-to-use-sit"
                  style={({ isActive }) => ({
                    ...styles.dropdownLink,
                    backgroundColor: isActive ? "#f0f0f0" : "transparent",
                    color: isActive ? "#007bff" : "#000",
                  })}
                  onMouseEnter={e => {
                    e.target.style.backgroundColor = "#f0f0f0";
                    e.target.style.color = "#007bff";
                  }}
                  onMouseLeave={e => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#000";
                  }}
                  onClick={() => { setShowHelp(false); setMenuOpen(false); }}
                >
                  {t("navbar.help.about_site")}
                </NavLink>

              </div>
            )}
          </div>

          {user && (
            <>
              <NavLink className='nav-link' to="/referral" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => setMenuOpen(false)}>{t("navbar.referral_program")}</NavLink>
              <NavLink className='nav-link' to="/saved-projects" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => setMenuOpen(false)}>{t("navbar.save-project")}</NavLink>
              



             

            </>
          )}
        </div>



        {/* عناصر خاصة بالموبايل داخل القائمة (تُظهر فقط على الشاشات الصغيرة) */}
      <div className="mobile-auth" style={{ display: 'none', flexDirection: 'column', gap: 8 }}>
  {!user ? (
    <>
     
    </>
  ) : (
    <>
      {/* 🔹 هنا أضفنا دائرة اليوزر وقائمة البروفايل/الخروج داخل القائمة الخاصة بالموبايل */}
      <div >
        <button style={{ backgroundColor:  '#f0f0f0', textAlign: 'start'}}
              className="onlogout"
              onClick={() => {
                setShowDropdown(false);
                setMenuOpen(false);
                onLogout();
              }}
            >
              <FaSignOutAlt /> {t("navbar.signout")}
            </button>
        
      </div>

    </>
  )}

  <LanguageSwitcher />
      </div>

        
      
      </div>

      {/* يمين النافبار - دائرة المستخدم وقائمة منسدلة (مخفية على الموبايل بواسطة CSS) */}
      <div className="right-links" style={styles.rightLinks} ref={dropdownRef}>
        {user ? (
          <>
            {!user.isSubscribed && (
              <NavLink to="/subscription" style={styles.upgradeBtn}>{t("navbar.upgrade")}</NavLink>
            )}
            <LanguageSwitcher />

            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowDropdown(prev => !prev)}
                style={styles.userCircle}
              >
                {user.username?.[0]?.toUpperCase() || "U"}
              </div>
              {showDropdown && (
                <div style={styles.dropdown}>
                  <div style={{ marginBottom: 10 }}>
                    <strong>{user.username}</strong>
                    <div style={{ fontSize: 13, color: '#555' }}>{user.email}</div>
                  </div>

                  <hr />

                  <NavLink
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    onMouseEnter={() => setHoverProfile(true)}
                    onMouseLeave={() => setHoverProfile(false)}
                    style={{
                      ...styles.btnDropdown,
                      backgroundColor: hoverProfile ? '#f0f0f0' : 'transparent',
                      color: hoverProfile ? '#007bff' : '#000',
                    }}
                  >
                    <FaUserCircle />{t("navbar.profile")}
                  </NavLink>

                  <button className='onlogout'
                    onClick={() => {
                      setShowDropdown(false);
                      onLogout();
                    }}
                  >
                    <FaSignOutAlt />{t("navbar.signout")}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <LanguageSwitcher />
            <NavLink to="/login" style={styles.buttonOutline}> {t("navbar.login")} </NavLink>
            <NavLink to="/register" style={styles.registerBtn}> {t("navbar.register")} </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
 /* nav: {
    position: 'sticky',
    top: '0',
    fontFamily: 'Tajawal, sans-serif',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '12px 30px',
    color: '#000',
    zIndex: 1000,
    boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
  },*/
  logo: {
    margin: 0,
    fontSize: '1.6rem',
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #00c6ff, #0072ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  leftLinks: {
    display: 'flex',
    alignItems: 'center',
    
    gap: '20px',
    flex: 1,
    justifyContent: 'center',
  },
  dropdownLink: {
    display: "block",
    padding: "8px 16px",
    textDecoration: "none",
    color: "#000",
    fontWeight: 500,
    borderRadius: 6,
    transition: "background 0.2s, color 0.2s",
  },
  rightLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  link: {
    color: '#000',
    textDecoration: 'none',
    fontWeight: 500,
    padding: '6px 10px',
    transition: 'color 0.3s ease',
  },
  button: {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    padding: '6px 14px',
    color: '#000',
    cursor: 'pointer',
    borderRadius: '6px',
    fontWeight: 500,
  },
  buttonOutline: {
    border: '1px solid #ccc',
    padding: '6px 14px',
    backgroundColor: 'white',
    borderRadius: '6px',
    textDecoration: 'none',
    color: '#000',
    fontWeight: 500,
  },
  registerBtn: {
    background: 'linear-gradient(to right, #7b2ff7, #f107a3)',
    color: 'white',
    padding: '7px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
    border: 'none',
  },
  upgradeBtn: {
    background: 'linear-gradient(to right, #f39c12, #f1c40f)',
    color: 'white',
    padding: '7px 14px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
    border: 'none',
  },
  btnDropdown: {
    display: 'block',
    padding: '8px 12px',
    textDecoration: 'none',
    color: '#000',
    borderRadius: 6,
    fontWeight: 500,
    transition: 'background 0.2s',
  },
  userCircle: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    top: '110%',
    
    
   insetInlineEnd: 0,   /* يستبدل right:0 */
    overflow: 'hidden',
    
    background: 'white',
    borderRadius: 10,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '15px',
    width: 230,
    zIndex: 200,
    
  }
};

export default Navbar;
