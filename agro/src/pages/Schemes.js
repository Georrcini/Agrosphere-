const schemesData = [
  {
    name: "PM-Kisan Yojana",
    description: "₹6000 per year to farmers in three equal installments directly into bank accounts.",
    link: "https://pmkisan.gov.in"
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance for farmers against natural calamities, pests, and diseases.",
    link: "https://pmfby.gov.in"
  },
  {
    name: "Soil Health Card Scheme",
    description: "Provides soil health cards to farmers with crop-wise recommendations of nutrients.",
    link: "https://soilhealth.dac.gov.in"
  },
  {
    name: "e-NAM (National Agriculture Market)",
    description: "A pan-India electronic trading portal for agri-produce to create unified market.",
    link: "https://enam.gov.in"
  },
  {
    name: "Paramparagat Krishi Vikas Yojana (PKVY)",
    description: "Promotes organic farming through cluster-based approach and certification.",
    link: "https://vikaspedia.in/agriculture/schemes/paramparagat-krishi-vikas-yojana"
  },
  {
    name: "Pradhan Mantri Krishi Sinchai Yojana (PMKSY)",
    description: "Ensures access to irrigation and promotes efficient water usage for crops.",
    link: "https://pmksy.gov.in"
  },
  {
    name: "Kisan Credit Card (KCC) Scheme",
    description: "Provides short-term credit support for farmers to meet crop-related expenses.",
    link: "https://www.pmkisan.gov.in/Documents/KCC.pdf"
  },
  {
    name: "Rashtriya Krishi Vikas Yojana (RKVY)",
    description: "Encourages states to increase public investment in agriculture.",
    link: "https://rkvy.nic.in"
  },
  {
    name: "National Mission for Sustainable Agriculture (NMSA)",
    description: "Promotes sustainable farming practices to address climate change impacts.",
    link: "https://agricoop.nic.in/en/Major#gsc.tab=0"
  },
  {
    name: "Livestock Health & Disease Control (LHDC)",
    description: "Supports disease control and vaccination programs for livestock.",
    link: "https://dahd.nic.in/schemes/livestock-health"
  },
  
  {
    name: "National Food Security Mission (NFSM)",
    description: "Increases production of rice, wheat, pulses, and coarse cereals sustainably.",
    link: "https://nfsm.gov.in"
  },
  {
    name: "MIDH (Mission for Integrated Development of Horticulture)",
    description: "Promotes holistic growth of the horticulture sector, including fruits, vegetables, and flowers.",
    link: "https://midh.gov.in"
  }
];

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    textAlign: 'center',
    color: '#2e7d32',
    marginBottom: '2rem'
  },
  list: {
    display: 'grid',
    gap: '1.5rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    transition: 'box-shadow 0.2s ease',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)'
  },
  cardHover: {
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
  },
  cardTitle: {
    color: '#388e3c',
    marginBottom: '0.5rem'
  },
  cardText: {
    fontSize: '0.95rem',
    marginBottom: '0.75rem'
  },
  link: {
    color: '#1976d2',
    textDecoration: 'none',
    fontWeight: 'bold'
  }
};

function Schemes() {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Agricultural Schemes</h2>
      <div style={styles.list}>
        {schemesData.map((scheme, index) => (
          <div key={index} style={styles.card}>
            <h3 style={styles.cardTitle}>{scheme.name}</h3>
            <p style={styles.cardText}>{scheme.description}</p>
            <a href={scheme.link} target="_blank" rel="noopener noreferrer" style={styles.link}>
              Learn More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Schemes;