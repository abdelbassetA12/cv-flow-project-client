import React from 'react';
import { useTranslation } from "react-i18next";
import { NavLink } from 'react-router-dom';
import {
  FaHome, FaFolderOpen, FaHeart, FaUser, FaPaintBrush, FaRocket, FaBars, FaUserFriends, FaQuestionCircle,
} from 'react-icons/fa';
import './sidebar.css';

const Sidebar = ({ user, collapsed, setCollapsed }) => {
  const { t } = useTranslation();
  if (!user) return null;
  const iconSize = 22;
 

  return (
    <div  className={`sidebar ${collapsed ? 'collapsed' : ''}`} >
      
    
      <div className="sidebar-top">
        
       
     <div className="toggle-container" onClick={() => setCollapsed(!collapsed)}>
    
        <FaBars size={iconSize} />
       
     
    </div>

        <NavLink to="/" className="sidebar-link">
          <FaHome size={iconSize}/>
          {!collapsed && <span>{t("sidebar.home")}</span>}
        </NavLink>
        
         <NavLink to="/editor" className="sidebar-link" target="_blank">
          <FaPaintBrush size={iconSize}/>
          {!collapsed && <span> {t("sidebar.create_cv")}</span>}
        </NavLink>

        <NavLink to="/saved-projects" className="sidebar-link">
          <FaFolderOpen size={iconSize}/>
          {!collapsed && <span>{t("sidebar.saved_designs")}</span>}
        </NavLink>

        <NavLink to="/favorites" className="sidebar-link">
          <FaHeart size={iconSize}/>
          {!collapsed && <span> {t("sidebar.favorite_templates")}</span>}
        </NavLink>

       

        <NavLink to="/referral" className="sidebar-link">
          < FaUserFriends size={iconSize}/>
          {!collapsed && <span>  {t("sidebar.referral_program")}</span>}
        </NavLink>

        <NavLink to="/referral-info" className="sidebar-link">
          <FaRocket size={iconSize}/>
          {!collapsed && <span>{t("sidebar.referral_info")}</span>}
        </NavLink>
        <NavLink to="/profile" className="sidebar-link">
          <FaUser size={iconSize}/>
          {!collapsed && <span>{t("sidebar.profile")} </span>}
        </NavLink>
       

        

        <NavLink to="/how-to-use-sit" className="sidebar-link">
          < FaQuestionCircle	 size={iconSize}/>
          {!collapsed && <span> {t("sidebar.about_site")}</span>}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
