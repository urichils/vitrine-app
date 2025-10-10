import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        Alpha release
      </p>
      <p>
        Made with <span className="gradient-text">love</span> and ADHD hyperfocus ♡
      </p>
      <p className="copyright">
        © {new Date().getFullYear()} Vitrine. All rights reserved.
      </p>
    </footer>
  );
}
