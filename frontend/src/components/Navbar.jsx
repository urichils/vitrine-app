import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import "../styles/Navbar.css";

export default function Navbar() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.body.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <nav className="navbar">
      <img src="/logo.svg" alt="Logo" />
      <ul>
        <li><a href="#">Sign Up</a></li>
        <li><a href="#">Login</a></li>
        <li>
          <button className="theme-toggle" onClick={() => setDark(!dark)}>
            {dark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </li>
      </ul>
    </nav>
  );
}
