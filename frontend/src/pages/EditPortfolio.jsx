// src/pages/EditPortfolio.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Rnd } from "react-rnd";
import { Move, Trash2 } from "lucide-react";
import { BLOCKS } from "../BlockRegistry";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Footer from "../components/Footer";
import "../styles/EditPortfolio.css";

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

export default function EditPortfolio() {
  const { portfolioId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [elements, setElements] = useState([]);
  const [canvasHeight, setCanvasHeight] = useState(1200);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({
    open: false,
    id: null,
    title: "",
    value: "",
  });

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
        const data = await res.json();
        if (!mountedRef.current) return;

        setElements(data?.elements || []);
        if (data.canvas?.height) setCanvasHeight(data.canvas.height);
      } catch {
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
    if (!loading) debouncedSave({ elements, canvas: { height: canvasHeight } });
  }, [elements, canvasHeight, debouncedSave, loading]);

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

  if (loading) return <p className="loading">Loading editor…</p>;

  return (
    <>
      <div className="canvas-shell-full">
        <div className="editor-top-right">
          <button className="top-btn" onClick={() => navigate(`/portfolio/${portfolioId}`)}>
            Publish
          </button>
          <button className="top-btn">{user?.username || "Account"}</button>
        </div>

        <div className="icon-toolbar">
          {Object.values(BLOCKS).map((b) => (
            <button key={b.type} className="icon-btn" onClick={() => add(b.type)} title={b.label}>
              {b.icon}
            </button>
          ))}
        </div>

        <main className="canvas-area">
          <div className="canvas-vw" style={{ minHeight: canvasHeight }}>
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
                    <div className="canvas-item" id={el.id}>
                      <div className="item-toolbar" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="drag-handle"><Move size={14} /></div>
                        <div style={{ fontSize: 12, color: "#666", marginRight: "auto" }}>{cfg?.label || el.type}</div>
                        <div className="item-actions">
                          {["image", "embed", "repos", "button"].includes(el.type) && (
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
          <div style={{ padding: 10 }}>
            <strong>Canvas</strong>
            <div style={{ marginTop: 8 }}>
              <label>Height</label>
              <input
                type="number"
                value={canvasHeight}
                onChange={(e) => setCanvasHeight(Math.max(400, +e.target.value || 1200))}
              />
            </div>
            <div style={{ marginTop: 12 }}>
              <button className="save-btn" onClick={() => saveNow({ elements, canvas: { height: canvasHeight } })}>
                Save
              </button>
            </div>
          </div>
        </aside>
      </div>

      <Modal open={modalState.open} title={modalState.title} value={modalState.value} onClose={closeModal} onSubmit={submitModal} />

      <Footer />
    </>
  );
}
