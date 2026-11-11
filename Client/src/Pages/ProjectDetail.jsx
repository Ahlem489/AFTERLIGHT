import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [uploadingMatId, setUploadingMatId] = useState(null);
  const [uploadingToolId, setUploadingToolId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projRes = await fetch(`http://localhost:5000/api/projects/${id}`);
        const projData = await projRes.json();
        setProject(projData);

        const matRes = await fetch(`http://localhost:5000/api/materials?project_id=${id}`);
        setMaterials(await matRes.json());

        const toolRes = await fetch(`http://localhost:5000/api/tools?project_id=${id}`);
        setTools(await toolRes.json());

      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p className="eyebrow">Retrieving blueprint...</p></main>;
  }

  if (!project) return <main style={{ padding: '100px 8%' }}><h1>Blueprint not found.</h1></main>;

  return (
    <main>
      <section className="project-hero">
        {project.image_url && <img src={project.image_url} alt={project.title} />}
        <div className="project-hero-overlay"></div>
        <div className="project-hero-content fade-in">
          <button 
            onClick={() => navigate(-1)} 
            className="secondary-button" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: '10px 20px', fontSize: '10px', cursor: 'pointer' }}
          >
            ← Return to Previous Page
          </button>
          <p className="eyebrow">{project.difficulty || 'Standard'} • {project.estimated_time || 'Time TBD'}</p>
          <h1>{project.title}</h1>
          <p className="project-subtitle">{project.description}</p>
        </div>
      </section>

      <section className="project-body-section">
        <div className="project-layout fade-in delay-1">
          
          <div className="instructions-column">
            <h2 className="section-title">Instructions</h2>
            <div className="instructions-text">
              {project.instructions.split('\n').map((line, index) => {
                const trimmed = line.trim();
                if (!trimmed) return null;

                // STEP 1: Two images (Clean jar + Oil-filled jar)
                if (trimmed === '{{STEP_1_IMAGES}}') {
                  return (
                    <div key={index} className="step-image-grid">
                      <div className="step-image-card">
                        <img src="https://images.openai.com/static-rsc-4/PYGwSMlfp1E6bNXM8TSmSgAQiFCINZJKDVSuF4bl-uLNW9d_fjEd8JPRkO3kbh6-L1ZtF3xfPVe1nFi98mi2CVG3H0xQu-qanF-V9qR_22cn_fBeciDtHUqQAxamvy1Xj0uVpqQEucQ0wnXP4fswyWA3FwtWlb82A9GfMKNuU7gUlTTaalUkuuN10iBZzslf?purpose=fullsize" alt="Clean Glass Jar" />
                        <div className="step-image-content">
                          <h4>Clean Glass Jar</h4>
                          <p>Start with a thoroughly cleaned container.</p>
                        </div>
                      </div>
                      <div className="step-image-card">
                        <img src="https://images.openai.com/static-rsc-4/tgAAxRdEd852V71JH311WoZG2NW35UomhBxKjD1o9labM8xX7oP09jnZBUMaLlUbYJBCZsqHPswmMBqJfs2WuuomfGG94OjI1Ju3l3dOjjNDN26nw8LK54CF6ZT_6LT_GmAl6vDwrvKoxO4JP92PrpdQn9UMvfeMg5uIRou1LnvDw1Cz97DagEx5XDOLq2KP?purpose=fullsize" alt="Oil-Filled Jar" />
                        <div className="step-image-content">
                          <h4>Oil-Filled Jar</h4>
                          <p>Fill 3/4 full with cooking oil or rendered fat.</p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // STEP 2: Two images (Cotton string + Cotton alternatives)
                if (trimmed === '{{STEP_2_IMAGES}}') {
                  return (
                    <div key={index} className="step-image-grid">
                      <div className="step-image-card">
                        <img src="https://images.openai.com/static-rsc-4/uZcqDIXxw0fagVRqeR0rPUaegCAwfD0-IDxymKSGn-8wN-PEhs5QTWyx00lNhPJk_q8yXfbnAl3Isq_Q69E-BDyn1pEKv2MHKhnOimZRHhFBm2RiqFP5XehrvjtxhjByR4ZvGN7rL7SHBfz9eoxMcbPJi8ScdKGlQuAQdhfi0NkbmteDVa8_zoJ5MvdX7RM3?purpose=fullsize" alt="Cotton String" />
                        <div className="step-image-content">
                          <h4>Cotton String</h4>
                          <p>100% cotton string works perfectly as a wick.</p>
                        </div>
                      </div>
                      <div className="step-image-card">
                        <img src="https://images.openai.com/static-rsc-4/EnzKsy7akKHN7rbQzgOe8K46UrX_V-BUOmQux7f6fxoIc-eGCnBC2RBVxD-ULHBQ8QT8EtivsDty4qcd-ryh5Qd9kY2Uh9Y9Lnjir0jQCJ7goc1yHCTF95Y1JB9iEvsxrLMCGtcCQf3LJtgdy5uGhzVEt-jP-IdFIiHQhifJa19ATiL_JeTTAtt74k32TuKK?purpose=fullsize" alt="Cotton Ball Alternative" />
                        <div className="step-image-content">
                          <h4>Cotton Ball Alternative</h4>
                          <p>Roll a cotton ball tightly if string is unavailable.</p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // STEP 3: Two images (Foil holder + Metal lid)
                if (trimmed === '{{STEP_3_IMAGES}}') {
                  return (
                    <div key={index} className="step-image-grid">
                      <div className="step-image-card">
                        <img src="https://images.openai.com/static-rsc-4/rLy5QaLyXatfxUZccrMhRKVq9hPasqFTjXsuhATuKPARIbEtkeGXm4Ky5wdU03h3RIYpsfQiCrogELFjswFS8SheojupdiiS9VPIsTbtERuC7DOV8oQB2Z2h450DBiKAJy2JB_ugFsBmbwQ-AU0xa2p3IyVcz1Q3CP2Qh0PankS8cOCxDW9nYY4ipju0BHpU?purpose=fullsize" alt="Foil Holder" />
                        <div className="step-image-content">
                          <h4>Aluminum Foil Holder</h4>
                          <p>Thread wick through a small hole in foil.</p>
                        </div>
                      </div>
                      <div className="step-image-card">
                        <img src="https://images.openai.com/static-rsc-4/EGrcXTlzgjhSVILVRHpKnFoVDyJlfSJ2r7HGZNFCH5JH8kjzKbb2DCIt6WkRBCy7E7ELk77AiLLPADZZrncn9S79NZkmpVWDSv35reBaaMCFs8YLId2P8FY34M3F_J5TYRoNonhfHP1zU3qftBWzSnxaU6EBkHDgzxwNh0JoUSV1ILBBGWShekxKi95eSj05?purpose=fullsize" alt="Metal Lid" />
                        <div className="step-image-content">
                          <h4>Metal Lid</h4>
                          <p>A metal lid with a hole works even better.</p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // STEP 4: Single image (Assembled lamp)
                if (trimmed === '{{STEP_4_IMAGE}}') {
                  return (
                    <div key={index} className="step-single-image">
                      <img src="https://images.openai.com/static-rsc-4/Mn9dbJGqKC0aZkvQK27ePRubOStYRJpwYzA7qOVFvEjs8AzKbRd7gRrhneeK3hesFuvEEZI9853YlhiDHOWQvB9WmX0Lt4YEhDekNJtdN6Kc7LBnVYj-wSv7MROYPWAqoq-Ft3drWe6z2Gz-9jP6kbTO_yOxiX_nrT6Kr1bXiehzwLu2rZFWmAKLfh4GuWmq?purpose=fullsize" alt="Assembled Lamp" />
                      <div className="step-single-caption">
                        <p>Assembled Lamp</p>
                      </div>
                    </div>
                  );
                }

                // STEP 5: Single image (Final lit lamp)
                if (trimmed === '{{STEP_5_IMAGE}}') {
                  return (
                    <div key={index} className="step-single-image">
                      <img src="https://images.openai.com/static-rsc-4/YZit6qWOLHbAAHNlgV2eqNo6RfTdfUk2oVmw4Ppg4eCy29FBvN9ojoPhH3pxj6gRVVKekjFEJtgCsQlCWTnD5wOBtZA649b4oFD2ybYRk_2JOnqwDFEzbpMtlrK4VJB2BiWq8Y_sXReqmWHqZpT9FSXDtnSD1Twqhdw7GUOxrH1z2eC--o-QwDgTP7OIIXSA?purpose=fullsize" alt="Final Lit Lamp" />
                      <div className="step-single-caption">
                        <p>Final Appearance</p>
                      </div>
                    </div>
                  );
                }

                // Normal Step Headers
                if (trimmed.match(/^Step \d+:/i)) {
                  return <h4 key={index} className="step-header">{trimmed}</h4>;
                }
                
                // Normal Paragraphs
                return <p key={index} className="step-description">{trimmed}</p>;
              })}
            </div>
          </div>

          {/* Right Column: Resources */}
          <div className="resources-column">
            <div className="resource-block">
              <h3 className="resource-title">Required Materials</h3>
              {materials.length === 0 ? (
                <p className="empty-resource">No specific materials listed.</p>
              ) : (
                <div className="materials-grid">
                  {materials.map(mat => (
                    <div key={mat.id} className="material-card">
                      <div className="material-image">
                        {mat.image_url ? (
                          <img src={mat.image_url} alt={mat.name} />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#5c5952', fontSize: '11px' }}>No Image</div>
                        )}
                      </div>
                      <div className="material-info">
                        <h4>{mat.name}</h4>
                        {mat.description && <p className="resource-desc">{mat.description}</p>}
                        {mat.quantity && <span className="material-quantity">Qty: {mat.quantity}</span>}
                        
                        <label className="upload-btn">
                          {uploadingMatId === mat.id ? 'Uploading...' : '📷 Upload Photo'}
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }} 
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              
                              setUploadingMatId(mat.id);
                              const formData = new FormData();
                              formData.append('image', file);

                              try {
                                const response = await fetch(`http://localhost:5000/api/materials/${mat.id}/image`, {
                                  method: 'PATCH',
                                  body: formData
                                });
                                
                                if (response.ok) {
                                  const updatedMaterial = await response.json();
                                  setMaterials(materials.map(m => m.id === mat.id ? updatedMaterial : m));
                                }
                              } catch (error) {
                                console.error("Upload failed:", error);
                              } finally {
                                setUploadingMatId(null);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="resource-block" style={{ marginTop: '40px' }}>
              <h3 className="resource-title">Required Tools</h3>
              {tools.length === 0 ? (
                <p className="empty-resource">No specific tools listed.</p>
              ) : (
                <div className="tools-grid">
                  {tools.map(tool => (
                    <div key={tool.id} className="tool-card">
                      <div className="tool-image">
                        {tool.image_url ? (
                          <img src={tool.image_url} alt={tool.name} />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#5c5952', fontSize: '11px' }}>No Image</div>
                        )}
                      </div>
                      <div className="tool-info">
                        <h4>{tool.name}</h4>
                        {tool.description && <p className="resource-desc">{tool.description}</p>}
                        
                        <label className="upload-btn">
                          {uploadingToolId === tool.id ? 'Uploading...' : ' Upload Photo'}
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }} 
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              
                              setUploadingToolId(tool.id);
                              const formData = new FormData();
                              formData.append('image', file);

                              try {
                                const response = await fetch(`http://localhost:5000/api/tools/${tool.id}/image`, {
                                  method: 'PATCH',
                                  body: formData
                                });
                                
                                if (response.ok) {
                                  const updatedTool = await response.json();
                                  setTools(tools.map(t => t.id === tool.id ? updatedTool : t));
                                }
                              } catch (error) {
                                console.error("Upload failed:", error);
                              } finally {
                                setUploadingToolId(null);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProjectDetail;