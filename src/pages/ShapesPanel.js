
import React, { useState } from "react";
import { FaShapes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./ShapesPanel.css";

export default function ShapesPanel({ shapes, addShape }) {
  const [visible, setVisible] = useState(false);
  const [pinned, setPinned] = useState(false);
   const { t } = useTranslation();


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
        <FaShapes style={{ marginRight: "6px", fontSize: "18px" }} />

      
         
          {pinned ? t("shapesPanel.toggle.hide") : t("shapesPanel.toggle.show")}

       
        
      </button>
    


      {/* القائمة الجانبية */}
      <div className={`sections-sidebar ${visible ? "show" : ""}`}>
        <h4>{t("shapesPanel.sidebar.title")}</h4>
        {shapes.map((s) => (
          <button
            key={s.name}
            onClick={() => addShape(s.name)}
            className="section-btn"
          >
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}










