import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaPinterestP, FaYoutube } from "react-icons/fa";


const footerStyles = {
  footer: {
    backgroundColor: "#1c1c1c",
    padding: "40px 0 20px",
    textAlign: "center",
    color: "white",
    borderTop: "5px solid #0f5f30",
  },
  footerContent: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "0 20px",
  },
  footerLogo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  thImg: {
    width: "40px",
    height: "auto",
  },
  logoText: {
    fontSize: "28px",
    fontWeight: "600",
    color: "white",
    margin: "0",
    letterSpacing: "1px",
  },
  footerIcons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    fontSize: "18px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },
  iconLink: {
    color: "#fff",
    transition: "color 0.3s ease",
    cursor: "pointer",
  },
  footerText: {
    fontSize: "14px",
    color: "#ccc",
  },
  textLink: {
    color: "#ccc",
    textDecoration: "underline",
  },
};

const Footer = () => {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const socialLinks = [
    { id: "facebook", icon: <FaFacebookF />, url: "https://facebook.com" },
    { id: "twitter", icon: <FaTwitter />, url: "https://twitter.com" },
    { id: "pinterest", icon: <FaPinterestP />, url: "https://pinterest.com" },
    { id: "youtube", icon: <FaYoutube />, url: "https://youtube.com" },
  ];

  return (
    <footer style={footerStyles.footer}>
      <div style={footerStyles.footerContent}>
        <div style={footerStyles.footerLogo}>
        <img src="/th.png" alt="Agrosphere logo" style={footerStyles.thImg} />
         <h2 style={footerStyles.logoText}>AGROSPHERE</h2>
        
        </div>

        <div style={footerStyles.footerIcons}>
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredIcon(link.id)}
              onMouseLeave={() => setHoveredIcon(null)}
              style={{
                ...footerStyles.iconLink,
                color: hoveredIcon === link.id ? "#4caf50" : "#fff",
              }}
            >
              {link.icon}
            </a>
          ))}
        </div>

        <p style={footerStyles.footerText}>
          Agrosphere © 2025 ·{" "}
          <a href="/privacy-policy" style={footerStyles.textLink}>
            Privacy Policy
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
