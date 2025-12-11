// EditorApp.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import { FaRegFileAlt, FaImage, FaListUl, FaListOl, FaUpload, FaTrash, FaClone, FaPaintBrush } from "react-icons/fa";
import { LuFileCog } from "react-icons/lu";
import {  toast } from 'react-toastify';




import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";



import { MdSettings } from "react-icons/md";
import { BiReflectVertical   } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { jsPDF } from "jspdf";


import { 
  MdVerticalAlignTop,      // نقل العنصر إلى الأمام مباشرة
  MdVerticalAlignBottom,   // نقل العنصر إلى الخلف مباشرة
        // خفض العنصر خطوة واحدة
} from "react-icons/md";
import { fabric } from 'fabric';
import { sections } from './sections';
import { Shapes } from './Shapes';
import IconSidebar from './IconSidebar';

import SectionsPanel from './SectionsPanel';
import ShapesPanel from './ShapesPanel';




// مضاف
import axios from "axios";


import  './Editor.css';

// إرسال الكوكي تلقائيًا مع كل الطلبات
axios.defaults.withCredentials = true;

export default function EditorApp(){
  //اخفاء واضهار قائمة الموبايل
  const [menuOpen, setMenuOpen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(false);
const [rightOpen, setRightOpen] = useState(false);
 const API_URL = process.env.REACT_APP_API_URL;  // ⬅️ هنا نقرأ env


// إضافة ستايت للتحكم بالقائمة المنسدلة
const [openExportMenu, setOpenExportMenu] = useState(false);
const menuRef = useRef(null);

useEffect(() => {
  function handleClickOutside(event) {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpenExportMenu(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);






const { user } = useContext(AuthContext);
const userPlan = user?.subscriptionPlan || "basic";



  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const fileLoadRef = useRef(null);
  const imageLoaderRef = useRef(null);
 const { t } = useTranslation();
  // history
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const savingStateLocker = useRef(false);

  // zoom
  const [zoomLevel, setZoomLevel] = useState(1);
  // grid
  const [gridVisible, setGridVisible] = useState(false);
  const [gridSize, setGridSize] = useState(20);

  // stage size & bg
  const [stageW, setStageW] = useState( 793);

 
  const [stageH, setStageH] = useState(1122);
  const [bgColor, setBgColor] = useState('#ffffff');

  // props panel state (extended)
  const [fontFamily, setFontFamily] = useState('Almarai');
  const [fontSize, setFontSize] = useState(36);
  const [textString, setTextString] = useState('');
  const [fillColor, setFillColor] = useState('#000000');
  const [opacity, setOpacity] = useState(1);

  // NEW states
  const [charSpacing, setCharSpacing] = useState(0); // letter spacing
  const [lineHeight, setLineHeight] = useState(1.16); // line height
  const [isUnderline, setIsUnderline] = useState(false);
  const [isLinethrough, setIsLinethrough] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isBold, setIsBold] = useState(false);

  const [selected, setSelected] = useState(null);
  // layers (for re-render list)
 
  const [, forceRerender] = useState(0);

 
  const [textBgColor, setTextBgColor] = useState('#ffffff'); // اللون الافتراضي للخلفية
  // للتحكم في خصائص الإطار
const [borderRadius, setBorderRadius] = useState(40);
const [borderColor, setBorderColor] = useState('#00b894');
const [borderWidth, setBorderWidth] = useState(0);
const [textAlign, setTextAlign] = useState('right'); // أو 'left' افتراضيًا


const [activePopover, setActivePopover] = useState(null); // "radius" | "color" | "width" | null

const radiusRef = useRef(null);
const colorRef = useRef(null);
const widthRef = useRef(null);


const [showThirdToolbar, setShowThirdToolbar] = useState(false);






const [frameColor, setFrameColor] = useState("" );
// لاضهار شريط التحكم في الشفافية 
const [showOpacityControl, setShowOpacityControl] = useState(false);

// حالة اضهار لوحة التحكم في التباعد بين الاحرف والاسطر
const [showSpacingPanel, setShowSpacingPanel] = useState(false);



//

const [showRxControl, setShowRxControl] = useState(false);
const [showStrokeControl, setShowStrokeControl] = useState(false);
const [showStrokeWidthControl, setShowStrokeWidthControl] = useState(false);
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);





const rxRef = useRef(null);
const strokeRef = useRef(null);
const strokeWidthRef = useRef(null);


  const [projectName, setProjectName] = useState(''); // ✅ تمت الإضافة هنا
  const { projectId } = useParams();






const opacityRef = useRef(null);
const [gradientSettings, setGradientSettings] = useState({
  type: "linear", // "linear" أو "radial"
  direction: "diagonal", // up, down, left, right, diagonal
  colors: [
    { offset: 0, color: "#ff00cc" },
    { offset: 1, color: "#3333ff" },
  ],
});
const guideLinesRef = useRef([]); // لتخزين الخطوط التوجيهية أثناء السحب


// مضاف
 const { slug } = useParams();
  const [canvas, setCanvas] = useState(null);
  const [template, setTemplate] = useState(null);


async function saveProjectToDB(projectName) {
  const json = JSON.stringify(canvasRef.current.toJSON(extraPropsToSave));

  try {
    const res = await fetch(`${API_URL}/api/saved-projects`, {
      method: 'POST',
        credentials: "include", // 🔥 إرسال الكوكي تلقائيًا
      headers: {
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify({ name: projectName, data: json })
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(' تم حفظ المشروع في قاعدة البيانات');
      console.log(data.project);
    } else {
      alert('❌ فشل الحفظ: ' + (data.error || 'غير معروف'));
    }
  } catch (err) {
    toast.error('خطأ أثناء الحفظ:', err);
 
  }
}





  useEffect(()=>{
    // init canvas
    const c = new fabric.Canvas('c', { selection: true, preserveObjectStacking: true });
    c.setWidth(stageW); c.setHeight(stageH);
    c.backgroundColor = bgColor;
    canvasRef.current = c;
    setCanvas(c); // هذا يضمن أن useEffect الخاص بالتحميل سيتفعل












    
// helper: هل العنصر أو أي طفل داخل group هو نص أو صورة؟
function isTextOrImage(obj) {
  if (!obj) return false;
  if (obj.type === 'image') return true;
  if (obj.type === 'i-text' || obj.type === 'textbox' || obj.type === 'text') return true;
  // لو group: فحص الأعضاء
  if (obj.type === 'group' || obj.type === 'activeSelection') {
    const children = obj._objects || obj.getObjects?.() || [];
    for (let i = 0; i < children.length; i++) {
      if (isTextOrImage(children[i])) return true;
    }
  }
  return false;
}

// function to update toolbar visibility given an object (or null)
function updateThirdToolbarForObject(obj) {
  if (!obj) {
    setShowThirdToolbar(false);
    return;
  }
  const hasTextOrImage = isTextOrImage(obj);
  // show third toolbar only if NOT text and NOT image
  setShowThirdToolbar(!hasTextOrImage);
}

// attach to selection events
c.on('selection:created', (e) => {
  // e.selected may be array
  const obj = Array.isArray(e.selected) ? e.selected[0] : e.selected || e.target;
  updateThirdToolbarForObject(obj);
});

c.on('selection:updated', (e) => {
  const obj = Array.isArray(e.selected) ? e.selected[0] : e.selected || e.target;
  updateThirdToolbarForObject(obj);
});

c.on('selection:cleared', () => {
  setShowThirdToolbar(false);
});

// إضافي: لو المستخدم يضغط على العنصر (activeObject يتغير) بطريقة أخرى
c.on('mouse:down', () => {
  const active = c.getActiveObject();
  updateThirdToolbarForObject(active);
});









   




















    // ---- SMART ALIGNMENT: advanced checkAlignment ----
let pendingRAF = false; // throttle flag

function getCanvasBounds(obj) {
  // use fabric's getBoundingRect(true) to respect scale/angle/origin
  return obj.getBoundingRect(true); // { left, top, width, height, ... } relative to canvas
}

function createGuideLine(x1, y1, x2, y2, label) {
  const line = new fabric.Line([x1, y1, x2, y2], {
    stroke: 'rgba(255,80,80,0.95)',
    strokeWidth: 1,
    selectable: false,
    evented: false,
    hoverCursor: 'default'
  });

  if (label != null) {
    const text = new fabric.Text(label, {
      left: Math.min(x1, x2) + 6,
      top: Math.min(y1, y2) + 6,
      fontSize: 12,
      selectable: false,
      evented: false,
      backgroundColor: 'rgba(255,255,255,0.9)',
      padding: 4
    });
    return { line, text };
  }

  return { line };
}

function clearGuides() {
  const canvas = canvasRef.current;
  guideLinesRef.current.forEach(el => {
    if (el.line) canvas.remove(el.line);
    if (el.text) canvas.remove(el.text);
    if (el instanceof fabric.Line || el instanceof fabric.Text) canvas.remove(el);
  });
  guideLinesRef.current = [];
}

function checkAlignment(movingObj, nativeEvent = null) {
  // throttle using RAF to avoid flood of renders when dragging fast
  if (pendingRAF) {
    // store last call params if you want; for simplicity ignore
    return;
  }
  pendingRAF = true;
  requestAnimationFrame(() => {
    pendingRAF = false;
    const canvas = canvasRef.current;
    if (!canvas || !movingObj) return;

    // 🧩 حارس مؤقت لمنع التكرار السريع أثناء السحب
if (movingObj._isSnapping) return;
movingObj._isSnapping = true;
setTimeout(() => movingObj._isSnapping = false, 50);

    // if user holds Shift (or ctrl) -> bypass snapping (temporary disable)
    const bypassSnap = nativeEvent && (nativeEvent.shiftKey || nativeEvent.ctrlKey || nativeEvent.metaKey);

    // clear previous lines
    clearGuides();

    const tolerance = 3; // pixels snapping tolerance (tweakable)
    const snapToCanvas = true; // enable snap-to-canvas edges/center
    const snapToGrid = gridVisible; // if grid visible also snap to grid
    const gridSz = gridSize || 20;
    const movingBounds = getCanvasBounds(movingObj);

    // values to test: edges and centers
    const movingEdges = {
      left: movingBounds.left,
      right: movingBounds.left + movingBounds.width,
      top: movingBounds.top,
      bottom: movingBounds.top + movingBounds.height,
      centerX: movingBounds.left + movingBounds.width / 2,
      centerY: movingBounds.top + movingBounds.height / 2
    };

    // collect candidates: canvas edges + other objects
    const candidates = [];

    // canvas edges/centers
    if (snapToCanvas) {
      candidates.push({
        type: 'canvas',
        left: 0,
        right: canvas.width,
        top: 0,
        bottom: canvas.height,
        centerX: canvas.width / 2,
        centerY: canvas.height / 2
      });
    }

    // objects (exclude moving and if not visible)
    canvas.getObjects().forEach(obj => {
      if (obj === movingObj) return;
      if (!obj.visible) return;
      const b = getCanvasBounds(obj);
      candidates.push({
        type: 'object',
        obj,
        left: b.left,
        right: b.left + b.width,
        top: b.top,
        bottom: b.top + b.height,
        centerX: b.left + b.width / 2,
        centerY: b.top + b.height / 2
      });
    });

    // function to try snapping an axis (X or Y)
    const snaps = { x: null, y: null }; // store best snap candidate

    candidates.forEach(cand => {
      // X axis checks: left/right/centerX
      ['left','centerX','right'].forEach(key => {
        const candVal = cand[key];
        const dxLeft = Math.abs(movingEdges.left - candVal);
        const dxCenter = Math.abs(movingEdges.centerX - candVal);
        const dxRight = Math.abs(movingEdges.right - candVal);

        // check each corner/center for proximity
        if (dxLeft < tolerance) {
          if (!snaps.x || dxLeft < snaps.x.dist) {
            snaps.x = { dist: dxLeft, type: key, cand, candVal, anchor: 'left' };
          }
        }
        if (dxCenter < tolerance) {
          if (!snaps.x || dxCenter < snaps.x.dist) {
            snaps.x = { dist: dxCenter, type: key, cand, candVal, anchor: 'center' };
          }
        }
        if (dxRight < tolerance) {
          if (!snaps.x || dxRight < snaps.x.dist) {
            snaps.x = { dist: dxRight, type: key, cand, candVal, anchor: 'right' };
          }
        }
      });

      // Y axis checks
      ['top','centerY','bottom'].forEach(key => {
        const candVal = cand[key];
        const dyTop = Math.abs(movingEdges.top - candVal);
        const dyCenter = Math.abs(movingEdges.centerY - candVal);
        const dyBottom = Math.abs(movingEdges.bottom - candVal);

        if (dyTop < tolerance) {
          if (!snaps.y || dyTop < snaps.y.dist) {
            snaps.y = { dist: dyTop, type: key, cand, candVal, anchor: 'top' };
          }
        }
        if (dyCenter < tolerance) {
          if (!snaps.y || dyCenter < snaps.y.dist) {
            snaps.y = { dist: dyCenter, type: key, cand, candVal, anchor: 'center' };
          }
        }
        if (dyBottom < tolerance) {
          if (!snaps.y || dyBottom < snaps.y.dist) {
            snaps.y = { dist: dyBottom, type: key, cand, candVal, anchor: 'bottom' };
          }
        }
      });
    });

    // grid snapping (if enabled) - try to snap moving object's top/left to nearest grid
    let gridSnap = { left: null, top: null };
    if (snapToGrid && !bypassSnap) {
      const modLeft = Math.round(movingEdges.left / gridSz) * gridSz;
      const modTop = Math.round(movingEdges.top / gridSz) * gridSz;
      if (Math.abs(modLeft - movingEdges.left) < tolerance) gridSnap.left = modLeft;
      if (Math.abs(modTop - movingEdges.top) < tolerance) gridSnap.top = modTop;
    }

    // apply snaps (unless bypassSnap)
    if (!bypassSnap) {
      // X axis
      if (snaps.x) {
        // draw vertical guide at candVal
        const gx = snaps.x.candVal;
        const guide = createGuideLine(gx, 0, gx, canvas.height, Math.round(snaps.x.dist) + 'px');
        if (guide.text) {
          canvas.add(guide.line, guide.text);
          guideLinesRef.current.push(guide);
        } else {
          canvas.add(guide.line);
          guideLinesRef.current.push(guide.line);
        }

        // compute new left for movingObj depending on which anchor matched
        // we want final movingBounds anchor position to equal gx
        let newLeft = movingObj.left;
        // Note: movingBounds.left is computed from current movingObj properties; to snap we need to set movingObj.left so bounding left equals gx
        const currentBounding = movingObj.getBoundingRect(true);
        const offset = movingObj.left - currentBounding.left; // difference between object.left and bounding left
        if (snaps.x.anchor === 'left') {
          newLeft = gx + offset;
        } else if (snaps.x.anchor === 'center') {
          newLeft = gx - (currentBounding.width / 2) + offset;
        } else if (snaps.x.anchor === 'right') {
          newLeft = gx - currentBounding.width + offset;
        }
        movingObj.set('left', newLeft);
        movingObj.setCoords();
      } else if (gridSnap.left != null) {
        movingObj.set('left', gridSnap.left + (movingObj.left - movingBounds.left));
        movingObj.setCoords();
        const gx = gridSnap.left;
        const guide = createGuideLine(gx, 0, gx, canvas.height);
        canvas.add(guide.line);
        guideLinesRef.current.push(guide.line);
      }

      // Y axis
      if (snaps.y) {
        const gy = snaps.y.candVal;
        const guide = createGuideLine(0, gy, canvas.width, gy, Math.round(snaps.y.dist) + 'px');
        if (guide.text) {
          canvas.add(guide.line, guide.text);
          guideLinesRef.current.push(guide);
        } else {
          canvas.add(guide.line);
          guideLinesRef.current.push(guide.line);
        }

        const currentBounding = movingObj.getBoundingRect(true);
        const offsetY = movingObj.top - currentBounding.top;
        let newTop = movingObj.top;
        if (snaps.y.anchor === 'top') {
          newTop = gy + offsetY;
        } else if (snaps.y.anchor === 'center') {
          newTop = gy - (currentBounding.height / 2) + offsetY;
        } else if (snaps.y.anchor === 'bottom') {
          newTop = gy - currentBounding.height + offsetY;
        }
        movingObj.set('top', newTop);
        movingObj.setCoords();
      } else if (gridSnap.top != null) {
        movingObj.set('top', gridSnap.top + (movingObj.top - movingBounds.top));
        movingObj.setCoords();
        const gy = gridSnap.top;
        const guide = createGuideLine(0, gy, canvas.width, gy);
        canvas.add(guide.line);
        guideLinesRef.current.push(guide.line);
      }
    }

    canvas.requestRenderAll();
  });
}


    

// ------------------- SMART ALIGNMENT -------------------
/*
    function checkAlignment(movingObj) {
  const canvas = canvasRef.current;
  if (!canvas) return;

  // إزالة أي خطوط سابقة
  guideLinesRef.current.forEach(line => canvas.remove(line));
  guideLinesRef.current = [];

  const tolerance = 5; // عدد البيكسلات المقبول للاختلاف

  canvas.getObjects().forEach(obj => {
    if(obj === movingObj) return; // تجاهل العنصر المتحرك نفسه

    // محاذاة مراكز X (عمودية)
    if (Math.abs((movingObj.left + movingObj.width/2) - (obj.left + obj.width/2)) < tolerance) {
      const line = new fabric.Line(
        [obj.left + obj.width/2, 0, obj.left + obj.width/2, canvas.height],
        { stroke: 'red', strokeWidth: 1, selectable: false, evented: false, opacity: 0.5 }
      );
      canvas.add(line);
      guideLinesRef.current.push(line);

      // Snap تلقائي
      movingObj.left = obj.left + obj.width/2 - movingObj.width/2;
    }

    // محاذاة مراكز Y (أفقية)
    if (Math.abs((movingObj.top + movingObj.height/2) - (obj.top + obj.height/2)) < tolerance) {
      const line = new fabric.Line(
        [0, obj.top + obj.height/2, canvas.width, obj.top + obj.height/2],
        { stroke: 'red', strokeWidth: 1, selectable: false, evented: false, opacity: 0.5 }
      );
      canvas.add(line);
      guideLinesRef.current.push(line);

      // Snap تلقائي
      movingObj.top = obj.top + obj.height/2 - movingObj.height/2;
    }
  });

  canvas.requestRenderAll();
}
*/
    
   /*
    function syncProperties(e) {
  const obj = e.selected ? e.selected[0] : canvasRef.current.getActiveObject();
  setSelected(obj);

  if (obj && obj.type === 'group' && obj._objects?.length === 2) {
    const border = obj._objects[1]; // المستطيل الثاني داخل المجموعة
    setBorderRadius(border.rx || 0);
    setBorderColor(border.stroke || '#000');
    setBorderWidth(border.strokeWidth || 0);
  }
}*/
  







   //دخيل خاص بالقائمة list
    canvasRef.current.on('text:changed', function(e) {
  const obj = e.target;
  if (!obj || !obj.listMode) return;

  // تقسيم النص إلى أسطر
  const lines = obj.text.split('\n');
  const newLines = lines.map((line, index) => {
    if (obj.listMode === 'bulleted') {
      // إذا لم تبدأ النقطة بـ "• " أضفها
      return line.startsWith('• ') ? line : '• ' + line;
    } else if (obj.listMode === 'numbered') {
      // إزالة أي أرقام سابقة ثم إضافة الرقم الصحيح
      const cleanLine = line.replace(/^\d+\.\s*/, '');
      return `${index + 1}. ${cleanLine}`;
    }
    return line;
  });

  obj.text = newLines.join('\n');

  // إعادة تعيين موقع المؤشر على آخر السطر
  if (typeof obj.selectionStart === 'number') {
    obj.selectionStart = obj.selectionEnd = obj.text.length;
  }

  canvasRef.current.requestRenderAll();
});





    // events
    /*
    c.on('object:added', () => { saveState(); refreshLayers(); });
    c.on('object:removed', () => { saveState(); refreshLayers(); });
    c.on('object:modified', () => { saveState(); refreshLayers(); });
*/
    c.on('object:added', () => { saveState(); refreshLayers(); setHasUnsavedChanges(true); });
c.on('object:removed', () => { saveState(); refreshLayers(); setHasUnsavedChanges(true); });
c.on('object:modified', () => { saveState(); refreshLayers(); setHasUnsavedChanges(true); });

    c.on('selection:created', syncProperties);
    c.on('selection:updated', syncProperties);
    c.on('selection:cleared', clearProperties);


     
    // scaling handler (kept from original)
    function handleObjectScaling(e){
      const o = e.target;
      if(!o) return;

      const isText = (obj) => {
        return obj.type === 'textbox' || obj.type === 'i-text' || obj.type === 'text';
      };

      if(!isText(o)) return;

      const canvas = canvasRef.current;
      if(o.scaleX < 1){
        let textObj = o;
        if(o.type === 'i-text'){
          const props = o.toObject(['left','top','width','height','fontSize','fontFamily','fill','text','angle','opacity','textAlign','lineHeight','charSpacing','underline','linethrough','fontStyle','fontWeight','listMode']);
          const left = o.left;
          const top = o.top;
          const tbWidth = (props.width || (o.getScaledWidth ? o.getScaledWidth() : 200)) * o.scaleX;
          const tb = new fabric.Textbox(o.text || props.text || '', {
            left: left,
            top: top,
            fontSize: props.fontSize || 36,
            fontFamily: props.fontFamily || 'Almarai',
            fill: props.fill || '#000',
            width: tbWidth || 200,
            angle: props.angle || 0,
            opacity: props.opacity != null ? props.opacity : 1,
            textAlign: props.textAlign || 'left',
            lineHeight: props.lineHeight || 1.16,
            charSpacing: props.charSpacing || 0,
            underline: props.underline || false,
            linethrough: props.linethrough || false,
            fontStyle: props.fontStyle || '',
            fontWeight: props.fontWeight || '',
            listMode: props.listMode || null,
          });

          const z = canvas.getObjects().indexOf(o);
          canvas.remove(o);
          canvas.add(tb);
          canvas.moveTo(tb, z);
          canvas.setActiveObject(tb);
          textObj = tb;
        }

        const currentWidth = textObj.width || (textObj.getScaledWidth ? textObj.getScaledWidth() : 200);
        const newWidth = Math.max(10, currentWidth * textObj.scaleX);
        textObj.set({ width: newWidth, scaleX: 1 });
        canvas.requestRenderAll();
      }
    }
    function handleRotation(e) {
  const o = e.target;
  if (!o) return;
  const native = e.e;
  // إذا ضغط المستخدم Shift/Meta/CTRL -> تعطيل snap
  if (native && (native.shiftKey || native.ctrlKey || native.metaKey)) return;

  const snapAngles = 15; // snap every 15 degrees (تعديل ممكن)
  const angle = o.angle % 360;
  const snapped = Math.round(angle / snapAngles) * snapAngles;
  const diff = Math.abs(snapped - angle);
  if (diff < 4) { // tolerance in degrees
    o.set('angle', snapped);
    o.setCoords();
  }
}

c.on('object:rotating', handleRotation);






    // ------------------- SMART ALIGNMENT -------------------

// عند تحريك أي عنصر
/*
c.on('object:moving', (e) => {
  checkAlignment(e.target, e.e); // e.e هو الحدث الأصلي من الماوس/اللمس
});

*/
let lastMove = 0; // لتقليل عدد مرات الحساب
const MOVE_THROTTLE = 30; // بالميلي ثانية

c.on('object:moving', (e) => {
  const now = Date.now();
  if (now - lastMove < MOVE_THROTTLE) return; // تجاهل التحديثات المتقاربة جدًا
  lastMove = now;

  const evt = e.e;
  // إذا كان المستخدم يضغط على Shift أو Ctrl → تجاوز المحاذاة لتفادي "البلوك"
  if (evt && (evt.shiftKey || evt.ctrlKey || evt.metaKey)) {
    clearGuides();
    return;
  }

  // حساب المحاذاة فقط إذا لم يكن قريبًا جدًا من عناصر أخرى (تخفيف الحساسية)
  checkAlignment(e.target, evt);
});





// عند إفلات العنصر إزالة الخطوط
c.on('mouse:up', () => {
  clearGuides(); // استخدم الدالة الأصلية لأنها تزيل النصوص والخطوط معاً
  const canvas = canvasRef.current;
  canvas.requestRenderAll();
});



    c.on('object:scaling', handleObjectScaling);

    // keyboard handlers (delete, undo/redo, Enter handling for lists)
    function onKey(e){
      // delete/backspace
      if((e.key === 'Delete' || e.key === 'Backspace')){
        const o = c.getActiveObject();
        if(o && !o.isEditing){ // only delete object if not editing text
          c.remove(o); saveState(); refreshLayers();
          return;
        }
      }

      // undo/redo
      if((e.ctrlKey||e.metaKey) && e.key.toLowerCase() === 'z'){ e.preventDefault(); undo(); return; }
      if((e.ctrlKey||e.metaKey) && e.key.toLowerCase() === 'y'){ e.preventDefault(); redo(); return; }

      // Enter handling for lists


      // Enter handling for lists (مع دعم القوائم دون التأثير على التنسيقات)
      //ادا واخهت مشكلة في خاصية القوائم ازيل هدا واشغل الدي اسفله
   





   if(e.key === 'Enter'){
        const o = c.getActiveObject();
        if(o && (o.type === 'i-text' || o.type === 'textbox' || o.type === 'text') && o.listMode){
          // allow the Enter to insert newline, then patch the new line to include list marker
          // use setTimeout 0 to let fabric apply the newline first
          setTimeout(()=> {
            const active = c.getActiveObject();
            if(!active) return;
            const txt = active.text || '';
            // Try to get selectionStart (works for IText/Textbox while editing)
            const sel = (typeof active.selectionStart === 'number') ? active.selectionStart : txt.length;
            // Compute current line index where caret is
            const prefix = txt.slice(0, sel);
            const lineIndex = prefix.split('\n').length - 1;
            const lines = txt.split('\n');

            // If the previous line (lineIndex -1) was part of same list, we add marker to current line
            const prevLine = lines[Math.max(0, lineIndex - 1)] || '';
            const isPrevBulleted = /^\s*•\s/.test(prevLine);
            const prevNumberMatch = prevLine.match(/^\s*(\d+)\.\s/);

            if(active.listMode === 'bulleted' && (isPrevBulleted || prevLine.trim().length > 0 && prevLine.startsWith('•'))){
              const marker = '• ';
              // Prepend marker only if current line doesn't already start with marker
              if(!/^\s*•\s/.test(lines[lineIndex])){
                lines[lineIndex] = marker + lines[lineIndex];
                const newText = lines.join('\n');
                active.set({ text: newText });
                // move caret to after marker
                const newSel = sel + marker.length;
                if(typeof active.selectionStart !== 'undefined'){
                  active.selectionStart = active.selectionEnd = newSel;
                }
                c.requestRenderAll();
                saveState(); refreshLayers();
              }
            } else if(active.listMode === 'numbered' && (prevNumberMatch || /^\s*\d+\.\s/.test(prevLine))){
              // find next number based on previous numbered lines count
              // count preceding numbered lines that are contiguous (stop when encountering non-numbered)
              let start = lineIndex - 1;
              let count = 0;
              while(start >= 0){
                const l = lines[start];
                if(/^\s*\d+\.\s/.test(l)){ count++; start--; } else break;
              }
              const nextNumber = count + 1;
              const marker = `${nextNumber}. `;
              if(!/^\s*\d+\.\s/.test(lines[lineIndex])){
                lines[lineIndex] = marker + lines[lineIndex];
                const newText = lines.join('\n');
                active.set({ text: newText });
                const newSel = sel + marker.length;
                if(typeof active.selectionStart !== 'undefined'){
                  active.selectionStart = active.selectionEnd = newSel;
                }
                c.requestRenderAll();
                saveState(); refreshLayers();
              }
            }
          }, 0);
        }
      }
        
    }

    window.addEventListener('keydown', onKey);

    // initial state
    saveState(); refreshLayers();

    // resize handler
    function onResize(){ c.calcOffset(); }
    window.addEventListener('resize', onResize);

    return ()=>{
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey);
      c.dispose();
    };
  }, []);

  useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = "لديك تغييرات غير محفوظة، هل تريد حقًا مغادرة الصفحة؟";
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, [hasUnsavedChanges]);



// مضاف
   // 2️⃣ جلب القالب وملف JSON
  useEffect(() => {
    if (!slug || !canvas) return;
    const loadTemplate = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/templates/${slug}`, {
          //headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const t = res.data.template;
        setTemplate(t);

        const jsonRes = await fetch(`http://localhost:5000${t.jsonUrl}`);
       
        const json = await jsonRes.json();

        canvas.loadFromJSON(json, () => {
          canvas.renderAll();
        });
      } catch (err) {
       
      }
    };
    loadTemplate();
  }, [slug, canvas]);
 

  useEffect(() => {
  if (!projectId) return;

  const fetchProject = async () => {
   
   // const res = await fetch(`http://localhost:5000/api/saved-projects/${projectId}`, {
       const res = await fetch(`http://localhost:5000/api/saved-projects/${projectId}`, {
          credentials: "include", // 🔥 إرسال الكوكي تلقائيًا
    
    });
    const project = await res.json();
    const jsonData = JSON.parse(project.data);
    canvasRef.current.loadFromJSON(jsonData, () => {
      canvasRef.current.renderAll();
    });
  };

  fetchProject();
}, [projectId]);


  
  useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const active = canvas.getActiveObject();
  if (!active) return;

  // ✅ إذا كان العنصر مجموعة (frame + element)
  if (active.type === "group") {
    active._objects.forEach(obj => {
      if (obj.stroke) {
        obj.set({ stroke: frameColor });
        if (obj.shadow) obj.shadow.color = frameColor;
      }
    });
    canvas.requestRenderAll();
  }
  // ✅ أو إذا كان العنصر العادي نفسه إطار
  else if (active.stroke) {
    active.set({ stroke: frameColor });
    if (active.shadow) active.shadow.color = frameColor;
    canvas.requestRenderAll();
  }
}, [frameColor]);

//لاخفاء لوحة التحكم في الشفافية 
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const active = canvas.getActiveObject();
  if (!active) return;

  if (active.type === "group") {
    const frame = active._objects.find(obj => obj.stroke || obj.fill);
    if (frame) {
      const grad = createGradient(gradientSettings, frame.width, frame.height);
      frame.set("stroke", grad);
      canvas.requestRenderAll();
    }
  }
}, [gradientSettings]);
useEffect(() => {
  const handleClickOutside = (e) => {
    if (opacityRef.current && !opacityRef.current.contains(e.target)) {
      setShowOpacityControl(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

//لاخفاء لوحة التحكم في التباعد 
useEffect(() => {
  const handleClickOutside = () => setShowSpacingPanel(false);
  document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
}, []);



  // إغلاق النوافذ عند الضغط خارجها
  // إغلاق جميع النوافذ عند الضغط خارجها
useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      radiusRef.current?.contains(e.target) ||
      colorRef.current?.contains(e.target) ||
      widthRef.current?.contains(e.target)
    ) {
      return;
    }
    setActivePopover(null);
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);



useEffect(() => {
  const handleClickOutside = (e) => {
    // إذا كان النقر خارج أي Popover أو زر
    if (
      !rxRef.current?.contains(e.target) &&
      !strokeRef.current?.contains(e.target) &&
      !strokeWidthRef.current?.contains(e.target)
    ) {
      setShowRxControl(false);
      setShowStrokeControl(false);
      setShowStrokeWidthControl(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);





  // SAVE / LOAD HISTORY
  const extraPropsToSave = ['charSpacing','linethrough','underline','fontWeight','fontStyle','lineHeight'];

  function saveState(){
    if(!canvasRef.current) return;
    if(savingStateLocker.current) return; // prevent recursion
    try{
      savingStateLocker.current = true;
      const json = JSON.stringify(canvasRef.current.toJSON(extraPropsToSave));
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
      historyRef.current.push(json);
      if(historyRef.current.length > 100) historyRef.current.shift();
      historyIndexRef.current = historyRef.current.length - 1;
    }catch(e){ console.error('saveState err', e); }
    finally{ savingStateLocker.current = false; }
  }
  function loadState(index){
    if(!canvasRef.current) return;
    if(index < 0 || index >= historyRef.current.length) return;
    canvasRef.current.clear();
    canvasRef.current.loadFromJSON(historyRef.current[index], () => { canvasRef.current.renderAll(); refreshLayers(); });
    historyIndexRef.current = index;
  }




  function undo() {
  if(historyIndexRef.current > 0) {
    loadState(historyIndexRef.current - 1);
  }
}

function redo() {
  if(historyIndexRef.current < historyRef.current.length - 1) {
    loadState(historyIndexRef.current + 1);
  }
}
   

  // توزيع أفقي / عمودي للعناصر المحددة

// ضع هذه الدالة داخل نفس الملف (خارج useEffect) حيث تعريف canvasRef و saveState و refreshLayers متوفرة
function distributeSelection(axis = 'x') {
  const canvas = canvasRef.current;
  if (!canvas) return;

  // احصل على العناصر المحددة كمصفوفة (آمنة حتى لو لا توجد مجموعة نشطة)
  const items = canvas.getActiveObjects ? canvas.getActiveObjects() : [];
  if (!items || items.length < 2) {
    // إذا أردت السماح بالتوزيع لعنصرين فقط عدّل الشرط إلى < 2
    return;
  }

  // جلب حدود كل عنصر بالنسبة للكانفاس (تحترم التحجيم والدوران)
  const bounds = items.map(i => i.getBoundingRect(true));

  if (axis === 'x') {
    // نرتب العناصر حسب اليسار لضمان التوزيع المتسلسل
    const order = bounds
      .map((b, idx) => ({ idx, left: b.left, width: b.width }))
      .sort((a, b) => a.left - b.left);

    const leftMost = order[0].left;
    const rightMost = order[order.length - 1].left + order[order.length - 1].width;
    const totalWidth = order.reduce((s, o) => s + o.width, 0);

    const gaps = Math.max(0, order.length - 1);
    const space = gaps === 0 ? 0 : (rightMost - leftMost - totalWidth) / gaps;

    let cursor = leftMost;
    order.forEach(o => {
      const obj = items[o.idx];
      const b = bounds[o.idx];
      // نضع left جديد بحيث يحافظ على الفرق بين left و bounding.left الأصلي
      const delta = obj.left - b.left;
      obj.set({ left: cursor + delta });
      obj.setCoords();
      cursor += b.width + space;
    });
  } else { // axis === 'y'
    const order = bounds
      .map((b, idx) => ({ idx, top: b.top, height: b.height }))
      .sort((a, b) => a.top - b.top);

    const topMost = order[0].top;
    const bottomMost = order[order.length - 1].top + order[order.length - 1].height;
    const totalHeight = order.reduce((s, o) => s + o.height, 0);

    const gaps = Math.max(0, order.length - 1);
    const space = gaps === 0 ? 0 : (bottomMost - topMost - totalHeight) / gaps;

    let cursor = topMost;
    order.forEach(o => {
      const obj = items[o.idx];
      const b = bounds[o.idx];
      const delta = obj.top - b.top;
      obj.set({ top: cursor + delta });
      obj.setCoords();
      cursor += b.height + space;
    });
  }

  canvas.requestRenderAll();

  // احفظ الحالة وجدد ليرز إن توفرت الدوال
  try { saveState(); } catch(e) { /* ignore if not available */ }
  try { refreshLayers(); } catch(e) { /* ignore if not available */ }
}




  // Layer refresh (forces render of list)
  function refreshLayers(){ forceRerender(n => n+1); }

  // 🎨 دالة ذكية لتغيير لون العنصر المحدد تلقائيًا يمكن اضافة زر لتشغيلها
function applySmartColor(color) {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const active = canvas.getActiveObject();
  if (!active) return;

  // إذا كانت مجموعة (Group)
  if (active.type === "group") {
    active._objects.forEach(obj => {
      if (obj.type === "line" || obj.stroke) {
        obj.set({ stroke: color });
      } else if (obj.fill) {
        obj.set({ fill: color });
      }
    });
  }
  // عنصر مفرد
  else {
    // لو العنصر خط أو يعتمد على stroke
    if (active.type === "line" || active.stroke) {
      active.set({ stroke: color });
    } 
    // لو العنصر ممتلئ (rect, circle, path...)
    else if (active.fill) {
      active.set({ fill: color });
    }
  }

  canvas.requestRenderAll();
  saveState();
}




function addIcon(icon) {
  const canvas = canvasRef.current;
  if (!canvas) return;
  if (!icon || !icon.url) return;

  fabric.loadSVGFromURL(icon.url, (objects, options) => {
    const obj = fabric.util.groupSVGElements(objects, options);
    obj.set({
      left: 100,
      top: 100,
      scaleX: 1,
      scaleY: 1,
      selectable: true,
    });

    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();
    saveState();
    refreshLayers();
  });
}


  // Add element helpers (add default text with new props)
  function addSection(sectionName) {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const section = sections.find(s => s.name === sectionName);
  if (!section) return console.warn("Section not found:", sectionName);

  // تحميل الـ objects من JSON مباشرة
  fabric.util.enlivenObjects(section.data.objects, function(objects) {
    objects.forEach(obj => canvas.add(obj));
    canvas.requestRenderAll();
    saveState();
    refreshLayers();
  });
}
 // Add element helpers (add default text with new props)
function addShape(shapeName) {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const shapeObj = Shapes.find(s => s.name === shapeName);
  if (!shapeObj) return console.warn("Shape not found:", shapeName);

  // تحميل الـ objects من JSON مباشرة
  fabric.util.enlivenObjects(shapeObj.data.objects, function(objects) {
    objects.forEach(obj => canvas.add(obj));
    canvas.requestRenderAll();
    saveState();
    refreshLayers();
  });
}



 
  function addText(){ 
    const txt = new fabric.Textbox('نص جديد', { 
      left:100, top:100, fontSize:36, fill: '#000000', width: 220,
      charSpacing: 0,
      lineHeight: 1.16,
      underline: false,
      linethrough: false,
      fontFamily: 'Almarai',
      fontStyle: '',
      fontWeight: '',
      listMode: null,
    });
    canvasRef.current.add(txt).setActiveObject(txt); saveState(); refreshLayers(); 
  }

  function applyTextAlign(align) {
  setTextAlign(align);
  const canvas = canvasRef.current;
  if (!canvas) return;

  const active = canvas.getActiveObject();
  if (!active) return;

  if (active.type === 'textbox' || active.type === 'i-text' || active.type === 'text') {
    active.set({ textAlign: align });
    canvas.requestRenderAll();
    saveState();
  }
}


    //دخيل خاص بالقائمة list
// إضافة نص نقطي
function addBulletedText() {
  const txt = new fabric.Textbox('• ', {
    left: 100,
    top: 100,
    fontSize: 36,
    fill: '#000',
    width: 220,
    listMode: 'bulleted',  // ← لتحديد نوع القائمة
    charSpacing: 0,
    lineHeight: 1.16,
    underline: false,
    linethrough: false,
    fontStyle: '',
    fontWeight: ''
  });
  canvasRef.current.add(txt).setActiveObject(txt);
  saveState(); refreshLayers();
}

// إضافة نص مرقم
function addNumberedText() {
  const txt = new fabric.Textbox('1. ', {
    left: 100,
    top: 100,
    fontSize: 36,
    fill: '#000',
    width: 220,
    listMode: 'numbered',  // ← لتحديد نوع القائمة
    charSpacing: 0,
    lineHeight: 1.16,
    underline: false,
    linethrough: false,
    fontStyle: '',
    fontWeight: ''
  });
  canvasRef.current.add(txt).setActiveObject(txt);
  saveState(); refreshLayers();
}


  function addLine(){ const line = new fabric.Line([50,100,200,100], { left:150, top:150, stroke:'#000', strokeWidth:4 }); canvasRef.current.add(line).setActiveObject(line); saveState(); refreshLayers(); }


  function addSquare() {
  const square = new fabric.Rect({
    left: 120,       // الموضع الأفقي
    top: 120,        // الموضع الرأسي
    width: 150,      // العرض
    height: 150,     // الارتفاع (لأنه مربع يكون نفس العرض)
    fill: '#3b82f6'  // اللون
  });

  canvasRef.current.add(square).setActiveObject(square);
  saveState();
  refreshLayers();
}
  function addRect(){ const rect = new fabric.Rect({ left:120, top:120, width:200, height:120, fill: '#f97316' }); canvasRef.current.add(rect).setActiveObject(rect); saveState(); refreshLayers(); }
 
  function addCircle(){ const circ = new fabric.Circle({ left:160, top:160, radius:60, fill:'#06b6d4' }); canvasRef.current.add(circ).setActiveObject(circ); saveState(); refreshLayers(); }
// ◐ نصف دائرة
function addHalfCircle() {
  const path = new fabric.Path('M 200 200 A 80 80 0 0 1 200 360 L 200 200 Z', {
    fill: '#a855f7',
    stroke: '#000',
    strokeWidth: 2
  });
  canvasRef.current.add(path).setActiveObject(path);
  saveState(); refreshLayers();
}

// مستطيل مع حواف مستديرة
function addRoundedRect(){
  const rect = new fabric.Rect({
    left:150, top:150, width:200, height:120, fill:'#f97316',
    rx:20, ry:20
  });
  canvasRef.current.add(rect).setActiveObject(rect);
  saveState(); refreshLayers();
}

  // بيضاوي
function addEllipse(){
  const el = new fabric.Ellipse({ left:200, top:180, rx:80, ry:40, fill:'#22c55e' });
  canvasRef.current.add(el).setActiveObject(el);
  saveState(); refreshLayers();
}

// مثلث
function addTriangle(){
  const tri = new fabric.Triangle({ left:250, top:100, width:120, height:120, fill:'#facc15' });
  canvasRef.current.add(tri).setActiveObject(tri);
  saveState(); refreshLayers();
}

// مضلع (Polygon)
function addPolygon(){
  const poly = new fabric.Polygon([
    { x:300, y:300 },
    { x:350, y:350 },
    { x:325, y:400 },
    { x:275, y:400 },
    { x:250, y:350 }
  ], { fill:'#f43f5e', stroke:'#000', strokeWidth:2 });
  canvasRef.current.add(poly).setActiveObject(poly);
  saveState(); refreshLayers();
}


// ⭐ نجمة (Star)
function addStar() {
  const points = [];
  const cx = 200, cy = 200;
  const outerRadius = 80;
  const innerRadius = 35;
  const spikes = 5;

  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI / spikes) * i;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    points.push({ x, y });
  }

  const star = new fabric.Polygon(points, {
    left: 150,
    top: 150,
    fill: '#fbbf24',
    stroke: '#000',
    strokeWidth: 2
  });
  canvasRef.current.add(star).setActiveObject(star);
  saveState(); refreshLayers();
}

// ⬣ مثمن (Octagon)
function addOctagon() {
  const sides = 8;
  const radius = 60;
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides;
    points.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) });
  }
  const oct = new fabric.Polygon(points, {
    left: 200, top: 200,
    fill: '#34d399',
    stroke: '#000',
    strokeWidth: 2
  });
  canvasRef.current.add(oct).setActiveObject(oct);
  saveState(); refreshLayers();
}

// 🔷 سداسي (Hexagon)
function addHexagon() {
  const sides = 6;
  const radius = 60;
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides;
    points.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) });
  }
  const hex = new fabric.Polygon(points, {
    left: 200, top: 200,
    fill: '#60a5fa',
    stroke: '#000',
    strokeWidth: 2
  });
  canvasRef.current.add(hex).setActiveObject(hex);
  saveState(); refreshLayers();
}

// ❤️ قلب
function addHeart() {
  const path = new fabric.Path('M 272.701,142.227 C 252.533,95.878 178.743,87.307 150,135.125 C 121.257,87.307 47.467,95.878 27.299,142.227 C 3.091,197.24 75.634,258.422 150,330 C 224.366,258.422 296.909,197.24 272.701,142.227 Z', {
    left: 100,
    top: 100,
    fill: '#ef4444',
    stroke: '#000',
    strokeWidth: 1,
    scaleX: 0.6,
    scaleY: 0.6
  });
  canvasRef.current.add(path).setActiveObject(path);
  saveState(); refreshLayers();
}
// ◔ ربع دائرة
function addQuarterCircle() {
  const path = new fabric.Path(`
    M 200 200
    A 80 80 0 0 1 280 280
    L 200 280 Z
  `, {
    fill: '#fb923c',
    stroke: '#333',
    strokeWidth: 2,
  });
  canvasRef.current.add(path).setActiveObject(path);
  saveState(); refreshLayers();
}





// ⬜ مربع فارغ
function addSquareOutline() {
  const square = new fabric.Rect({
    left: 120,
    top: 120,
    width: 150,
    height: 150,
    fill: 'transparent',
    stroke: '#3b82f6',
    strokeWidth: 3
  });
  canvasRef.current.add(square).setActiveObject(square);
  saveState(); refreshLayers();
}

// ⬛ مستطيل فارغ
function addRectOutline() {
  const rect = new fabric.Rect({
    left: 120,
    top: 120,
    width: 200,
    height: 120,
    fill: 'transparent',
    stroke: '#f97316',
    strokeWidth: 3
  });
  canvasRef.current.add(rect).setActiveObject(rect);
  saveState(); refreshLayers();
}

// ⚪ دائرة فارغة
function addCircleOutline() {
  const circ = new fabric.Circle({
    left: 160,
    top: 160,
    radius: 60,
    fill: 'transparent',
    stroke: '#06b6d4',
    strokeWidth: 3
  });
  canvasRef.current.add(circ).setActiveObject(circ);
  saveState(); refreshLayers();
}

// ◐ نصف دائرة فارغة
function addHalfCircleOutline() {
  const path = new fabric.Path('M 200 200 A 80 80 0 0 1 200 360 L 200 200 Z', {
    fill: 'transparent',
    stroke: '#a855f7',
    strokeWidth: 3
  });
  canvasRef.current.add(path).setActiveObject(path);
  saveState(); refreshLayers();
}

// 🟧 مستطيل بحواف مستديرة فارغ
function addRoundedRectOutline() {
  const rect = new fabric.Rect({
    left: 150,
    top: 150,
    width: 200,
    height: 120,
    fill: 'transparent',
    rx: 20,
    ry: 20,
    stroke: '#f97316',
    strokeWidth: 3
  });
  canvasRef.current.add(rect).setActiveObject(rect);
  saveState(); refreshLayers();
}

// 🥚 بيضاوي فارغ
function addEllipseOutline() {
  const el = new fabric.Ellipse({
    left: 200,
    top: 180,
    rx: 80,
    ry: 40,
    fill: 'transparent',
    stroke: '#22c55e',
    strokeWidth: 3
  });
  canvasRef.current.add(el).setActiveObject(el);
  saveState(); refreshLayers();
}

// 🔺 مثلث فارغ
function addTriangleOutline() {
  const tri = new fabric.Triangle({
    left: 250,
    top: 100,
    width: 120,
    height: 120,
    fill: 'transparent',
    stroke: '#facc15',
    strokeWidth: 3
  });
  canvasRef.current.add(tri).setActiveObject(tri);
  saveState(); refreshLayers();
}

// ⬠ مضلع فارغ
function addPolygonOutline() {
  const poly = new fabric.Polygon([
    { x: 300, y: 300 },
    { x: 350, y: 350 },
    { x: 325, y: 400 },
    { x: 275, y: 400 },
    { x: 250, y: 350 }
  ], {
    fill: 'transparent',
    stroke: '#f43f5e',
    strokeWidth: 3
  });
  canvasRef.current.add(poly).setActiveObject(poly);
  saveState(); refreshLayers();
}

// ⭐ نجمة فارغة
function addStarOutline() {
  const points = [];
  const cx = 200, cy = 200;
  const outerRadius = 80;
  const innerRadius = 35;
  const spikes = 5;
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI / spikes) * i;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    points.push({ x, y });
  }
  const star = new fabric.Polygon(points, {
    left: 150,
    top: 150,
    fill: 'transparent',
    stroke: '#fbbf24',
    strokeWidth: 3
  });
  canvasRef.current.add(star).setActiveObject(star);
  saveState(); refreshLayers();
}

// ⬣ مثمن فارغ
function addOctagonOutline() {
  const sides = 8;
  const radius = 60;
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides;
    points.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) });
  }
  const oct = new fabric.Polygon(points, {
    left: 200,
    top: 200,
    fill: 'transparent',
    stroke: '#34d399',
    strokeWidth: 3
  });
  canvasRef.current.add(oct).setActiveObject(oct);
  saveState(); refreshLayers();
}

// 🔷 سداسي فارغ
function addHexagonOutline() {
  const sides = 6;
  const radius = 60;
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides;
    points.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) });
  }
  const hex = new fabric.Polygon(points, {
    left: 200,
    top: 200,
    fill: 'transparent',
    stroke: '#60a5fa',
    strokeWidth: 3
  });
  canvasRef.current.add(hex).setActiveObject(hex);
  saveState(); refreshLayers();
}

// ❤️ قلب فارغ
function addHeartOutline() {
  const path = new fabric.Path('M 272.701,142.227 C 252.533,95.878 178.743,87.307 150,135.125 C 121.257,87.307 47.467,95.878 27.299,142.227 C 3.091,197.24 75.634,258.422 150,330 C 224.366,258.422 296.909,197.24 272.701,142.227 Z', {
    left: 100,
    top: 100,
    fill: 'transparent',
    stroke: '#ef4444',
    strokeWidth: 2,
    scaleX: 0.6,
    scaleY: 0.6
  });
  canvasRef.current.add(path).setActiveObject(path);
  saveState(); refreshLayers();
}

// ◔ ربع دائرة فارغ
function addQuarterCircleOutline() {
  const path = new fabric.Path(`
    M 200 200
    A 80 80 0 0 1 280 280
    L 200 280 Z
  `, {
    fill: 'transparent',
    stroke: '#fb923c',
    strokeWidth: 3,
  });
  canvasRef.current.add(path).setActiveObject(path);
  saveState(); refreshLayers();
}




//💬 فقاعة الكلام (Speech Bubble)
function addSpeechBubble() {
  const path = new fabric.Path(`
    M 100 150
    Q 100 100 200 100
    Q 300 100 300 150
    Q 300 200 200 200
    Q 150 200 130 190
    L 100 230 L 120 190
    Q 100 180 100 150
    Z
  `, {
    fill: '#f9a8d4',
    stroke: '#333',
    strokeWidth: 2,
  });
  canvasRef.current.add(path).setActiveObject(path);
  saveState(); refreshLayers();
}

// ☁️ سحابة (Cloud)

function addCloud() {
  const path = new fabric.Path(`
    M 200 200
    C 180 180 150 170 150 200
    C 120 210 130 250 170 250
    C 170 270 220 280 240 260
    C 270 280 310 260 310 230
    C 340 220 330 180 300 180
    C 280 150 230 150 200 200
    Z
  `, {
    fill: '#bae6fd',
    stroke: '#333',
    strokeWidth: 2,
  });
  canvasRef.current.add(path).setActiveObject(path);
  saveState(); refreshLayers();
}
// ☀️ شمس
function addSun() {
  const rays = [];
  const cx = 200, cy = 200, r = 50, rayLength = 25;
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 * i) / 12;
    const x1 = cx + Math.cos(angle) * r;
    const y1 = cy + Math.sin(angle) * r;
    const x2 = cx + Math.cos(angle) * (r + rayLength);
    const y2 = cy + Math.sin(angle) * (r + rayLength);
    rays.push(new fabric.Line([x1, y1, x2, y2], { stroke: '#facc15', strokeWidth: 3 }));
  }
  const circle = new fabric.Circle({ left: cx - r, top: cy - r, radius: r, fill: '#facc15' });
  const group = new fabric.Group([...rays, circle]);
  canvasRef.current.add(group).setActiveObject(group);
  saveState(); refreshLayers();
}

// 🌙 قمر
function addMoon() {
  const crescent = new fabric.Path(`
    M 200 200
    A 60 60 0 1 1 200 80
    A 40 60 0 1 0 200 200
    Z
  `, {
    fill: '#fde68a',
    stroke: '#333',
    strokeWidth: 1.5,
  });
  canvasRef.current.add(crescent).setActiveObject(crescent);
  saveState(); refreshLayers();
}


// 🔹 دالة إضافة إطار ديناميكي


const defaultFrameColors = {
  simple: '#00b894',
  rounded: '#6c5ce7',
  dotted: '#fd79a8',
  double: '#e17055',
  shadow: '#0984e3',
  gold: '#f1c40f',
  gradient: '#ff00cc',  // يمكن استخدام لون ابتدائي لل Gradient
  neon: '#00ffff',
  glass: '#ffffff',
  decorative: '#d63031',
};




function createGradient(settings, width, height) {
  const { type, direction, colors } = settings;

  let coords;
  switch (direction) {
    case "up": coords = { x1: 0.5, y1: 1, x2: 0.5, y2: 0 }; break;
    case "down": coords = { x1: 0.5, y1: 0, x2: 0.5, y2: 1 }; break;
    case "left": coords = { x1: 1, y1: 0.5, x2: 0, y2: 0.5 }; break;
    case "right": coords = { x1: 0, y1: 0.5, x2: 1, y2: 0.5 }; break;
    default: coords = { x1: 0, y1: 0, x2: 1, y2: 1 };
  }

  return new fabric.Gradient({
    type: type,
    gradientUnits: "percentage",
    coords,
    colorStops: colors,
  });
}


function addFrame(style = "simple") {
  const canvas = canvasRef.current;
  const active = canvas.getActiveObject();
  if (!active) return alert("📌 اختر عنصرًا أولاً لوضع الإطار حوله.");

  const bound = active.getBoundingRect(); // أبعاد العنصر الفعلية في الكانفس
  const padding = 10; // المسافة بين العنصر والإطار
   // استخدم اللون الافتراضي لكل نوع إطار إذا لم يحدد المستخدم لون
  const color = frameColor || defaultFrameColors[style] || '#000';
  let frame;

  // إنشاء الإطار بحسب النمط
  switch (style) {
    case "simple":
      frame = new fabric.Rect({
        left: bound.left - padding,
        top: bound.top - padding,
        width: bound.width + padding * 2,
        height: bound.height + padding * 2,
        fill: "transparent",
        
         //stroke: frameColor, // ← اللون من المستخدم
         stroke: color,
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });
      break;

    case "rounded":
      frame = new fabric.Rect({
        left: bound.left - padding,
        top: bound.top - padding,
        width: bound.width + padding * 2,
        height: bound.height + padding * 2,
        rx: 20,
        ry: 20,
        fill: "transparent",
        stroke: color,
        strokeWidth: 3,
        selectable: false,
        evented: false,
      });
      break;

    case "dotted":
      frame = new fabric.Rect({
        left: bound.left - padding,
        top: bound.top - padding,
        width: bound.width + padding * 2,
        height: bound.height + padding * 2,
        fill: "transparent",
         stroke: color,
        strokeWidth: 2,
        strokeDashArray: [8, 6],
        selectable: false,
        evented: false,
      });
      break;

    case "double":
      const outer = new fabric.Rect({
        left: bound.left - padding,
        top: bound.top - padding,
        width: bound.width + padding * 2,
        height: bound.height + padding * 2,
        fill: "transparent",
       stroke: color,
        strokeWidth: 4,
        selectable: false,
        evented: false,
      });

      const inner = new fabric.Rect({
        left: bound.left - padding + 6,
        top: bound.top - padding + 6,
        width: bound.width + (padding - 6) * 2,
        height: bound.height + (padding - 6) * 2,
        fill: "transparent",
         stroke: color,
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });

      frame = new fabric.Group([outer, inner], { selectable: false, evented: false });
      break;

    case "shadow":
      frame = new fabric.Rect({
        left: bound.left - padding,
        top: bound.top - padding,
        width: bound.width + padding * 2,
        height: bound.height + padding * 2,
        fill: "transparent",
        stroke: color,
        strokeWidth: 2,
        shadow: {
          color: "rgba(0,0,0,0.4)",
          blur: 10,
          offsetX: 5,
          offsetY: 5,
        },
        selectable: false,
        evented: false,
      });
      break;

          // ✨ إطار ذهبي فخم
    case "gold":
      frame = new fabric.Rect({
        left: bound.left - padding,
        top: bound.top - padding,
        width: bound.width + padding * 2,
        height: bound.height + padding * 2,
        fill: "transparent",
       stroke: color,
        strokeWidth: 6,
        shadow: {
          color: "rgba(255, 215, 0, 0.6)",
          blur: 20,
          offsetX: 0,
          offsetY: 0,
        },
        selectable: false,
        evented: false,
      });
      break;

    // 🌈 إطار متدرج لوني جميل
    case "gradient":
      frame = new fabric.Rect({
        left: bound.left - padding,
        top: bound.top - padding,
        width: bound.width + padding * 2,
        height: bound.height + padding * 2,
        fill: "transparent",
        strokeWidth: 5,
        stroke: new fabric.Gradient({
          type: "linear",
          gradientUnits: "percentage",
          coords: { x1: 0, y1: 0, x2: 1, y2: 1 },
          colorStops: [
            { offset: 0, color: "#ff00cc" },
            { offset: 1, color: "#3333ff" },
          ],
        }),
        selectable: false,
        evented: false,
      });
      break;

    // 💡 إطار نيون متوهّج
    case "neon":
      frame = new fabric.Rect({
        left: bound.left - padding,
        top: bound.top - padding,
        width: bound.width + padding * 2,
        height: bound.height + padding * 2,
        fill: "transparent",
       stroke: color,
        strokeWidth: 3,
        shadow: {
          color: "#00ffff",
          blur: 30,
          offsetX: 0,
          offsetY: 0,
        },
        selectable: false,
        evented: false,
      });
      break;

    // 🪟 إطار زجاجي (شفاف مع تأثير بلور)
    case "glass":
      frame = new fabric.Rect({
        left: bound.left - padding,
        top: bound.top - padding,
        width: bound.width + padding * 2,
        height: bound.height + padding * 2,
        fill: "rgba(255,255,255,0.1)",
        stroke: color,
        strokeWidth: 2,
        shadow: {
          color: "rgba(255,255,255,0.3)",
          blur: 10,
          offsetX: 0,
          offsetY: 0,
        },
        rx: 15,
        ry: 15,
        selectable: false,
        evented: false,
      });
      break;

    // 🔳 إطار زخرفي منقط مزدوج
    case "decorative":
      const outerDec = new fabric.Rect({
        left: bound.left - padding,
        top: bound.top - padding,
        width: bound.width + padding * 2,
        height: bound.height + padding * 2,
        fill: "transparent",
        stroke: color,
        strokeWidth: 3,
        strokeDashArray: [12, 6],
      });

      const innerDec = new fabric.Rect({
        left: bound.left - padding + 6,
        top: bound.top - padding + 6,
        width: bound.width + (padding - 6) * 2,
        height: bound.height + (padding - 6) * 2,
        fill: "transparent",
         stroke: color,
        strokeWidth: 2,
        strokeDashArray: [4, 4],
      });

      frame = new fabric.Group([outerDec, innerDec], {
        selectable: false,
        evented: false,
      });
      break;


    default:
      return;
  }

  // ⚡ تجميع الإطار مع العنصر بحيث يتحركان سويًا
  const group = new fabric.Group([frame, active], {
    selectable: true,
    originX: "left",
    originY: "top",
  });

  canvas.remove(active);
  canvas.add(group);
  canvas.setActiveObject(group);
  saveState(); refreshLayers();
}

/*
function addSidebarSection() {
  const canvas = canvasRef.current;
  const canvasHeight = canvas.getHeight();
  const sidebarWidth = 220;
  const topStart = 140; // بعد الهيدر
  const padding = 20; // المسافة الداخلية من الجوانب

  // 🔹 خلفية الشريط الجانبي
  const sidebarBg = new fabric.Rect({
    left: 0,
    top: topStart,
    width: sidebarWidth,
    height: canvasHeight - topStart,
    fill: '#f3f4f6',
    selectable: true, // يمكن تغيير الحجم أو اللون أو التحريك
    hasControls: true,
    lockUniScaling: false,
  });

  // --- بيانات Sidebar ---
  const sectionData = [
    {
      title: 'Personal Info',
      content: '📍 New York, USA\n📞 +123 456 789\n✉️ johndoe@email.com',
    },
    {
      title: 'Skills',
      content: '• JavaScript\n• React\n• Node.js\n• MongoDB',
    },
    {
      title: 'Languages',
      content: '• English\n• Spanish\n• French',
    },
  ];

  const sections = [];
  let currentTop = topStart + padding;

  sectionData.forEach(section => {
    // العنوان
    const title = new fabric.Textbox(section.title, {
      left: padding,
      top: currentTop,
      fontSize: 18,
      fontWeight: 'bold',
      fill: '#111827',
      editable: true,
    });
    currentTop += title.height + 8;

    // المحتوى
    const content = new fabric.Textbox(section.content, {
      left: padding,
      top: currentTop,
      fontSize: 14,
      fill: '#374151',
      width: sidebarWidth - padding * 2,
      editable: true,
    });
    currentTop += content.height + 20; // المسافة بين الأقسام

    sections.push(title, content);
  });

  // إضافة كل شيء إلى canvas
  canvas.add(sidebarBg, ...sections);
  canvas.renderAll();

  saveState();
}
*/

/*
function addHeaderSection() {
  const canvas = canvasRef.current;
  const canvasWidth = canvas.getWidth();

  // 🔹 المستطيل الخلفي للهيدر
  const headerBg = new fabric.Rect({
    left: 0,
    top: 0,
    width: canvasWidth,
    height: 130,
    fill: '#1e3a8a', // لون أزرق احترافي
    selectable: true,
  });

  // 🔹 الاسم الكامل (في اليسار)
  const name = new fabric.Textbox('John Doe', {
    left: 150,
    top: 35,
    fontSize: 36,
    fontWeight: 'bold',
    fill: '#ffffff',
    editable: true,
  });

  // 🔹 المسمى الوظيفي (أسفل الاسم قليلًا)
  const title = new fabric.Textbox('Full Stack Developer', {
    left: 52,
    top: 80,
    fontSize: 18,
    fill: '#dbeafe',
    editable: true,
  });

  // 🔹 بيانات التواصل (في الجهة اليمنى، داخل المستطيل)
  const contactText = '📞 +123 456 789\n✉️ johndoe@email.com\n🌐 www.portfolio.com';
  const contact = new fabric.Textbox(contactText, {
    left: canvasWidth - 320,
    top: 35,
    fontSize: 16,
    fill: '#e0f2fe',
    editable: true,
    width: 260,
    textAlign: 'left',
  });

  // 🔹 خط فاصل أنيق أسفل الهيدر
  const separator = new fabric.Line([0, 130, canvasWidth, 130], {
    stroke: '#0f172a',
    strokeWidth: 2,
    selectable: false,
  });

  // ✅ إضافة كل العناصر بشكل منسق
  canvas.add(headerBg, name, title, contact, separator);
  canvas.renderAll();

  saveState();
}
*/



  

// مسار (Path)
function addPath(){
  const path = new fabric.Path('M 300 300 Q 400 200 500 300 T 700 300', { fill:'', stroke:'#7c3aed', strokeWidth:3 });
  canvasRef.current.add(path).setActiveObject(path);
  saveState(); refreshLayers();
}
  


function updateBorderProps(type, value) {
  const canvas = canvasRef.current;
  const obj = canvas.getActiveObject();
  if (!obj || obj.type !== 'group' || obj._objects.length < 2) return;

  const [img, border] = obj._objects;

  if (type === 'radius') {
    // حدث للحدود الخارجية
    border.set({ rx: value, ry: value });

    // ✳️ أنشئ clipPath جديد (أضمن أن التغيير سيطبّق فوراً)
    const newClip = new fabric.Rect({
      width: img.width != null ? img.width : img.getScaledWidth(),
      height: img.height != null ? img.height : img.getScaledHeight(),
      rx: value,
      ry: value,
      originX: 'center',
      originY: 'center',
      absolutePositioned: false,
    });

    // إن أردت أن يبقى الـ clipPath متموضعًا نسبةً للمجموعة/الصورة
    // نضع نفس transformOrigin مثل الصورة
    img.set({ clipPath: newClip });

    // ⚠️ مهم: علم الـ fabric أن الصورة والمجموعة " متسخة " ليعيد حساب الـ clipMask فورًا
    if (img.clipPath) img.clipPath.setCoords();
    img.dirty = true;
    obj.dirty = true;        // المجموعة
    img.setCoords();
    obj.setCoords();

    // إعادة الرسم فورًا
    canvas.requestRenderAll();

    // لا تحفظ حالة كل تغير أثناء السحب (يمكن الحفظ عند الانتهاء)
    return;
  } else if (type === 'color') {
    border.set({ stroke: value });
  } else if (type === 'width') {
    border.set({ strokeWidth: value });
  }

  // لباقي الخصائص نرسم فقط
  canvas.requestRenderAll();
  // احفظ مرة واحدة عند الانتهاء (مثلاً onMouseUp من السلايدر)
  // saveState();
}


function onImageFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (f) {
    const dataUrl = f.target.result;
    const canvas = canvasRef.current;
    // أثناء إضافة الصورة — اجعل الـ frame قابلاً لإعادة الاستخدام عند التحديث
fabric.Image.fromURL(dataUrl, function (img) {
  // الإطار بدون انحناء مبدئي
  const frame = new fabric.Rect({
    width: img.width,
    height: img.height,
    rx: 0,
    ry: 0,
    originX: 'center',
    originY: 'center',
    // مهم: نترك absolutePositioned=false (الافتراضي) حتى يتبع الـ clipPath تحولات العنصر
    absolutePositioned: false,
  });

  // clipPath للصورة: نمرر نسخة (clone) أو نفس الكائن
  img.set({
    clipPath: frame,
    originX: 'center',
    originY: 'center',
    left: 0,
    top: 0,
  });

  const border = new fabric.Rect({
    width: img.width,
    height: img.height,
    rx: 0,
    ry: 0,
    fill: 'transparent',
    stroke: borderColor,
    strokeWidth: borderWidth,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
  });

  const group = new fabric.Group([img, border], {
    left: 100,
    top: 100,
    hasControls: true,
    hasBorders: false,
  });

  // force coords
  img.setCoords();
  border.setCoords();
  group.setCoords();

  canvas.add(group).setActiveObject(group);
  canvas.renderAll();

  saveState();
  refreshLayers();
});


  /* fabric.Image.fromURL(dataUrl, function (img) {
      // الإطار بدون انحناء مبدئي
      const frame = new fabric.Rect({
        width: img.width,
        height: img.height,
        rx: 0, // لا يوجد انحناء افتراضي
        ry: 0,
        originX: 'center',
        originY: 'center',
      });

      // clipPath للصورة
      img.set({
        clipPath: frame,
        originX: 'center',
        originY: 'center',
        left: 0,
        top: 0,
      });

      const border = new fabric.Rect({
        width: img.width,
        height: img.height,
        rx: 0, // لا يوجد انحناء افتراضي
        ry: 0,
        fill: 'transparent',
        stroke: borderColor,
        strokeWidth: borderWidth,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
      });

      const group = new fabric.Group([img, border], {
        left: 100,
        top: 100,
        hasControls: true,
        hasBorders: false,
      });

      canvas.add(group).setActiveObject(group);
      canvas.renderAll();

      if (typeof saveState === 'function') saveState();
      if (typeof refreshLayers === 'function') refreshLayers();
    });*/
  };
  reader.readAsDataURL(file);
  e.target.value = null;
}

// ⚙️ قص الصورة داخل المجموعة (النسخة النهائية المحسّنة)
/*
function cropSelectedImage() {
  const canvas = canvasRef.current;
  const active = canvas.getActiveObject();
  if (!active || active.type !== "group" || active._objects.length < 2) {
    alert("حدد مجموعة تحتوي على صورة أولاً!");
    return;
  }

  const [img, border] = active._objects;
  const originalUrl = img._originalElement?.src || img._element?.src;
  if (!originalUrl) return alert("لم يتم العثور على مصدر الصورة.");

  // 🧩 إنشاء واجهة القص المؤقتة
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.right = "0";
  modal.style.bottom = "0";
  modal.style.background = "rgba(0,0,0,0.8)";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.flexDirection = "column";
  modal.style.zIndex = "9999";

  const inner = document.createElement("div");
  inner.style.background = "#fff";
  inner.style.padding = "10px";
  inner.style.borderRadius = "10px";
  inner.style.textAlign = "center";

  const canvasHolder = document.createElement("div");
  inner.appendChild(canvasHolder);
  modal.appendChild(inner);
  document.body.appendChild(modal);

  // ✅ إنشاء عنصر canvas فعلي بعد إضافته إلى DOM
  const canvasEl = document.createElement("canvas");
  canvasEl.width = img.width;
  canvasEl.height = img.height;
  canvasEl.style.border = "1px solid #ddd";
  canvasEl.style.cursor = "crosshair";
  canvasEl.style.display = "block";
  canvasEl.style.maxWidth = "90vw";
  canvasEl.style.maxHeight = "70vh";
  canvasHolder.appendChild(canvasEl);

  // ✅ إنشاء Fabric Canvas للقص
  const cropCanvas = new fabric.Canvas(canvasEl, {
    width: img.width,
    height: img.height,
    backgroundColor: null, // لا نريد خلفية بيضاء
    preserveObjectStacking: true,
  });

  // تحميل الصورة داخل نافذة القص
  fabric.Image.fromURL(originalUrl, (clone) => {
    clone.set({
      left: 0,
      top: 0,
      originX: "left",
      originY: "top",
      scaleX: 1,
      scaleY: 1,
      selectable: false,
    });
    cropCanvas.add(clone);

    // مستطيل القص
    const cropRect = new fabric.Rect({
      left: 50,
      top: 50,
      width: img.width / 2,
      height: img.height / 2,
      fill: "rgba(0,0,0,0.2)",
      stroke: "#00b894",
      strokeWidth: 2,
      hasControls: true,
      hasBorders: true,
      selectable: true,
    });

    cropCanvas.add(cropRect);
    cropCanvas.setActiveObject(cropRect);
    cropCanvas.renderAll();

    setTimeout(() => cropCanvas.calcOffset(), 100);

    // أزرار التحكم
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "حفظ القص";
    saveBtn.style.margin = "10px";
    saveBtn.style.padding = "8px 16px";
    saveBtn.style.background = "#00b894";
    saveBtn.style.color = "#fff";
    saveBtn.style.border = "none";
    saveBtn.style.cursor = "pointer";
    saveBtn.style.borderRadius = "8px";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "إلغاء";
    cancelBtn.style.margin = "10px";
    cancelBtn.style.padding = "8px 16px";
    cancelBtn.style.background = "#ff7675";
    cancelBtn.style.color = "#fff";
    cancelBtn.style.border = "none";
    cancelBtn.style.cursor = "pointer";
    cancelBtn.style.borderRadius = "8px";

    inner.appendChild(saveBtn);
    inner.appendChild(cancelBtn);

    // ✅ تنفيذ القص النهائي
    saveBtn.onclick = () => {
      // أخفِ الإطار مؤقتًا حتى لا يُحفظ في الصورة
      cropRect.visible = false;
      cropCanvas.renderAll();

      const rect = cropRect.getBoundingRect();
      const croppedDataURL = cropCanvas.toDataURL({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        format: "png",
        multiplier: 1,
      });

      cropRect.visible = true; // إعادة إظهاره بعد الالتقاط

      // 🟢 استبدال الصورة داخل المجموعة
      fabric.Image.fromURL(croppedDataURL, (croppedImg) => {
        // احصل على أبعاد الإطار القديم
        const bw = border.width;
        const bh = border.height;

        // اضبط الصورة الجديدة لتملأ نفس الإطار
        const scaleX = bw / croppedImg.width;
        const scaleY = bh / croppedImg.height;

        croppedImg.set({
          originX: "center",
          originY: "center",
          scaleX,
          scaleY,
        });

        // استبدال الصورة القديمة بالجديدة داخل المجموعة
        active.remove(img);
        active._objects.unshift(croppedImg);

        // تحديث العرض
        canvas.requestRenderAll();
        saveState();
        refreshLayers();
      });

      document.body.removeChild(modal);
    };

    // 🔴 إلغاء
    cancelBtn.onclick = () => {
      document.body.removeChild(modal);
    };
  });
}
*/

// ⚙️ قص الصورة داخل المجموعة (إصدار يجعل المجموعة تتكيّف مع الأبعاد الجديدة)
function cropSelectedImage() {
  const canvas = canvasRef.current;
  const active = canvas.getActiveObject();

  if (!active || active.type !== "group" || active._objects.length < 2) {
   
    toast.warning(' حدد مجموعة تحتوي على صورة أولاً!');
    return;
  }

  const [img, border] = active._objects;

  // ✅ استخدم الصورة الأصلية دائمًا
  if (!img._originalSrc) {
    img._originalSrc = img._originalElement?.src || img._element?.src;
  }
  const originalUrl = img._originalSrc;
  if (!originalUrl) return  toast.warning('  لم يتم العثور على مصدر الصورة الأصلي. ');

  // 🧩 إنشاء نافذة القص
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    position: "fixed",
    inset: "0",
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    zIndex: "9999",
  });

  const inner = document.createElement("div");
  Object.assign(inner.style, {
    background: "#fff",
    padding: "10px",
    borderRadius: "10px",
    textAlign: "center",
  });

  const canvasHolder = document.createElement("div");
  inner.appendChild(canvasHolder);
  modal.appendChild(inner);
  document.body.appendChild(modal);

  // ✅ Canvas داخلي للقص
  const canvasEl = document.createElement("canvas");
  Object.assign(canvasEl.style, {
    border: "1px solid #ddd",
    cursor: "crosshair",
    display: "block",
    maxWidth: "90vw",
    maxHeight: "70vh",
  });
  canvasHolder.appendChild(canvasEl);

  const cropCanvas = new fabric.Canvas(canvasEl, {
    preserveObjectStacking: true,
  });

  // تحميل الصورة الأصلية للقص
  fabric.Image.fromURL(originalUrl, (clone) => {
    clone.set({
      left: 0,
      top: 0,
      originX: "left",
      originY: "top",
      selectable: false,
    });

    cropCanvas.setWidth(clone.width);
    cropCanvas.setHeight(clone.height);
    cropCanvas.add(clone);

    // مستطيل القص الافتراضي
    const cropRect = new fabric.Rect({
      left: 50,
      top: 50,
      width: clone.width / 2,
      height: clone.height / 2,
      fill: "rgba(0,0,0,0.2)",
      stroke: "#00b894",
      strokeWidth: 2,
    });
    cropCanvas.add(cropRect);
    cropCanvas.setActiveObject(cropRect);

    // أزرار الحفظ والإلغاء
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "حفظ القص";
    Object.assign(saveBtn.style, {
      margin: "10px",
      padding: "8px 16px",
      background: "#00b894",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      borderRadius: "8px",
    });

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "إلغاء";
    Object.assign(cancelBtn.style, {
      margin: "10px",
      padding: "8px 16px",
      background: "#ff7675",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      borderRadius: "8px",
    });

    inner.appendChild(saveBtn);
    inner.appendChild(cancelBtn);

    // ✅ حفظ القص
    saveBtn.onclick = () => {
       cropRect.visible = false; // إخفاء الإطار مؤقتًا
  cropCanvas.renderAll();
      const rect = cropRect.getBoundingRect();

      const croppedDataURL = cropCanvas.toDataURL({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        format: "png",
      });
       cropRect.visible = true; // إعادة إظهاره إن أردت بعد الحفظ
  cropCanvas.renderAll();

      // 🖼️ استبدال الصورة داخل المجموعة
      fabric.Image.fromURL(croppedDataURL, (croppedImg) => {
        croppedImg._originalSrc = originalUrl; // نحافظ على الصورة الأصلية دائمًا

        const groupCenter = active.getCenterPoint();

        croppedImg.set({
          originX: "center",
          originY: "center",
          left: 0,
          top: 0,
        });

        const newBorder = new fabric.Rect({
          width: croppedImg.width,
          height: croppedImg.height,
          rx: border.rx || 0,
          ry: border.ry || 0,
          fill: "transparent",
          stroke: border.stroke,
          strokeWidth: border.strokeWidth,
          originX: "center",
          originY: "center",
          selectable: false,
          evented: false,
        });

        const newGroup = new fabric.Group([croppedImg, newBorder], {
          left: groupCenter.x,
          top: groupCenter.y,
          originX: "center",
          originY: "center",
          hasControls: true,
          hasBorders: false,
        });

        canvas.remove(active);
        canvas.add(newGroup).setActiveObject(newGroup);
        canvas.renderAll();

        saveState();
        refreshLayers();
      });

      document.body.removeChild(modal);
    };

    cancelBtn.onclick = () => document.body.removeChild(modal);
  });
}








  // duplicate / delete
  function duplicateActive(){ const o = canvasRef.current.getActiveObject(); if(!o) return; o.clone(function(cl){ cl.set({ left: o.left + 20, top: o.top + 20 }); canvasRef.current.add(cl).setActiveObject(cl); saveState(); refreshLayers(); }); }
  function deleteActive(){ const o = canvasRef.current.getActiveObject(); if(!o) return; canvasRef.current.remove(o); saveState(); refreshLayers(); }

  // ordering and flip
  function bringForward(){ const o = canvasRef.current.getActiveObject(); if(o){ canvasRef.current.bringForward(o); saveState(); refreshLayers(); } }
  function sendBackward(){ const o = canvasRef.current.getActiveObject(); if(o){ canvasRef.current.sendBackwards(o); saveState(); refreshLayers(); } }
  function flipX(){ const o = canvasRef.current.getActiveObject(); if(o){ o.toggle('flipX'); canvasRef.current.requestRenderAll(); saveState(); } }

  // sync props (reads properties from active object into controls)
  function syncProperties(){
    const o = canvasRef.current.getActiveObject();
    if(!o){
      clearProperties();
      return;
    }
    setFillColor(o.fill || '#000000');
    setOpacity(o.opacity != null ? o.opacity : 1);

    // Only for text-like objects
    if(o.type === 'i-text' || o.type === 'textbox' || o.type === 'text'){
      setFontFamily(o.fontFamily || 'Almarai');
      setFontSize(o.fontSize || 36);
      setTextString(o.text || '');
      setCharSpacing(o.charSpacing != null ? o.charSpacing : 0);
      setLineHeight(o.lineHeight != null ? o.lineHeight : 1.16);
      setIsUnderline(!!o.underline);
      setIsLinethrough(!!o.linethrough);
      setIsItalic( (o.fontStyle || '').toLowerCase() === 'italic' );
      setIsBold( (o.fontWeight && (o.fontWeight === 'bold' || parseInt(o.fontWeight,10) >= 700)) ? true : false );
     
    } else {
      // reset text-controls for non-text selection
      setTextString('');

    }


    // حفظ العنصر المحدد
setSelected(o);

// خصائص الإطار إذا كان العنصر مجموعة أو له stroke
if (o.type === 'group' && o._objects?.length > 0) {
  const border = o._objects.find(obj => obj.stroke || obj.fill);
  if (border) {
    setBorderRadius(border.rx || 0);
    setBorderColor(border.stroke || '#000');
    setBorderWidth(border.strokeWidth || 0);
  }
} else if (o.stroke) {
  setBorderRadius(o.rx || 0);
  setBorderColor(o.stroke || '#000');
  setBorderWidth(o.strokeWidth || 0);
}

    


    







  }


  function clearProperties(){
     setSelected(null); 
    setTextString('');
    setCharSpacing(0);
    setLineHeight(1.16);
    setIsUnderline(false);
    setIsLinethrough(false);
    setIsItalic(false);
    setIsBold(false);
   
  }

  // apply props to active object (text-only props applied only if object is text-like)
  function applyPropsToActive(){
    const o = canvasRef.current.getActiveObject();
    if(!o) return;

    // Text-like properties
    if(o.type === 'i-text' || o.type === 'textbox' || o.type === 'text'){
      // fontWeight/fontStyle expects strings for many fonts
      let fontWeightVal = isBold ? 'bold' : '';
      let fontStyleVal = isItalic ? 'italic' : '';

      // apply text transformations from textString (note: uppercase/lowercase handled via dedicated buttons)
      o.set({
        fontFamily,
        fontSize: parseInt(fontSize,10) || 36,
        text: textString,
        charSpacing: parseInt(charSpacing,10) || 0,
        lineHeight: parseFloat(lineHeight) || 1.16,
        underline: !!isUnderline,
        linethrough: !!isLinethrough,
        fontStyle: fontStyleVal,
        fontWeight: fontWeightVal,
       
      });
    }

    // common props
    o.set({ fill: fillColor, opacity: parseFloat(opacity) });
    canvasRef.current.requestRenderAll();
    saveState(); refreshLayers();
  }

  // Quick functions for case transform (uppercase / lowercase)
  function transformActiveToUpper(){
    const o = canvasRef.current.getActiveObject();
    if(!o) return;
    if(o.type === 'i-text' || o.type === 'textbox' || o.type === 'text'){
      const newText = (o.text || '').toUpperCase();
      o.set({ text: newText });
      setTextString(newText);
      canvasRef.current.requestRenderAll();
      saveState(); refreshLayers();
    }
  }
  function transformActiveToLower(){
    const o = canvasRef.current.getActiveObject();
    if(!o) return;
    if(o.type === 'i-text' || o.type === 'textbox' || o.type === 'text'){
      const newText = (o.text || '').toLowerCase();
      o.set({ text: newText });
      setTextString(newText);
      canvasRef.current.requestRenderAll();
      saveState(); refreshLayers();
    }
  }

  // toggle functions for underline/strike/italic/bold
  function toggleUnderline(){
    const o = canvasRef.current.getActiveObject(); if(!o) return;
    if(o.type === 'i-text' || o.type === 'textbox' || o.type === 'text'){
      const newVal = !isUnderline;
      setIsUnderline(newVal);
      o.set({ underline: newVal });
      canvasRef.current.requestRenderAll();
      saveState(); refreshLayers();
    }
  }
  function toggleLinethrough(){
    const o = canvasRef.current.getActiveObject(); if(!o) return;
    if(o.type === 'i-text' || o.type === 'textbox' || o.type === 'text'){
      const newVal = !isLinethrough;
      setIsLinethrough(newVal);
      o.set({ linethrough: newVal });
      canvasRef.current.requestRenderAll();
      saveState(); refreshLayers();
    }
  }
  function toggleItalic(){
    const o = canvasRef.current.getActiveObject(); if(!o) return;
    if(o.type === 'i-text' || o.type === 'textbox' || o.type === 'text'){
      const newVal = !isItalic;
      setIsItalic(newVal);
      o.set({ fontStyle: newVal ? 'italic' : '' });
      canvasRef.current.requestRenderAll();
      saveState(); refreshLayers();
    }
  }
  function toggleBold(){
    const o = canvasRef.current.getActiveObject(); if(!o) return;
    if(o.type === 'i-text' || o.type === 'textbox' || o.type === 'text'){
      const newVal = !isBold;
      setIsBold(newVal);
      o.set({ fontWeight: newVal ? 'bold' : '' });
      canvasRef.current.requestRenderAll();
      saveState(); refreshLayers();
    }
  }


  //لتشغيل زري تكبير وتصغير الاحرف في زر واحد
  function toggleCase() {
  const o = canvasRef.current.getActiveObject();
  if (!o || (o.type !== 'textbox' && o.type !== 'i-text' && o.type !== 'text')) return;

  const currentText = o.text;
  if (!currentText) return;

  // 🔁 التحقق من الحالة الحالية للنص
  const isUpper = currentText === currentText.toUpperCase();

  if (isUpper) {
    transformActiveToLower(); // 🔠 كان كبير → نحوله لصغير
  } else {
    transformActiveToUpper(); // 🔡 كان صغير → نحوله لكبير
  }
}



  // -----------------------------
  // LIST FEATURES
 


  // -----------------------------
  // end LIST FEATURES
  // -----------------------------

  // export
  function exportPng(){ const dataURL = canvasRef.current.toDataURL({ format:'png', multiplier:2 }); const link = document.createElement('a'); link.href = dataURL; link.download = 'design.png'; link.click(); }
  function exportSvg(){ const svg = canvasRef.current.toSVG(); const blob = new Blob([svg], { type: 'image/svg+xml' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'design.svg'; a.click(); URL.revokeObjectURL(url); }



  // 📤 تصدير كـ JPG / JPEG
function exportJpg() {
  const dataURL = canvasRef.current.toDataURL({
    format: 'jpeg',
    quality: 0.9, // جودة الصورة (من 0 إلى 1)
    multiplier: 2, // دقة التصدير (كلما زادت زادت الجودة والحجم)
  });

  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'design.jpg';
  link.click();
}

// 📤 تصدير كـ PDF

function exportPdf() {
  const canvas = canvasRef.current;
  if (!canvas) return;

  // نحصل على أبعاد القماش الفعلية
  const width = canvas.width;
  const height = canvas.height;

  // نحصل على الصورة بجودة عالية
  const dataURL = canvas.toDataURL({
    format: "png",
    multiplier: 3, // زيادة الجودة (يمكنك تعديل الرقم)
  });

  // إنشاء ملف PDF بنفس أبعاد القماش بالضبط
  const pdf = new jsPDF({
    orientation: width > height ? "l" : "p", // تلقائي حسب الاتجاه
    unit: "px", // استخدم البكسل بدل النقاط
    format: [width, height],
  });

  // منع التحجيم — نضيف الصورة بنفس المقاسات
  pdf.addImage(dataURL, "PNG", 0, 0, width, height);

  // حفظ الملف
  pdf.save("design.pdf");
}


function exportPdfNormal() { // للمجاني
  exportPdfWithQuality(1);
}

function exportPdfHD() { // للمستخدم المدفوع
  exportPdfWithQuality(3);
}

function exportPdfUltraHD() { // خطة Premium
  exportPdfWithQuality(4);
}

function exportPdf4K() { // خطة Ultra
  exportPdfWithQuality(5);
}

function exportPdfWithQuality(multiplier) {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const width = canvas.width;
  const height = canvas.height;

  const dataURL = canvas.toDataURL({
    format: "png",
    multiplier: multiplier,
  });

  const pdf = new jsPDF({
    orientation: width > height ? "l" : "p",
    unit: "px",
    format: [width, height],
  });

  pdf.addImage(dataURL, "PNG", 0, 0, width, height);
  pdf.save("design.pdf");
}


  // save/load JSON project
 
 
  // add image by URL
  function addImageByUrl(){ const url = prompt('أدخل رابط الصورة (URL)'); if(!url) return; fabric.Image.fromURL(url, function(img){ img.set({ left:100, top:100, scaleX:0.6, scaleY:0.6 }); canvasRef.current.add(img).setActiveObject(img); saveState(); refreshLayers(); }); }

  // resize stage
  function applyStageSize(){ const w = parseInt(stageW,10) || 800; const h = parseInt(stageH,10) || 600; canvasRef.current.setWidth(w); canvasRef.current.setHeight(h); const container = document.getElementById('canvasContainer'); container.style.width = w + 'px'; container.style.height = h + 'px'; canvasRef.current.calcOffset(); canvasRef.current.requestRenderAll(); saveState(); }

  // grid draw
  function drawGrid(){ if(!canvasRef.current) return; if(!gridVisible){ canvasRef.current.setBackgroundImage(null, canvasRef.current.renderAll.bind(canvasRef.current)); return; }
    const w = canvasRef.current.getWidth(); const h = canvasRef.current.getHeight(); const bg = document.createElement('canvas'); bg.width = w; bg.height = h; const ctx = bg.getContext('2d'); ctx.strokeStyle = 'rgba(0,0,0,0.06)'; ctx.lineWidth = 1; for(let i=0;i<w;i+=gridSize){ ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,h); ctx.stroke(); } for(let j=0;j<h;j+=gridSize){ ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(w,j); ctx.stroke(); } const data = bg.toDataURL('image/png'); canvasRef.current.setBackgroundImage(data, canvasRef.current.renderAll.bind(canvasRef.current)); }

  useEffect(()=>{ drawGrid(); }, [gridVisible, gridSize]);

  // undo/redo
  /*
  function undo(){ if(historyIndexRef.current > 0){ historyIndexRef.current--; loadState(historyIndexRef.current); } }
  function redo(){ if(historyIndexRef.current < historyRef.current.length - 1){ historyIndexRef.current++; loadState(historyIndexRef.current); } }
*/
  // zoom handling via container transform
  useEffect(()=>{ const el = document.getElementById('canvasContainer'); if(el){ el.style.transform = `scale(${zoomLevel})`; el.style.transformOrigin = 'center center'; } }, [zoomLevel]);

  // bring layer selection from list
  function selectObjectByIndex(idxFromTop){ const objs = canvasRef.current.getObjects().slice().reverse(); const o = objs[idxFromTop]; if(o){ canvasRef.current.setActiveObject(o); canvasRef.current.requestRenderAll(); } }

  // layers list helper
  const getLayers = () => { if(!canvasRef.current) return []; return canvasRef.current.getObjects().slice().reverse(); };

  // change background color
  function onBgColorChange(c){ setBgColor(c); if(canvasRef.current){ canvasRef.current.setBackgroundColor(c, canvasRef.current.requestRenderAll.bind(canvasRef.current)); saveState(); } }

  // keyboard shortcuts: ctrl+z ctrl+y handled earlier





  return (
    <div className="editor-root">
        
       

      <header className="editor-header">
  <div className="brand">  CVFlow </div>

  <div className="spacer" />

  {/* أزرار سطح المكتب */}
  <div className="toolbar desktop-only">

    <div ref={menuRef} style={{ position: "relative", display: "inline-block",  }}>
  
  {/* زر فتح وإغلاق القائمة */}
  <button
    onClick={() => setOpenExportMenu(!openExportMenu)}
    style={{ padding: "8px 14px", cursor: "pointer" }}
  >
          {t("editor.toolbar.exportPdfBtm")} 
  </button>

  {/* القائمة المنسدلة */}
  {openExportMenu && (
    <div
      style={{
        position: "absolute",
        top: "45px",
        left: "0",
       
        background: "#000000",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        width: "240px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}
    >
      {/* ------------------- زر الجودة العادية ------------------- */}
      <button onClick={exportPdfNormal}>
        {t("editor.toolbar.exportPdfNormal")}
      </button>

      {/* ------------------- زر HD ------------------- */}
      {userPlan === "pro" || userPlan === "premium" ? (
        <button onClick={exportPdfHD}>
          {t("editor.toolbar.exportPdfHD")}
        </button>
      ) : (
        <button onClick={() => toast.warning("قم بالترقية للحصول على جودة HD")}>
          {t("editor.toolbar.exportPdfHD")}
        </button>
      )}

      {/* ------------------- زر Ultra HD ------------------- */}
      {userPlan === "premium" ? (
        <button onClick={exportPdfUltraHD}>
          {t("editor.toolbar.exportPdfUltraHD")}
        </button>
      ) : (
        <button
          onClick={() =>
            toast.warning("قم بالترقية للحصول على جودة تحميل PDF Ultra HD")
          }
        >
          {t("editor.toolbar.exportPdfUltraHD")}
        </button>
      )}

      {/* ------------------- زر 4K ------------------- */}
      {userPlan === "ultra" ? (
        <button onClick={exportPdf4K}>
          {t("editor.toolbar.exportPdf4K")}
        </button>
      ) : (
        <button
          onClick={() =>
            toast.warning("قم بالترقية للحصول على جودة تحميل PDF 4K")
          }
        >
          {t("editor.toolbar.exportPdf4K")}
        </button>
      )}
    </div>
  )}

</div>














  
    <button onClick={exportPng} className="mini">{t("editor.toolbar.exportPng")}</button>
    <button onClick={exportSvg} className="mini">{t("editor.toolbar.exportSvg")}</button>
    <button onClick={exportJpg} className="mini">{t("editor.toolbar.exportJpg")}</button>
    <button onClick={exportPdf} className="mini">{t("editor.toolbar.exportPdf")}</button>

      <button onClick={undo} className="mini">{t("editor.toolbar.undo")}</button>
    <button onClick={redo} className="mini">{t("editor.toolbar.redo")}</button>
    <button onClick={() => saveProjectToDB(projectName)} className="mini save">
      {t("editor.toolbar.saveProject")} 💾
    </button>
  </div>


  <button className="panel-toggle mobile-only" onClick={() => setLeftOpen(!leftOpen)}><FaPaintBrush size={24} color="#fff" />
</button>
<button className="panel-toggle mobile-only" onClick={() => setRightOpen(!rightOpen)}><LuFileCog size={28} color="#fff" />

</button>


  {/* زر الموبايل */}
  <button className="hamburger mobile-only" onClick={() => setMenuOpen(!menuOpen)}>
    ☰
  </button>

  {/* القائمة المنسدلة للموبايل */}
  <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
    <button onClick={undo}>{t("editor.toolbar.undo")}</button>
    <button onClick={redo}>{t("editor.toolbar.redo")}</button>
    <button onClick={exportPng}>{t("editor.toolbar.exportPng")}</button>
    <button onClick={exportSvg}>{t("editor.toolbar.exportSvg")}</button>
    <button onClick={exportJpg}>{t("editor.toolbar.exportJpg")}</button>
    <button onClick={exportPdf}>{t("editor.toolbar.exportPdf")}</button>
    <button onClick={() => saveProjectToDB(projectName)} className="save">
      {t("editor.toolbar.saveProject")} 💾
    </button>
  </div>
      </header>



      



        {/*للنص */}
        {selected && selected.type === 'textbox' && (
       <div class="toolbart">
         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  {/* زر تصغير */}
  {/* زر تصغير */}
<button
  className="decrease-font-button"
  onClick={() => {
    const newSize = Math.max(8, fontSize - 1);
    setFontSize(newSize);

    const o = canvasRef.current.getActiveObject();
    if (o && (o.type === 'textbox' || o.type === 'i-text' || o.type === 'text')) {
      o.set('fontSize', newSize);
      canvasRef.current.requestRenderAll();
    }
  }}
 
>
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    height="20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48zm0 368a160 160 0 1 1 160-160 160.18 160.18 0 0 1-160 160z"></path>
    <path d="M352 240H160a16 16 0 0 0 0 32h192a16 16 0 0 0 0-32z"></path>
  </svg>
  <span className="tooltip"> {t("editor.textToolbar.decreaseFont")}</span>
</button>


  {/* حقل إدخال الرقم */}
  <input
    type="number"
    min="8"
    max="200"
    step="1"
    value={fontSize}
    onChange={(e) => {
      const newSize = parseFloat(e.target.value);
      if (isNaN(newSize)) return;
      setFontSize(newSize);
      const o = canvasRef.current.getActiveObject();
      if (o && (o.type === 'textbox' || o.type === 'i-text' || o.type === 'text')) {
        o.set('fontSize', newSize);
        canvasRef.current.requestRenderAll();
      }
    }}
    style={{
      width: '60px',
      textAlign: 'center',
      padding: '4px',
      borderRadius: '6px',
      border: '1px solid #ccc',
    }}
  />



 

  {/* زر تكبير */}
 
  <button
  className="increase-font-button"
  onClick={() => {
    const newSize = Math.min(200, fontSize + 1);
    setFontSize(newSize);

    const o = canvasRef.current.getActiveObject();
    if (o && (o.type === 'textbox' || o.type === 'i-text' || o.type === 'text')) {
      o.set('fontSize', newSize);
      canvasRef.current.requestRenderAll();
    }
  }}
  
>
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    height="20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48zm0 368a160 160 0 1 1 160-160 160.18 160.18 0 0 1-160 160z"></path>
    <path d="M368 256h-96v-96a16 16 0 0 0-32 0v96h-96a16 16 0 0 0 0 32h96v96a16 16 0 0 0 32 0v-96h96a16 16 0 0 0 0-32z"></path>
  </svg>
  <span className="tooltip">{t("editor.textToolbar.increaseFont")}</span>
</button>

</div>
        <button class="duplicate-button" onClick={duplicateActive} >
    <svg stroke="currentColor" fill="currentColor" stroke-width="0"
      viewBox="0 0 512 512" height="20" width="20"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M112 80h288V56a24 24 0 0 0-24-24H66a34 34 0 0 0-34 34v310a24 24 0 0 0 24 24h24V112a32 32 0 0 1 32-32z"></path>
      <path d="M456 112H136a24 24 0 0 0-24 24v320a24 24 0 0 0 24 24h320a24 24 0 0 0 24-24V136a24 24 0 0 0-24-24zm-64 200h-80v80h-32v-80h-80v-32h80v-80h32v80h80z"></path>
    </svg>
    <span class="tooltip"> {t("editor.textToolbar.duplicate")}</span>
  </button>

   {/* 🔁 زر انعكاس العنصر */}
<button className="flip-button" onClick={flipX}>
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    height="20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* أيقونة الانعكاس (انعكاس أفقي) */}
    <path d="M256 32C132.3 32 32 132.3 32 256s100.3 224 224 224 224-100.3 224-224S379.7 32 256 32zm0 416c-106 0-192-86-192-192S150 64 256 64s192 86 192 192-86 192-192 192z" />
    <path d="M352 176H256v64h-32V144h128zM160 336h96v-64h32v96H160z" />
  </svg>
  <span className="tooltip"> {t("editor.textToolbar.flipX")}</span>
</button>

 
{/* الشفافية */}


<div style={{ position: "relative", display: "inline-block" }} ref={opacityRef}>
  <button
    className={`tool-btn ${showOpacityControl ? "active" : ""}`}
    onClick={() => setShowOpacityControl(!showOpacityControl)}
 
  >
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* أيقونة تدل على الشفافية */}
      <path
        d="M12 4a8 8 0 108 8 8 8 0 00-8-8zm0 14a6 6 0 010-12z"
        opacity="0.3"
      />
      <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 018-8 8 8 0 01-8 8z" />
    </svg>
    <span class="tooltip"> {t("editor.textToolbar.opacity")}</span>
  </button>

  {/* نافذة التحكم المنبثقة */}
  {showOpacityControl && (
    <div
      className="opacity-popover"
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px 12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        minWidth: "220px",
        zIndex: 9999,
      }}
    >
      <label
        style={{
          fontSize: "13px",
          color: "#444",
          marginBottom: "6px",
          display: "block",
        }}
      >
      {t("editor.textToolbar.opacity")}
      </label>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        


         {/* شريط التحكم */}
             <input
    id="opacityRange"
    type="range"
    min="0"
    max="100"
    step="1"
    value={opacity * 100}
    onChange={(e) => {
      const newOpacity = parseFloat(e.target.value) / 100;
      setOpacity(newOpacity);

      const o = canvasRef.current.getActiveObject();
      if (o) {
        o.set('opacity', newOpacity);
        canvasRef.current.requestRenderAll();
      }
    }}
    style={{ flex: 1 }}
  />
  <input
      type="number"
      min="0"
      max="100"
      step="1"
      value={(opacity * 100).toFixed(0)}
      onChange={(e) => {
        let val = parseFloat(e.target.value);
        if (isNaN(val)) val = 0;
        if (val < 0) val = 0;
        if (val > 100) val = 100;

        const normalized = val / 100;
        setOpacity(normalized);

        const o = canvasRef.current.getActiveObject();
        if (o) {
          o.set('opacity', normalized);
          canvasRef.current.requestRenderAll();
        }
      }}
      style={{
        width: '60px',
        textAlign: 'center',
      }}
    />
        <span style={{ fontSize: "12px", color: "#555" }}>%</span>
      </div>
    </div>
  )}
</div>





 

  
   <div class="color-button">
 <input
  type="color"
  value={fillColor}
  style={{
    opacity: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  }}
  onChange={(e) => {
    const color = e.target.value;
    setFillColor(color);

    const o = canvasRef.current.getActiveObject();
    if (o && (o.type === 'textbox' || o.type === 'i-text' || o.type === 'text')) {
      o.set('fill', color);
      canvasRef.current.requestRenderAll();
    }
  }}
  onMouseUp={() => saveState()}
/>

  <svg stroke="currentColor" fill="currentColor" stroke-width="0"
    viewBox="0 0 24 24" height="20" width="20"
    xmlns="http://www.w3.org/2000/svg">
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M2 20h20v4H2v-4zm3.49-3h2.42l1.27-3.58h5.65L16.09 17h2.42L13.25 3h-2.5L5.49 17zm4.42-5.61 2.03-5.79h.12l2.03 5.79H9.91z"></path>
  </svg>
  <span class="tooltip"> {t("editor.textToolbar.textColor")}</span>
   </div>
 


  <div class="bg-button">
    <input type="color" value={textBgColor}
    style={{
    opacity: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  }}
     onChange={e=>{
               setTextBgColor(e.target.value);
               const o = canvasRef.current.getActiveObject();
               if(o && (o.type==='textbox' || o.type==='i-text' || o.type==='text')){
               o.set({ textBackgroundColor: e.target.value });
               canvasRef.current.requestRenderAll();
               saveState();
               }
              }}/>
    <svg stroke="currentColor" fill="none" stroke-width="2"
      viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"
      height="20" width="20"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M4 8l4 -4"></path>
      <path d="M14 4l-10 10"></path>
      <path d="M4 20l16 -16"></path>
      <path d="M20 10l-10 10"></path>
      <path d="M20 16l-4 4"></path>
    </svg>
    <span class="tooltip"> {t("editor.textToolbar.backgroundColor")}</span>
  </div>



  
   {/* غامق */}
  <button className="tool-btn" onClick={toggleBold} >
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0"
      viewBox="0 0 24 24" height="20" width="20"
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M15.6 10.79A4.5 4.5 0 0012 2H6v20h8a4.5 4.5 0 001.6-8.79zM10 6h2a2 2 0 010 4h-2V6zm3 12H10v-4h3a2 2 0 010 4z" />
    </svg>
    <span class="tooltip"> {t("editor.textToolbar.bold")}</span>
  </button>
  {/* حروف صغيرة / كبيرة */}


<button className="tool-btn" onClick={toggleCase} >
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0"
    viewBox="0 0 24 24" height="20" width="20"
    xmlns="http://www.w3.org/2000/svg">
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M3 17h2.5l.71-2h4.58l.71 2H14L9.62 6H7.38L3 17zm4.15-4l1.35-3.67L9.85 13H7.15zM20 14v-4h-2v4h-2v2h2v2h2v-2h2v-2h-2z" />
  </svg>
  <span class="tooltip"> {t("editor.textToolbar.toggleCase")}</span>
</button>















<button 
  className="tool-btn" 
  onClick={(e) => {
    e.stopPropagation(); // يمنع إغلاقها فورًا عند الضغط على الزر
    setShowSpacingPanel(!showSpacingPanel);
  }} 
 
  style={{ position: 'relative' }} // للسماح للوحة أن تكون منبثقة بالنسبة له
>
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0"
    viewBox="0 0 24 24" height="20" width="20"
    xmlns="http://www.w3.org/2000/svg">
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M5 4v2h2.59L3 10.59 4.41 12 9 7.41V10h2V4H5zm14 16v-2h-2.59L21 13.41 19.59 12 15 16.59V14h-2v6h6zM7 19h10v-2H7v2z" />
  </svg>
 <span class="tooltip">{t("editor.textToolbar.letterSpacing")}</span>

  {/* لوحة منبثقة */}
  {showSpacingPanel && (
    <div 
      onClick={(e) => e.stopPropagation()} 
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        zIndex: 999,
        marginTop: 4,
        padding: 8,
        width: 220,
        border: '1px solid #ccc',
        borderRadius: 6,
        background: '#fff',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
      }}
    >
      {/* Letter spacing */}
      <div>
        <label>{t("editor.textToolbar.letterSpacing")}</label>
        <input type="range" min="-200" max="500" step="5" value={charSpacing} onChange={e=>{
          setCharSpacing(e.target.value);
          const o = canvasRef.current.getActiveObject();
          if(o && (o.type === 'i-text' || o.type === 'textbox' || o.type === 'text')){
            o.set({ charSpacing: parseInt(e.target.value,10) || 0 });
            canvasRef.current.requestRenderAll();
          }
        }} onMouseUp={applyPropsToActive} />
        <input type="number" className="mini" value={charSpacing} onChange={e=>setCharSpacing(e.target.value)} onBlur={applyPropsToActive} />
      </div>

      {/* Line height */}
      <div style={{marginTop:8}}>
        <label>  {t("editor.textToolbar.lineHeight")}</label>
        <input type="range" min="0.5" max="3" step="0.01" value={lineHeight} onChange={e=>{
          setLineHeight(e.target.value);
          const o = canvasRef.current.getActiveObject();
          if(o && (o.type === 'i-text' || o.type === 'textbox' || o.type === 'text')){
            o.set({ lineHeight: parseFloat(e.target.value) || 1.16 });
            canvasRef.current.requestRenderAll();
          }
        }} onMouseUp={applyPropsToActive} />
        <input type="number" className="mini" value={lineHeight} onChange={e=>setLineHeight(e.target.value)} onBlur={applyPropsToActive} step="0.01" />
      </div>
    </div>
  )}
</button>






   {/* مائل */}
  <button className="tool-btn" onClick={toggleItalic} >
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0"
      viewBox="0 0 24 24" height="20" width="20"
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M10 4v3h2.21l-3.42 10H6v3h8v-3h-2.21l3.42-10H18V4z" />
    </svg>
   <span class="tooltip"> {t("editor.textToolbar.italic")}</span>
  </button>
   {/* تحته خط */}
  <button className="tool-btn" onClick={toggleUnderline} >
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0"
      viewBox="0 0 24 24" height="20" width="20"
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M12 17a5 5 0 005-5V4h-2v8a3 3 0 01-6 0V4H7v8a5 5 0 005 5zM5 20v2h14v-2H5z" />
    </svg>
    <span class="tooltip"> {t("editor.textToolbar.underline")}</span>
  </button>

  {/* خط في الوسط (تشطيب) */}
<button  onClick={toggleLinethrough} className={`mini ${isLinethrough ? 'active' : ''}`} >
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0"
    viewBox="0 0 24 24" height="20" width="20"
    xmlns="http://www.w3.org/2000/svg">
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M5 11h14v2H5v-2zm7-7c-3.31 0-6 1.79-6 4h2c0-1.1 1.79-2 4-2s4 .9 4 2c0 1.1-.9 2-2 2H8v2h8v-2h-2c1.1 0 2-.9 2-2 0-2.21-2.69-4-6-4zm-4 10v2c0 2.21 2.69 4 6 4s6-1.79 6-4h-2c0 1.1-1.79 2-4 2s-4-.9-4-2v-2h-2z" />
  </svg>
  <span class="tooltip"> {t("editor.textToolbar.linethrough")}</span>
</button>


  {/* محاذاة لليسار */}
  <button   className={textAlign === 'left' ? 'active' : ''}
    onClick={() => applyTextAlign('left')}>
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0"
      viewBox="0 0 24 24" height="20" width="20"
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M3 3h18v2H3V3zm0 4h12v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z" />
    </svg>
    <span class="tooltip">  {t("editor.textToolbar.alignLeft")}</span>
  </button>

  {/* محاذاة في المنتصف */}
  <button   className={textAlign === 'center' ? 'active' : ''}
    onClick={() => applyTextAlign('center')}>
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0"
      viewBox="0 0 24 24" height="20" width="20"
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M4 3h16v2H4V3zm2 4h12v2H6V7zm-4 4h20v2H2v-2zm2 4h12v2H4v-2zm-2 4h16v2H2v-2z" />
    </svg>
    <span class="tooltip">  {t("editor.textToolbar.alignCenter")}</span>
  </button>

  {/* محاذاة لليمين */}
  <button   className={textAlign === 'right' ? 'active' : ''}
    onClick={() => applyTextAlign('right')}>
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0"
      viewBox="0 0 24 24" height="20" width="20"
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M3 3h18v2H3V3zm6 4h12v2H9V7zm-6 4h18v2H3v-2zm6 4h12v2H9v-2zm-6 4h18v2H3v-2z" />
    </svg>
    <span class="tooltip"> {t("editor.textToolbar.alignRight")}</span>
  </button>
  <button class="delete-button" onClick={deleteActive} >
    <svg stroke="currentColor" fill="currentColor" stroke-width="0"
      viewBox="0 0 24 24" height="20" width="20"
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
    </svg>
    <span class="tooltip"> {t("editor.textToolbar.delete")}</span>
  </button>


      </div>
      )}




        {/*للصور */}
       {selected && selected.type === 'group' && (
       <div class="toolbart">
        
        <button class="duplicate-button" onClick={duplicateActive} >
    <svg stroke="currentColor" fill="currentColor" stroke-width="0"
      viewBox="0 0 512 512" height="20" width="20"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M112 80h288V56a24 24 0 0 0-24-24H66a34 34 0 0 0-34 34v310a24 24 0 0 0 24 24h24V112a32 32 0 0 1 32-32z"></path>
      <path d="M456 112H136a24 24 0 0 0-24 24v320a24 24 0 0 0 24 24h320a24 24 0 0 0 24-24V136a24 24 0 0 0-24-24zm-64 200h-80v80h-32v-80h-80v-32h80v-80h32v80h80z"></path>
    </svg>
    <span class="tooltip"> {t("editor.textToolbar.duplicate")}</span>
        </button>

        {/* 🔁 زر انعكاس العنصر */}
<button className="flip-button" onClick={flipX}>
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    height="20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* أيقونة الانعكاس (انعكاس أفقي) */}
    <path d="M256 32C132.3 32 32 132.3 32 256s100.3 224 224 224 224-100.3 224-224S379.7 32 256 32zm0 416c-106 0-192-86-192-192S150 64 256 64s192 86 192 192-86 192-192 192z" />
    <path d="M352 176H256v64h-32V144h128zM160 336h96v-64h32v96H160z" />
  </svg>
  <span className="tooltip"> {t("editor.textToolbar.flipX")}</span>
</button>


 
{/* الشفافية */}


<div style={{ position: "relative", display: "inline-block" }} ref={opacityRef}>
  <button
    className={`tool-btn ${showOpacityControl ? "active" : ""}`}
    onClick={() => setShowOpacityControl(!showOpacityControl)}
 
  >
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* أيقونة تدل على الشفافية */}
      <path
        d="M12 4a8 8 0 108 8 8 8 0 00-8-8zm0 14a6 6 0 010-12z"
        opacity="0.3"
      />
      <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 018-8 8 8 0 01-8 8z" />
    </svg>
    <span class="tooltip"> {t("editor.textToolbar.opacity")}</span>
  </button>

  {/* نافذة التحكم المنبثقة */}
  {showOpacityControl && (
    <div
      className="opacity-popover"
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px 12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        minWidth: "220px",
        zIndex: 9999,
      }}
    >
      <label
        style={{
          fontSize: "13px",
          color: "#444",
          marginBottom: "6px",
          display: "block",
        }}
      >
{t("editor.textToolbar.opacity")}
      </label>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        


         {/* شريط التحكم */}
             <input
    id="opacityRange"
    type="range"
    min="0"
    max="100"
    step="1"
    value={opacity * 100}
    onChange={(e) => {
      const newOpacity = parseFloat(e.target.value) / 100;
      setOpacity(newOpacity);

      const o = canvasRef.current.getActiveObject();
      if (o) {
        o.set('opacity', newOpacity);
        canvasRef.current.requestRenderAll();
      }
    }}
    style={{ flex: 1 }}
  />
  <input
      type="number"
      min="0"
      max="100"
      step="1"
      value={(opacity * 100).toFixed(0)}
      onChange={(e) => {
        let val = parseFloat(e.target.value);
        if (isNaN(val)) val = 0;
        if (val < 0) val = 0;
        if (val > 100) val = 100;

        const normalized = val / 100;
        setOpacity(normalized);

        const o = canvasRef.current.getActiveObject();
        if (o) {
          o.set('opacity', normalized);
          canvasRef.current.requestRenderAll();
        }
      }}
      style={{
        width: '60px',
        textAlign: 'center',
      }}
    />
        <span style={{ fontSize: "12px", color: "#555" }}>%</span>
      </div>
    </div>
  )}
</div>


<div style={{ position: "relative", display: "inline-block" }} ref={radiusRef}>
  <button
    className={`tool-btn ${activePopover === "radius" ? "active" : ""}`}
    onClick={() =>
      setActivePopover(activePopover === "radius" ? null : "radius")
    }
  >
    {/* أيقونة الانحناء */}
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 3h2v18H3zM19 3h2v18h-2zM7 19v2h10v-2zM7 3v2h10V3z" />
    </svg>
    <span class="tooltip">  {t("editor.textToolbar.radius")}</span>
  </button>

  {activePopover === "radius" && (
    <div
      className="radius-popover"
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px 12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        minWidth: "220px",
        zIndex: 9999,
      }}
    >
      <label
        style={{
          fontSize: "13px",
          color: "#444",
          marginBottom: "6px",
          display: "block",
        }}
      >
      {t("editor.textToolbar.radius")}
      </label>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
          type="range"
          min="0"
          max="150"
          value={borderRadius}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setBorderRadius(val);
            updateBorderProps("radius", val);
          }}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: "13px" }}>{borderRadius}px</span>
      </div>
    </div>
  )}
</div>


<div style={{ position: "relative", display: "inline-block" }} ref={colorRef}>
  <button
    className={`tool-btn ${activePopover === "color" ? "active" : ""}`}
    onClick={() =>
      setActivePopover(activePopover === "color" ? null : "color")
    }
  >
    {/* أيقونة اللون */}
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 3a9 9 0 0 0 0 18h4a5 5 0 0 0 0-10h-1a1 1 0 0 1 0-2h1a7 7 0 0 1 0 14h-4a11 11 0 0 1 0-22z"></path>
    </svg>
    <span class="tooltip">   {t("editor.textToolbar.borderColor")}</span>
  </button>

  {activePopover === "color" && (
    <div
      className="color-popover"
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px 12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        minWidth: "220px",
        zIndex: 9999,
      }}
    >
      <label
        style={{
          fontSize: "13px",
         minWidth: "100px" ,
          color: "#444",
          marginBottom: "6px",
          display: "block",
        }}
      >
     {t("editor.textToolbar.borderColor")}
      </label>
      <input
        type="color"
        value={borderColor}
        onChange={(e) => {
          const val = e.target.value;
          setBorderColor(val);
          updateBorderProps("color", val);
        }}
        style={{
          width: "100%",
          height: "40px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      />
    </div>
  )}
</div>


<div style={{ position: "relative", display: "inline-block" }} ref={widthRef}>
  <button
    className={`tool-btn ${activePopover === "width" ? "active" : ""}`}
    onClick={() =>
      setActivePopover(activePopover === "width" ? null : "width")
    }
  >
    {/* أيقونة السمك */}
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 11h16v2H4z"></path>
    </svg>
    <span class="tooltip">  {t("editor.textToolbar.borderWidth")}</span>
  </button>

  {activePopover === "width" && (
    <div
      className="width-popover"
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px 12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        minWidth: "220px",
        zIndex: 9999,
      }}
    >
      <label
        style={{
          fontSize: "13px",
          color: "#444",
          marginBottom: "6px",
          display: "block",
        }}
      >
   {t("editor.textToolbar.borderWidth")}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
          type="range"
          min="0"
          max="20"
          value={borderWidth}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setBorderWidth(val);
            updateBorderProps("width", val);
          }}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: "13px" }}>{borderWidth}px</span>
      </div>
    </div>
  )}
</div>







<button class="crop-button" onClick={cropSelectedImage}>
  <svg
    stroke="currentColor"
    fill="currentColor"
    stroke-width="0"
    viewBox="0 0 24 24"
    height="20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17 15V7a1 1 0 0 0-1-1H9V4H7v2H4v2h2v8a1 1 0 0 0 1 1h8v2h2v-2h3v-2h-3zm-2 0H9V9h6v6z"></path>
  </svg>
  <span class="tooltip"> {t("editor.textToolbar.crop")}</span>
</button>





  <button class="delete-button" onClick={deleteActive} >
    <svg stroke="currentColor" fill="currentColor" stroke-width="0"
      viewBox="0 0 24 24" height="20" width="20"
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
    </svg>
    <span class="tooltip"> {t("editor.textToolbar.delete")}</span>
  </button>


      </div>
      )}


      
       {/*للعناصر */}
       {showThirdToolbar && (
     
       <div class="toolbart">
        
        <button class="duplicate-button" onClick={duplicateActive} >
    <svg stroke="currentColor" fill="currentColor" stroke-width="0"
      viewBox="0 0 512 512" height="20" width="20"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M112 80h288V56a24 24 0 0 0-24-24H66a34 34 0 0 0-34 34v310a24 24 0 0 0 24 24h24V112a32 32 0 0 1 32-32z"></path>
      <path d="M456 112H136a24 24 0 0 0-24 24v320a24 24 0 0 0 24 24h320a24 24 0 0 0 24-24V136a24 24 0 0 0-24-24zm-64 200h-80v80h-32v-80h-80v-32h80v-80h32v80h80z"></path>
    </svg>
    <span class="tooltip"> {t("editor.textToolbar.duplicate")}</span>
        </button>

        {/* 🔁 زر انعكاس العنصر */}
<button className="flip-button" onClick={flipX}>
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    height="20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* أيقونة الانعكاس (انعكاس أفقي) */}
    <path d="M256 32C132.3 32 32 132.3 32 256s100.3 224 224 224 224-100.3 224-224S379.7 32 256 32zm0 416c-106 0-192-86-192-192S150 64 256 64s192 86 192 192-86 192-192 192z" />
    <path d="M352 176H256v64h-32V144h128zM160 336h96v-64h32v96H160z" />
  </svg>
  <span className="tooltip"> {t("editor.textToolbar.flipX")}</span>
</button>

{/* 🔁 لون تعبئة العنصر*/}
 <div class="bg-button">
    <input
  type="color"


   style={{
    opacity: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  }}



  onChange={(e) => {
    const color = e.target.value;
    const o = canvasRef.current.getActiveObject();
    if (o && o.fill !== undefined) {
      o.set('fill', color);
      canvasRef.current.requestRenderAll();
    }
  }}
/>
    <svg stroke="currentColor" fill="none" stroke-width="2"
      viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"
      height="20" width="20"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M4 8l4 -4"></path>
      <path d="M14 4l-10 10"></path>
      <path d="M4 20l16 -16"></path>
      <path d="M20 10l-10 10"></path>
      <path d="M20 16l-4 4"></path>
    </svg>
    <span class="tooltip">  {t("editor.textToolbar.fillColor")}</span>
  </div>


 
{/* الشفافية */}


<div style={{ position: "relative", display: "inline-block" }} ref={opacityRef}>
  <button
    className={`tool-btn ${showOpacityControl ? "active" : ""}`}
    onClick={() => setShowOpacityControl(!showOpacityControl)}
 
  >
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* أيقونة تدل على الشفافية */}
      <path
        d="M12 4a8 8 0 108 8 8 8 0 00-8-8zm0 14a6 6 0 010-12z"
        opacity="0.3"
      />
      <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 018-8 8 8 0 01-8 8z" />
    </svg>
    <span class="tooltip"> {t("editor.textToolbar.opacity")}</span>
  </button>

  {/* نافذة التحكم المنبثقة */}
  {showOpacityControl && (
    <div
      className="opacity-popover"
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px 12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        minWidth: "220px",
        zIndex: 9999,
      }}
    >
      <label
        style={{
          fontSize: "13px",
          color: "#444",
          marginBottom: "6px",
          display: "block",
        }}
      >
    {t("editor.textToolbar.opacity")}
      </label>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        


         {/* شريط التحكم */}
             <input
    id="opacityRange"
    type="range"
    min="0"
    max="100"
    step="1"
    value={opacity * 100}
    onChange={(e) => {
      const newOpacity = parseFloat(e.target.value) / 100;
      setOpacity(newOpacity);

      const o = canvasRef.current.getActiveObject();
      if (o) {
        o.set('opacity', newOpacity);
        canvasRef.current.requestRenderAll();
      }
    }}
    style={{ flex: 1 }}
  />
  <input
      type="number"
      min="0"
      max="100"
      step="1"
      value={(opacity * 100).toFixed(0)}
      onChange={(e) => {
        let val = parseFloat(e.target.value);
        if (isNaN(val)) val = 0;
        if (val < 0) val = 0;
        if (val > 100) val = 100;

        const normalized = val / 100;
        setOpacity(normalized);

        const o = canvasRef.current.getActiveObject();
        if (o) {
          o.set('opacity', normalized);
          canvasRef.current.requestRenderAll();
        }
      }}
      style={{
        width: '60px',
        textAlign: 'center',
      }}
    />
        <span style={{ fontSize: "12px", color: "#555" }}>%</span>
      </div>
    </div>
  )}
</div>













{/* ازرار بوردر العنصر */}

<div className="controls-buttons" style={{ display: "flex", gap: "10px" }}>

  {/* 🔲 زر نصف قطر الحواف */}
  <div style={{ position: "relative", display: "inline-block" }} ref={rxRef}>
    <button
      className={`tool-btn ${showRxControl ? "active" : ""}`}
     onClick={() => {
    setShowRxControl(!showRxControl);
    setShowStrokeControl(false);      // إغلاق Popover لون البوردر
    setShowStrokeWidthControl(false); // إغلاق Popover سمك البوردر
  }}

    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        height="20"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 4h16v16H4z" /> {/* أيقونة رمزية لمربع */}
      </svg>
      <span className="tooltip"> {t("editor.textToolbar.radius")}</span>
    </button>

    {showRxControl && (
      <div style={{  position: "absolute",
        top: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px 12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        minWidth: "220px",
        zIndex: 9999, }}>
    <label style={{ minWidth: "100px" }}>{t("editor.textToolbar.radius")}</label>
    <input
      type="range"
      min="0"
      max="200"
      step="1"
      value={selected?.rx || 0}
      onChange={(e) => {
        const obj = canvasRef.current.getActiveObject();
        if (!obj) return;
        const val = parseInt(e.target.value, 10) || 0;
        obj.set({ rx: val, ry: val });
        setSelected({ ...selected, rx: val });
        canvasRef.current.requestRenderAll();
        saveState();
      }}
      style={{ flex: 1 }}
    />
    <input
      type="number"
      min="0"
      max="200"
      step="1"
      value={selected?.rx || 0}
      onChange={(e) => {
        const obj = canvasRef.current.getActiveObject();
        if (!obj) return;
        const val = parseInt(e.target.value, 10) || 0;
        obj.set({ rx: val, ry: val });
        setSelected({ ...selected, rx: val });
        canvasRef.current.requestRenderAll();
        saveState();
      }}
      style={{ width: "60px", textAlign: "center" }}
    />
  </div>
    )}
  </div>

  {/* 🎨 زر لون البوردر */}
  <div style={{ position: "relative", display: "inline-block" }} ref={strokeRef}>
    <button
      className={`tool-btn ${showStrokeControl ? "active" : ""}`}
      onClick={() => {
    setShowStrokeControl(!showStrokeControl);
    setShowRxControl(false);          // إغلاق Popover نصف قطر الحواف
    setShowStrokeWidthControl(false); // إغلاق Popover سمك البوردر
  }}
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        height="20"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2l3 6h6l-4.5 4.5L18 18l-6-3-6 3 1.5-5.5L3 8h6z" /> {/* أيقونة رمز ألوان */}
      </svg>
      <span className="tooltip">  {t("editor.textToolbar.borderColor")}</span>
    </button>

    {showStrokeControl && (
      
  <div style={{  position: "absolute",
        top: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px 12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        minWidth: "220px",
        zIndex: 9999, }}>
    <label style={{ minWidth: "100px" }}>  {t("editor.textToolbar.borderColor")}</label>
    <input
      type="color"
      value={selected?.stroke || "#000000"}

      style={{width: "100%",
          height: "40px",
          border: "none",
          background: "transparent",
          cursor: "pointer", }}
      onChange={(e) => {
        const obj = canvasRef.current.getActiveObject();
        if (!obj) return;
        obj.set({ stroke: e.target.value });
        setSelected({ ...selected, stroke: e.target.value });
        canvasRef.current.requestRenderAll();
        saveState();
      }}
    />
  </div>
    )}
  </div>

  {/* 📏 زر سمك البوردر */}
  <div style={{ position: "relative", display: "inline-block" }} ref={strokeWidthRef}>
    <button
      className={`tool-btn ${showStrokeWidthControl ? "active" : ""}`}
        onClick={() => {
    setShowStrokeWidthControl(!showStrokeWidthControl);
    setShowRxControl(false);          // إغلاق Popover نصف قطر الحواف
    setShowStrokeControl(false);      // إغلاق Popover لون البوردر
  }}

    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        height="20"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M3 3h18v4H3zm0 7h18v4H3zm0 7h18v4H3z" /> {/* أيقونة خطوط */}
      </svg>
      <span className="tooltip">  {t("editor.textToolbar.borderWidth")}</span>
    </button>

    {showStrokeWidthControl && (
      <div style={{  position: "absolute",
        top: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px 12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        minWidth: "220px",
        zIndex: 9999,}}>
    <label style={{ minWidth: "100px" }}> {t("editor.textToolbar.borderWidth")}</label>
    <input
      type="range"
      min="0"
      max="50"
      step="1"
      value={selected?.strokeWidth || 1}
      onChange={(e) => {
        const obj = canvasRef.current.getActiveObject();
        if (!obj) return;
        const val = parseInt(e.target.value, 10) || 1;
        obj.set({ strokeWidth: val, strokeUniform: true });
        setSelected({ ...selected, strokeWidth: val });
        canvasRef.current.requestRenderAll();
        saveState();
      }}
      style={{ flex: 1 }}
    />
    <input
      type="number"
      min="0"
      max="50"
      step="1"
      value={selected?.strokeWidth || 1}
      onChange={(e) => {
        const obj = canvasRef.current.getActiveObject();
        if (!obj) return;
        const val = parseInt(e.target.value, 10) || 1;
        obj.set({ strokeWidth: val, strokeUniform: true });
        setSelected({ ...selected, strokeWidth: val });
        canvasRef.current.requestRenderAll();
        saveState();
      }}
      style={{ width: "60px", textAlign: "center" }}
    />
  </div>
    )}
  </div>
</div>




















  <button class="delete-button" onClick={deleteActive} >
    <svg stroke="currentColor" fill="currentColor" stroke-width="0"
      viewBox="0 0 24 24" height="20" width="20"
      xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
    </svg>
    <span class="tooltip"> {t("editor.textToolbar.delete")}</span>
  </button>


      </div>
      )}
      

      

        
       
      

      <div className="app">




        <aside className={`left-panel ${leftOpen ? "open" : ""}`}>
           <div className="panel-title">  
    <h1>  {t("editor.sidebarLeft.addElements")}</h1>
     <button id="addText" onClick={addText} className="mini-sidright"> 
      <FaRegFileAlt style={{ marginRight: "6px" }} />
       {t("editor.sidebarLeft.text")}
     </button>
            <button onClick={ addImageByUrl } className="mini-sidright"> 
              <FaImage style={{ marginRight: "6px" }} />
               {t("editor.sidebarLeft.image")}
            </button>

             <button onClick={addBulletedText} className="mini-sidright"> 
              <FaListUl style={{ marginRight: "6px" }} />
                {t("editor.sidebarLeft.bulletedList")}
             </button>
            <button onClick={addNumberedText} className="mini-sidright"> 
               <FaListOl style={{ marginRight: "6px" }} />
                 {t("editor.sidebarLeft.numberedList")}
            </button>
            <label className=" mini-sidright lab-photo" >
  <FaUpload style={{ marginRight: "6px" }} />
    {t("editor.sidebarLeft.uploadImage")}
  <input 
    ref={imageLoaderRef} 
    type="file" 
    accept="image/*"  
    onChange={onImageFileChange} 
    style={{ display: "none" }} // إخفاء input الأصلي
  />
</label>

           

  </div>



          




      

<hr />
{/* Sidebar أيقونات */}
    <IconSidebar addIcon={addIcon} />
  


  



<SectionsPanel sections={sections} addSection={addSection} />

<ShapesPanel shapes={Shapes} addShape={addShape} />



          
   





<hr />
<div className="panel-title">  
            <h1>{t("editor.sidebarLeft.textFormatting")}</h1>
           

         
            <div className='gradient-controls'>
              <label> {t("editor.sidebarLeft.font")}</label>
            <select
  value={fontFamily}
  onChange={(e) => {
    const newFont = e.target.value;
    setFontFamily(newFont);

    const o = canvasRef.current.getActiveObject();
    if (o && (o.type === 'textbox' || o.type === 'i-text' || o.type === 'text')) {
      o.set('fontFamily', newFont);
      canvasRef.current.requestRenderAll();
    }
  }}
  className="mini"
>
  <option value="Almarai">Almarai</option>
  <option value="Tajawal">Tajawal</option>
  <option value="Arial">Arial</option>
  <option value="Times New Roman">Times New Roman</option>
  <option value="Cairo">Cairo</option>
  <option value="Amiri">Amiri</option>
  <option value="Noto Kufi Arabic">Noto Kufi Arabic</option>
            </select>

            </div>


            <div className="text-control">
  <label> {t("editor.sidebarLeft.textLabel")}</label>
  <input
    type="text"
    value={textString}
    onChange={(e) => {
      const newValue = e.target.value;
      setTextString(newValue);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const active = canvas.getActiveObject();
      if (
        active &&
        (active.type === "textbox" ||
          active.type === "i-text" ||
          active.type === "text")
      ) {
        active.set({ text: newValue });
        canvas.requestRenderAll();
      }
    }}
    className="mini"
    
    placeholder={t("editor.textToolbar.searchPlaceholder")}

  />
</div>

            
           
         
           

          </div>


          <hr />



<div className="panel">
  <div className="panel-title">
    <h1> {t("editor.sidebarLeft.generalFormatting")}</h1>
  </div>



  <div id="propPanel" className="panel-section">
    {/* لون التعبئة */}
    <div className="control-group">
      <label>  {t("editor.sidebarLeft.fillColor")}</label>
      <input
        type="color"
        onChange={(e) => {
          const color = e.target.value;
          const o = canvasRef.current.getActiveObject();
          if (o && o.fill !== undefined) {
            o.set('fill', color);
            canvasRef.current.requestRenderAll();
          }
        }}
      />
    </div>

    {/* الشفافية */}
    <div className="control-group">
      <label> {t("editor.sidebarLeft.opacity")}</label>
      <div className="opacity-control">
        <input
          id="opacityRange"
          type="range"
          min="0"
          max="100"
          value={opacity * 100}
          onChange={(e) => {
            const newOpacity = parseFloat(e.target.value) / 100;
            setOpacity(newOpacity);
            const o = canvasRef.current.getActiveObject();
            if (o) {
              o.set('opacity', newOpacity);
              canvasRef.current.requestRenderAll();
            }
          }}
        />
        <div className="opacity-number">
          <input
            type="number"
            min="0"
            max="100"
            value={(opacity * 100).toFixed(0)}
            onChange={(e) => {
              let val = parseFloat(e.target.value);
              if (isNaN(val)) val = 0;
              if (val < 0) val = 0;
              if (val > 100) val = 100;
              const normalized = val / 100;
              setOpacity(normalized);
              const o = canvasRef.current.getActiveObject();
              if (o) {
                o.set('opacity', normalized);
                canvasRef.current.requestRenderAll();
              }
            }}
            
          />
         
        </div>
      </div>
    </div>

    {/* طبقات */}
    <div className="row-buttons">
       <button onClick={() => distributeSelection('x')}> {t("editor.sidebarLeft.distributeX")}</button>
    <button onClick={() => distributeSelection('y')}> {t("editor.sidebarLeft.distributeY")}</button>
      <button onClick={bringForward}><MdVerticalAlignTop style={{ marginRight: 6 }} />  {t("editor.sidebarLeft.bringForward")}</button>
      <button onClick={sendBackward}><MdVerticalAlignBottom style={{ marginRight: 6 }} />  {t("editor.sidebarLeft.sendBackward")}</button>
    
      <button onClick={flipX}>< BiReflectVertical style={{ marginRight: 6 }} />  {t("editor.sidebarLeft.flipX")}</button>
     
   
      <button onClick={duplicateActive}><FaClone style={{ marginRight: 6 }} />  {t("editor.sidebarLeft.duplicate")}</button>
      <button onClick={deleteActive}> <FaTrash style={{ marginRight: 6 }} />  {t("editor.sidebarLeft.delete")}</button>
    </div>
  </div>

  {/* لون الإطار */}
  <div className="panel-section">
    <label>{t("editor.sidebarLeft.frameColor")}</label>
    <input
      type="color"
      value={frameColor}
      onChange={(e) => setFrameColor(e.target.value)}
      style={{ width: 50, height: 30, cursor: "pointer" }}
    />
  </div>

  {/* إعدادات التدرج */}
  <div className="panel-section gradient-controls">
    <h3>{t("editor.sidebarLeft.gradientSettings")}</h3>

    <label> {t("editor.sidebarLeft.type")}</label>
    <select
      value={gradientSettings.type}
      onChange={(e) => setGradientSettings({ ...gradientSettings, type: e.target.value })}
    >
      <option value="linear"> {t("editor.sidebarLeft.linear")}</option>
      <option value="radial"> {t("editor.sidebarLeft.radial")}</option>
    </select>

    <label> {t("editor.sidebarLeft.direction")}</label>
    <select
      value={gradientSettings.direction}
      onChange={(e) => setGradientSettings({ ...gradientSettings, direction: e.target.value })}
    >
      <option value="up">   {t("editor.sidebarLeft.up")}</option>
      <option value="down">   {t("editor.sidebarLeft.down")}</option>
      <option value="left">   {t("editor.sidebarLeft.left")}</option>
      <option value="right">   {t("editor.sidebarLeft.right")}</option>
      <option value="diagonal"> {t("editor.sidebarLeft.diagonal")}</option>
    </select>

    <label> {t("editor.sidebarLeft.colors")}</label>
    {gradientSettings.colors.map((stop, i) => (
      <div key={i} className="gradient-row">
        <input
          type="color"
          value={stop.color}
          onChange={(e) => {
            const newColors = [...gradientSettings.colors];
            newColors[i].color = e.target.value;
            setGradientSettings({ ...gradientSettings, colors: newColors });
          }}
        />
        <input
          type="number"
          min="0"
          max="1"
          step="0.1"
          value={stop.offset}
          onChange={(e) => {
            const newColors = [...gradientSettings.colors];
            newColors[i].offset = parseFloat(e.target.value);
            setGradientSettings({ ...gradientSettings, colors: newColors });
          }}
        />
      </div>
    ))}

    <button className="add-color" onClick={() =>
      setGradientSettings({
        ...gradientSettings,
        colors: [...gradientSettings.colors, { offset: 1, color: "#ffffff" }],
      })
    }>
       {t("editor.sidebarLeft.addColor")}
    </button>

    <button className="apply-gradient" onClick={() => addFrame("gradient")}>
 {t("editor.sidebarLeft.applyGradient")}
    </button>
  </div>
</div>


<hr />



           

          <div className="panel-title"> {t("editor.sidebarLeft.layers")}</div>
          <ul id="layers" className="layers-list">
            {getLayers().map((o, idx) => (
              <li key={idx}>
                <span>{o.type === 'image' ? 'صورة' : (o.type === 'rect' ? 'مربع' : (o.type === 'circle' ? 'دائرة' : (o.type === 'i-text' || o.type === 'textbox' ? 'نص' : o.type)))}</span>
                <div>
                  <button className="mini" onClick={()=>selectObjectByIndex(idx)}>  {t("editor.sidebarLeft.select")}</button>
                  <button className="mini" onClick={()=>{ canvasRef.current.bringForward(o); saveState(); refreshLayers(); }}>▲</button>
                  <button className="mini" onClick={()=>{ canvasRef.current.sendBackwards(o); saveState(); refreshLayers(); }}>▼</button>
                </div>
              </li>
            ))}
          </ul>

        </aside>






        <div className="canvas-wrap">
          <div id="canvasContainer" className="stage" style={{width: stageW + 'px', height: stageH + 'px'}} ref={containerRef}>
            <canvas id="c" width={stageW} height={stageH}></canvas>
          </div>
        </div>

        


       <aside className={`right-panel ${rightOpen ? "open" : ""}`}>
          <div className="panel-title">{t("editor.rightPanel.pageSettings")}</div>
          <label> {t("editor.rightPanel.background")}</label>
          <input type="color" value={bgColor} onChange={e=>onBgColorChange(e.target.value)} />
          <label> {t("editor.rightPanel.width")}</label>
          <input type="number" value={stageW} onChange={e=>setStageW(e.target.value)} className="mini" />
          <label> {t("editor.rightPanel.height")}</label>
          <input type="number" value={stageH} onChange={e=>setStageH(e.target.value)} className="mini" />
          <div style={{marginTop:8}} className="row"><button onClick={applyStageSize} className="mini">  {t("editor.rightPanel.applySize")}</button></div>

          <hr />

          <div className="panel-title"> {t("editor.rightPanel.viewZoom")}</div>
          <label>  {t("editor.rightPanel.zoom")}</label>
          <input id="zoomRange" type="range" min="0.2" max="1.05" step="0.05" value={zoomLevel} onChange={e=>setZoomLevel(e.target.value)} />
         
          <hr />

          <div className="panel-title">{t("editor.rightPanel.gridSimulation")}</div>
          <label> {t("editor.rightPanel.showGrid")}</label>
          <input type="checkbox" checked={gridVisible} onChange={e=>setGridVisible(e.target.checked)} />
          <label>  {t("editor.rightPanel.gridSize")}</label>
          <input type="number" value={gridSize} onChange={e=>setGridSize(parseInt(e.target.value||20,10))} className="mini" />
       

          <hr />

          
        </aside>


      </div>

      

      {/* hidden elements for image by URL */}
      <input type="file" accept="image/*" style={{display:'none'}} ref={imageLoaderRef} />

    </div>
  );
}




