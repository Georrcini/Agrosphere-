import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stepper from "../components/Stepper";

const SummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showAlert, setShowAlert] = useState(false); // State to show the custom alert

  // Destructuring order data passed from the previous pages (cart, address, payment)
  const { cartItems, orderTotal, paymentMethod, address } = location.state || {
    cartItems: [],
    orderTotal: 0,
    paymentMethod: "",
    address: {},
  };

  // Handle the order confirmation and navigate to the "Order Placed" page
  const handleConfirmOrder = () => {
    const newOrder = {
      orderId: "#" + Date.now(),
      cartItems,
      orderDate: new Date(),
      orderTotal, // 👈 include discounted total here
      paymentMethod,
      address,
    };

    // Show custom alert message after confirmation
    setShowAlert(true);

    // Optionally, navigate to the placed page (remove this if you don't want navigation)
    setTimeout(() => {
      navigate("/placed", {
        state: {
          ...newOrder,
          onlinePaymentMethod: location.state?.onlinePaymentMethod || "",
          originalTotal: location.state?.originalTotal || 0,
          discount: location.state?.discount || 0,
        },
      });
    }, 1000); // Delay for a smooth user experience
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      {/* Stepper Component */}
      <Stepper currentStep={4} />

      <h2>Order Summary</h2>

      {/* Product Details */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Products</h3>
        {cartItems.length === 0 && <p>Your cart is empty.</p>}
        {cartItems.map((item) => (
          <div key={item.name} style={{ marginBottom: "15px", borderBottom: "1px solid #ddd" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <img
                src={item.src}
                alt={item.name}
                style={{ width: "100px", objectFit: "cover" }}
              />
              <div>
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <p>
                  ₹{Number(item.price) * Number(item.quantity) || 0}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Summary */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Payment Details</h3>
        <div>
          <p>
            <strong>Payment Method:</strong>{" "}
            {paymentMethod === "cod" ? "Cash on Delivery (COD)" : "Online Payment"}
          </p>
          {paymentMethod === "online" && (
            <p>
              <strong>Online Payment Method:</strong>{" "}
              {location.state?.onlinePaymentMethod === "creditCard" ? "Credit Card" : "UPI"}
            </p>
          )}
        </div>
      </div>

      {/* Price Summary */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Price Details</h3>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <span>Total Product Price</span>
          <span>₹{location.state?.originalTotal}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "green" }}>
          <span>Total Discount</span>
          <span>- ₹{location.state?.discount?.toFixed(2)}</span>
        </div>
        <hr />
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
          <span>Order Total</span>
          <span>₹{orderTotal?.toFixed(2)}</span>
        </div>
      </div>

      {/* Confirmation Button */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleConfirmOrder}
          style={{
            width: "100%",
            background: "#7b1fa2",
            color: "white",
            padding: "12px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Confirm Order
        </button>
      </div>

      {/* Custom Alert */}
      {showAlert && (
        <div style={alertStyles}>
          <p style={alertTextStyle}>✅ Your order has been confirmed!</p>
        </div>
      )}
    </div>
  );
};

// Styling for the custom alert box
const alertStyles = {
  position: "absolute",
            top: "50px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#333",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "5px",
            fontSize: "14px",
            zIndex: 10,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            background:"green"
};

const alertTextStyle = {
  margin: 0,
  fontSize: "15px",
};

export default SummaryPage;
