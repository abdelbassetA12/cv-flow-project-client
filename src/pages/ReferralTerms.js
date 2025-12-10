import { FaShareAlt, FaGift, FaExclamationTriangle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Footer from '../components/Footer';
import "./PrivacyPolicy.css";

export default function ReferralTerms() {
  const { t } = useTranslation();

  return (
    <div>


      <div className="policy-wrapper">

      {/* Header */}
      <div className="policy-header">
        <FaShareAlt className="header-icon" />
        <h1>{t("referral_terms.title")}</h1>
        <p className="policy-date">{t("referral_terms.last_update")}: 2025</p>
      </div>

      {/* 1. طريقة الإحالة */}
      <div className="policy-card">
        <h2 className="policy-title">🎯 {t("referral_terms.section1.title")}</h2>
        <ul className="policy-list">
          <li>{t("referral_terms.section1.item1")}</li>
          <li>{t("referral_terms.section1.item2")}</li>
        </ul>
      </div>

      {/* 2. نظام المكافآت */}
      <div className="policy-card">
        <h2 className="policy-title">
          <FaGift className="inline-icon success" /> {t("referral_terms.section2.title")}
        </h2>
        <ul className="policy-list">
          <li>{t("referral_terms.section2.item1")}</li>
          <li>{t("referral_terms.section2.item2")}</li>
        </ul>
      </div>

      {/* 3. الشروط */}
      <div className="policy-card">
        <h2 className="policy-title">📋 {t("referral_terms.section3.title")}</h2>
        <ul className="policy-list">
          <li>{t("referral_terms.section3.item1")}</li>
          <li>{t("referral_terms.section3.item2")}</li>
          <li>{t("referral_terms.section3.item3")}</li>
        </ul>
      </div>

      {/* 4. انتهاكات البرنامج */}
      <div className="policy-card">
        <h2 className="policy-title">
          <FaExclamationTriangle className="inline-icon danger" /> {t("referral_terms.section4.title")}
        </h2>
        <ul className="policy-list">
          <li>{t("referral_terms.section4.item1")}</li>
          <li>{t("referral_terms.section4.item2")}</li>
        </ul>
      </div>
      

    </div>
<Footer />

    </div>
    
  );
}
