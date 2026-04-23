import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      console.log('Signup attempt:', { username, password });
      const response = await axios.post('http://localhost:8000/api/register/', {
        username,
        password,
      });
      console.log('Signup success:', response.data);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        alert(`Signup failed: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('No response from server:', error.request);
        alert('Signup failed: No response from server.');
      } else {
        alert(`Signup failed: ${error.message}`);
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: "url('/login.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'Arial, sans-serif',
        marginRight:"-10px",
        marginLeft:"-10px",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)', // transparent background
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h2 style={{ textAlign: 'center', fontSize: '28px', color: '#333', marginBottom: '20px' }}>
          Signup
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
          <input
            style={{
              padding: '12px',
              fontSize: '16px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              outline: 'none',
              transition: 'border 0.3s',
            }}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            style={{
              padding: '12px',
              fontSize: '16px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              outline: 'none',
              transition: 'border 0.3s',
            }}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            background: "#7b1fa2",
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onClick={handleSignup}
        >
          Signup
        </button>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#555', marginTop: '15px' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: "#7b1fa2", textDecoration: 'none' }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
