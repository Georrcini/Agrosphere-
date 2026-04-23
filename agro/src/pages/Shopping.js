import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const stars = [];

  for (let i = 0; i < fullStars; i++) stars.push("★");
  if (halfStar) stars.push("☆");
  while (stars.length < 5) stars.push("✩");

  return stars.join(" ");
};

const CategoryRow = () => {
  const [selectedCategory, setSelectedCategory] = useState("PLANTS");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/products/");
        if (!response.ok) throw new Error("Failed to fetch products data");
        const data = await response.json();
        setProducts(data); // data is a flat array of all products
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(
    (item) => item.category === selectedCategory
  );

  const handleProductClick = (item) => {
    navigate(`/product/${item.id}`, { state: item });  // Fixed template literal here
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products: {error}</div>;

  const categories = [
    { title: "PLANTS", image: "plants.jpg" },
    { title: "SEEDS", image: "seeds.jpg" },
    { title: "FERTILIZERS", image: "fertilizers.jpg" },
    { title: "PESTICIDES", image: "pesticides.jpg" },
  ];

  return (
    <div style={{ position: "relative", paddingBottom: "80px" }}>
      {/* Category Icons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "60px",
          padding: "30px 10px",
        }}
      >
        {categories.map((cat) => (
          <div
            key={cat.title}
            style={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => setSelectedCategory(cat.title)}
          >
            <img
              src={cat.image}
              alt={cat.title}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                border:
                  selectedCategory === cat.title ? "3px solid green" : "none",
              }}
            />
            <div
              style={{ marginTop: "8px", fontWeight: "bold", fontSize: "14px" }}
            >
              {cat.title}
            </div>
          </div>
        ))}
      </div>

      {/* Products Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "40px",
          justifyContent: "center",
          padding: "60px",
          maxWidth: "80%",
          margin: "0 auto",
        }}
      >
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            onClick={() => handleProductClick(item)}
            style={{
              width: "250px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              fontFamily: "sans-serif",
              position: "relative",
              cursor: "pointer",
            }}
          >
            <img
              src={item.image} // Correct template literal here
              alt={item.name}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div style={{ padding: "12px" }}>
              <div style={{ color: "red", fontSize: "18px", fontWeight: "bold" }}>
                ₹{item.price}
              </div>
              <div style={{ fontWeight: "bold", marginTop: "8px" }}>{item.name}</div>
              <div style={{ color: "#f4b400", fontSize: "14px", marginTop: "4px" }}>
                {renderStars(item.rating)}{" "}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryRow;
