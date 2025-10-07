import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState(null);

  const register = async () => {
    try {
      const res = await fetch("http://localhost:4322/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      setResponse(await res.json());
    } catch (err) {
      setResponse({ error: err.message });
    }
  };

  const login = async () => {
    try {
      const res = await fetch("http://localhost:4322/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      setResponse(await res.json());
    } catch (err) {
      setResponse({ error: err.message });
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Backend Tester</h1>
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>
      <pre>{response && JSON.stringify(response, null, 2)}</pre>
    </div>
  );
}

export default App;
