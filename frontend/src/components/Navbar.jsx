import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import { Link } from "react=router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <nav className="navbar">
      <img src="/logo.svg" alt="Logo" className="logo" />

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
  {menuOpen ? <X size={24} /> : <Menu size={24} />}
  </button>

  <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
      <li><Link to="/register">Sign Up</Link></li>
      <li><Link to="/login">Login</Link></li>
      <li>
        <button className="theme-toggle" onClick={() => setDark(!dark)}>
          {dark ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </li>
    </ul>

    </nav>
  );
}
