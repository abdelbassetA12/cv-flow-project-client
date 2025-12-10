import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import TemplateCard from "../components/TemplateCard";
import { useTranslation } from 'react-i18next';

export default function FavoritesPage() {
      const { t } = useTranslation();
    const { user } = useContext(AuthContext);
      const API_URL = process.env.REACT_APP_API_URL;  // ⬅️ هنا نقرأ env
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await fetch(`${API_URL}/api/favorites`, {
                    method: "GET",
                    credentials: "include", // 🔥 إرسال الكوكي تلقائيًا
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (!res.ok) {
                    return toast.error(t('favorites.fetch_error')); 
                   
                }

                const data = await res.json();
                setFavorites(data.map(f => f.templateId));
            } catch (err) {
                console.error(  t('favorites.fetch_error') , err);
               
                toast.error(t('favorites.fetch_error')); 
            }
        };

        fetchFavorites();
    }, []); 

    const handleRemove = async (tpl) => {
        try {
            const res = await fetch(`${API_URL}/api/favorites/${tpl._id}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!res.ok) {
                return  toast.error(t('favorites.remove_error')); 
                
            }

            setFavorites(prev => prev.filter(f => f._id !== tpl._id));
           
             toast.success(t('favorites.success_remove'));
        } catch (err) {
           
             toast.error(t('favorites.remove_error'));
        }
    };

    const plansRank = { basic: 0, pro: 1, premium: 2 };

    const handleOpenTemplate = (tpl) => {
        if (!user) {
            return toast.error("  ❌ You must log in first");
        }

        const userRank = plansRank[user.subscriptionPlan?.toLowerCase()] ?? 0;
        const requiredRank = plansRank[tpl.tier.toLowerCase()] ?? 0;

        if (userRank < requiredRank) {
            return toast.error(
                `❌ هذا القالب يتطلب خطة ${tpl.tier} أو أعلى. خطتك الحالية: ${user.subscriptionPlan ?? 'لا يوجد اشتراك'}`
            );
        }

        window.open(`/editor/${tpl.slug}`, "_blank");
    };
          
          // 🎨 تنسيقات الصفحة
  const styles = {

         heading: {
      fontSize: '2rem',
      marginBottom: '1.5rem',
      textAlign: 'center',
      color: '#00796b',
    },
  
   

  };
   

    if (favorites.length === 0)
        return (
           
                 <h2 style={styles.heading}>{t('favorites.favorites_yet')}</h2>
           
        );
 

    return (
        <div className="templates-root" style={{ padding: "20px" }}>
          <h2 style={styles.heading} >{t('favorites.title')}</h2>
        
            <div
                className="templates-grid"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: "16px"
                }}
            >
           
                {favorites.map((tpl) => (
                    <TemplateCard
                        key={tpl._id}
                        tpl={tpl}
                        user={user}
                        isFavorite={true}
                        onToggleFavorite={() => handleRemove(tpl)}
                        onOpen={() => handleOpenTemplate(tpl)}
                        plansRank={plansRank}
                    />
                ))}
            </div>
        </div>
    );
}

