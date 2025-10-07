import "../styles/Features.css";
import { Code, Palette, Cloud, Bot, Wrench, Rainbow } from "lucide-react";
import { useEffect, useState } from "react";

export default function Features() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector(".features");
      if (section && window.scrollY + window.innerHeight * 0.8 > section.offsetTop) {
        setVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Code size={32} />,
      title: "Developer-first",
      desc: "Built for coders who want control, not cookie-cutter templates.",
    },
    {
      icon: <Palette size={32} />,
      title: "Fully customizable",
      desc: "Style every section your way — no design degree required.",
    },
    {
      icon: <Cloud size={32} />,
      title: "Instant hosting",
      desc: "Your portfolio goes live in seconds. No setup, no nonsense.",
    },
    {
      icon: <Bot size={32} />,
      title: "AI integration",
      desc: "Generate a professional page in minutes.",
    },
    {
      icon: <Wrench size={32} />,
      title: "GitHub support",
      desc: "Your repositories are embedded easily. No complex steps.",
    },
    {
      icon: <Rainbow size={32} />,
      title: "Markdown/LaTeX support",
      desc: "Use Markdown or LaTeX formatting for extra flexibility.",
    },
  ];

  return (
    <section className={`features ${visible ? "visible" : ""}`}>
      <h2>Features</h2>
      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card">
            <div className="icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
