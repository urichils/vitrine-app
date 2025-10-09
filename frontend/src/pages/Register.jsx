import Footer from "../components/Footer"
import { useState } from "react";
import "../styles/Login.css";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    
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
                <form onSubmit={handleSubmit}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    <input type="password" value={password} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required />
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