import { FaFileContract, FaUserShield, FaTools } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Footer from '../components/Footer';
import "./PrivacyPolicy.css";

export default function TermsOfService() {
  const { t } = useTranslation();

  return (
    <div>


      <div className="policy-wrapper">

      {/* Header */}
      <div className="policy-header">
        <FaFileContract className="header-icon" />
        <h1>{t("terms.title")}</h1>
        <p className="policy-date">{t("terms.last_update")}: 2025</p>
      </div>

      {/* 1 */}
      <div className="policy-card">
        <h2 className="policy-title">{t("terms.section1.title")}</h2>
        <p className="policy-text">{t("terms.section1.text")}</p>
      </div>

      {/* 2 */}
      <div className="policy-card">
        <h2 className="policy-title">{t("terms.section2.title")}</h2>
        <ul className="policy-list">
          <li>{t("terms.section2.item1")}</li>
          <li>{t("terms.section2.item2")}</li>
          <li>{t("terms.section2.item3")}</li>
        </ul>
      </div>

      {/* 3 */}
      <div className="policy-card">
        <h2 className="policy-title">{t("terms.section3.title")}</h2>
        <ul className="policy-list">
          <li>{t("terms.section3.item1")}</li>
          <li>{t("terms.section3.item2")}</li>
        </ul>
      </div>

      {/* 4 */}
      <div className="policy-card">
        <h2 className="policy-title">{t("terms.section4.title")}</h2>
        <p className="policy-text">{t("terms.section4.text")}</p>
      </div>

      {/* 5 */}
      <div className="policy-card">
        <h2 className="policy-title">{t("terms.section5.title")}</h2>
        <ul className="policy-list">
          <li>{t("terms.section5.item1")}</li>
          <li>{t("terms.section5.item2")}</li>
        </ul>
      </div>

      {/* 6 */}
      <div className="policy-card">
        <h2 className="policy-title">{t("terms.section6.title")}</h2>
        <p className="policy-text">{t("terms.section6.text")}</p>
      </div>
      

    </div>

<Footer />
    </div>
    
  );
}


