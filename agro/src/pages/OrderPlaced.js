import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OrderPlacedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the order details from state passed by SummaryPage
  const {
    cartItems = [],
    orderTotal = 0,
    paymentMethod = "",
    address = {},
    onlinePaymentMethod = "",
    originalTotal = 0,
    discount = 0,
  } = location.state || {};
  console.log("Location state:", location.state);
  console.log("Address:", address);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/details", {
        state: {
          cartItems,
          orderTotal,
          originalTotal,
          discount,
          paymentMethod,
          address,
          orderId: `#${Math.floor(Math.random() * 1000000000000000)}`
        }
      });
      
      
    }, 2000);
    
  
    return () => clearTimeout(timer);
  }, [
    navigate,
    cartItems,
    orderTotal,
    paymentMethod,
    address,
    onlinePaymentMethod,
    originalTotal,
    discount,
  ]);
  
  

  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <h1 style={{ fontSize: "36px", color: "#4caf50" }}>
        🎉 Order Placed Successfully!
      </h1>
      <p style={{ fontSize: "18px", margin: "20px 0" }}>
        Thank you for your purchase. Your order is being processed.
      </p>
    </div>
  );
};

export default OrderPlacedPage;
