

import React from "react";
import { FaHeart } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import './TemplateCard.css';
const TemplateCard = ({ tpl, user, isFavorite, onToggleFavorite, onOpen, plansRank = { basic: 0, pro: 1, premium: 2 } }) => {
  const requiredRank = plansRank[tpl.tier?.toLowerCase()] ?? 0;
   const { t } = useTranslation();
  const userRank = plansRank[user?.subscriptionPlan?.toLowerCase()] ?? 0;
  const locked = user && userRank < requiredRank;
  const notLogged = !user;
  

  return (
    <div className="template-card"
    onClick={() =>   window.open(`/editor/${tpl.slug}`, "_blank")}
    
    >
      {/* زر المفضلة */}
      {user && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(tpl); }}
          className="favorite-btn"
          title={isFavorite ?t("TemplateCard.remove_from_favorites") : t("TemplateCard.add_to_favorites")}
        >
          <FaHeart size={22} color={isFavorite ? "red" : "#94a3b8"} />
        </button>
      )}

      {/* صورة القالب */}
      {tpl.thumbnailUrl ? (
        <img
          /*src={`http://localhost:5000${tpl.thumbnailUrl}`}*/
          src={tpl.thumbnailUrl}
          alt={tpl.name}
          className="template-thumb"
        />
      ) : (
        <div className="template-thumb placeholder" />
      )}

      {/* شاشة القفل */}
      {locked && (
        <div className="locked-overlay">
          <div> {t("TemplateCard.locked")}🔒</div>
          <div style={{ fontSize: 13 }}>      {t("TemplateCard.requires_plan")} {tpl.tier.toUpperCase()} </div>
        </div>
      )}

      <div className="template-name">{tpl.name}</div>

      <button
        onClick={() => onOpen(tpl)}
        disabled={locked || notLogged}
        className={`open-btn ${locked || notLogged ? "disabled" : ""}`}
      >
        { notLogged ? t("TemplateCard.login_required") : locked ? t("TemplateCard.upgrade_required") : t("TemplateCard.open_template")}
      </button>

      <div className="template-tier">{tpl.tier.toUpperCase()}</div>
    </div>
  );
};

export default TemplateCard;



