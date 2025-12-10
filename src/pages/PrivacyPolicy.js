import { FaUserSecret, FaLock, FaTrash, FaDatabase } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Footer from '../components/Footer';
import "./PrivacyPolicy.css";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div>

      <div className="policy-wrapper">

      {/* Header */}
      <div className="policy-header">
        <FaUserSecret className="header-icon" />
        <h1>{t("privacy.title")}</h1>
        <p className="policy-date">{t("privacy.last_update")}: 2025</p>
      </div>

      {/* 1 */}
      <div className="policy-card">
        <h2 className="policy-title">{t("privacy.section1.title")}</h2>
        <ul className="policy-list">
          <li>{t("privacy.section1.item1")}</li>
          <li>{t("privacy.section1.item2")}</li>
          <li>{t("privacy.section1.item3")}</li>
          <li>{t("privacy.section1.item4")}</li>
        </ul>
      </div>

      {/* 2 */}
      <div className="policy-card">
        <h2 className="policy-title">{t("privacy.section2.title")}</h2>
        <ul className="policy-list">
          <li>{t("privacy.section2.item1")}</li>
          <li>{t("privacy.section2.item2")}</li>
          <li>{t("privacy.section2.item3")}</li>
        </ul>
      </div>

      {/* 3 */}
      <div className="policy-card">
        <h2 className="policy-title">
          <FaLock className="inline-icon success" /> {t("privacy.section3.title")}
        </h2>
        <p className="policy-text">{t("privacy.section3.text")}</p>
      </div>

      {/* 4 */}
      <div className="policy-card">
        <h2 className="policy-title">{t("privacy.section4.title")}</h2>
        <ul className="policy-list">
          <li>{t("privacy.section4.item1")}</li>
          <li>{t("privacy.section4.item2")}</li>
        </ul>
      </div>

      {/* 5 */}
      <div className="policy-card">
        <h2 className="policy-title">
          <FaTrash className="inline-icon danger" /> {t("privacy.section5.title")}
        </h2>
        <p className="policy-text">{t("privacy.section5.text")}</p>
      </div>
     

    </div>
 <Footer />
    </div>
    
  );
}

