import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import "../styles/Templates.css";

export default function Templates() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const templates = [
    { id: "minimal", name: "Minimal", desc: "Clean layout with focus on text." },
    { id: "modern", name: "Modern", desc: "Bold visuals and large sections." },
    { id: "creative", name: "Creative", desc: "Playful blocks and bright colors." },
  ];

  const createPortfolio = async (templateId) => {
    try {
      const res = await fetch("http://localhost:4322/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: `${templateId.charAt(0).toUpperCase() + templateId.slice(1)} Portfolio`,
          slug: `${templateId}-${Date.now().toString().slice(-4)}`,
          theme: templateId,
        }),
      });

      if (res.ok) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error creating from template:", err);
    }
  };

  return (
    <div className="templates-page">
      <h1>Choose a Template</h1>
      <p>Select a base design for your portfolio below.</p>

      <div className="templates-grid">
        {templates.map((t) => (
          <div
            key={t.id}
            className="template-card"
            onClick={() => createPortfolio(t.id)}
          >
            <div className={`template-preview ${t.id}`}>
              <div className="block header"></div>
              <div className="block text short"></div>
              <div className="block text"></div>
              <div className="block image"></div>
            </div>
            <h3>{t.name}</h3>
            <p>{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
