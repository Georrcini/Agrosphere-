
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../pages/cartContext";
import React, { useState } from "react";


function Nav() {
  const [searchTerm, setSearchTerm] = useState("");

  const { cartItems = [] } = useCart() || {};
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const handleSearch = () => {
  if (searchTerm.trim() !== "") {
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  }
};

  const handleProtectedClick = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      alert("Please login to continue.");
      navigate("/login", { state: { from: path } });

    }
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        flexWrap: "wrap",
        background: "hwb(87 29% 42%)",
        marginLeft: "-10px",
        marginRight: "-20px",
      }}
    >
      {/* Center: Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          margin: "0 20px",
          paddingLeft: "330px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "600px",
            width: "100%",
          }}
        >
          <input
  type="text"
  placeholder="What are you looking for?"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") handleSearch();
  }}

            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: "8px 0 0 8px",
              border: "1px solid #ccc",
              fontSize: "16px",
              outline: "none",
            }}
          />
          <button onClick={handleSearch}
            style={{
              padding: "10px 16px",
              border: "1px solid #ccc",
              background: "rgb(106, 53, 89)",
              borderRadius: "0 8px 8px 0",
              cursor: "pointer",
            }}
          >
            <img
              src="/search.png"
              alt="search"
              style={{ width: "18px", height: "16px", marginRight: "4px" }}
            />
          </button>
        </div>
      </div>

      {/* Right: Navigation Links */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          to="/shopping"
          style={{ marginLeft: "30px", textDecoration: "none", color: "black" }}
        >
          Home
        </Link>

        <span
          onClick={() => handleProtectedClick("/orders")}
          style={{ marginLeft: "30px", textDecoration: "none", color: "black", cursor: "pointer" }}
        >
          Orders
        </span>

        <span
          onClick={() => handleProtectedClick("/cart")}
          style={{
            marginLeft: "30px",
            textDecoration: "none",
            color: "black",
            display: "flex",
            alignItems: "center",
            position: "relative",
            cursor: "pointer",
          }}
        >
          <img
            src="cart.png"
            alt="Shopping Icon"
            style={{ width: "24px", height: "24px", marginRight: "4px" }}
          />
          {cartItems.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "-15px",
                right: "30px",
                background: "green",
                color: "white",
                borderRadius: "50%",
                padding: "3px 7px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {cartItems.length}
            </div>
          )}
          Cart
        </span>
      </div>
    </nav>
  );
}

export default Nav;
