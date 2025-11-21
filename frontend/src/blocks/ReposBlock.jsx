// src/blocks/ReposBlock.jsx
import React, { useState } from "react";

export default function ReposBlock({ element, update, openModal }) {
  const [repos, setRepos] = useState([]);

  const fetchRepos = async (username) => {
    try {
      const res = await fetch(`https://api.github.com/users/${username}/repos`);
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setRepos(data.slice(0, 12)); // show first 12
      update({ content: username });
    } catch (err) {
      console.error(err);
      setRepos([]);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <strong>GitHub:</strong>
        <div style={{ color: "#666" }}>{element.content || "(no username set)"}</div>
        <button onClick={() => openModal && openModal(element.id)} style={{ marginLeft: "auto" }}>Set</button>
      </div>

      <div style={{ marginTop: 10 }}>
        {repos.length === 0 && <div style={{ color: "#888" }}>No repos loaded. Click Set and enter a GitHub username.</div>}
        <ul style={{ marginTop: 8 }}>
          {repos.map((r) => (
            <li key={r.id}><a href={r.html_url} target="_blank" rel="noreferrer">{r.name}</a> — ⭐ {r.stargazers_count}</li>
          ))}
        </ul>
      </div>

      {/* if content holds username and modal isn't opened, try to fetch once */}
    </div>
  );
}
