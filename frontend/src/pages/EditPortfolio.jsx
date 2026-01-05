// src/pages/EditPortfolio.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Rnd } from "react-rnd";
import { Move, Trash2, Eye, Upload, X, Check } from "lucide-react";
import { BLOCKS } from "../BlockRegistry";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Footer from "../components/Footer";
import "../styles/EditPortfolio.css";
import AuthDebugHelper from "../components/AuthDebugHelper";
import { Link } from "react-router-dom";

const genId = () =>
  crypto?.randomUUID
    ? crypto.randomUUID()
    : "id_" + Math.random().toString(36).slice(2, 9);

const debounce = (fn, wait = 800) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

function Modal({ open, title, value, onClose, onSubmit }) {
  if (!open) return null;
  return (
    <div className="img-url-modal-backdrop">
      <div className="img-url-modal">
        <h3>{title}</h3>
        <input id="modal-input" defaultValue={value || ""} />
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            className="primary"
            onClick={() => {
              const v = document.getElementById("modal-input").value.trim();
              onSubmit(v);
              onClose();
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ open, elements, canvasHeight, canvasBackground, onClose }) {
  if (!open) return null;

  return (
    <div 
      className="img-url-modal-backdrop" 
      style={{ zIndex: 1000 }}
      onClick={onClose}
    >
      <div 
        className="preview-modal" 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '90vw',
          maxWidth: '1200px',
          height: '90vh',
          backgroundColor: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Preview Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '2px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Eye size={20} style={{ color: '#6b7280' }} />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Preview Mode</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Preview Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: canvasBackground
        }}>
          <div style={{
            position: 'relative',
            minHeight: canvasHeight,
            width: '100%'
          }}>
            {elements.map((el) => {
              const cfg = BLOCKS[el.type];
              const Block = cfg?.Render;

              return (
                <div
                  key={el.id}
                  style={{
                    position: 'absolute',
                    left: el.x,
                    top: el.y,
                    width: el.width,
                    height: el.height,
                    pointerEvents: 'auto'
                  }}
                >
                  {Block ? (
                    <Block 
                      element={el} 
                      update={() => {}} 
                      openModal={() => {}}
                      readOnly={true}
                    />
                  ) : (
                    <div>Unknown block</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function PublishModal({ open, onClose, onPublish, publishing }) {
  if (!open) return null;

  return (
    <div className="img-url-modal-backdrop">
      <div className="img-url-modal" style={{ maxWidth: '500px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Upload size={24} />
          Publish Portfolio
        </h3>
        <p style={{ margin: '16px 0', color: '#6b7280', fontSize: '14px' }}>
          Publishing will make your portfolio live and accessible to anyone with the link. 
          All changes will be saved automatically.
        </p>
        <div className="modal-actions">
          <button onClick={onClose} disabled={publishing}>
            Cancel
          </button>
          <button
            className="primary"
            onClick={onPublish}
            disabled={publishing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {publishing ? (
              <>
                <span className="spinner-small" />
                Publishing...
              </>
            ) : (
              <>
                <Check size={16} />
                Publish Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditPortfolio() {
  const { portfolioId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [elements, setElements] = useState([]);
  const [canvasHeight, setCanvasHeight] = useState(1200);
  const [canvasBackground, setCanvasBackground] = useState("#ffffff");
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [modalState, setModalState] = useState({
    open: false,
    id: null,
    title: "",
    value: "",
  });
  const [selectedId, setSelectedId] = useState(null);

  const mountedRef = useRef(true);

  useEffect(() => {
    const handleResize = () => setCanvasHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!user) return;
    mountedRef.current = true;

    (async () => {
      try {
        const res = await fetch(
          `http://localhost:4322/portfolio/${portfolioId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        console.log("Fetch response:", res);

        const text = await res.text();
        if (!text) throw new Error("Empty response");

        const data = JSON.parse(text);
        if (!mountedRef.current) return;

        setElements(data?.elements || []);
        if (data.canvas?.height) setCanvasHeight(data.canvas.height);
        if (data.canvas?.background) setCanvasBackground(data.canvas.background);
      } catch (err) {
        console.error("Failed to load portfolio:", err);
        setElements([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => { mountedRef.current = false; };
  }, [portfolioId, user]);

  const saveNow = useCallback(
    async (payload) => {
      if (!user) return;
      try {
        await fetch(`http://localhost:4322/portfolio/${portfolioId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(payload),
        });
      } catch (err) { console.error(err); }
    },
    [portfolioId, user]
  );

  const debouncedSave = useRef(debounce((p) => saveNow(p), 900)).current;

  useEffect(() => {
    if (!loading) debouncedSave({ elements, canvas: { height: canvasHeight, background: canvasBackground } });
  }, [elements, canvasHeight, canvasBackground, debouncedSave, loading]);

  const handlePublish = async () => {
    setPublishing(true);
    
    try {
      // First save current state
      await saveNow({ elements, canvas: { height: canvasHeight, background: canvasBackground } });
      
      // Then publish
      const res = await fetch(`http://localhost:4322/portfolio/${portfolioId}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (res.ok) {
        setPublishSuccess(true);
        setTimeout(() => {
          setPublishModalOpen(false);
          setPublishSuccess(false);
          // Optionally navigate to the published portfolio
          navigate(`/portfolio/${portfolioId}`);
        }, 1500);
      }
    } catch (err) {
      console.error("Publish failed:", err);
      alert("Failed to publish portfolio. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  const add = (type) => {
    const cfg = BLOCKS[type];
    const base = {
      id: genId(),
      type,
      x: Math.max(40, window.innerWidth * 0.08),
      y: 160 + elements.length * 40,
      width: cfg.defaultWidth,
      height: cfg.defaultHeight,
      content: cfg.defaultContent || "",
      style: {},
    };
    setElements((s) => [...s, base]);
    setTimeout(() => {
      const el = document.getElementById(base.id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  };

  const selected = elements.find((el) => el.id === selectedId);

  const update = (id, patch) =>
    setElements((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const remove = (id) =>
    setElements((prev) => prev.filter((p) => p.id !== id));

  const openModalFor = (id, title, initial = "") =>
    setModalState({ open: true, id, title, value: initial });

  const closeModal = () =>
    setModalState({ open: false, id: null, title: "", value: "" });

  const submitModal = (val) => {
    if (!modalState.id) return;
    update(modalState.id, { content: val });
  };

  if (loading) return <p className="loading">Loading editor...</p>;

  return (
    <>
      <div className="canvas-shell-full">
        <div className="editor-top-right">
          <div className="editor-top-right">
            <button className="top-btn top-btn-secondary" onClick={() => setPreviewOpen(true)}>
              <Eye size={16} />
              Preview
            </button>

            <button className="top-btn" onClick={() => setPublishModalOpen(true)}>
              <Upload size={16} />
              Publish
            </button>

            <button className="top-btn top-btn-ghost">
              <Link to="/dashboard" >{user?.username || "Account"}</Link>
            </button>
          </div>
        </div>

        <div className="icon-toolbar">
          {Object.values(BLOCKS).map((b) => (
            <button key={b.type} className="icon-btn" onClick={() => add(b.type)} title={b.label}>
              {b.icon}
            </button>
          ))}
        </div>

        <main className="canvas-area">
          <div 
            className="canvas-vw" 
            style={{ 
              minHeight: canvasHeight,
              backgroundColor: canvasBackground,
              transition: 'background-color 0.3s ease'
            }}
          >
            <div className="canvas-vw-inner">
              {elements.length === 0 && (
                <div className="canvas-empty">Add blocks from the top to start</div>
              )}
              {elements.map((el) => {
                const cfg = BLOCKS[el.type];
                const Block = cfg?.Render;

                return (
                  <Rnd
                    key={el.id}
                    id={el.id}
                    size={{ width: el.width, height: el.height }}
                    position={{ x: el.x, y: el.y }}
                    onDragStop={(_, d) => update(el.id, { x: Math.max(0, d.x), y: Math.max(0, d.y) })}
                    onResizeStop={(_, __, ref, ___, pos) =>
                      update(el.id, {
                        width: Math.max(60, ref.offsetWidth),
                        height: Math.max(40, ref.offsetHeight),
                        x: Math.max(0, pos.x),
                        y: Math.max(0, pos.y),
                      })
                    }
                    bounds="parent"
                    minWidth={60}
                    minHeight={40}
                    className="canvas-item-rnd"
                    dragHandleClassName="drag-handle"
                  >
                    <div className="canvas-item" onClick={() => setSelectedId(el.id)} id={el.id}>
                      <div className="item-toolbar" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="drag-handle"><Move size={14} /></div>
                        <div style={{ fontSize: 12, color: "#666", marginRight: "auto" }}>{cfg?.label || el.type}</div>
                        <div className="item-actions">
                          {["image", "embed", "repos", "button", "icon"].includes(el.type) && (
                            <button
                              className="tiny"
                              onClick={() =>
                                openModalFor(el.id, el.type === "repos" ? "GitHub username" : "Set content", el.content)
                              }
                            >
                              Set
                            </button>
                          )}
                          <button className="tiny danger" onClick={() => remove(el.id)} title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="item-body">
                        {Block ? (
                          <Block element={el} update={(p) => update(el.id, p)} openModal={(id) => openModalFor(id, el.type === "repos" ? "GitHub username" : "Set content", el.content)} />
                        ) : (
                          <div>Unknown block</div>
                        )}
                      </div>
                    </div>
                  </Rnd>
                );
              })}
            </div>
          </div>
        </main>

        <aside className="prop-panel open">
          <div className="prop-panel-inner">
            <strong>Canvas Settings</strong>
            
            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
                Background Color
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={canvasBackground}
                  onChange={(e) => setCanvasBackground(e.target.value)}
                  style={{ 
                    width: '50px', 
                    height: '32px', 
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                />
                <input
                  type="text"
                  value={canvasBackground}
                  onChange={(e) => setCanvasBackground(e.target.value)}
                  placeholder="#ffffff"
                  style={{ 
                    flex: 1,
                    padding: '6px 8px',
                    fontSize: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                {['#ffffff', '#f3f4f6', '#1f2937', '#3b82f6', '#10b981', '#f59e0b'].map(color => (
                  <button
                    key={color}
                    onClick={() => setCanvasBackground(color)}
                    style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: color,
                      border: canvasBackground === color ? '2px solid #000' : '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: '12px', fontWeight: '500' }}>Canvas Height</label>
              <input
                type="number"
                value={canvasHeight}
                onChange={(e) => setCanvasHeight(Math.max(400, +e.target.value || 1200))}
                style={{ marginTop: '4px' }}
              />
            </div>
            
            <div style={{ marginTop: 12 }}>
              <button 
                className="save-btn" 
                onClick={() => saveNow({ elements, canvas: { height: canvasHeight, background: canvasBackground } })}
              >
                Save Changes
              </button>
            </div>

            
          </div>
        </aside>
      </div>

      <Modal 
        open={modalState.open} 
        title={modalState.title} 
        value={modalState.value} 
        onClose={closeModal} 
        onSubmit={submitModal} 
      />

      <PreviewModal
        open={previewOpen}
        elements={elements}
        canvasHeight={canvasHeight}
        canvasBackground={canvasBackground}
        onClose={() => setPreviewOpen(false)}
      />

      <PublishModal
        open={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        onPublish={handlePublish}
        publishing={publishing}
      />

      {publishSuccess && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 1001
        }}>
          <Check size={20} />
          <span>Published successfully!</span>
        </div>
      )}

      <Footer />

      <style>{`
        .spinner-small {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <AuthDebugHelper />
    </>
  );
}