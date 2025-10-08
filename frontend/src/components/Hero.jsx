import { useState, useEffect } from "react";
import "../styles/Hero.css";

export default function Hero() {
  const phrases = [
    { normal: "Create eye-catching", highlight: " dev portfolios" },
    { normal: "Build amazing ", highlight: " personal sites" },
    { normal: "Blend your repos and resume", highlight: " seamlessly" },
  ];

  const [displayed, setDisplayed] = useState("");
  const [highlighted, setHighlighted] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [showPeriod, setShowPeriod] = useState(false);
  const [visible, setVisible] = useState(false); // new state

  useEffect(() => {
    setVisible(true); // triggers fade-in on mount
  }, []);

  useEffect(() => {
    const current = phrases[index];
    const fullText = current.normal + current.highlight;
    let timer;

    if (!deleting && displayed.length < fullText.length) {
      setShowPeriod(false);
      timer = setTimeout(() => {
        const next = fullText.slice(0, displayed.length + 1);
        const splitIndex = Math.min(next.length, current.normal.length);
        setDisplayed(next);
        setHighlighted(next.slice(splitIndex));
      }, 80);
    } else if (deleting && displayed.length > 0) {
      setShowPeriod(false);
      timer = setTimeout(() => {
        const next = fullText.slice(0, displayed.length - 1);
        const splitIndex = Math.min(next.length, current.normal.length);
        setDisplayed(next);
        setHighlighted(next.slice(splitIndex));
      }, 40);
    } else if (!deleting && displayed.length === fullText.length) {
      setShowPeriod(true);
      timer = setTimeout(() => setDeleting(true), 1200);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timer);
  }, [displayed, deleting, index, phrases]);

  const current = phrases[index];
  const plain = displayed.slice(0, current.normal.length);

  return (
    <section className={`hero ${visible ? "visible" : ""}`}>
      <h1>
        {plain}
        <span className="gradient-text">{highlighted}</span>
        {showPeriod && <span className="period">.</span>}
        <span className="cursor">_</span>
      </h1>
      <p>Build and host your portfolio in minutes.</p>
      <button className="get-started">
        Get Started <span className="arrow">→</span>
    </button>  
    </section>
  );
}
