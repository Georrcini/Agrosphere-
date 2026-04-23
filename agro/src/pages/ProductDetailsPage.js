import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../pages/cartContext";
import axios from "axios";

const ProductDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { id } = useParams();

  const [product, setProduct] = useState(state || null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("")
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [hoveredButton, setHoveredButton] = useState(null);

  // Fetch product and reviews
  useEffect(() => {
    if (!product && id) {
      axios
        .get(`http://localhost:8000/products/${id}/`)
        .then(res => {
          setProduct(res.data);
        })
        .catch(err => {
          console.error("Failed to fetch product:", err);
          navigate("/shopping");
        });
    }

    if (id) {
      axios
        .get(`http://localhost:8000/products/${id}/reviews/`)
        .then(res => setReviews(res.data))
        .catch(err => console.error("Failed to fetch reviews:", err));
    }
  }, [id, product, navigate]);

  if (!product) return <div style={{ padding: 40 }}>Loading product...</div>;

  const { image, name, description, price, rating, soldCount } = product;

  const handleAddToCart = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    setAlertMessage("Please login to add items to cart.");
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
      navigate("/login");
    }, 1500);
    return;
  }

  addToCart({
    product_id: product.id,
    quantity: 1,
    description: "Added to cart",
  });

  setAlertMessage(`${product.name} added to cart!`);
  setAlertVisible(true);
  setTimeout(() => setAlertVisible(false), 1500);
};


const handleBuyNow = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    setAlertMessage("Please login to buy items.");
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
      navigate("/login", { state: { from: location.pathname } });
    }, 1500);
    return;
  }

  const item = { ...product, quantity: 1 };
  const total = parseFloat(price.replace(/[^0-9.]/g, "")) * item.quantity;

  navigate("/address", {
    state: { cartItems: [item], orderTotal: total, fromBuyNow: true },
  });
};


  const handleSubmitReview = () => {
  if (userRating === 0 || userReview.trim() === "") return;

  const token = localStorage.getItem("token");
  if (!token) {
    setAlertMessage("Please login to submit a review.");
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
      navigate("/login", { state: { from: location.pathname } });
    }, 1500);
    return;
  }

  const newReview = {
    rating: userRating,
    comment: userReview.trim(),
    product: parseInt(id),  // Only include this if your backend requires it
  };

  axios
    .post(`http://localhost:8000/products/${id}/reviews/`, newReview, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      setReviews([res.data, ...reviews]);
      setUserRating(0);
      setUserReview("");
    })
    .catch((err) => {
      console.error("Failed to submit review:", err.response?.data || err.message);
      setAlertMessage("Failed to submit review. Please try again.");
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 1500);
    });
};


  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 40 }}>
      {alertVisible && (
  <div style={{
    position: "fixed", top: 20, left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "green", color: "white",
    padding: "10px 20px", borderRadius: 5, zIndex: 1000
  }}>
    {alertMessage}
  </div>
)}

      <div style={{ display: "flex", gap: 40 }}>
        <div style={{ flex: 1 }}>
          <img
            src={product.image}// Prefix added
  alt={product.name}
            style={{ width: "100%", height: 450, objectFit: "contain", borderRadius: 8 }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: 10 }}>{name}</h2>
          <p style={{ marginBottom: 20, color: "#444" }}>{description}</p>
          <p style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
            ₹{price}
          </p>
          <p style={{ marginBottom: 10 }}>
            <span style={{
              backgroundColor: "#d4edda", color: "#2e7d32",
              padding: "4px 10px", borderRadius: 20,
              fontWeight: "bold", fontSize: 14
            }}>
              ⭐ {rating}
            </span>
            &nbsp;
            <span style={{ color: "#777", fontSize: 14 }}>
              8067+ orders
            </span>
          </p>
          <p style={{
            backgroundColor: "#f1f3f4", padding: "5px 10px",
            display: "inline-block", borderRadius: 4, fontSize: 13
          }}>
            Free Delivery
          </p>

          <div style={{ display: "flex", gap: 15, marginTop: 30 }}>
            <button
              onClick={handleAddToCart}
              onMouseEnter={() => setHoveredButton("cart")}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                flex: 1, padding: 12,
                backgroundColor: hoveredButton === "cart" ? "green" : "white",
                color: hoveredButton === "cart" ? "white" : "black",
                border: "2px solid #0ca970", borderRadius: 6,
                cursor: "pointer"
              }}
            >
              🛒 Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              onMouseEnter={() => setHoveredButton("buy")}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                flex: 1, padding: 12,
                backgroundColor: hoveredButton === "buy" ? "green" : "white",
                color: hoveredButton === "buy" ? "white" : "black",
                border: "2px solid #0ca970", borderRadius: 6,
                cursor: "pointer"
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <h3>Rate & Review</h3>
        <div style={{ fontSize: 24, margin: "10px 0" }}>
          {[1,2,3,4,5].map(n => (
            <span
              key={n}
              onClick={() => setUserRating(n)}
              style={{
                color: n <= userRating ? "#f4b400" : "#ccc",
                cursor: "pointer", marginRight: 5
              }}
            >★</span>
          ))}
        </div>
        <textarea
          rows={4}
          value={userReview}
          onChange={e => setUserReview(e.target.value)}
          placeholder="Write your review…"
          style={{
            width: "100%", padding: 10, borderRadius: 6,
            border: "1px solid #ccc", fontSize: 14
          }}
        />
        <button
          onClick={handleSubmitReview}
          style={{
            marginTop: 10, padding: "10px 20px",
            backgroundColor: "#7b1fa2", color: "white",
            border: "none", borderRadius: 5, cursor: "pointer"
          }}
        >
          Submit Review
        </button>

        {reviews.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h4>Customer Reviews</h4>
            {reviews.map((r, i) => (
              <div key={i} style={{
                border: "1px solid #eee", padding: 10,
                borderRadius: 5, marginBottom: 10
              }}>
                <div style={{ color: "#f4b400", marginBottom: 5 }}>
                  {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                </div>
                <p style={{ margin: "5px 0" }}>{r.comment}</p>
                <small style={{ color: "#777" }}>
                  {r.date || new Date().toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
