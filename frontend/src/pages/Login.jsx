import { useEffect, useState } from "react";
import "../styles/Login.css";
import Footer from "../components/Footer";
import { auth, provider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4322/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, email);
        navigate("/dashboard");
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await fetch("http://localhost:4322/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await res.json();
      if (res.ok) {
        login(data.token);
        navigate("/dashboard");
        console.log("Logged in with Google!");
      } else {
        console.error("Backend error:", data);
        setError(data.error || "Google login failed");
      }
    } catch (err) {
      console.error("Google sign-in failed:", err);
      setError("Google login failed");
    }
  };

  return (
    <>
      <div className="container-wrapper">
        <div className="container">
          <h1>Login to your account</h1>
          <button type="button" className="log-button" onClick={handleGoogleLogin}>
            Sign in with Google
          </button>
          <p style={{ textAlign: "center", margin: "20px 0", fontSize: "small" }}>
            <i> or </i>
          </p>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="input-box">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <br />
            <button type="submit" className="log-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}