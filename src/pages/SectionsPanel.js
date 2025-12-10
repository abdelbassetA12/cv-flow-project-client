import React, { useState } from "react";
import { BsCollection } from "react-icons/bs";       // أيقونة مجموعة أقسام
import { useTranslation } from "react-i18next";
import "./SectionsPanel.css";

export default function SectionsPanel({ sections, addSection }) {
  const [visible, setVisible] = useState(false);
  const [pinned, setPinned] = useState(false);
   const { t } = useTranslation();
/*
  const handleMouseEnter = () => {
    if (!pinned) setVisible(true);
  };

  const handleMouseLeave = () => {
    if (!pinned) setVisible(false);
  };
  */

  const handleClick = () => {
    setPinned(!pinned);
    setVisible(!pinned ? true : false);
  };

  return (
    <div
      className="sections-panel-wrapper"
      //onMouseEnter={handleMouseEnter}
      //onMouseLeave={handleMouseLeave}
    >
      {/* الزر الجانبي */}
      <button onClick={handleClick} className="sections-toggle-btn">
        <BsCollection style={{ marginRight: "6px", fontSize: "18px" }} />
     
      {pinned ? t("SectionsPanel.toggle.hide") : t("SectionsPanel.toggle.show")}
       
        
      </button>

      {/* القائمة الجانبية */}
      <div className={`sections-sidebar ${visible ? "show" : ""}`}>
        <h4> {t("SectionsPanel.sidebar.title")}</h4>
        {sections.map((s) => (
          <button
            key={s.name}
            onClick={() => addSection(s.name)}
            className="section-btn"
          >
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}
