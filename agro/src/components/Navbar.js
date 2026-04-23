import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaFacebookF, FaInstagram } from 'react-icons/fa';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
// Inside your Navbar component
const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token");
  navigate('/login'); // redirects to login page
};



  return (
    <div className="navbar-wrapper">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="call-info">
          <span className="orange-text">Call Us</span>
          <FaPhone className="orange-text" />
          <span className="white-text" align="center">+91 9791952533</span>
        </div>
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="main-navbar">
        <div className="logo-section">
          <img src="/th.png" alt="Logo" className="logo" />
          <div className="logo-text">
            <h2 className="logo-heading">AGROSPHERE</h2>
            <p className="logo-subtext">Sustainable Solutions</p>
          </div>
        </div>

        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/services" className="nav-link">Schemes</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/shopping" className="nav-link">Shopping</Link>
        </div>

         {/* Account Button with Dropdown */}
       
        {/* Account Button with Dropdown */}
        <div className="account-dropdown" ref={dropdownRef}>
          <button type="button" className="support-button" onClick={toggleDropdown}>
            ACCOUNT
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              {!localStorage.getItem("token") ? (
                <>
                  <Link to="/login" className="dropdown-item">Login</Link>
                  <Link to="/register" className="dropdown-item">Register</Link>
                </>
              ) : (
                <button onClick={handleLogout} className="dropdown-item logout-btn">
                  Logout
                </button>
              )}
            </div>
          )}
        </div> {/* ✅ This was missing */}
      </div> {/* ✅ Closing main-navbar */}
    </div>    
  );
}


export default Navbar;
