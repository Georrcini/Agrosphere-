import React from 'react';
import Footer from './Footer';

const styles = {
  aboutHero: {
    backgroundImage: "url('/about.jpg')", // Ensure about.jpg is in public folder
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '500px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  overlay: {
    color: 'white',
    padding: '20px',
    textAlign: 'center',
    width: '100%',
  },
  content: {
    padding: '40px 20px',
    maxWidth: '900px',
    margin: '0 auto',
    textAlign: 'center',
    lineHeight: '1.6',
  },
  sideBySide: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '40px',
    flexWrap: 'wrap',
    padding: '40px 20px',
    maxWidth: '1100px',
    margin: 'auto',
  },
  image: {
    width: '40%',
    minWidth: '280px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  textBlock: {
    flex: 1,
    minWidth: '300px',
  },
  heading: {
    fontSize: '1.8rem',
    marginBottom: '10px',
    color: '#2e7d32',
  },
  paragraph: {
    fontSize: '1rem',
    color: '#444',
    lineHeight: '1.6',
  },
};

function App() {
  return (
    <div>
      {/* Hero Section */}
      <div style={styles.aboutHero}>
        <div style={styles.overlay}>
          <div style={styles.content}>
          <h1>ABOUT US</h1>
          <p>
          Agrosphere Sustainable Solutions is a smart farming platform designed to support farmers 
          with modern tools and resources. It features an e-commerce store for seeds, plants and fertilizers,
          a real-time chat system for expert advice, and up-to-date information on government schemes.
          Agrosphere combines technology and sustainability to make farming more efficient and farmer-friendly.
        </p>
        </div>
      </div>
    </div>
    

      {/* Marketplace Section */}
      <div style={styles.sideBySide}>
        <img src="/aboutshop.jpg" alt="Shopping place" style={styles.image} />
        <div style={styles.textBlock}>
          <h2 style={styles.heading}>Shopping site</h2>
          <p style={styles.paragraph}>
          Our shopping website offers a wide range of agricultural products including seeds, plants, pesticides, and fertilizers.
           Farmers and garden enthusiasts can easily browse and purchase everything they need in one place, making farming more convenient and efficient.
          </p>
        </div>
      </div>

      {/* Chat Support Section */}
      <div style={styles.sideBySide}>
        <img src="/aboutchat.jpg" alt="Chat Support" style={styles.image} />
        <div style={styles.textBlock}>
          <h2 style={styles.heading}>Real-time Chat Support</h2>
          <p style={styles.paragraph}>
            Get instant help from agricultural experts and fellow farmers through our built-in chat feature.
            This enables fast responses to real-world farming issues.
          </p>
        </div>
      </div>
{/* Government Schemes Section */}
<div style={styles.sideBySide}>
  <img src="/aboutscheme.jpg" alt="Government Schemes" style={styles.image} />
  <div style={styles.textBlock}>
    <h2 style={styles.heading}>Government Schemes & Subsidies</h2>
    <p style={styles.paragraph}>
      Stay updated with the latest government schemes and agricultural subsidies tailored for farmers. 
      Agrosphere brings essential information right to your fingertips, helping you access financial support and resources that can boost your farming journey.
    </p>
  </div>
</div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
