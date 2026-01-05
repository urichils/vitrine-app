import React, { useState, useEffect } from "react";
import { Github, Star, GitFork, ExternalLink, Settings, Loader2, AlertCircle } from "lucide-react";
import "../styles/ReposBlock.css";

const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript:   "#3178c6",
  Python:  "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#239120",
  PHP: "#777BB4",
  Ruby: "#CC342D",
  Swift: "#FA7343",
  Kotlin:   "#7F52FF",
  HTML: "#e34c26",
  CSS:   "#563d7c",
  Shell: "#89e051",
  SQL: "#336791",
  Vue: "#2c3e50",
  React:   "#61dafb",
  Angular: "#dd0031"
};

const getLanguageColor = (language) => {
  if (!language) return "#9CA3AF";
  return LANGUAGE_COLORS[language] || "#3b82f6";
};

export default function ReposBlock({ element = {}, update, openModal, readOnly }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRepos = async (username) => {
    if (!  username) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=12`);
      if (!res.ok) throw new Error("Failed to fetch repositories");
      const data = await res.json();
      setRepos(data);
      if (update) {
        update({ ...  element, content: username });
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (element?.  content) {
      fetchRepos(element.content);
    }
  }, [element?.content]);

  const hasUsername = element?.content;

  return (
    <div className="repos-block-container">
      <div className="flex h-full flex-1">
        <div className="flex-1 flex flex-col">
          <div className="repos-header">
            <div className="repos-header-content">
              <div className="repos-header-icon">
                <Github size={28} />
              </div>
              <div className="repos-header-text">
                <h3>GitHub Projects</h3>
                {hasUsername ?   (
                  <p className="repos-header-username">@{element.content}</p>
                ) : (
                  <p>Configure to display repositories</p>
                )}
              </div>
            </div>
          </div>

          <div className="repos-content">
            {loading && (
              <div className="repos-loading">
                <Loader2 className="repos-loading-spinner" />
                <p className="repos-loading-text">Loading repositories...</p>
              </div>
            )}

            {error && !  loading && (
              <div className="repos-error">
                <AlertCircle className="repos-error-icon" />
                <div className="repos-error-content">
                  <h4>Failed to load repositories</h4>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {!hasUsername && ! loading && (
              <div className="repos-empty">
                <div className="repos-empty-icon">
                  <Github />
                </div>
                <h4 className="repos-empty-title">No repositories yet</h4>
                <p className="repos-empty-text">
                  Click the configure button to add a GitHub username
                </p>
              </div>
            )}

            {repos.length > 0 && ! loading && (
              <div className="repos-grid">
                {repos.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo. html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="repo-card"
                  >
                    <div className="repo-card-header">
                      <h4 className="repo-card-title">{repo.name}</h4>
                      <ExternalLink className="repo-card-link-icon" />
                    </div>

                    {repo. description && (
                      <p className="repo-card-description">
                        {repo.description}
                      </p>
                    )}

                    <div className="repo-card-footer">
                      <div className="repo-card-stats">
                        {repo.stargazers_count > 0 && (
                          <div className="stat-badge stat-badge-stars">
                            <Star size={13} />
                            <span>{repo.stargazers_count. toLocaleString()}</span>
                          </div>
                        )}
                        {repo.  forks_count > 0 && (
                          <div className="stat-badge stat-badge-forks">
                            <GitFork size={13} />
                            <span>{repo.forks_count.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {repo.language && (
                        <div className="repo-language">
                          <span
                            className="language-dot"
                            style={{ backgroundColor: getLanguageColor(repo.language) }}
                          />
                          <span className="language-text">{repo.  language}</span>
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}

            {hasUsername && repos.length === 0 && ! loading && !  error && (
              <div className="repos-empty">
                <p className="repos-empty-text">No public repositories found</p>
              </div>
            )}
          </div>
        </div>

        {! readOnly && (
          <div className="repos-sidebar">
            <p className="repos-sidebar-label">Manage</p>
            <button
              onClick={() => openModal && openModal(element.id)}
              className="repos-configure-btn"
            >
              <Settings size={24} />
              <span>Configure</span>
            </button>
            <p className="repos-configure-help">Change username</p>
          </div>
        )}
      </div>
    </div>
  );
}