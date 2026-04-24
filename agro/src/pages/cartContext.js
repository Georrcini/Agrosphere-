import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

 const addToCart = async ({ product_id, quantity, description }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:8000/cart/items/",
      {
        product_id,
        quantity,
        description
      },
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Item added:", response.data);
  } catch (error) {
    console.error("Server responded with an error:", error.response.data);
  }
};

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
