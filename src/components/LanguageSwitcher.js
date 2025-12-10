






import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang); // حفظ الاختيار
    document.documentElement.lang = lang; // خاصية lang
    document.body.dir = lang === "ar" ? "rtl" : "ltr"; // اتجاه الصفحة
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <i className="fas fa-globe"></i>
      <select
        value={i18n.language} // 👈 يحدد اللغة الحالية
        onChange={(e) => changeLang(e.target.value)} // 👈 تغيير اللغة
        style={{
          border: "none",
          outline: "none",
          fontSize: "0.85rem",
          backgroundColor: "#fff",
          color: "#000",
          cursor: "pointer",
        }}
      >
        <option value="ar">العربية</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}

