import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
   const API_URL = process.env.REACT_APP_API_URL;  // ⬅️ هنا نقرأ env
  const [emailNotVerified, setEmailNotVerified] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 🔥 لم نعد نرسل أي هيدر — الكوكي تنرسل تلقائيًا
        const res = await axios.get(`${API_URL}/api/auth/me`);

        if (res.data && res.data.isVerified === false) {
          setUser(null);
          setEmailNotVerified(true);
        } else {
          setUser(res.data);
          setEmailNotVerified(false);

          // 🔔 تنبيه قرب انتهاء الاشتراك
          if (res.data.subscriptionExpiresAt) {
            const expiresAt = new Date(res.data.subscriptionExpiresAt);
            const now = new Date();
            const diffDays = (expiresAt - now) / (1000 * 60 * 60 * 24);

            if (diffDays <= 3 && diffDays > 0) {
              const toastId = "subscription-warning";
              toast.warn(
                `${Math.ceil(diffDays)} days left until your subscription expires!`,
                { toastId }
              );
            }
          }
        }
      } catch (error) {
        setUser(null);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  const logout = async () => {
    await axios.post(`${API_URL}/api/auth/logout`);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, emailNotVerified, setEmailNotVerified, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};



/*
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailNotVerified, setEmailNotVerified] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.data && res.data.isVerified === false) {
            localStorage.removeItem('token');
            setUser(null);
            setEmailNotVerified(true);
          } else {
            setUser(res.data);
            setEmailNotVerified(false);

            // ✅ تنبيه المستخدم إذا اقترب انتهاء الاشتراك
            if (res.data.subscriptionExpiresAt) {
              const expiresAt = new Date(res.data.subscriptionExpiresAt);
              const now = new Date();
              const diffDays = (expiresAt - now) / (1000 * 60 * 60 * 24);

              if (diffDays <= 3 && diffDays > 0) {
                  const toastId = "subscription-warning"; // 🆔 ثابت
                toast.warn(` ${Math.ceil(diffDays)}  days left until your subscription expires!`, {
                position: 'top-center',
                autoClose: 8000,
                      toastId, // نفس الـ ID يمنع التكرار

              });

              }
            }
          }
        } catch (error) {
          setUser(null);
          setEmailNotVerified(false);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, emailNotVerified, setEmailNotVerified, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
*/