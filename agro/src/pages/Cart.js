import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Stepper from "../components/Stepper";
import { useCart } from '../pages/cartContext';


const API_BASE_URL = "http://localhost:8000";

const Cart = () => {
  const { cartItems, setCartItems } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

const fetchCart = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/cart/`, getAuthHeaders());
    console.log("Cart API response:", res.data);
    setCartItems(res.data.items || []);
  } catch (err) {
    console.error("Failed to load cart:", err);
    setError("Could not load cart. Please login.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchCart();
  }, []);
const updateCartItem = async (item, newQuantity) => {
  if (newQuantity < 1) return; // Don't allow quantity < 1
  setUpdatingItemId(item.id);

  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      `http://localhost:8000/cart/items/${item.id}/update/`,  // ✅ matches Django URL pattern
      { quantity: newQuantity },
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Update cart state in frontend
    setCartItems(prevItems =>
      prevItems.map(ci =>
        ci.id === item.id ? { ...ci, quantity: newQuantity } : ci
      )
    );
  } catch (error) {
    console.error("Failed to update quantity:", error.response?.data || error.message);
  } finally {
    setUpdatingItemId(null);
  }
};

  const removeItem = item => updateCartItem(item, 0);
  const decreaseQuantity = item => updateCartItem(item, item.quantity - 1);
  const increaseQuantity = item => updateCartItem(item, item.quantity + 1);

  const extractNumber = (value) => {
  const match = value?.match(/(\d+(\.\d+)?)/); // captures first number
  return match ? parseFloat(match[0]) : 0;
};

const totalProductPrice = cartItems.reduce((total, item) => {
  const price = extractNumber(item?.price);
  const quantity = item?.quantity || 1;
  return total + price * quantity;
}, 0);


  const orderTotal = totalProductPrice;

  const handleContinue = async () => {
  try {
    if (!cartItems.length) {
      navigate("/shopping");
    } else {
      const res = await axios.post(
        `${API_BASE_URL}/orders/`,
        {
          total: orderTotal,
          payment_method: "Cash on Delivery",
          // status: "Pending",
          items: cartItems.map(i => ({
            product_id: i.product_id || i.id,  // ✅ Use correct field name
            quantity: i.quantity,
          })),
        },
        getAuthHeaders()
      );

      navigate("/address", {
        state: {
          cartItems,
          orderTotal,
          orderId: res.data.id,
          fromBuyNow: true,
        },
      });
    }
  } catch (e) {
    console.error("Order failed:", e.response?.data || e.message);
    alert("Could not place order");
  }
};


  if (loading) return <div style={{ padding: 40 }}>Loading cart...</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;

  return (
    <>
      <Stepper currentStep={1} />

      <div style={{ display: "flex", gap: 40, padding: 20 }}>
        {/* Left Side - Cart Items */}
        <div style={{ flex: 2 }}>
          <h2>Product Details</h2>
          {!cartItems.length && <p>Your cart is empty.</p>}
          {cartItems.map(item => (
            
            <div
              key={item.id}
              style={{
                display: "flex",
                border: "1px solid #ddd",
                borderRadius: 8,
                marginBottom: 20,
                overflow: "hidden",
              }}
            >
              <img src={item.src} alt={item.product_name}
  style={{ width: "100px", height: "100px", objectFit: "cover" }}
/>


              <div style={{ flex: 1, padding: 15, position: "relative" }}>
                <h3>{item.product_name}</h3>
                <p style={{ marginBottom: 20, color: "#444" }}>{item.description}</p>
                <div style={{ margin: "12px 0", display: "flex", gap: 10, alignItems: "center" }}>
                  <button
                    disabled={updatingItemId === item.id}
                    onClick={() => decreaseQuantity(item)}
                    style={qtyBtn}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    disabled={updatingItemId === item.id}
                    onClick={() => increaseQuantity(item)}
                    style={qtyBtn}
                  >
                    +
                  </button>
                </div>
                <div style={{ fontSize: 18, fontWeight: "bold" }}>
  ₹{Number(item.price) * Number(item.quantity) || 0}

</div>

                <button
                  disabled={updatingItemId === item.id}
                  onClick={() => removeItem(item)}
                  style={removeBtn}
                >
                  REMOVE
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side - Summary */}
        <div
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 20,
            height: "fit-content",
          }}
        >
          <h3>Price Details ({cartItems.length} Items)</h3>
          <div style={rowStyle}>
            <span>Total Price</span>
            <span>₹{totalProductPrice}</span>
          </div>
          <hr />
          <div style={{ ...rowStyle, fontWeight: "bold", margin: "15px 0" }}>
            <span>Order Total</span>
            <span>₹{orderTotal}</span>
          </div>
          <button onClick={handleContinue} style={continueBtn}>
            Continue
          </button>
        </div>
      </div>
    </>
  );
};

// Styles
const qtyBtn = {
  padding: 5,
  background: "#ddd",
  borderRadius: 4,
  cursor: "pointer",
  userSelect: "none",
};
const removeBtn = {
  position: "absolute",
  bottom: 15,
  right: 15,
  background: "none",
  border: "none",
  color: "red",
  cursor: "pointer",
};
const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  margin: "10px 0",
};
const continueBtn = {
  width: "100%",
  background: "#7b1fa2",
  color: "white",
  padding: "12px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default Cart;
