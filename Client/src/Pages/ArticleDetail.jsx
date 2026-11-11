import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for tracking which item is currently uploading
  const [uploadingId, setUploadingId] = useState(null);

  const getArticleResources = (title) => {
    // 1. FORAGING ARTICLE
    if (title === 'Foraging for Natural Fuels') {
      return {
        materials: [
          { id: 'mat1', name: "Sharp Knife / Blade", desc: "For scraping resin and peeling bark.", image_url: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=200&q=80" },
          { id: 'mat2', name: "Waterproof Container", desc: "To store dry tinder and fatwood.", image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&q=80" },
          { id: 'mat3', name: "Canvas Bag / Backpack", desc: "For carrying harvested fuels.", image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&q=80" }
        ],
        tools: [
          { id: 'tool1', name: "Observation Skills", desc: "Knowing what to look for in the environment.", image_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&q=80" },
          { id: 'tool2', name: "Fire Starting Kit", desc: "Flint, steel, or matches to test the fuels.", image_url: "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=200&q=80" }
        ],
        sectionImages: [
          'https://images.openai.com/static-rsc-4/fd2g15CNppsXiHKOXXpIDVuOs3hK8sOpMt5P3wRWqwKy-Qkc_ppkXPMmgjklzVW1Ofy5RLd05rbwijGgOt32dXauQFQPpoH9AuhAVQhAZjdPfa9ETpUX3kLyh-3R2t6Fh1JM5NoosZy_AFNJ_L2tHQj2gNtGS1ahH3nlcggTyDPJVp6kB7GEWIjuRqTp_aP4?purpose=fullsize', 
          'https://images.openai.com/static-rsc-4/8PYRM9Sdi7jtV3D4zh3C5LWZ3fjXNtsi7AXERSGN61yVvl6inLxwsCPykZwJRkFGzPFlVL_lwQRyF3JhKjwgtKjh_ph69HotQ_Oif0s63NPMBb7f2VJE0v45IGnV67Vlo1CDZeKpVjWAOI1PQOUwNNvSxUXEh6z3uGv78kYp_UsJHUBI20ki9zpR9pi3CJdK?purpose=fullsize', 
          'https://images.openai.com/static-rsc-4/dCeSmcPhFgFnhPaT7f4VkAX5sq-gyzSPb0e4H1SZICqHG7iUigLpHKXrvbHfrUHjTXKrl3XzfQx67oKfVBBZQA6bTwkV8CZvZAoJRtn4YM_4A-niIbx9xWhkzj0lq9xJP2jgHsYvep6lpvQ6NKXhomq3serOrM3AdXimjUT5roe8vCZVNicc2qpYoHMvvY8-?purpose=fullsize', 
          'https://images.openai.com/static-rsc-4/bnoAfJWDfgrIsruvx-hBQ08J3LR615nxkdBiqdGA2AEydM71G2HM9g1ah_rShIgN9jQuWUXVBj79vVt32zvjI9QIZ-Bro-Ofa3gJDqbRCmBmLLRieVweLTlfNY_xHn-wkj00cwStHzbyS28Q3LER-xDG-wVwlMsG2GhKQRzOcEs_Tug2Ybvddd-IBb8EiHxl?purpose=fullsize',  
          'https://images.openai.com/static-rsc-4/LtsdhMGhga4-4Hx_R2icVo8am6fP__6RV4uZFMP0t3_LW-_1loW6q6pes3BB6QO59sQkc-KRIoV4IrA7-romj4uFnZF8lhuvXij8_WPXPHJhpEAivrrsDbnOJjnlWFoKcLyq_xKTSLlpIhd_COEyemc_VQ1C-hzLfUHgYqsmirj_7xIFBepFO3rr5i918CNF?purpose=fullsize'
        ]
      };
    }

    // 2. CHEMISTRY OF THE FLAME ARTICLE
    if (title === 'The Chemistry of the Flame: Primitive Lighting') {
      return {
        materials: [
          { id: 'mat1', name: "Rendered Tallow or Beeswax", desc: "The primary fuel source for your lamp.", image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&q=80" },
          { id: 'mat2', name: "Cotton String or Plant Fiber", desc: "For creating the wick through capillary action.", image_url: "https://images.unsplash.com/photo-1605218427368-35b861286e68?w=200&q=80" },
          { id: 'mat3', name: "Shallow Container", desc: "A stone bowl, clay dish, or tin can to hold the fuel.", image_url: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=200&q=80" }
        ],
        tools: [
          { id: 'tool1', name: "Fire Starting Kit", desc: "Matches, flint, or ferro rod to ignite the wick.", image_url: "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=200&q=80" },
          { id: 'tool2', name: "Knife or Scissors", desc: "For trimming the wick to the perfect length.", image_url: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=200&q=80" }
        ],
        sectionImages: [
          'https://images.unsplash.com/photo-1516934024742-b461fba47600?w=800&q=80', // Fig 1: Introduction (Flame)
          'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80', // Fig 2: Natural Fuels (Tallow/Wax)
          'https://images.unsplash.com/photo-1605218427368-35b861286e68?w=800&q=80', // Fig 3: The Wick (Cotton/Fiber)
          'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&q=80'  // Fig 4: Pro-Tips (Container/Lamp)
        ]
      };
    }

    // Default fallback for all other articles
    return { materials: [], tools: [], sectionImages: [] };
  };

  const [resources, setResources] = useState({ materials: [], tools: [], sectionImages: [] });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/articles/${id}`);
        const data = await res.json();
        setArticle(data);
        setResources(getArticleResources(data.title));
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p className="eyebrow">Retrieving document...</p></main>;
  if (!article) return <main style={{ padding: '100px 8%' }}><h1>Document not found.</h1></main>;

  const contentSections = article.content.split(/(?=CATEGORY \d+|PRO-TIPS)/).map((section, index) => {
    if (index === 0) return { title: 'Introduction', text: section };
    let title = section.split('\n')[0].replace(/CATEGORY \d+:\s*/, '').replace(/PRO-TIPS\s*/, 'Pro-Tips: ');
    let text = section.substring(section.indexOf('\n') + 1);
    return { title, text };
  });

  const CompassIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
    </svg>
  );

  return (
    <main>
      <section className="article-hero">
        {article.image_url && <img src={article.image_url} alt={article.title} />}
        <div className="article-hero-overlay"></div>
        <div className="article-hero-content fade-in">
          <button onClick={() => navigate(-1)} className="secondary-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: '10px 20px', fontSize: '10px', cursor: 'pointer' }}>
            ← Return to Previous Page
          </button>
          <p className="eyebrow">{article.difficulty || 'General'} • {new Date(article.created_at).toLocaleDateString()}</p>
          <h1>{article.title}</h1>
          <p className="article-hero-subtitle">{article.summary}</p>
        </div>
      </section>

      <section className="article-body-section">
        <div className="article-layout fade-in delay-1">
          <div className="article-main-content">
            {contentSections.map((section, index) => {
              const isProTips = section.title.includes('Pro-Tips');
              return (
                <div key={index} className="article-text-section">
                  <h2 className="section-heading">{section.title}</h2>
                  {isProTips ? (
                    <div className="pro-tips-grid">
                      {section.text.split('\n\n').map((tip, i) => {
                        if (!tip.trim()) return null;
                        const parts = tip.split(':');
                        return (
                          <div key={i} className="pro-tip-card">
                            <div className="pro-tip-icon"><CompassIcon /></div>
                            <h4 className="pro-tip-title">{parts[0].trim()}</h4>
                            <p className="pro-tip-desc">{parts.slice(1).join(':').trim()}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="section-text">
                      {section.text.split('\n').map((para, i) => para.trim() && <p key={i}>{para}</p>)}
                    </div>
                  )}
                  {resources.sectionImages[index] && (
                    <div className="section-image-container">
                      <img src={resources.sectionImages[index]} alt={section.title} className="section-image" />
                      <div className="image-caption">Fig {index + 1}: {section.title}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {(resources.materials.length > 0 || resources.tools.length > 0) && (
            <aside className="article-sidebar">
              {resources.materials.length > 0 && (
                <div className="sidebar-block">
                  <h3 className="sidebar-title">Required Materials</h3>
                  <ul className="resource-list">
                    {resources.materials.map((mat) => (
                      <li key={mat.id} className="sidebar-resource-item">
                        <div className="sidebar-resource-img">
                          {mat.image_url ? <img src={mat.image_url} alt={mat.name} /> : <span>No Img</span>}
                          <label className="sidebar-upload-btn">
                            📷
                            <input type="file" accept="image/*" style={{ display: 'none' }} 
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                setUploadingId(mat.id);
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setResources(prev => ({
                                    ...prev,
                                    materials: prev.materials.map(m => m.id === mat.id ? { ...m, image_url: reader.result } : m)
                                  }));
                                  setUploadingId(null);
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                        </div>
                        <div className="sidebar-resource-text">
                          <span className="resource-name">{mat.name}</span>
                          <p className="resource-desc">{mat.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {resources.tools.length > 0 && (
                <div className="sidebar-block">
                  <h3 className="sidebar-title">Essential Tools & Skills</h3>
                  <ul className="resource-list">
                    {resources.tools.map((tool) => (
                      <li key={tool.id} className="sidebar-resource-item">
                        <div className="sidebar-resource-img">
                          {tool.image_url ? <img src={tool.image_url} alt={tool.name} /> : <span>No Img</span>}
                          <label className="sidebar-upload-btn">
                            📷
                            <input type="file" accept="image/*" style={{ display: 'none' }} 
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                setUploadingId(tool.id);
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setResources(prev => ({
                                    ...prev,
                                    tools: prev.tools.map(t => t.id === tool.id ? { ...t, image_url: reader.result } : t)
                                  }));
                                  setUploadingId(null);
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                        </div>
                        <div className="sidebar-resource-text">
                          <span className="resource-name">{tool.name}</span>
                          <p className="resource-desc">{tool.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          )}
        </div>
      </section>
    </main>
  );
}

export default ArticleDetail;