import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Stepper from "../components/Stepper";
import { useCart } from "../pages/cartContext";

const API_BASE_URL = "http://localhost:8000";

const Cart = () => {
  const { cartItems, setCartItems } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  const navigate = useNavigate();

  // ✅ AUTH HEADERS
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first");
      setLoading(false);
      return null;
    }

    return {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  // ✅ FETCH CART (FIXED useCallback)
  const fetchCart = useCallback(async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const res = await axios.get(`${API_BASE_URL}/cart/`, headers);
      console.log("Cart API response:", res.data);
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setError("Could not load cart. Please login.");
    } finally {
      setLoading(false);
    }
  }, [setCartItems]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ✅ UPDATE CART ITEM
  const updateCartItem = async (item, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItemId(item.id);

    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      await axios.put(
        `${API_BASE_URL}/cart/items/${item.id}/update/`,
        { quantity: newQuantity },
        headers
      );

      setCartItems((prev) =>
        prev.map((ci) =>
          ci.id === item.id ? { ...ci, quantity: newQuantity } : ci
        )
      );
    } catch (error) {
      console.error("Failed to update quantity:", error.response?.data || error.message);
    } finally {
      setUpdatingItemId(null);
    }
  };

  // ✅ REMOVE ITEM (better than quantity = 0)
  const removeItem = async (item) => {
    setUpdatingItemId(item.id);

    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/cart/items/${item.id}/`,
        headers
      );

      setCartItems((prev) => prev.filter((ci) => ci.id !== item.id));
    } catch (error) {
      console.error("Failed to remove item:", error.response?.data || error.message);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const decreaseQuantity = (item) => updateCartItem(item, item.quantity - 1);
  const increaseQuantity = (item) => updateCartItem(item, item.quantity + 1);

  // ✅ SAFE PRICE CALCULATION (NO REGEX)
  const totalProductPrice = cartItems.reduce((total, item) => {
    return total + (Number(item.price) || 0) * (item.quantity || 1);
  }, 0);

  const orderTotal = totalProductPrice;

  // ✅ CONTINUE TO ORDER
  const handleContinue = async () => {
    try {
      if (!cartItems.length) {
        navigate("/shopping");
        return;
      }

      const headers = getAuthHeaders();
      if (!headers) return;

      const res = await axios.post(
        `${API_BASE_URL}/orders/`,
        {
          total: orderTotal,
          payment_method: "Cash on Delivery",
          items: cartItems.map((i) => ({
            product_id: i.product_id || i.id,
            quantity: i.quantity,
          })),
        },
        headers
      );

      navigate("/address", {
        state: {
          cartItems,
          orderTotal,
          orderId: res.data.id,
          fromBuyNow: true,
        },
      });
    } catch (e) {
      console.error("Order failed:", e.response?.data || e.message);
      alert("Could not place order");
    }
  };

  // ✅ LOADING / ERROR UI
  if (loading) return <div style={{ padding: 40 }}>Loading cart...</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;

  return (
    <>
      <Stepper currentStep={1} />

      <div style={{ display: "flex", gap: 40, padding: 20 }}>
        {/* LEFT SIDE */}
        <div style={{ flex: 2 }}>
          <h2>Product Details</h2>

          {!cartItems.length && <p>Your cart is empty 🛒</p>}

          {cartItems.map((item) => {
            const isUpdating = updatingItemId === item.id;

            return (
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
                <img
                  src={item.src}
                  alt={item.product_name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />

                <div style={{ flex: 1, padding: 15, position: "relative" }}>
                  <h3>{item.product_name}</h3>

                  <p style={{ marginBottom: 20, color: "#444" }}>
                    {item.description}
                  </p>

                  {/* QUANTITY */}
                  <div
                    style={{
                      margin: "12px 0",
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <button
                      disabled={isUpdating}
                      onClick={() => decreaseQuantity(item)}
                      style={qtyBtn}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      disabled={isUpdating}
                      onClick={() => increaseQuantity(item)}
                      style={qtyBtn}
                    >
                      +
                    </button>
                  </div>

                  {/* PRICE */}
                  <div style={{ fontSize: 18, fontWeight: "bold" }}>
                    ₹{(Number(item.price) || 0) * (item.quantity || 1)}
                  </div>

                  {/* REMOVE */}
                  <button
                    disabled={isUpdating}
                    onClick={() => removeItem(item)}
                    style={removeBtn}
                  >
                    {isUpdating ? "Removing..." : "REMOVE"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT SIDE */}
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

// ✅ STYLES
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