import { useEffect } from "react";
import React from "react";

import { useLocation, useNavigate } from "react-router-dom";

const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract order details from location.state
  const {
    cartItems = [],
    orderTotal = 0,
    paymentMethod = "",
    address = {},
    orderId,
    originalTotal = 0,
    discount = 0,
  } = location.state || {};

  // Check if orderId exists and cartItems is not empty before proceeding
  useEffect(() => {
    if (!orderId || cartItems.length === 0) return;

    // Get the current orders from localStorage
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");

    // Check if the order already exists
    const alreadyExists = existingOrders.some(order => order.orderId === orderId);

    if (!alreadyExists) {
      // Create a new order object
      const newOrder = {
        orderId,
        items: cartItems,
        total: orderTotal,
        paymentMethod,
        address,
        date: new Date().toISOString(),
        status: "Ordered", // Set the status to 'Ordered' when the order is first placed
      };

      // Add the new order to existing orders
      const updatedOrders = [newOrder, ...existingOrders];

      // Save the updated orders back to localStorage
      localStorage.setItem("orders", JSON.stringify(updatedOrders));

      console.log("Order added:", newOrder);
    }

    console.log("All Orders in localStorage:", existingOrders);
  }, [orderId, cartItems, orderTotal, paymentMethod, address]);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      {/* Order Confirmation */}
      <div
        style={{
          background: "#e6f4ea",
          border: "1px solid #34a853",
          padding: "20px",
          marginBottom: "20px",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ color: "#34a853" }}>✅ Thank you for shopping with us!</h2>
        <p style={{ marginTop: "8px" }}>
          Order ID: <strong>{orderId}</strong>
        </p>
      </div>

      {/* Product Details */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Product Details</h3>
        {cartItems.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "10px",
              alignItems: "center",
            }}
          >
            <img src={item.src} alt={item.product_name}
  style={{ width: "100px", height: "100px", objectFit: "cover" }}
/>


            <div style={{ flex: 1 }}>
              <h4>{item.name}</h4>
              <p>{item.price}</p>
              <p>Qty: {item.quantity}</p>
              <p>Free Delivery</p>
              <p style={{ fontSize: "14px", color: "#555" }}>
                Estimated Delivery by <strong>Tuesday, 13th May</strong>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Address */}
      <div style={{ marginBottom: "20px" }}>
        <h3>📍 Delivery Address</h3>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "6px",
          }}
        >
          <p>
            <strong>{address.name}</strong>
            <br />
            {address.address?.trim() && (
              <>
                {address.address.trim()}
                <br />
              </>
            )}
            {address.city}, {address.state} - {address.phone}
          </p>
        </div>
      </div>

      {/* Payment Mode */}
      <div style={{ marginBottom: "20px" }}>
        <h3>💳 Payment Mode</h3>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "6px",
          }}
        >
          {paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
        </div>
      </div>

      {/* Price Summary */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Price Details</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <span>Total Product Price</span>
          <span>₹{originalTotal.toFixed(2)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
            color: "green",
          }}
        >
          <span>Total Discount</span>
          <span>- ₹{discount.toFixed(2)}</span>
        </div>
        <hr />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
          }}
        >
          <span>Order Total</span>
          <span>₹{orderTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => navigate("/shopping")}
          style={{
            backgroundColor: "white",
            color: "#7b1fa2",
            border: "2px solid #7b1fa2",
            padding: "12px 24px",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
