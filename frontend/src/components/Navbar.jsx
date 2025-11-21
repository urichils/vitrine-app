import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "../styles/Navbar.css";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location && typeof location.pathname === "string"
    ? location.pathname
    : (typeof window !== "undefined" ? window.location.pathname : "/");

  useEffect(() => {
    document.body.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (path.startsWith("/edit")) return null;

  return (
    <nav className="navbar">
      <img src="/logo.svg" alt="Logo" className="logo" />

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        {user ? (
          <>
            <li><Link to="/create">Create New</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><button id="logout" onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/register">Sign Up</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}
        <li>
          <button className="theme-toggle" onClick={() => setDark(!dark)}>
            {dark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </li>
      </ul>
    </nav>
  );
}
