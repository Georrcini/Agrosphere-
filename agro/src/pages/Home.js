

import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Advantages from "./Advantages";
import Review from "./Review";
import Footer from "./Footer";

const images = [
  { src: "/bg 1.jpg" },
  { src: "/bg 2.jpg" },
  { src: "/bg 3.jpg" },
  { src: "/bg 4.jpg" },
  { src: "/bg 5.jpg" },
];

const Slideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={slideshowStyles.container}>
      {images.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt={`Slide ${index}`}
          style={{
            ...slideshowStyles.image,
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
};

const GardenHero = () => (
  <div style={styles.heroSection}>
    <div style={styles.overlay} className="fade-in">
      <h1 style={styles.heading} className="slide-up">
        AGROSPHERE <br />
        <span style={styles.subHeading}>We Grow Your Vision</span>
      </h1>
      <p style={styles.paragraph} className="fade-in delay-1">
        So whenever you just feel you need a professional helping hand at your
        garden, call us up!
      </p>
      <Link to="/About">
        <button style={styles.button} className="pulse-button">
          FIND OUT MORE
        </button>
      </Link>
    </div>
  </div>
);

const ChatPopup = ({ onClose }) => {
    const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Hi! How can I help you today?" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef(null);

  const API_KEY = "AIzaSyDBBaEQx4g7qSl_sFakGxqbSu-q5Fq8bA4";

  const sendMessageToGemini = async (text) => {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text }]
            }
          ]
        })
      });

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";
      return reply.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");
    } catch (error) {
      console.error("Error from Gemini API:", error);
      return "Oops! Something went wrong. Please try again.";
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const userMsg = newMessage.trim();
    setMessages((prev) => [...prev, { id: prev.length + 1, sender: "user", text: userMsg }]);
    setNewMessage("");
    setMessages((prev) => [...prev, { id: prev.length + 2, sender: "bot", text: "Thinking..." }]);

    const botReply = await sendMessageToGemini(userMsg);

    setMessages((prev) => [
      ...prev.slice(0, -1),
      { id: prev.length + 2, sender: "bot", text: botReply }
    ]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={chatStyles.popup}>
      <div style={chatStyles.box}>
        <div style={chatStyles.header}>
          Chat with AGROSPHERE
          <button style={chatStyles.closeButton} onClick={onClose}>×</button>
        </div>
        <div style={chatStyles.body}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...chatStyles.message,
                ...(msg.sender === "user" ? chatStyles.sent : chatStyles.received)
              }}
            >
              <span>{msg.text}</span>
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>
        <div style={chatStyles.inputContainer}>
          <input
            type="text"
            value={newMessage}
            placeholder="Type a message..."
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            style={chatStyles.input}
          />
          <button onClick={handleSend} style={chatStyles.sendButton}>Send</button>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      {/* ✅ Hero + Background Section */}
      <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        <Slideshow />
        <GardenHero />
      </div>

      <Advantages />
      <Review />
      <Footer />

      {/* ✅ Chat Icon with Message */}
      <div
        style={{
          position: "fixed",
          bottom: "25px",
          right: "25px",
          cursor: "pointer",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
        onClick={() => setShowChat(true)}
      >
        {/* 💬 Chat message */}
        <div
          style={{
            background: "#4caf50",
            color: "#fff",
            padding: "8px 14px",
            borderRadius: "20px",
            fontSize: "14px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            whiteSpace: "nowrap",
          }}
        >
          Chat with us
        </div>

        {/* 🟢 Chat Icon */}
        <img
          src="/chatim.png"
          alt="Chatbot Icon"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        />
      </div>

      {showChat && <ChatPopup onClose={() => setShowChat(false)} />}
    </div>
  );
};

// ✅ Styles

const styles = {
  heroSection: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 20px",
    textAlign: "center",
    
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: "40px",
    borderRadius: "12px",
    color: "#fff",
    maxWidth: "90%",
  },
  heading: {
    fontSize: "42px",
    marginBottom: "10px",
    fontWeight: "700",
  },
  subHeading: {
    fontSize: "30px",
    fontWeight: "700",
  },
  paragraph: {
    fontSize: "18px",
    marginBottom: "25px",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "transparent",
    border: "2px solid green",
    color: "white",
    fontWeight: "bold",
    borderRadius: "30px",
    cursor: "pointer",
    fontSize: "16px",
    textDecoration: "none",
    transition: "all 0.3s ease",
  },
};

const slideshowStyles = {
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    zIndex: -1,
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    objectFit: "cover",
    transition: "opacity 1s ease-in-out",
  },
};

const chatStyles = {
  popup: {
    position: "fixed",
    bottom: "100px",
    right: "30px",
    zIndex: 1100,
  },
  box: {
    width: "300px",
    height: "400px",
    background: "#f8f8f8",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    background: "#4caf50",
    color: "white",
    padding: "10px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
  },
  body: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    background: "#fff",
  },
  message: {
    marginBottom: "10px",
    padding: "8px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    maxWidth: "80%",
  },
  sent: {
    backgroundColor: "#dcf8c6",
    alignSelf: "flex-end",
    textAlign: "right",
  },
  received: {
    backgroundColor: "#f1f1f1",
    alignSelf: "flex-start",
  },
  inputContainer: {
    display: "flex",
    borderTop: "1px solid #ccc",
    padding: "10px",
    background: "#fff",
  },
  input: {
    flex: 1,
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "20px",
    marginRight: "10px",
  },
  sendButton: {
    padding: "8px 12px",
    backgroundColor: "#4caf50",
    border: "none",
    color: "white",
    borderRadius: "20px",
    cursor: "pointer",
  },
};

export default Home;
