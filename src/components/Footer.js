







// components/Footer.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import './Footer.css'; // 👈 سنضيف هذا الملف الجديد

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
          <h4>{t("footer.sections.account.title")}</h4>
          <ul>
            <li><NavLink to="/login">{t("footer.sections.account.links.login")}</NavLink></li>
            <li><NavLink to="/register">{t("footer.sections.account.links.register")}</NavLink></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{t("footer.sections.cvs.title")}</h4>
          <ul>
            <li><NavLink to="/">{t("footer.sections.cvs.links.home")}</NavLink></li>
            <li><NavLink to="/editor" target="_blank">{t("footer.sections.cvs.links.create")}</NavLink></li>
            <li><NavLink to="/saved-projects">{t("footer.sections.cvs.links.saved")}</NavLink></li>
            <li><NavLink to="/favorites">{t("footer.sections.cvs.links.favorites")}</NavLink></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{t("footer.sections.subscriptions.title")}</h4>
          <ul>
            <li><NavLink to="/subscription">{t("footer.sections.subscriptions.links.pricing")}</NavLink></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{t("footer.sections.referrals.title")}</h4>
          <ul>
            <li><NavLink to="/referral">{t("footer.sections.referrals.links.program")}</NavLink></li>
            <li><NavLink to="/referral-info">{t("footer.sections.referrals.links.info")}</NavLink></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{t("footer.sections.help.title")}</h4>
          <ul>
            <li><NavLink to="/how-to-use-sit">{t("footer.sections.help.links.about_site")}</NavLink></li>
            <li><NavLink to="/freelance-guide">{t("footer.sections.help.links.freelance")}</NavLink></li>
            <li><NavLink to="/contact">{t("footer.sections.help.links.contact")}</NavLink></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{t("footer.sections.about.title")}</h4>
          <ul>
            <li><NavLink to="/about">{t("footer.sections.about.links.about_us")}</NavLink></li>
            <li><NavLink to="/refund-policy">{t("footer.sections.about.links.refund_policy")}</NavLink></li>
            <li><NavLink to="/terms-of-service">{t("footer.sections.about.links.terms_of_service")}</NavLink></li>
            <li><NavLink to="/privacy-policy">{t("footer.sections.about.links.privacy_policy")}</NavLink></li>
            <li><NavLink to="/referral-terms">{t("footer.sections.about.links.referral_terms")}</NavLink></li>

          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <LanguageSwitcher />
        <p>© {new Date().getFullYear()} {t("footer.bottom.rights")}</p>
        <div className="footer-social">
          <a href="https://www.facebook.com/profile.php?id=61580407262967" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
          <a href="https://x.com/cvflow0" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
          <a href="https://www.instagram.com/cvflow001/" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
          <a href="https://www.linkedin.com/in/cv-flow-212360383/" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

