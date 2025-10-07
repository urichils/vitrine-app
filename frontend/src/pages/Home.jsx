import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import "../styles/Home.css";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="home">
        <Hero />
      </main>
      <Footer />
    </>
  );
}
