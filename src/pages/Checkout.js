

import React, { useEffect, useCallback, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {  toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import './Checkout.css';

function Checkout() {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');
  const navigate = useNavigate();
  const [sdkReady, setSdkReady] = useState(false);
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;  // ⬅️ هنا نقرأ env
   const { t } = useTranslation();

  const prices = {
    pro: 2.99,
    premium: 4.99,
  };

  useEffect(() => {
    const addPaypalScript = () => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}&currency=USD`;
      script.async = true;
      script.onload = () => setSdkReady(true);
      document.body.appendChild(script);
    };

    if (!window.paypal) {
      addPaypalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  const createOrder = useCallback(async () => {
    const res = await fetch(`${API_URL}/api/payment/create-order`, {
      method: 'POST',
       credentials: 'include', //🔥 إرسال الكوكي تلقائياً
      headers: { 'Content-Type': 'application/json' },
      
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    return data.id;
  }, [plan]);

  const onApprove = useCallback(
    async (data) => {
      const captureRes = await fetch(`${API_URL}/api/payment/capture-order`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          //Authorization: `Bearer ${localStorage.getItem('token')}`,
          
        },
        
        body: JSON.stringify({ orderID: data.orderID, plan }),
      });
      const captureData = await captureRes.json();
      if (captureData.success) {
        
        
       toast.success(t("checkout.checkout_payment_success", { plan }));
        navigate('/');
        window.location.reload();
      } else {
       
         
         toast.error(t("checkout.checkout_payment_fail"));
      }
    },
    [plan, navigate]
  );

  useEffect(() => {
    const container = document.getElementById('paypal-button-container');
    if (sdkReady && window.paypal && container && container.childElementCount === 0) {
      window.paypal.Buttons({
        createOrder: () => {
          setShowBankTransfer(false); // إخفاء التحويل البنكي عند اختيار PayPal
          return createOrder();
        },
        onApprove: (data) => onApprove(data),
        onError: (err) => {
          console.error('PayPal Error:', err);
          
           toast.error(t("checkout.checkout_payment_error"));
        },
      }).render('#paypal-button-container');
    }
  }, [sdkReady, createOrder, onApprove]);









  const handleScreenshotUploadAndSubmit = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setScreenshot(file);

  const formData = new FormData();
  formData.append('screenshot', file);
  formData.append('plan', plan);
  formData.append('price', prices[plan]);

  try {
    const res = await fetch(`${API_URL}/api/bank-transfer/upload`, {
      method: 'POST',
       credentials: "include",
      
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      
       
       toast.success(t("checkout.checkout_bank_transfer_success"));
    } else {
     
    
      toast.error(
  t("checkout.checkout_bank_transfer_fail", {
    reason: data.message || t("checkout.checkout_bank_unknown_error")
  })
);

    }
  } catch (err) {
    console.error(err);
  
  
    toast.error(t("checkout.checkout_paypal_error"));
  }
};





  if (!plan || !prices[plan]) {
    return <p style={{ textAlign: 'center' }}>{t("checkout.checkout_no_plan_error")}❌</p>;
  }

 

  return (
    
  <div  className="checkout-container" >


     


         {/* ✅ العنوان */}
    <h1 className="checkout-title" >
      {t("checkout.checkout_title")}
     
    </h1>
    
    

    {/* ✅ الحاوية الرئيسية */}
    <div className="checkout-content" >
   
      
      {/* 💼 ملخص الاشتراك */}
      
      <div className="checkout-summary" >
  <h2 style={{
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '0.5rem',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '0.5rem',
  }}>
     
    📄{t("checkout.checkout_summary_title")}
  </h2>

  <div style={{ fontSize: '18px', color: '#555' }}>
    <p>
      <strong style={{ color: '#2980b9' }}>{t("checkout.checkout_plan_label")} : </strong> {plan}
    </p>
    <p>
      <strong style={{ color: '#2980b9' }}>{t("checkout.checkout_price_label")} : </strong> ${prices[plan]} <span style={{ fontSize: '14px', color: '#888' }}>/ {t("checkout.checkout_month_span")}</span>
    </p>
  </div>
</div>


      {/* 💰 طرق الدفع */}
      <div className="checkout-payment" >
        <h2 >
         
          {t("checkout.checkout_choose_payment")}
          
        </h2>

        {/* زر التحويل البنكي */}
        <button className="bank-transfer-btn"
          onClick={() => setShowBankTransfer(!showBankTransfer)}
          
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1e8449')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#27ae60')}
        >
        
          {t("checkout.checkout_bank_transfer_button")}
        </button>



 

        {/* ✅ قسم التحويل البنكي */}
        {showBankTransfer && (
          <div className="bank-transfer-box" >
            <h3 >
               
                {t("checkout.checkout_bank_transfer_title")}
            </h3>

            <p >
           
             {t("checkout.checkout_bank_transfer_text")}
            </p>

            <div  className="bank-info" >
              <p>🏦 <strong>{t("")}CIH Bank</strong></p>
              <p> {t("checkout.checkout_account_holder")} : Abdelbasset El Hajiri</p>
              
              
              <p> {t("checkout.checkout_account_number")} : 3898826211001300</p>
              <p>RIB : 230 780 3898826211001300 57</p>
              <p>IBAN : MA64 2307 8038 9882 6211 0013 0057</p>
            </div>

           
            <div className="upload-section" >
  <label >
    
    📸{t("checkout.checkout_upload_label")}:
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={handleScreenshotUploadAndSubmit}
    onMouseOver={(e) => e.currentTarget.style.borderColor = '#2980b9'}
    onMouseOut={(e) => e.currentTarget.style.borderColor = '#ccc'}
  />
</div>


            {screenshot && (
              <p className="upload-success" >
                
                 {t("checkout.checkout_upload_success")}
              </p>
            )}
            <p className="review-note" >
            
             {t("checkout.checkout_review_note")}
            </p>
          </div>
        )}

        {/* ✅ زر PayPal */}
        <div id="paypal-button-container" className="paypal-btn-container" ></div>
      </div>
    </div>
  </div>
);

}

export default Checkout;



