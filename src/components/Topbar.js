import React from "react";
import {
  FaUndo,
  FaRedo,
  FaFilePdf,
  FaSave,
  FaImage,
  
  FaArrowLeft
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const TopbarButton = ({ icon, label, onClick, disabled, onExit }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "none",
      border: "none",
      padding: "10px 15px",
      color: disabled ? "#9ca3af" : "#374151",
      fontSize: "11px",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.2s ease-in-out",
    }}
    onMouseEnter={(e) => {
      if (!disabled) e.currentTarget.style.backgroundColor = "#e5e7eb";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "transparent";
    }}
  >
    <div style={{ fontSize: "18px", marginBottom: "4px" }}>{icon}</div>
    <span>{label}</span>
  </button>
);

const Topbar = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSave,
 
  onImageChange,
  onExit,
  downloadPDF,
}) => {
  const { t } = useTranslation();

  return (
    <div className="topbar"
      style={{
        position: "sticky",
        
      
        top: "0",
        direction: "ltr",
      
        width: "100% ",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 40px",
        zIndex: 1000,
      }}
    >

      <style>{`
         /* 🎯 كود خاص بالشاشات الصغيرة (الموبايل) */
@media (max-width: 768px) {
   .topbar {
    overflow-y: scroll;
    
  } 

  }



        
      `}</style>
      {/* 🔹 القسم الأيمن: زر الخروج */}
      

      <button
  onClick={onExit}
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent", // خلفية شفافة
    color: "gray", // لون النص والأيقونة
    border: "2px solid gray", // بوردر رمادي
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "gray"; // لون الخلفية عند الهوفر
    e.currentTarget.style.color = "#fff"; // يمكن ترك النص أبيض
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "transparent"; // رجوع للخلفية الشفافة
    e.currentTarget.style.color = "gray"; // رجوع للنص الأبيض
  }}
>
  <FaArrowLeft style={{ marginInlineEnd: "6px" }} />
  Exit
</button>

      {/* 🔹 القسم الأيسر: أدوات التحرير */}
      <div style={{ display: "flex", gap: "25px" }}>
        <TopbarButton
          icon={<FaUndo />}
          label={t("editor.topbar.undo")}
          onClick={onUndo}
          disabled={!canUndo}
        />
        <TopbarButton
          icon={<FaRedo />}
          label={t("editor.topbar.redo")}
          onClick={onRedo}
          disabled={!canRedo}
        />

        <TopbarButton
          icon={<FaSave />}
          label={t("editor.actions.save")}
          onClick={onSave}
        />

        <TopbarButton
          icon={<FaFilePdf />}
          label={t("editor.actions.downloadPdf")}
          onClick={downloadPDF }
        />

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            padding: "10px 15px",
            color: "#374151",
            fontSize: "11px",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#e5e7eb")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <div style={{ fontSize: "18px", marginBottom: "4px" }}>
            <FaImage />
          </div>
          <span>{t("editor.actions.changeImage")}</span>
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            style={{ display: "none" }}
          />
        </label>
      </div>

      
      
    </div>
  );
};

export default Topbar;





