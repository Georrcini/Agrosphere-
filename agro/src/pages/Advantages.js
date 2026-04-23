import React from 'react';
import {
  LightbulbIcon,
  FlowerIcon,
  LeafIcon,
  UserIcon,
  DollarSignIcon,
  DropletIcon,
} from 'lucide-react';

const Advantages = () => {
  const advantages = [
    {
      icon: <LightbulbIcon className="text-green-600 w-8 h-8" />,
      title: 'Creative Ideas',
      description:
        'We serve everyone from households to businesses with full-cycle design and landscaping services!',
    },
    {
      icon: <FlowerIcon className="text-green-600 w-8 h-8" />,
      title: 'Decorating',
      description:
        'Decorating is a year-round joy—enhance your home’s beauty with timeless exterior touches.',
    },
    {
      icon: <LeafIcon className="text-green-600 w-8 h-8" />,
      title: 'Garden Design',
      description:
        'Bring magazine-worthy landscapes to life with unique, stylish garden designs.',
    },
    {
      icon: <UserIcon className="text-green-600 w-8 h-8" />,
      title: 'Expert Advice',
      description:
        'Our design-and-build experts can turn even the wildest ideas into reality—no matter the scale!',
    },
    {
      icon: <DollarSignIcon className="text-green-600 w-8 h-8" />,
      title: 'Friendly Prices',
      description:
        'We offer the best value without compromising on quality—fair, transparent, and friendly pricing!',
    },
    {
      icon: <DropletIcon className="text-green-600 w-8 h-8" />,
      title: 'Softscapes',
      description:
        'Softscaping brings life to your yard with elements like soil, plants, and flowers—natural and vibrant.',
    },
  ];

  return (
    <section style={styles.section}>
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          @keyframes pulseShadow {
            0% { box-shadow: 0 0 8px rgba(203, 68, 221, 0.6); }
            50% { box-shadow: 0 0 20px rgb(22, 221, 198); }
            100% { box-shadow: 0 0 8px rgba(25, 134, 10, 0.6); }
          }

          .fade-in { animation: fadeIn 0.8s ease forwards; }
          .card {
            transition: all 0.3s ease;
            animation: pulseShadow 2s infinite;
          }
          .card:hover {
            transform: translateY(-8px);
            box-shadow: 0 8px 16px rgba(45, 135, 25, 0.5);
          }
        `}
      </style>

      <h2 style={styles.heading}>Our Advantages</h2>

      <div style={styles.grid}>
        {advantages.map((adv, idx) => (
          <div key={idx} className="fade-in card" style={styles.card}>
            <div style={styles.iconContainer}>{adv.icon}</div>
            <h3 style={styles.cardTitle}>{adv.title}</h3>
            <p style={styles.cardDescription}>{adv.description}</p>
          </div>
        ))}
      </div>

      {/* Image and Text Side-by-Side */}
      <h2 style={styles.heading}>Why Choose Us?</h2>
      <p style={styles.paragraph}></p>
      <div style={styles.imageTextWrapper}>
        <img src="/img 1.jpg" alt="Landscaping service" style={styles.image} /><p></p>
        <div style={styles.textContent}>
          <p style={styles.paragraph}>
            We are a team of passionate professionals dedicated to transforming outdoor spaces into beautiful, functional landscapes. Our mission is to provide top-notch landscaping services that enhance the beauty and value of your property.
          </p>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: '4rem 2rem',
    backgroundColor: 'white',
    color: '#333',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2.5rem',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateRows: 'repeat(2, auto)',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
    justifyItems: 'center',
    marginBottom: '3rem',
  },
  card: {
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(32, 43, 31, 0.7)',
    transition: 'all 0.3s ease',
    width: '100%',
    maxWidth: '350px',
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2c6d2e',
    marginBottom: '1rem',
  },
  cardDescription: {
    fontSize: '0.875rem',
    color: '#666',
    lineHeight: '1.6',
  },
  imageTextWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '2rem',
    marginTop: '4rem',
  },
  image: {
    width: '100%',
    maxWidth: '500px',
    borderRadius: '18px',
    imgleft: 'cover',
    boxShadow: '0 4px 12px rgba(12, 11, 11, 0.1)',
    marginRight: '2rem',
    marginBottom: '2rem',
    animation: 'fadeIn 0.8s ease forwards',
    
  },
  textContent: {
    maxWidth: '500px',
  },
  paragraph: {
    fontSize: '1rem',
    lineHeight: '1.2',
    color: 'green',
  },
};

export default Advantages;
