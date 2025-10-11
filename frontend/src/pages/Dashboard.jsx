import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchPortfolios = async () => {
      try {
        const res = await fetch("http://localhost:4322/portfolio", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        setPortfolios(Array.isArray(data) ? data : data.portfolios || []);
      } catch (err) {
        console.error("Error fetching portfolios:", err);
        setPortfolios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [user]);

  const createScratchPortfolio = async () => {
    try {
      setFeedback("Creating blank portfolio...");

      const res = await fetch("http://localhost:4322/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: "Untitled Portfolio",
          slug: "scratch-" + Date.now().toString().slice(-4),
          theme: "scratch",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPortfolios((prev) => [...prev, data]);
        setFeedback("✅ Portfolio created successfully!");
        setTimeout(() => setFeedback(""), 2000);
        setShowModal(false);
      } else {
        setFeedback(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setFeedback("Failed to create portfolio.");
    }
  };

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.email?.split("@")[0] || "User"}</h1>
          <p>Manage your portfolios and profile here.</p>
          <hr />
        </div>

        <div className="dashboard-content">
          {loading ? (
            <div className="empty-state">
              <p>Loading portfolios...</p>
            </div>
          ) : portfolios.length === 0 ? (
            <div className="empty-state">
              <h2>No portfolios yet</h2>
              <p>Create your first portfolio:</p>
              <button className="new-btn" onClick={() => setShowModal(true)}>
                + Create Portfolio
              </button>
              {feedback && <p className="feedback">{feedback}</p>}
            </div>
          ) : (
            <>
              <div className="portfolio-list">
                {portfolios.map((p) => (
                  <div key={p._id} className="portfolio-card">
                    <h3>{p.name}</h3>
                    <p><b>Slug:</b> {p.slug}</p>
                    <p><b>Theme:</b> {p.theme}</p>
                  </div>
                ))}
              </div>

              <div className="center-btn">
                <button className="create-btn" onClick={() => setShowModal(true)}>
                  + Create New
                </button>
              </div>
              {feedback && <p className="feedback">{feedback}</p>}
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create a Portfolio</h2>
            <p>Choose a starting point:</p>

            <div className="modal-options">
              <button className="create-btn" onClick={createScratchPortfolio}>
                + Start from Scratch
              </button>
              <button className="create-btn" onClick={() => navigate("/templates")}>
                Choose a Template
              </button>
            </div>

            {feedback && <p className="feedback">{feedback}</p>}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}