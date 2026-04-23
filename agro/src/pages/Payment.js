import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stepper from "../components/Stepper";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [onlinePaymentMethod, setOnlinePaymentMethod] = useState("creditCard");
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
    upiId: "",
  });

  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const {
    orderTotal = 0,
    cartItems = [],
  } = location.state || {};

  const discountRate = 0.05;
  const baseDiscount = orderTotal * discountRate;
  const baseDiscountedTotal = orderTotal - baseDiscount;
  const onlineExtraDiscount = 10;
  const onlineTotal = baseDiscountedTotal - onlineExtraDiscount;

  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginTop: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  if (paymentMethod === "online") {
    if (
      (onlinePaymentMethod === "upi" && !formData.upiId.trim()) ||
      (onlinePaymentMethod === "creditCard" &&
        (!formData.cardNumber.trim() ||
          !formData.cardHolder.trim() ||
          !formData.expiryDate.trim() ||
          !formData.cvv.trim()))
    ) {
      setAlertMessage("⚠️ Please fill in all required payment details.");
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 2000);
      return;
    }
  }

  const finalTotal = paymentMethod === "online" ? onlineTotal : baseDiscountedTotal;

  const summaryData = {
    cartItems,
    orderTotal: finalTotal,
    originalTotal: orderTotal,
    discount: orderTotal - finalTotal,
    paymentMethod,
    onlinePaymentMethod,
    address: location.state?.address,
    orderDate: new Date().toISOString(),
  };

  const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
  existingOrders.push(summaryData);
  localStorage.setItem("orders", JSON.stringify(existingOrders));

  setAlertMessage(
    paymentMethod === "cod"
      ? "✅ Order placed with Cash on Delivery!"
      : "✅ Payment processed successfully!"
  );
  setAlertVisible(true);

  setTimeout(() => {
    setAlertVisible(false);
    navigate("/summary", { state: summaryData });
  }, 2000);
};

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      {/* Alert Banner */}
      {isAlertVisible && (
        <div
          style={{
            position: "absolute",
            top: "-5px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "green",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "5px",
            fontSize: "14px",
            zIndex: 1000,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {alertMessage}
        </div>
      )}

      <Stepper currentStep={3} />

      <div style={{ display: "flex", maxWidth: "1100px", margin: "0 auto", gap: "20px" }}>
        {/* Payment Options */}
        <div style={{ flex: 2 }}>
          <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
            <h2>Choose Payment Method</h2>
            <label style={{ display: "block", marginBottom: "10px", cursor: "pointer" }}>
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={handlePaymentMethodChange}
                style={{ marginRight: "8px" }}
              />
              ₹{baseDiscountedTotal.toFixed(2)} - Cash on Delivery (5% OFF)
            </label>
            <label style={{ display: "block", cursor: "pointer" }}>
              <input
                type="radio"
                value="online"
                checked={paymentMethod === "online"}
                onChange={handlePaymentMethodChange}
                style={{ marginRight: "8px" }}
              />
              ₹{onlineTotal.toFixed(2)} - Pay Online (5% OFF + ₹10 Extra OFF)
            </label>
          </div>

          {paymentMethod === "online" && (
            <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px", marginTop: "20px" }}>
              <h3>Pay Online</h3>

              <details style={{ marginBottom: "10px" }} open>
                <summary style={{ cursor: "pointer", fontWeight: "bold" }}>UPI</summary>
                <input
                  type="text"
                  name="upiId"
                  placeholder="Enter UPI ID"
                  value={formData.upiId}
                  onChange={(e) => {
                    handleChange(e);
                    setOnlinePaymentMethod("upi");
                  }}
                  style={inputStyle}
                />
              </details>

              <details style={{ marginBottom: "10px" }}>
                <summary style={{ cursor: "pointer", fontWeight: "bold" }}>Debit/Credit Cards</summary>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={formData.cardNumber}
                  onChange={(e) => {
                    handleChange(e);
                    setOnlinePaymentMethod("creditCard");
                  }}
                  style={inputStyle}
                />
                <input
                  type="text"
                  name="cardHolder"
                  placeholder="Cardholder Name"
                  value={formData.cardHolder}
                  onChange={handleChange}
                  style={inputStyle}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="month"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={formData.cvv}
                    onChange={handleChange}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                </div>
              </details>
            </div>
          )}
        </div>

        {/* Summary Section */}
        <div style={{ flex: 1 }}>
          <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px" }}>
            <h3>Price Details</h3>
            <p>Total Product Price: ₹{orderTotal}</p>
            <p>5% Discount: -₹{baseDiscount.toFixed(2)}</p>
            {paymentMethod === "online" && <p>Extra Online Discount: -₹{onlineExtraDiscount}</p>}
            <hr />
            <p>
              <strong>
                Order Total: ₹
                {paymentMethod === "online"
                  ? onlineTotal.toFixed(2)
                  : baseDiscountedTotal.toFixed(2)}
              </strong>
            </p>
            <p style={{ fontSize: "12px", color: "#777" }}>
              Clicking "Continue" will not deduct any amount
            </p>
            <button
              onClick={handleSubmit}
              style={{
                width: "100%",
                backgroundColor: "#7b1fa2",
                color: "white",
                padding: "12px",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                marginTop: "10px",
                cursor: "pointer",
              }}
            >
              {paymentMethod === "cod" ? "Place Order (COD)" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
