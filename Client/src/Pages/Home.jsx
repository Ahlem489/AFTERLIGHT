import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Send the search term to the backend
        const response = await fetch(`http://localhost:5000/api/categories?search=${searchTerm}`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [searchTerm]); // Re-runs whenever searchTerm changes

  return (
    <main>
      {/* ... Keep your Hero section exactly as it is ... */}
      <section className="hero">
        <div className="hero-content fade-in">
          <p className="eyebrow">The Human Knowledge Archive</p>
          <h1>When the world goes dark,<br /><span>knowledge remains.</span></h1>
          <p className="hero-description">
            Explore the science, engineering, and practical wisdom behind the systems that sustain human civilization.
          </p>
          <div className="hero-actions">
            <a href="#explore" className="primary-button">Enter the Archive</a>
            <a href="#about" className="secondary-button">Our Mission</a>
          </div>
        </div>
        <div className="hero-decoration fade-in delay-2">
          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>
          <div className="orbit-center">
            <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#a68b5b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
            </svg>
          </div>
          <p>Est. 2026 / Vol. I</p>
        </div>
      </section>

      {/* EXPLORE SECTION WITH SEARCH */}
      <section className="explore-section" id="explore">
        <div className="fade-in delay-1" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p className="eyebrow">The Collection</p>
          <h2>Knowledge worth preserving.</h2>
          
          {/* SEARCH BAR */}
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search archives (e.g., gears, fire, water)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="category-grid">
          {loading ? (
            <p style={{ color: "#8c887e", gridColumn: "1 / -1", textAlign: "center" }}>Retrieving archives...</p>
          ) : categories.length === 0 ? (
            <p style={{ color: "#8c887e", gridColumn: "1 / -1", textAlign: "center", fontSize: '18px' }}>No records found in the archive.</p>
          ) : (
            categories.map((category) => (
              <Link 
                to={`/category/${category.id}`} 
                className="category-card fade-in" 
                key={category.id}
              >
                {/* Image Area */}
                <div className="card-image">
                  {category.image_url ? (
                    <img src={category.image_url} alt={category.name} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                  <div className="card-overlay"></div>
                </div>
                
                {/* Text Area */}
                <div className="card-content">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <div className="card-arrow">
  <span>Explore</span>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
</div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default Home;