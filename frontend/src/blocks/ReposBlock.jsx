import React, { useState, useEffect } from "react";
import { Github, Star, GitFork, ExternalLink, Settings, Loader2, AlertCircle } from "lucide-react";

const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#239120",
  PHP: "#777BB4",
  Ruby: "#CC342D",
  Swift: "#FA7343",
  Kotlin: "#7F52FF",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  SQL: "#336791",
  Vue: "#2c3e50",
  React: "#61dafb",
  Angular: "#dd0031"
};

const getLanguageColor = (language) => {
  if (!language) return "#9CA3AF";
  return LANGUAGE_COLORS[language] || "#3b82f6";
};

export default function ReposBlock({ element = {}, update, openModal }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRepos = async (username) => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=12`);
      if (!res.ok) throw new Error("Failed to fetch repositories");
      const data = await res.json();
      setRepos(data);
      if (update) {
        update({ ...element, content: username });
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
    if (element?.content) {
      fetchRepos(element.content);
    }
  }, [element?.content]);

  const hasUsername = element?.content;

  return (
    <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
      <div className="flex h-full">
        <div className="flex-1 flex flex-col">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6 border-b border-gray-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <Github size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">GitHub Projects</h3>
                {hasUsername ? (
                  <p className="text-sm text-slate-300 mt-1">
                    @{element.content}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 mt-1">
                    Configure to display repositories
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 p-8">
            {loading && (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 size={48} className="text-slate-400 animate-spin" />
                <p className="mt-4 text-sm text-gray-600">Loading repositories...</p>
              </div>
            )}

            {error && !loading && (
              <div className="flex items-start gap-3 p-5 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900">Failed to load repositories</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {!hasUsername && !loading && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center mb-6">
                  <Github size={40} className="text-slate-400" />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">No repositories yet</p>
                <p className="text-sm text-gray-600 max-w-xs">
                  Click the configure button to add a GitHub username
                </p>
              </div>
            )}

            {repos.length > 0 && !loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {repos.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col h-full p-5 bg-gradient-to-br from-white to-slate-50 border border-gray-200 rounded-xl transition-all duration-300 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-base text-gray-900 group-hover:text-slate-700 transition-colors flex-1 line-clamp-1">
                          {repo.name}
                        </h4>
                        <ExternalLink size={16} className="text-slate-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>

                      {repo.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {repo.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-5 border-t border-gray-200 space-y-3">
                      <div className="flex items-center flex-wrap gap-2">
                        {repo.stargazers_count > 0 && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 rounded-full">
                            <Star size={13} className="text-yellow-600" />
                            <span className="text-xs font-semibold text-yellow-800">{repo.stargazers_count.toLocaleString()}</span>
                          </div>
                        )}
                        {repo.forks_count > 0 && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full">
                            <GitFork size={13} className="text-slate-700" />
                            <span className="text-xs font-semibold text-slate-800">{repo.forks_count.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {repo.language && (
                        <div className="flex items-center gap-2 pt-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: getLanguageColor(repo.language) }}
                          />
                          <span className="text-xs font-medium text-gray-700">{repo.language}</span>
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}

            {hasUsername && repos.length === 0 && !loading && !error && (
              <div className="text-center py-8">
                <p className="text-gray-500">No public repositories found</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-40 bg-gradient-to-b from-slate-50 to-white border-l border-gray-300 flex flex-col items-center justify-center gap-4 p-6">
          <div className="text-center mb-2">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Manage</p>
          </div>
          <button
            onClick={() => openModal && openModal(element.id)}
            className="w-full flex flex-col items-center gap-3 px-4 py-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
          >
            <Settings size={24} className="text-white" />
            <span className="text-sm font-semibold">Configure</span>
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">
            Change username
          </p>
        </div>
      </div>
    </div>
  );
}