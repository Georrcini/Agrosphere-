import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCart } from "../pages/cartContext";
import axios from "axios";

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { id } = useParams();

  const [product, setProduct] = useState(location.state || null);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [hoveredButton, setHoveredButton] = useState(null);
  const [loading, setLoading] = useState(true);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 1500);
  };

  // Fetch product + reviews
  useEffect(() => {
    if (!product && id) {
      axios
        .get(`http://localhost:8000/products/${id}/`)
        .then((res) => setProduct(res.data))
        .catch(() => navigate("/shopping"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    if (id) {
      axios
        .get(`http://localhost:8000/products/${id}/reviews/`)
        .then((res) => setReviews(res.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  if (loading) return <div style={{ padding: 40 }}>Loading product...</div>;
  if (!product) return <div style={{ padding: 40 }}>Product not found</div>;

  const { image, name, description, price, rating } = product;

  // Convert price safely
  const priceValue =
    typeof price === "string"
      ? parseFloat(price.replace(/[^0-9.]/g, ""))
      : price;

  // ADD TO CART
  const handleAddToCart = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showAlert("Please login to add items to cart.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    addToCart({
      product_id: product.id,
      quantity: 1,
    });

    showAlert(`${name} added to cart!`);
  };

  // BUY NOW
  const handleBuyNow = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showAlert("Please login to buy items.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    const total = priceValue * 1;

    navigate("/address", {
      state: {
        cartItems: [{ ...product, quantity: 1 }],
        orderTotal: total,
        fromBuyNow: true,
      },
    });
  };

  // SUBMIT REVIEW
  const handleSubmitReview = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showAlert("Please login to submit a review.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (userRating === 0 || userReview.trim() === "") return;

    const newReview = {
      rating: userRating,
      comment: userReview.trim(),
    };

    axios
      .post(
        `http://localhost:8000/products/${id}/reviews/`,
        newReview,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        setReviews([res.data, ...reviews]);
        setUserRating(0);
        setUserReview("");
      })
      .catch(() => showAlert("Failed to submit review"));
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 40 }}>
      {/* ALERT */}
      {alertVisible && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "green",
            color: "white",
            padding: "10px 20px",
            borderRadius: 5,
            zIndex: 1000,
          }}
        >
          {alertMessage}
        </div>
      )}

      <div style={{ display: "flex", gap: 40 }}>
        {/* IMAGE */}
        <div style={{ flex: 1 }}>
          <img
            src={image}
            alt={name}
            style={{
              width: "100%",
              height: 450,
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
        </div>

        {/* DETAILS */}
        <div style={{ flex: 1 }}>
          <h2>{name}</h2>
          <p style={{ color: "#444" }}>{description}</p>

          <h3>₹{priceValue}</h3>

          <p>
            ⭐ {rating} | 8000+ orders
          </p>

          {/* BUTTONS */}
          <div style={{ display: "flex", gap: 15, marginTop: 20 }}>
            <button
              onClick={handleAddToCart}
              onMouseEnter={() => setHoveredButton("cart")}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                flex: 1,
                padding: 12,
                background:
                  hoveredButton === "cart" ? "green" : "white",
                color: hoveredButton === "cart" ? "white" : "black",
                border: "2px solid #0ca970",
                cursor: "pointer",
              }}
            >
              🛒 Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              onMouseEnter={() => setHoveredButton("buy")}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                flex: 1,
                padding: 12,
                background:
                  hoveredButton === "buy" ? "green" : "white",
                color: hoveredButton === "buy" ? "white" : "black",
                border: "2px solid #0ca970",
                cursor: "pointer",
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div style={{ marginTop: 40 }}>
        <h3>Rate & Review</h3>

        {/* STARS */}
        <div style={{ fontSize: 24 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => setUserRating(n)}
              style={{
                cursor: "pointer",
                color: n <= userRating ? "#f4b400" : "#ccc",
              }}
            >
              ★
            </span>
          ))}
        </div>

        {/* TEXTAREA */}
        <textarea
          value={userReview}
          onChange={(e) => setUserReview(e.target.value)}
          placeholder="Write review..."
          style={{ width: "100%", padding: 10, marginTop: 10 }}
        />

        <button
          onClick={handleSubmitReview}
          style={{
            marginTop: 10,
            padding: "10px 20px",
            background: "#7b1fa2",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Submit Review
        </button>

        {/* LIST */}
        <div style={{ marginTop: 20 }}>
          {reviews.map((r, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #eee",
                padding: 10,
                marginBottom: 10,
              }}
            >
              <div style={{ color: "#f4b400" }}>
                {"★".repeat(r.rating)}
              </div>
              <p>{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;