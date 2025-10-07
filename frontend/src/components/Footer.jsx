import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        Made with <span className="gradient-text">passion</span> and caffeine ☕
      </p>
      <p className="copyright">
        © {new Date().getFullYear()} Vitrine. All rights reserved.
      </p>
    </footer>
  );
}
