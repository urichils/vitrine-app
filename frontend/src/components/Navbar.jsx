import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
            <li><button onClick={handleLogout}>Logout</button></li>
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
