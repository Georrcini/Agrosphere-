import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/products/')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Product List</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map(product => (
          <li key={product.id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <img
  src={`http://localhost:8000${product.image}`}  // Prefix added
  alt={product.name}
  style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '1rem' }}
/>

            <div>
              <strong>{product.name}</strong><br />
              ₹{product.price}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
