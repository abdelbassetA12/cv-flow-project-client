import React, { useState } from "react";
import { icons } from "./iconLibrary";
import { FaIcons } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./IconSidebar.css"; // سنضيف التنسيقات هنا

export default function IconSidebar({ addIcon }) {
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [pinned, setPinned] = useState(false);
   const { t } = useTranslation();

  // فلترة الأيقونات حسب البحث
  const filteredIcons = icons.filter(
    (icon) =>
      icon.name.toLowerCase().includes(search.toLowerCase()) ||
      (icon.tags &&
        icon.tags.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        ))
  );
/*
  // التحكم في الظهور
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
      className="icon-sidebar-container"
     // onMouseEnter={handleMouseEnter}
     // onMouseLeave={handleMouseLeave}
    >
      {/* الزر */}
      <button onClick={handleClick} className="sidebar-toggle-btn">
        <FaIcons style={{ marginRight: "6px", fontSize: "18px" }} />
                  
                    {pinned ? t("iconSidebar.toggle.hide") : t("iconSidebar.toggle.show")}
      
       
      </button>

      {/* القائمة الجانبية */}
      <div className={`sidebar-panel ${visible ? "show" : ""}`}>
        <div className="icon-sidebar">
          <div className="fixed-search">
             <input
            type="text"
           
            placeholder={t("iconSidebar.searchPlaceholder")}

            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          </div>
        

          <div className="icon-grid">
            {filteredIcons.map((icon) => (
              <div
                key={icon.id}
                className="icon-item"
                onClick={() => addIcon(icon)}
                title={icon.name}
              >
                <img
                  src={icon.url}
                  alt={icon.name}
                  width={40}
                  height={40}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
