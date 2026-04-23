import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();       // <-- add this
  const [results, setResults] = useState([]);
  const query = new URLSearchParams(location.search).get("query");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (query) {
      fetch(`http://localhost:8000/products/search/?query=${query}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
  console.log("Search API response:", data); // 🔍 confirm structure
  setResults(Array.isArray(data) ? data : data.results || []);
})

        .catch((err) => console.error(err));
    }
  }, [query, token]);

return (
  <div style={{ padding: "20px" }}>
    {Array.isArray(results) && results.length === 0 ? (
  <p>No products found.</p>
) : (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
    {Array.isArray(results) &&
      results.map((product) => (
        <div
          key={product.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            width: "200px",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/product/${product.id}`, { state: product })}
        >
          <img
            src={product.image} // ensure image URL is correct
            alt={product.name}
            style={{ width: "100%", height: 150, objectFit: "contain" }}
          />
          <h4>{product.name}</h4>
          <p>{product.description}</p>
          <p>₹{product.price}</p>
        </div>
      ))}
  </div>
)}

  </div>
);

}

export default SearchResults;
