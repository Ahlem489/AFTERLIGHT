import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function CategoryDetail() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch(`http://localhost:5000/api/categories/${id}`);
        const catData = await catRes.json();
        setCategory(catData);

        const artRes = await fetch(`http://localhost:5000/api/articles?category_id=${id}`);
        const artData = await artRes.json();
        setArticles(artData);

        const projRes = await fetch(`http://localhost:5000/api/projects?category_id=${id}`);
        const projData = await projRes.json();
        setProjects(projData);

      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="eyebrow">Retrieving archives...</p>
      </main>
    );
  }

  const filteredArticles = filter === "All" ? articles : articles.filter(a => a.difficulty === filter);
  const filteredProjects = filter === "All" ? projects : projects.filter(p => p.difficulty === filter);

  return (
    <main>
      {/* Header Section */}
      <section className="hero" style={{ minHeight: '40vh', paddingBottom: '40px' }}>
        <div className="hero-content fade-in">
          <Link to="/" className="secondary-button" style={{ display: 'inline-block', marginBottom: '30px', padding: '10px 20px', fontSize: '10px' }}>
            ← Return to Archive
          </Link>
          
          <p className="eyebrow">Category Archive</p>
          <h1>{category ? category.name : 'Unknown'}</h1>
          <p className="hero-description" style={{ marginTop: '20px' }}>
            {category ? category.description : 'Loading description...'}
          </p>

          {/* Difficulty Filter Buttons */}
          <div style={{ marginTop: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
              <button 
                key={level}
                onClick={() => setFilter(level)}
                style={{
                  background: filter === level ? '#a68b5b' : 'transparent',
                  color: filter === level ? '#121110' : '#8c887e',
                  border: '1px solid #3d3a35',
                  padding: '8px 16px',
                  fontFamily: "'Cinzel', serif",
                  fontSize: '11px',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: '0.3s',
                  textTransform: 'uppercase'
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="explore-section" style={{ paddingTop: '60px' }}>
        <div className="fade-in delay-1" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* ARTICLES SECTION */}
          <div className="detail-section">
            <div className="section-header">
              <h2>Archived Articles</h2>
              <span className="count-badge">{filteredArticles.length} Records</span>
            </div>
            
            {filteredArticles.length === 0 ? (
              <div className="empty-state">No articles match this filter yet.</div>
            ) : (
              <div className="article-list">
                {filteredArticles.map(article => (
                  <div key={article.id} className="article-card-wrapper">
                    <Link to={`/article/${article.id}`} className="article-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                      {article.image_url ? (
                        <div className="article-image">
                          <img src={article.image_url} alt={article.title} />
                          <div className="card-overlay"></div>
                        </div>
                      ) : (
                        <div className="article-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1816' }}>
                          <span style={{ color: '#5c5952', fontSize: '12px' }}>No Image</span>
                        </div>
                      )}
                      <div className="article-content">
                        <div className="meta-tags">
                          <span className="meta-tag">{article.difficulty || 'General'}</span>
                          <span className="meta-tag" style={{ color: '#5c5952' }}>•</span>
                          <span className="meta-tag" style={{ color: '#5c5952' }}>{new Date(article.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3>{article.title}</h3>
                        <p>{article.summary || article.content.substring(0, 200) + '...'}</p>
                      </div>
                    </Link>
                    
                    {/* Edit Image Button */}
                    <label className="edit-image-btn" title="Change article image">
                      📷
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onClick={(e) => e.stopPropagation()} 
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          
                          const formData = new FormData();
                          formData.append('image', file);
                          
                          try {
                            const response = await fetch(`http://localhost:5000/api/articles/${article.id}/image`, {
                              method: 'PATCH',
                              body: formData
                            });
                            
                            if (response.ok) {
                              const updatedArticle = await response.json();
                              setArticles(articles.map(a => a.id === article.id ? updatedArticle : a));
                            }
                          } catch (error) {
                            console.error("Upload failed:", error);
                          }
                        }}
                      />
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PROJECTS SECTION */}
          <div className="detail-section">
            <div className="section-header">
              <h2>Practical Projects</h2>
              <span className="count-badge">{filteredProjects.length} Blueprints</span>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="empty-state">No practical projects match this filter yet.</div>
            ) : (
              <div className="project-grid">
                {filteredProjects.map(project => (
                  <div key={project.id} className="project-card">
                    {project.image_url ? (
                      <div className="project-image">
                        <img src={project.image_url} alt={project.title} />
                        <div className="card-overlay"></div>
                      </div>
                    ) : (
                      <div className="project-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1816' }}>
                        <span style={{ color: '#5c5952', fontSize: '12px' }}>No Image</span>
                      </div>
                    )}
                    <div className="project-content">
                      <div className="meta-tags">
                        <span className="meta-tag">{project.difficulty || 'Standard'}</span>
                        <span className="meta-tag" style={{ color: '#5c5952' }}>•</span>
                        <span className="meta-tag" style={{ color: '#5c5952' }}>{project.estimated_time || 'Time TBD'}</span>
                      </div>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <Link to={`/project/${project.id}`} className="view-details-btn">View Blueprint</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}

export default CategoryDetail;