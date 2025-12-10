import React, { useState } from "react";
import axios from "axios";
import {  toast } from 'react-toastify';
import Footer from '../components/Footer';
import { useTranslation } from "react-i18next";

export default function Contact() {
  const [inquiry, setInquiry] = useState("");
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");

  const [feedback, setFeedback] = useState("");
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [rating, setRating] = useState(0); // تقييم النجوم
  const [hoverRating, setHoverRating] = useState(0); // عند التحويم
    const API_URL = process.env.REACT_APP_API_URL;  // ⬅️ هنا نقرأ env
   const { t } = useTranslation();

  // نصوص وصفية لكل تقييم
 // const ratingTexts = ["سيء", "ضعيف", "جيد", "جيد جدًا", "ممتاز"];
  //const ratingTexts = ["Bad", "Poor", "Good", "Very Good", "Excellent"];
  const ratingTexts = t("contact.rating_texts", { returnObjects: true });


  const sendInquiry = async () => {
    if (!inquiryName || !inquiryEmail || !inquiry) {
      
      
       toast.warning(t("contact.feedback_required"));
    return;
    }
    try {
      await axios.post(`${API_URL}/api/contact/inquiry`, {
        name: inquiryName,
        email: inquiryEmail,
        message: inquiry,
      });
     
      toast.success(t("contact.inquiry_success"));
      setInquiry("");
      setInquiryName("");
      setInquiryEmail("");
    } catch (err) {
      
      
       toast.error(t("contact.inquiry_error", { error: err.response?.data?.error || err.message }));

    }
  };

  const sendFeedback = async () => {
    if (!feedbackName || !feedbackEmail || !feedback || rating === 0) {
     
      
       toast.warning(t("contact.feedback_required"));
    return;
    }
    try {
      await axios.post(`${API_URL}/api/contact/feedback`, {
        name: feedbackName,
        email: feedbackEmail,
        note: feedback,
        rating: rating, // إرسال التقييم
      });
      
      
      toast.success(t("contact.feedback_success"));
      setFeedback("");
      setFeedbackName("");
      setFeedbackEmail("");
      setRating(0);
      setHoverRating(0);
    } catch (err) {
      
      
       toast.error(t("contact.feedback_error", { error: err.response?.data?.error || err.message }));
      
    }
  };

  return (
    <div>
      <style>{`
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(to right, #f0f4f8, #d9e2ec);
          margin: 0;
          padding: 0;
        }
        .container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 30px;
          padding: 50px 20px;
        }

        .card1 {
         display: flex;
    flex-direction: column;
    justify-content: space-between;
        }


        .card {
          background: white;
          border-radius: 25px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          padding: 30px;
          width: 400px;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }
        h2 {
          margin-bottom: 20px;
          font-size: 22px;
          color: #333;
        }
        input, textarea {
          width: 100%;
          padding: 15px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 12px;
          font-size: 16px;
          outline: none;
          transition: border-color 0.3s;
        }
        input:focus, textarea:focus {
          border-color: #4f46e5;
        }
        textarea {
          min-height: 120px;
          resize: none;
        }
        .btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s, transform 0.2s;
        }
        .btn:hover {
          transform: translateY(-2px);
        }
        .btn-inquiry {
          background: linear-gradient(to right, #4f46e5, #7c3aed);
        }
        .btn-feedback {
          background: linear-gradient(to right, #10b981, #22c55e);
        }
        .stars {
          display: flex;
          gap: 5px;
          margin-bottom: 5px;
        }
        .star {
          font-size: 30px;
          cursor: pointer;
          transition: color 0.2s;
        }
        .rating-text {
          font-size: 16px;
          color: #555;
          min-height: 20px;
          margin-bottom: 15px;
        }

          /* ✅ تجاوُب ممتاز لكل المقاسات */
        @media (max-width: 1024px) {
          .container {
            padding: 40px 10px;
            gap: 20px;
          }
          .card {
            width: 90%;
            max-width: 450px;
            padding: 25px;
          }
          h2 {
            font-size: 20px;
          }
        }

        @media (max-width: 768px) {
          .container {
            flex-direction: column;
            align-items: center;
          }
          .card {
            width: 95%;
            max-width: 400px;
          }
          input, textarea {
            font-size: 15px;
            padding: 13px;
          }
          .btn {
            font-size: 15px;
            padding: 14px;
          }
          .star {
            font-size: 26px;
          }
        }

        @media (max-width: 480px) {
          body {
            background: linear-gradient(to bottom, #f0f4f8, #d9e2ec);
          }
          .container {
            padding: 20px 10px;
          }
          .card {
            width: 100%;
            padding: 20px;
            border-radius: 20px;
          }
          h2 {
            font-size: 18px;
          }
          input, textarea {
            font-size: 14px;
            padding: 12px;
          }
          .btn {
            font-size: 14px;
            padding: 12px;
          }
          .star {
            font-size: 24px;
          }
          .rating-text {
            font-size: 14px;
          }
        }





       
        }
      `}</style>

      <div className="container">
        {/* قسم الاستفسارات */}
        <div className="card card1">
          <div>
            <h2> {t("contact.inquiry_title")}📩</h2>
          <input
            type="text"
            value={inquiryName}
            onChange={(e) => setInquiryName(e.target.value)}
           
            placeholder={t("contact.inquiry_name_placeholder")}
          />
          <input
            type="email"
            value={inquiryEmail}
            onChange={(e) => setInquiryEmail(e.target.value)}
            
            placeholder={t("contact.inquiry_email_placeholder")}
          />
          <textarea
            value={inquiry}
            onChange={(e) => setInquiry(e.target.value)}
           
            placeholder={t("contact.inquiry_message_placeholder")}
          />
          </div>
          <button className="btn btn-inquiry" onClick={sendInquiry}>
             {t("contact.inquiry_button")}
           
          </button>
        </div>

        {/* قسم الملاحظات مع تقييم النجوم */}
        <div className="card">
          <h2> {t("contact.feedback_title")}📝</h2>
          <input
            type="text"
            value={feedbackName}
            onChange={(e) => setFeedbackName(e.target.value)}
            placeholder={t("contact.feedback_name_placeholder")}
          />
          <input
            type="email"
            value={feedbackEmail}
            onChange={(e) => setFeedbackEmail(e.target.value)}
             placeholder={t("contact.feedback_email_placeholder")}
          />
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
           
            placeholder={t("contact.feedback_message_placeholder")}
          />

          {/* تقييم النجوم */}
          <p> {t("contact.feedback_rate_text")}</p>
          <div className="stars">
            
            {[1,2,3,4,5].map((star) => (
              <span
                key={star}
                className="star"
                style={{ color: (hoverRating || rating) >= star ? '#FFD700' : '#ccc' }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </span>
            ))}
          </div>
          {/* النص الوصفي للتقييم */}
          <div className="rating-text">
            {(hoverRating ? ratingTexts[hoverRating-1] : rating ? ratingTexts[rating-1] : "")}
          </div>

          <button className="btn btn-feedback" onClick={sendFeedback}>
             {t("contact.feedback_button")}
          
          </button>
        </div>
      </div>
       <Footer />
    </div>
  );
}





