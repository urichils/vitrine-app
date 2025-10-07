import { set } from "mongoose";
import { useState } from "react";

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
        const res = await fetch("http://localhost:4322/auth/login", {
            method: "POST",
            headers: {"Content=Type": "application/json"},
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("token", data.token);
            setLoading(false);
        }
    } catch (err) {
        console.error(err);
        setError("Login failed. Please try again.");
        setLoading(false);
    }
}

export default function Login() {
    return (
        <div>
            <h1>
                Login
            </h1>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    )
}