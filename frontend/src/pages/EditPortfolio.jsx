import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import '../styles/EditPortfolio.css';

// small things that would help
const genId = (prefix = "s") => prefix + "_" + Math.random().toString(36).slice(2, 9);
const debounce = (fn, wait = 800) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait);};
}

// sample template blocks
const templates = {
    minimal: [
        {id: genId(), type: "hero", content: { title: "Hi, I'm", subtitle: "Description"}, settings: {}},
        { id: genId(), type: "text", content: { heading: "About", bodu: "Add bio here."}, settings: {}},
        {id: genId(), type: "projects", content: { heading: "Projects", items: [] }, settings: {}},
    ],
    creative: [
        { id: genId(), type: "hero", content: { title: "Hello.", subtitle: "Design + Code"}, settings: { style: "big" }},
        { id: genId(), type: "gallery", content: { images: [] }, settings: {} },
    ],
};

function BlockEditor({ block, onChange, onRemove }) {
    const update = (patch) => onChange({...block, content: {...block.content, ...patch}});

    switch (block.type) {
        case "hero":
            return (
                <div className="block block-hero">
                    <label>Hero Title</label>
                    <input value={block.content.title || ""} onChange= {(e) => update({ subtitle: e.target.value})} />
                    <label>Subtitle</label>
                    <input value={block.content.subtitle || ""} onChange={(e) => update({ subtitle: e.target.value})} />
                    <button className="small danger" onClick={() => onRemove(block.id)}>Remove</button>
                </div>
            );
        case "text":
            return (
                <div className="block block-text">
                    <label>Heading</label>
                    <input value={block.content.heading || ""} onChange={(e) => update({ heading: e.target.value})} />
                    <label>Body</label>
                    <textarea value={block.content.body || ""} onChange={(e) => update({ body: e.target.value})} />
                    <button className="small danger" onClick={() => onRemove(block.id)}>Remove</button>
                </div>
            );
        case "projects":
            return (
                <div className="block block-projects">
                    <label>Heading</label>
                    <input value={block.content.heading || ""} onChange={(e) => update({ heading: e.target.value})} />
                    <p className='muted'>projects list can managed later.</p>
                    <button className="small danger" onClick={() => onRemove(block.id)}>Remove</button>
                </div>
            );
        case "gallery":
            return (
                <div className="block block-gallery">
                    <label>Images (Comma Separated)</label>
                    <input value={(block.content.images || []).join(", ")} onChange={(e) => update({ images: e.target.value.split(",").map(s => s.trim()) })} />
                    <button className="small danger" onClick={() => onRemove(block.id)}>Remove</button>
                </div>
            );
        default:
            return (
                <div className="block block-unknown">
                    <p>Unknown block type: {block.type}</p>
                    <button className="small danger" onClick={() => onRemove(block.id)}>Remove</button>
                </div>
            );
    }
}

export default function EditPortfolio() {
    const { user } = useAuth();
    const { portfolioId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [portfolio, setPortfolio] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [sections, setSections] = useState([]);
    const [sideSelection, setSideSelection] = useState(null);
    const [isPreviewing, setIsPreviewing] = useState(false);

// fetch portfolio when user is there
    useEffect(() => {
        if (!user) return;
        let mounted = true;
        (async () => {
            try {
                const res = await fetch(`http://localhost:4322/portfolio/${portfolioId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    },
                });

                const data = await res.json();
                if (!mounted) return;
                setPortfolio(data);
                setSections(Array.isArray(data.sections) ? data.sections : []);
            } catch (err) {
            console.error("Load failed", err);
            } finally {
            setLoading(false);
            }
        })();
        return () => { mounted = false; }; }, [user, portfolioId]);

        // debounced auto-save

        const doSave = useCallback(async (payload) => {
            setSaving(true);
            try {
                const res= await fetch(`http://localhost:4322/portfolio/${portfolioId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) {
                    const err = await res.json();
                    setFeedback(err.error || "Save failed");
                } else {
                    setFeedback("Saved");
                    setTimeout(() => setFeedback(""), 1200);
                }
            } catch (err) {
                console.error(err);
                setFeedback("Network error");
            } finally {
                setSaving(false);
            }
        }, [portfolioId, user]);

    const debouncedSave = useCallback(debounce(doSave, 1000), [doSave]);

    // when sections change, trigger auto save and update portfolio

    useEffect(() => {
        if (!portfolio) return;
        const newPortfolio = {...portfolio, sections};
        setPortfolio(newPortfolio);
        debouncedSave(newPortfolio);
    }, [sections]);

    // dnd handlers

    function onDragEnd (result) {
        if (!result.destination) return;

        const from = result.source.index;
        const to = result.destination.index;
        if (from === to) return;
        const items = Array.from(sections);
        const [moved] = items.splice(from, 1);
        items.splice(to, 0, moved);
        setSections(items);
        setFeedback("Reordered");
            setTimeout(() => setFeedback(""), 1000);
    }

    // block stuff

    const addBlock = (type) => {
        const b = { id: genId(), type, content: {}, settings: {}};
        // default
        if (type === "hero") b.content = { title: "Hello", subtitle: "Description"};
        if (type === "text") b.content = { heading: "Heading", body: "Body text"};
        if (type === "projects") b.content = { heading: "Projects", items: []};
        setSections(prev => [...prev, b]);
        setSideSelection(b.id);
    };

    constremoveBlock = (id) => {
        setSections(prev => prev.filter(s => s.id!== id));
        if (sideSelection === id) setSideSelection(null);
    };

    const updateBlock = (updated) => {
        setSections(prev => prev.map(s => s.id === updated.id ? updated : s));
    };

    const insertTemplate = (templateKey) => {
        const blocks = (templates[templateKey] || []).map(b => ({...b, id: genId()}));
        setSections(prev => [...prev, ...blocks]);
        setFeedback("Template inserted");
        setTimeout(() => setFeedback(""), 1200);
    };

    const manualSaveNow = async () => {
        if (!portfolio) return;
        await doSave({...portfolio, sections});
    };

    if (loading) return <p style={{ marginTop: "6rem", textAlign: "center" }}>Loading...</p>;

    // the hell starts here

    return (
        <>
        <div className="editor-wrap">
            <div className="editor-left">
            <div className="editor-topbar">
                <h2>Edit: {portfolio?.name || "Untitled"}</h2>
                <div className="topbar-actions">
                <button className="muted" onClick={() => navigate(`/portfolio/${portfolio?.slug || ""}`)}>Preview</button>
                <button onClick={manualSaveNow} className="primary">{saving ? "Saving..." : "Save now"}</button>
                <span className="save-feedback">{feedback}</span>
                </div>
            </div>
            {/* what is this */}
            <div className="editor-main">
                <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections-droppable">
                    {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="sections-list">
                        {sections.map((s, idx) => (
                        <Draggable key={s.id} draggableId={s.id} index={idx}>
                            {(dr) => (
                            <div ref={dr.innerRef} {...dr.draggableProps} {...dr.dragHandleProps} className="draggable-item">
                                <div className="block-header">
                                <strong>{s.type.toUpperCase()}</strong>
                                <div className="block-controls">
                                    <button className="small" onClick={() => setSideSelection(s.id)}>Edit</button>
                                    <button className="small danger" onClick={() => removeBlock(s.id)}>Remove</button>
                                </div>
                                </div>
                                <BlockEditor block={s} onChange={updateBlock} onRemove={removeBlock} />
                            </div>
                            )}
                        </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                    )}
                </Droppable>
                </DragDropContext>

                <div className="add-block-row">
                <button onClick={() => addBlock("hero")} className="outline">+ Hero</button>
                <button onClick={() => addBlock("text")} className="outline">+ Text</button>
                <button onClick={() => addBlock("projects")} className="outline">+ Projects</button>
                <button onClick={() => addBlock("gallery")} className="outline">+ Gallery</button>
                </div>
            </div>
            </div>

            {/* side panel */}
            <aside className="editor-side">
            <div className="side-section">
                <h4>Templates</h4>
                <button className="tpl" onClick={() => insertTemplate("minimal")}>Minimal</button>
                <button className="tpl" onClick={() => insertTemplate("creative")}>Creative</button>
                <hr />
                <h4>Selected block</h4>
                {!sideSelection && <p className="muted">Select a block to edit its settings</p>}
                {sideSelection && (() => {
                const blk = sections.find(s => s.id === sideSelection);
                if (!blk) return <p>Block not found</p>;
                // small side settings UI
                return (
                    <>
                    <p><b>Type:</b> {blk.type}</p>
                    <label>Background (CSS)</label>
                    <input value={blk.settings.bg || ""} onChange={(e) => {
                        const updated = { ...blk, settings: { ...blk.settings, bg: e.target.value } };
                        updateBlock(updated);
                    }} placeholder="e.g. linear-gradient(...)" />
                    <label>Padding</label>
                    <input value={blk.settings.padding || ""} onChange={(e) => {
                        const updated = { ...blk, settings: { ...blk.settings, padding: e.target.value } };
                        updateBlock(updated);
                    }} placeholder="e.g. 40px 0" />
                    </>
                );
                })()}
                <hr />
                <h4>Portfolio</h4>
                <p><b>Name</b></p>
                <input value={portfolio?.name || ""} onChange={(e) => {
                setPortfolio(p => ({ ...p, name: e.target.value }));
                }} />
                <p><b>Slug</b></p>
                <input value={portfolio?.slug || ""} onChange={(e) => setPortfolio(p => ({ ...p, slug: e.target.value }))} />
                <div style={{ marginTop: 12 }}>
                <button className="primary" onClick={manualSaveNow}>{saving ? "Saving..." : "Save portfolio"}</button>
                </div>
            </div>
            </aside>
        </div>

        <Footer />
        </>
    );
}
