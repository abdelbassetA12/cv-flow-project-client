
// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

const plansRank = {
  basic: 0,
  pro: 1,
  premium: 2,
};

export default function ProtectedRoute({ user, loading, requireSubscription = false, children }) {
  const { slug } = useParams(); // فقط المسار الذي يحتوي على slug
  const [templateTier, setTemplateTier] = useState(null);
  const [checking, setChecking] = useState(false);

  // 🧩 جلب tier إذا كان المسار يحتوي على slug
  useEffect(() => {
    
 const API_URL = process.env.REACT_APP_API_URL;  // ⬅️ هنا نقرأ env
    const fetchTier = async () => {
      if (!slug) return; // لا نفعل شيئًا إذا لم يكن هناك slug
      setChecking(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/templates/slug/${slug}`, {
        
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTemplateTier(data?.tier?.toLowerCase() || "basic");
      } catch (err) {
        console.error("Failed to fetch template tier", err);
        setTemplateTier("basic");
      } finally {
        setChecking(false);
      }
    };
    fetchTier();
  }, [slug]);

  // 🧮 حساب خطة المستخدم الحالية
  const userPlanRank = plansRank[user?.subscriptionPlan?.toLowerCase()] ?? 0;
  const requiredPlanRank = plansRank[templateTier?.toLowerCase() || "basic"] ?? 0;

  // 🧠 التحقق من الشروط
  if (loading) {
    return <div style={{ padding: 20, textAlign: 'center' }}>⏳ جاري التحقق من صلاحيات الوصول...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        ⚠️ لم يتم تفعيل بريدك الإلكتروني بعد.<br />
        يرجى التحقق من بريدك أو إعادة إرسال رابط التفعيل من صفحة الاشتراك.
      </div>
    );
  }

  if (!requireSubscription) {
    return children;
  }

  if (!user.isSubscribed) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        ❌ اشتراكك غير فعّال أو منتهي.<br />
        يرجى تجديد الاشتراك للوصول إلى هذه الميزة.
      </div>
    );
  }




  if (checking && slug) {
    return <div style={{ padding: 20, textAlign: 'center' }}>⏳ جارٍ فحص صلاحيات القالب...</div>;
  }

  if (userPlanRank < requiredPlanRank) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        ❌ هذا القالب يتطلب اشتراكًا في خطة <strong>{templateTier}</strong> أو أعلى.<br />
        خطتك الحالية: <strong>{user.subscriptionPlan ?? "لا يوجد اشتراك"}</strong>
      </div>
    );
  }



  return children;
}



 
