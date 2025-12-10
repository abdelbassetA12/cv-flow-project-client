
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import ar from "./locales/ar/translation.json";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

i18n
  .use(LanguageDetector) // يقرأ من localStorage أو لغة المتصفح تلقائياً
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("lang") || "en", // لغة افتراضية أو المحفوظة
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
