import React from "react";

const testimonials = [
  {
    quote:
      "As I’ve just never had enough time to do all of my work, home chores and the garden care tasks, I’ve hired these guys to help me!",
    name: "Alison Hankers",
  },
  {
    quote:
      "Seeing how much tidier and greener my sweet little garden has become since these guys took over, I feel incredibly thankful!",
    name: "Jane Bond",
  },
  {
    quote:
      "When after years of taking care of my garden all by myself I’ve hired these guys for a little help, I never expected them to be so professional!",
    name: "Mary Appleheather",
  },
];

const Testimonials = () => {
  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>
        Read What Happy Customers Have to Say!
      </h2>
      <div style={styles.grid}>
        {testimonials.map((testimonial, index) => (
          <div key={index} style={styles.card}>
            <span style={styles.quoteIcon}>“</span>
            <p style={styles.quote}>{testimonial.quote}</p>
            <p style={styles.name}>— {testimonial.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// CSS-in-JS styles
const styles = {
  section: {
    backgroundColor: "black",
    color: "white",
    padding: "4rem 1rem",
    textAlign: "center",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "3rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "#2d3748",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(38, 119, 18, 0.4)",
    textAlign: "left",
  },
  quoteIcon: {
    fontSize: "3rem",
    color: "#facc15",
    display: "block",
    marginBottom: "1rem",
  },
  quote: {
    fontSize: "1.1rem",
    color: "#e2e8f0",
    marginBottom: "1.5rem",
    fontStyle: "italic",
    lineHeight: "1.6",
  },
  name: {
    fontWeight: "600",
    color: "#48bb78",
    textAlign: "right",
  },
};

export default Testimonials;
