import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { fabric } from "fabric";
import { toast } from "react-toastify";
import "./PersonalCV.css";

const SMALL_DEVICE_BREAKPOINT = 480;
const DEFAULT_ZOOM_DESKTOP = 0.6;
const DEFAULT_ZOOM_MOBILE = 0.4;

export default function PersonalCV() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM_DESKTOP);
  const canvasRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL;

  const fabricCanvasRef = useRef(null);

  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    const sidebar = document.querySelector(".sidebar");
    if (navbar) navbar.style.display = "none";
    if (sidebar) sidebar.style.display = "none";
    if (window.innerWidth <= SMALL_DEVICE_BREAKPOINT) {
      setZoom(DEFAULT_ZOOM_MOBILE);
    } else {
      setZoom(DEFAULT_ZOOM_DESKTOP);
    }
    return () => {
      if (navbar) navbar.style.display = "";
      if (sidebar) sidebar.style.display = "";
    };
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/saved-projects/public/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error(err);
        toast.error("  Project does not exist or an error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  useEffect(() => {
    if (!project || !canvasRef.current) return;
    try {
      const json = typeof project.data === "string" ? JSON.parse(project.data) : project.data;

     
      const fabricCanvas = new fabric.StaticCanvas(canvasRef.current, { backgroundColor: json.background || "#fff" });

      fabricCanvasRef.current = fabricCanvas;

      fabricCanvas.loadFromJSON(json, fabricCanvas.renderAll.bind(fabricCanvas));

      return () => fabricCanvas.dispose();
    } catch (err) {
      console.error("خطأ في تحميل JSON:", err);
      toast.error("⚠️ لا يمكن عرض السيرة الذاتية (تنسيق غير صالح)");
    }
  }, [project]);

  if (loading) return <div style={{ padding: 20 }}>⏳ جاري التحميل...</div>;
  if (!project) return <div style={{ padding: 20 }}>❌ المشروع غير موجود</div>;

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.1, DEFAULT_ZOOM_MOBILE));
  const resetZoom = () => {
    if (window.innerWidth <= SMALL_DEVICE_BREAKPOINT) setZoom(DEFAULT_ZOOM_MOBILE);
    else setZoom(DEFAULT_ZOOM_DESKTOP);
  };

  return (
    <div className="cv-fullscreen">
      <div className="zoom-controls">
        <button onClick={zoomOut}>-</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button onClick={zoomIn}>+</button>
        <button onClick={resetZoom}>Reset</button>
      </div>

      <div className="cv-canvas-wrapper" style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}>
        <canvas ref={canvasRef} width={793} height={1122}></canvas>
      </div>
    </div>
  );
}



