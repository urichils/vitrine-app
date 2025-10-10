import Footer from "../components/Footer"
import { useState } from "react";
import "../styles/Login.css";
import { auth, provider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

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
            localStorage.setItem("token", data.token);
            console.log("Logged in with Google!");
            } else {
            console.error("Backend error:", data);
            }
        } catch (err) {
            console.error("Google sign-in failed:", err);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }
        
        try {
            const res = await fetch("http://localhost:4322/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setEmail("");
                setPassword("");
                setConfirmPassword("");
            } else {
                setError(data.error || "Registration failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("Registration failed. Please try again.");
            setLoading(false);
            return;
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
        <div className="container-wrapper">
            <div className="container">
                <h1>Sign up for a new account</h1>
                <button type="button" className="log-button" onClick={handleGoogleLogin}> 
                    Sign in with Google
                </button>
                <p style={{ textAlign: 'center', margin: '20px 0', fontSize: 'small'}}><i> or </i></p>
                <form onSubmit={handleSubmit}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required />
                    <button className="log-button" type="submit" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {success && <p style={{ color: "green" }}>Account created successfully!</p>}
                </form>
            </div>
        </div>
        <Footer />
        </>
    )
}