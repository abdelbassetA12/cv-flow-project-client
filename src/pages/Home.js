import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import { useNavigate } from "react-router-dom";
import axios from "axios";
import TemplateCard from "../components/TemplateCard";
import { useTranslation } from "react-i18next";
  const API_URL = process.env.REACT_APP_API_URL;  // ⬅️ هنا نقرأ env

// إرسال الكوكي تلقائيًا مع كل الطلبات
axios.defaults.withCredentials = true;

export default function TemplatesPage() {
    const { user } = useContext(AuthContext);
    //const navigate = useNavigate();
    const { t } = useTranslation();

    const [templates, setTemplates] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/templates`);
                setTemplates(res.data.templates || []);
            } catch (err) {
                console.error("Error fetching templates:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchFavorites = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/favorites`);
                setFavorites(res.data.map(f => f.templateId._id));
            } catch (err) {
                console.error("Error loading favorites:", err);
            }
        };

        fetchTemplates();
        fetchFavorites();
    }, []);

    const plansRank = { basic: 0, pro: 1, premium: 2 };

    const handleOpenTemplate = (tpl) => {
        if (!user) {
            toast.error("❌ يجب تسجيل الدخول أولاً");
            return;
        }

        if (!user.subscriptionPlan) {
            toast.error("❌ يجب شراء خطة اشتراك أولاً");
            return;
        }

        const userRank = plansRank[user.subscriptionPlan.toLowerCase()];
        const requiredRank = plansRank[tpl.tier.toLowerCase()];

        if (userRank < requiredRank) {
            toast.error(`❌ هذا القالب يتطلب خطة ${tpl.tier}. خطتك الحالية: ${user.subscriptionPlan}`);
            return;
        }

        window.open(`/editor/${tpl.slug}`, "_blank");
    };

    const handleToggleFavorite = async (tpl) => {
        const isFav = favorites.includes(tpl._id);

        try {
            if (isFav) {
                await axios.delete(`${API_URL}/api/favorites/${tpl._id}`);
                setFavorites(prev => prev.filter(f => f !== tpl._id));
                toast.info(t('home.toast.favorite_info'));
            } else {
                await axios.post(`${API_URL}/api/favorites`, { templateId: tpl._id });
                setFavorites(prev => [...prev, tpl._id]);
                toast.success(t('home.toast.favorite_added'));
            }
        } catch (err) {
            console.error("Error updating favorites:", err);
            toast.error(t('home.toast.favorite_failed'));
        }
    };

    if (loading) return <div style={{ textAlign: "center", padding: 30 }}>{t("home.lodin")}</div>;
    if (templates.length === 0) return <div style={{ textAlign: "center", padding: 30 }}>{t("home.no-template")}</div>;
    // 🎨 تنسيقات الصفحة
  const styles = {

         heading: {
      fontSize: '2rem',
      marginBottom: '1.5rem',
      textAlign: 'center',
      color: '#00796b',
    },
    };
    return (
        <main className="templates-root">
            <style>{`
                .templates-root { padding: 20px; min-height: 100vh; background: #f8fafc; }
                .templates-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 16px; }
                @media(min-width:720px) { .templates-grid { grid-template-columns: repeat(3, 1fr); } }
                @media(min-width:1200px) { .templates-grid { grid-template-columns: repeat(4, 1fr); } }
            `}</style>

            <h1 style={styles.heading}>{t("home.title")}</h1>

            <div className="templates-grid">
                {templates.map((tpl) => (
                    <TemplateCard
                        key={tpl._id}
                        tpl={tpl}
                        user={user}
                        isFavorite={favorites.includes(tpl._id)}
                        onToggleFavorite={handleToggleFavorite}
                        onOpen={handleOpenTemplate}
                        plansRank={plansRank}
                    />
                ))}
            </div>
        </main>
    );
}


