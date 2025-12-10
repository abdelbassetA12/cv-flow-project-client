// Tracker.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function Tracker() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-5NN4292HL4", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null; // ما يعرض أي شيء
}

export default Tracker;

