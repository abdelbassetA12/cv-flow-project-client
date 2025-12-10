


import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import Navbar from './components/Navbar';
import Home from './pages/Home';

import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Subscription from './pages/Subscription';

import FavoriteTemplates from './pages/FavoriteTemplates';
import Checkout from './pages/Checkout';
import LandingPage from './pages/LandingPage';
import Referral from './pages/Referral';
import ReferralInfo from './pages/ReferralInfo';
import { AuthContext } from './context/AuthContext';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';
import HowToUsePage from './pages/HowToUsePage';
import FreelanceGuide from './pages/FreelanceGuide';
import Withdraw from './pages/WithdrawPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PersonalCV from "./pages/PersonalCV";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import Editor from "./pages/Editor";
import SavedProjects from './pages/SavedProjects';




import Tracker from "./usePageTracking";
import Topbar from './components/Topbar';
import { EditorProvider } from "./context/EditorContext";
import { useEditor } from "./context/EditorContext";





// ✅ مكوّن فرعي ليتمكّن من استخدام useLocation داخل Router
function AppContent() {
  const { i18n } = useTranslation();
  const location = useLocation(); // ✅ الآن داخل Router
  const { user, loading, updateUser, emailNotVerified, logout, setEmailNotVerified } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(true);
   const API_URL = process.env.REACT_APP_API_URL;
  const { editorActions } = useEditor();


  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);


  const hideNavbar = location.pathname.startsWith('/app') || location.pathname.startsWith('/editor');

 
  const showTopbar = location.pathname.startsWith('/Editors');


  



  return (
    <>
     
      <Tracker />
       
      
      {!hideNavbar && <Navbar user={user} onLogout={logout} />}
      
    {showTopbar && editorActions && (
  <Topbar
    onUndo={editorActions.onUndo}
    onRedo={editorActions.onRedo}
    canUndo={editorActions.canUndo}
    canRedo={editorActions.canRedo}
    onSave={editorActions.onSave}
    downloadPDF={editorActions.downloadPDF}
    onImageChange={editorActions.onImageChange}
    onExit={editorActions.onExit}
  />
)}


      
     

      <div style={{ display: 'flex' }}>
               {  !hideNavbar &&    user && <Sidebar user={user} collapsed={collapsed} setCollapsed={setCollapsed} />}
   
      
       
       

       

      {/* تعليقك هنا  <div className={`main-content ${user ? (collapsed ? 'collapsed' : '') : 'full'}`}>*/}
       {/* ✅ إذا كان المستخدم غير موجود أو نحن داخل صفحة الإيديتور، نجعل الصفحة بعرض كامل */}
<div className={`main-content ${
  !user || hideNavbar ? 'full' : (collapsed ? 'collapsed' : '')
}`}>





      
        


       
          {emailNotVerified && (
            <div style={{
              background: "#fff3cd",
              color: "#856404",
              border: "1px solid #ffeeba",
              padding: "10px 20px",
              margin: 10,
              borderRadius: 6,
              textAlign: "center"
            }}>
              ⚠️ لم يتم تفعيل بريدك الإلكتروني.<br />
              يرجى التحقق من بريدك لتفعيل الحساب.<br /><br />
              <button
                onClick={async () => {
                  const email = prompt('📧 أدخل بريدك لإعادة إرسال رابط التفعيل:');
                  if (!email) return;

                  try {
                    const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email }),
                    });
                    const data = await res.json();
                    alert(data.message);
                    if (res.ok) {
                      setEmailNotVerified(false);
                    }
                  } catch (err) {
                    alert('حدث خطأ غير متوقع');
                  }
                }}
                style={{
                  backgroundColor: "#856404",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: 10
                }}
              >
                📩 إعادة إرسال رابط التفعيل
              </button>
            </div>
          )}

          <Routes>
            <Route path="/" element={user ? <Home user={user} /> : <LandingPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/checkout" element={<Checkout />} />
            
            <Route path="/personal-cv/:id" element={<PersonalCV />} />

          
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutUs />} />
           <Route
  path="/saved-projects"
  element={
    <ProtectedRoute user={user} loading={loading}>
      <SavedProjects />
    </ProtectedRoute>
  }
/>



            <Route path="/profile" element={<ProtectedRoute user={user} loading={loading}><Profile /></ProtectedRoute>} />
            <Route path="/editor" element={<ProtectedRoute user={user} loading={loading}><Editor /></ProtectedRoute>} />
        
 <Route 
  path="/editor/:slug" 
  element={
    <ProtectedRoute user={user} loading={loading} requireSubscription={true}>
      <Editor/>
    </ProtectedRoute>
  } 
/>

<Route
  path="/editor/project/:projectId"
  element={
    <ProtectedRoute user={user} loading={loading}>
      <Editor />
    </ProtectedRoute>
  }
/>










            <Route path="/referral" element={<ProtectedRoute user={user} loading={loading} requireSubscription={false}><Referral user={user} /></ProtectedRoute>} />
            <Route path="/withdraw" element={<Withdraw user={user} />} />

   
       

            <Route path="/favorites" element={<ProtectedRoute user={user} loading={loading} requireSubscription={false}><FavoriteTemplates /></ProtectedRoute>} />
        

            <Route path="/login" element={<Login onLogin={updateUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/subscription" element={<Subscription user={user} />} />
            <Route path="/referral-info" element={<ReferralInfo />} />
            <Route path="/how-to-use-sit" element={<HowToUsePage />} />
            <Route path="/freelance-guide" element={<FreelanceGuide />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
}


// ✅ المكون الرئيسي الذي يغلّف كل شيء داخل Router
export default function App() {
  return (
    <Router>
       <EditorProvider>
      <AppContent />
       </EditorProvider>
    </Router>
  );
}



















