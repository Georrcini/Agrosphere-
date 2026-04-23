import React, { useState } from "react";
import Footer from "./Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          message: formData.message, // message is intentionally excluded
          // message is intentionally excluded
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Success!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          message: "",
        });
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

 return (
  <>
    <div style={styles.bgSection}>
      <div style={styles.formCard}>
        <div style={styles.contactHero}>
          <div style={styles.overlay}>
            <div style={styles.content}>
              <h1>CONTACT US</h1>
              <img
                src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
                alt="Contact Icon"
                style={styles.image}
              />
              <h2 style={styles.heading}>Request a Quote</h2>
              <p style={styles.subheading}>Get in touch with us</p>

              <form style={styles.form} onSubmit={handleSubmit}>
                 {/* Form Fields */}
          <input
            type="text"
            name="name"
            placeholder="Your name"
            style={styles.input}
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your email"
            style={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            style={styles.input}
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Street Address"
            style={styles.input}
            value={formData.address}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Message"
            style={{ ...styles.input, minHeight: "80px" }}
            value={formData.message}
            onChange={handleChange}
          />
          <button type="submit" style={styles.button}>
            Request Quote
          </button>
       </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Move footer outside so it spans full width */}
    <Footer />
  </>
);

};
const styles = {
  bgSection: {
    // backgroundImage: url('/login.jpg'),
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    margin: "-10px",
  },
  formCard: {
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "40px 30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    textAlign: "center",
  },
  image: {
    width: "60px",
    height: "60px",
    marginBottom: "10px",
  },
  heading: {
    fontSize: "26px",
    color: "#2c3e50",
    marginBottom: "5px",
  },
  subheading: {
    color: "#7f8c8d",
    marginBottom: "25px",
    fontSize: "15px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px 18px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "0.3s",
  },
  button: {
    padding: "14px",
    backgroundColor: "#2ecc71",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default Contact;