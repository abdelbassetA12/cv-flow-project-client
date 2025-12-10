// src/pages/SavedProjects.js
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import { confirmAlert } from 'react-confirm-alert';
import { useTranslation } from 'react-i18next';
//import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

function SavedProjects() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
 // const navigate = useNavigate();

  const overlayCss = `
    .custom-overlay{
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background-color: rgba(0, 0, 0, 0.5) !important;
      z-index: 10000 !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
    }
  `;

  // 🟢 جلب المشاريع من السيرفر
  useEffect(() => {
    const fetchProjects = async () => {
    
      try {
        const res = await fetch('http://localhost:5000/api/saved-projects/mine', {
         // headers: { Authorization: `Bearer ${token}` },
           method: 'GET',
  credentials: 'include', // 🔥 مهم جداً جداً
  headers: {
    'Content-Type': 'application/json',
  }
        });
        if (!res.ok) throw new Error('فشل في جلب المشاريع');
        const data = await res.json();
        setProjects(data);
      } catch (error) {
       // toast.error('❌ فشل تحميل المشاريع');
         toast.error(t('saved_templates.fetch_error'));
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // 🗑️ تأكيد الحذف
  const handleDelete = (id) => {
    confirmAlert({
      overlayClassName: 'custom-overlay',
      title:  t('saved_templates.confirm_title'),
      message: t('saved_templates.confirm_message'),
      buttons: [
        {
          label:  t('yes'),
          onClick: () => performDelete(id),
        },
        {
          label:  t('no'),
        },
      ],
    });
  };

  // 🗑️ تنفيذ الحذف فعلاً
  const performDelete = async (id) => {
    setDeletingId(id);
    //const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/saved-projects/${id}`, {
        method: 'DELETE',
         credentials: 'include', // 🔥 مهم جداً جداً
        
      });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
       toast.success(t('saved_templates.delete_success'));
      } else {
        toast.error(t('saved_templates.delete_error'));
      }
    } catch {
     toast.error(t('connection_failed'));
    } finally {
      setDeletingId(null);
    }
  };

  // 🎨 تنسيقات الصفحة
  const styles = {
    container: {
      fontFamily: 'Cairo, sans-serif',
      background: 'linear-gradient(to right, #f8f9fa, #e8f5e9)',
      minHeight: '100vh',
      padding: '2rem',
    },
    heading: {
      fontSize: '2rem',
      marginBottom: '1.5rem',
      textAlign: 'center',
      color: '#00796b',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '1.25rem',
      alignItems: 'start',
    },
    card: {
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
      padding: '1rem',
      textAlign: 'center',
      transition: 'transform 0.2s ease',
      cursor: 'pointer',
    },
    cardHover: {
      transform: 'scale(1.02)',
    },
    name: {
      fontSize: '1.1rem',
      marginBottom: '0.5rem',
      color: '#333',
    },
    date: {
      color: '#777',
      fontSize: '0.9rem',
      marginBottom: '0.75rem',
    },
    actions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    btn: {
      border: 'none',
      color: 'white',
      padding: '6px',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: '0.2s ease',
    },
    btnView: { background: '#3498db' },
    btnDelete: { background: '#e74c3c' },
  };

  return (
    <div style={styles.container}>
      <style>{overlayCss}</style>
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 style={styles.heading}>{t('saved_templates.title')}</h2>

      {loading ? (
        <p style={{ textAlign: 'center' }}>{t('loading')}</p>
      ) : projects.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#555' }}> {t('saved_templates.empty')}</p>
      ) : (
        <div style={styles.grid}>
          {projects.map((project) => (
            <div
              key={project._id}
              style={styles.card}
               onClick={() => window.open(`/editor/project/${project._id}`, "_blank")}
            >
              <h3 style={styles.name}>{project.name}</h3>
              <p style={styles.date}>
                🕒 {new Date(project.updatedAt).toLocaleDateString('ar-MA')}
              </p>

              <div style={styles.actions}>
                <button
                  style={{ ...styles.btn, ...styles.btnView }}
                  onClick={(e) => {
                    e.stopPropagation();
                  window.open(`/editor/project/${project._id}`, "_blank");
                     
                  }}
                >
                {t('saved_templates.edit-cv')}
               
                </button>

                <button
                  style={{ ...styles.btn, ...styles.btnDelete }}
                  disabled={deletingId === project._id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(project._id);
                  }}
                >
                  {deletingId === project._id ? t('deleting') : t('delete')}
                </button>

                {/* فتح المشروع في PersonalCV */}
  
<button
  style={{ ...styles.btn, ...styles.btnView }}
  onClick={(e) => {
    e.stopPropagation();
    window.open(`${window.location.origin}/personal-cv/${project._id}`, "_blank", "noopener,noreferrer");
  }}
>
    {t('saved_templates.view_cv')}
</button>


              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedProjects;
