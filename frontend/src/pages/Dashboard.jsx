import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPortfolios = async () => {
      try {
        const res = await fetch("http://localhost:4322/portfolio", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();

        if (Array.isArray(data)) {
          setPortfolios(data);
        } else if (Array.isArray(data.portfolios)) {
          setPortfolios(data.portfolios);
        } else {
          setPortfolios([]);
        }
      } catch (err) {
        console.error("Error fetching portfolios:", err);
        setPortfolios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [user]);

  return (
    <>
      <div className="dashboard">
        <h1>Welcome back, {user?.email || "User"} 👋</h1>
        <p style={{ marginBottom: "2rem", color: "#777" }}>
          Manage your portfolios and profile here.
        </p>

        <div className="portfolio-list">
          {loading ? (
            <p>Loading portfolios...</p>
          ) : portfolios.length === 0 ? (
            <p>No portfolios yet. Click "Create New" to start!</p>
          ) : (
            portfolios.map((p) => (
              <div key={p._id} className="portfolio-card">
                <h3>{p.name}</h3>
                <p>Slug: {p.slug}</p>
                <p>Theme: {p.theme}</p>
              </div>
            ))
          )}
        </div>

        <button
          className="create-button"
          onClick={() => navigate("/create")}
        >
          + Create New
        </button>

        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>

      <Footer />
    </>
  );
}
