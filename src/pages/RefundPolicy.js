import { FaUndo, FaTimesCircle, FaCheckCircle, FaEnvelope, FaInfoCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Footer from '../components/Footer';
import "./RefundPolicy.css";

export default function RefundPolicy() {
  const { t } = useTranslation();

  return (
    <div>


      <div className="refund-wrapper">

      {/* Header */}
      <div className="refund-header">
        <FaUndo className="header-icon" />
        <h1>{t("refund_policy.title")}</h1>
        <p className="update-date">{t("refund_policy.last_update")}: 2025</p>
      </div>

      {/* Intro */}
      <p className="intro-text">
        {t("refund_policy.intro")}
      </p>

      {/* Section 1 */}
      <div className="policy-card">
        <h2 className="card-title">
          <FaCheckCircle className="card-icon success" /> {t("refund_policy.section1.title")}
        </h2>
        <ul className="card-list">
          <li>{t("refund_policy.section1.item1")}</li>
          <li>{t("refund_policy.section1.item2")}</li>
          <li>{t("refund_policy.section1.item3")}</li>
        </ul>
      </div>

      {/* Section 2 */}
      <div className="policy-card">
        <h2 className="card-title">
          <FaTimesCircle className="card-icon danger" /> {t("refund_policy.section2.title")}
        </h2>
        <ul className="card-list">
          <li>{t("refund_policy.section2.item1")}</li>
          <li>{t("refund_policy.section2.item2")}</li>
          <li>{t("refund_policy.section2.item3")}</li>
        </ul>
      </div>

      {/* Section 3 */}
      <div className="policy-card">
        <h2 className="card-title">
          <FaInfoCircle className="card-icon" /> {t("refund_policy.section3.title")}
        </h2>
        <ul className="card-list">
          <li>{t("refund_policy.section3.item1")}</li>
          <li>{t("refund_policy.section3.item2")}</li>
          <li>{t("refund_policy.section3.item3")}</li>
        </ul>
      </div>

      {/* Contact */}
      <div className="policy-card contact-card">
        <h2 className="card-title">
          <FaEnvelope className="card-icon" /> {t("refund_policy.contact.title")}
        </h2>
        <p>
          {t("refund_policy.contact.text")} <strong>[ضع البريد هنا]</strong>
        </p>
      </div>
      

    </div>

<Footer />

    </div>
    
  );
}



