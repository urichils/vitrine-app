import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/authContext";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "../components/SortableItem.jsx"; // the component I wrote before
import "../styles/EditPortfolio.css";

// some helpers
const genId = (prefix = "s") =>
  prefix + "_" + Math.random().toString(36).slice(2, 9);

const debounce = (fn, wait = 800) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

// templates
const templates = {
  minimal: [
    {
      id: genId(),
      type: "hero",
      content: { title: "Hi, I'm", subtitle: "Description" },
      settings: {},
    },
    {
      id: genId(),
      type: "text",
      content: { heading: "About", body: "Add bio here." },
      settings: {},
    },
    {
      id: genId(),
      type: "projects",
      content: { heading: "Projects", items: [] },
      settings: {},
    },
  ],
  creative: [
    {
      id: genId(),
      type: "hero",
      content: { title: "Hello.", subtitle: "Design + Code" },
      settings: { style: "big" },
    },
    {
      id: genId(),
      type: "gallery",
      content: { images: [] },
      settings: {},
    },
  ],
};

// BlockEditor remains unchanged
function BlockEditor({ block, onChange, onRemove }) {
  const update = (patch) =>
    onChange({ ...block, content: { ...block.content, ...patch } });

  switch (block.type) {
    case "hero":
      return (
        <div className="block block-hero">
          <label>Hero Title</label>
          <input
            value={block.content.title || ""}
            onChange={(e) => update({ title: e.target.value })}
          />
          <label>Subtitle</label>
          <input
            value={block.content.subtitle || ""}
            onChange={(e) => update({ subtitle: e.target.value })}
          />
          <button className="small danger" onClick={() => onRemove(block.id)}>
            Remove
          </button>
        </div>
      );

    case "text":
      return (
        <div className="block block-text">
          <label>Heading</label>
          <input
            value={block.content.heading || ""}
            onChange={(e) => update({ heading: e.target.value })}
          />
          <label>Body</label>
          <textarea
            value={block.content.body || ""}
            onChange={(e) => update({ body: e.target.value })}
          />
          <button className="small danger" onClick={() => onRemove(block.id)}>
            Remove
          </button>
        </div>
      );

    case "projects":
      return (
        <div className="block block-projects">
          <label>Heading</label>
          <input
            value={block.content.heading || ""}
            onChange={(e) => update({ heading: e.target.value })}
          />
          <p className="muted">Project list editable later.</p>
          <button className="small danger" onClick={() => onRemove(block.id)}>
            Remove
          </button>
        </div>
      );

    case "gallery":
      return (
        <div className="block block-gallery">
          <label>Images (comma separated)</label>
          <input
            value={(block.content.images || []).join(", ")}
            onChange={(e) =>
              update({
                images: e.target.value.split(",").map((s) => s.trim()),
              })
            }
          />
          <button className="small danger" onClick={() => onRemove(block.id)}>
            Remove
          </button>
        </div>
      );

    default:
      return (
        <div className="block block-unknown">
          <p>Unknown block type: {block.type}</p>
          <button className="small danger" onClick={() => onRemove(block.id)}>
            Remove
          </button>
        </div>
      );
  }
}

// SidePanel remains mostly unchanged
function SidePanel({ block, updateBlock, portfolio, setPortfolio, onSave, saving }) {
  return (
    <aside className="editor-side">
      <div className="side-section">
        <h4>Templates</h4>
        <button className="tpl" onClick={() => onSave("minimal", true)}>
          Minimal
        </button>
        <button className="tpl" onClick={() => onSave("creative", true)}>
          Creative
        </button>
        <hr />
        <h4>Selected Block</h4>
        {!block && <p className="muted">Select a block to edit</p>}
        {block && (
          <>
            <p>
              <b>Type:</b> {block.type}
            </p>
            <label>Background (CSS)</label>
            <input
              value={block.settings?.bg || ""}
              onChange={(e) =>
                updateBlock({
                  ...block,
                  settings: { ...block.settings, bg: e.target.value },
                })
              }
              placeholder="e.g. linear-gradient(...)"
            />
            <label>Padding</label>
            <input
              value={block.settings?.padding || ""}
              onChange={(e) =>
                updateBlock({
                  ...block,
                  settings: { ...block.settings, padding: e.target.value },
                })
              }
              placeholder="e.g. 40px 0"
            />
          </>
        )}
        <hr />
        <h4>Portfolio Info</h4>
        <p><b>Name</b></p>
        <input
          value={portfolio?.name || ""}
          onChange={(e) =>
            setPortfolio((p) => ({ ...p, name: e.target.value }))
          }
        />
        <p><b>Slug</b></p>
        <input
          value={portfolio?.slug || ""}
          onChange={(e) =>
            setPortfolio((p) => ({ ...p, slug: e.target.value }))
          }
        />
        <div style={{ marginTop: 12 }}>
          <button className="primary" onClick={onSave}>
            {saving ? "Saving..." : "Save Portfolio"}
          </button>
        </div>
      </div>
    </aside>
  );
}

// MAIN COMPONENT
export default function EditPortfolio() {
  const { user } = useAuth();
  const { portfolioId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [sections, setSections] = useState([]);
  const [sideSelection, setSideSelection] = useState(null);
  const [feedback, setFeedback] = useState("");

  // Load portfolio
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(
          `http://localhost:4322/portfolio/${portfolioId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const data = await res.json();
        if (!mounted) return;
        setPortfolio(data);
        setSections(data.sections || []);
      } catch (err) {
        console.error("Load failed", err);
      } finally {
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [user, portfolioId]);

  // Save logic
  const saveNow = useCallback(
    async (payload) => {
      setSaving(true);
      try {
        const res = await fetch(
          `http://localhost:4322/portfolio/${portfolioId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) {
          const err = await res.json();
          setFeedback(err.error);
        } else {
          setFeedback("Saved!");
          setTimeout(() => setFeedback(""), 1200);
        }
      } finally {
        setSaving(false);
      }
    },
    [portfolioId, user]
  );

  const debouncedSave = useCallback(debounce(saveNow, 1000), [saveNow]);
  useEffect(() => {
    if (!portfolio) return;
    debouncedSave({ ...portfolio, sections });
  }, [sections]);

  // Drag and drop handler
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex !== newIndex) setSections(arrayMove(sections, oldIndex, newIndex));
  };

  // Block operations
  const addBlock = (type) => {
    const b = { id: genId(), type, content: {}, settings: {} };
    if (type === "hero") b.content = { title: "Hello", subtitle: "Description" };
    if (type === "text") b.content = { heading: "Heading", body: "Body text" };
    if (type === "projects") b.content = { heading: "Projects", items: [] };
    if (type === "gallery") b.content = { images: [] };
    setSections((prev) => [...prev, b]);
    setSideSelection(b.id);
  };

  const updateBlock = (updated) =>
    setSections((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));

  const removeBlock = (id) => {
    setSections((prev) => prev.filter((b) => b.id !== id));
    if (sideSelection === id) setSideSelection(null);
  };

  const insertTemplate = (templateKey) => {
    const blocks = templates[templateKey].map((b) => ({ ...b, id: genId() }));
    setSections((prev) => [...prev, ...blocks]);
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <>
      <div className="editor-wrap">
        <div className="editor-left">
          <div className="editor-topbar">
            <h2>Edit: {portfolio?.name || "Untitled"}</h2>
            <div className="topbar-actions">
              <button
                className="muted"
                onClick={() => navigate(`/portfolio/${portfolio.slug}`)}
              >
                Preview
              </button>
              <button
                className="primary"
                onClick={() => saveNow({ ...portfolio, sections })}
              >
                {saving ? "Saving..." : "Save now"}
              </button>
              <span className="save-feedback">{feedback}</span>
            </div>
          </div>

          {/* MAIN DRAG-AND-DROP */}
          <div className="editor-main">
            <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext
                items={sections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {sections.map((block) => (
                  <SortableItem key={block.id} id={block.id}>
                    <div className="draggable-item">
                      <div className="block-header">
                        <strong>{block.type.toUpperCase()}</strong>
                        <div className="block-controls">
                          <button
                            className="small"
                            onClick={() => setSideSelection(block.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="small danger"
                            onClick={() => removeBlock(block.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <BlockEditor
                        block={block}
                        onChange={updateBlock}
                        onRemove={removeBlock}
                      />
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>

            <div className="add-block-row">
              <button onClick={() => addBlock("hero")} className="outline">
                + Hero
              </button>
              <button onClick={() => addBlock("text")} className="outline">
                + Text
              </button>
              <button onClick={() => addBlock("projects")} className="outline">
                + Projects
              </button>
              <button onClick={() => addBlock("gallery")} className="outline">
                + Gallery
              </button>
            </div>
          </div>
        </div>

        <SidePanel
          block={sections.find((s) => s.id === sideSelection)}
          updateBlock={updateBlock}
          portfolio={portfolio}
          setPortfolio={setPortfolio}
          saving={saving}
          onSave={() => saveNow({ ...portfolio, sections })}
        />
      </div>

      <Footer />
    </>
  );
}
