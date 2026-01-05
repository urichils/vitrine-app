import React, { useState, useRef, useEffect } from "react";
import { Code, Copy, Check } from "lucide-react";
import "../styles/CodeBlock.css";

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 'php', 'ruby',
  'go', 'rust', 'swift', 'kotlin', 'sql', 'html', 'css', 'json', 'xml', 'yaml', 'bash', 'shell'
];

const THEMES = {
  dark: { bg: '#1e293b', text: '#e2e8f0', accent: '#38bdf8', border: '#334155' },
  light: { bg: '#f8fafc', text: '#334155', accent: '#3b82f6', border: '#e2e8f0' }
};

export default function CodeBlock({ element = {}, update, readOnly }) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const preRef = useRef(null);
  const toolbarRef = useRef(null);
  const blurTimeoutRef = useRef(null);

  const style = element.style || {};
  const theme = style.theme || 'dark';
  const language = style.language || 'javascript';
  const showLineNumbers = style.showLineNumbers ?? true;

  const currentTheme = THEMES[theme];

  const handleUpdateStyle = (key, value) => {
    if (typeof update === 'function') {
      update({ 
        style: { ...style, [key]: value }
      });
    }
  };

  const handleContentChange = (e) => {
    if (typeof update === 'function') {
      update({ 
        content: e.currentTarget.innerText 
      });
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(element.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = (element.content || '').split('\n').length;

  const handlePreBlur = () => {
    // Delay blur to check if focus moved to toolbar
    blurTimeoutRef.current = setTimeout(() => {
      setIsEditing(false);
    }, 50);
  };

  const handleToolbarFocus = () => {
    // Cancel blur timeout if toolbar gets focus
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    setIsEditing(true);
  };

  const handleToolbarBlur = () => {
    // Refocus the pre element when toolbar loses focus
    if (preRef.current) {
      preRef.current.focus();
    }
  };

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="code-block-root">
      {/* Header */}
      <div className="code-block-header" style={{ backgroundColor: currentTheme.border }}>
        <div className="code-block-info">
          <Code size={14} />
          <span className="code-block-language">{language}</span>
        </div>
        <div className="code-block-actions">
          <button
            onClick={copyCode}
            className="code-block-btn"
            title="Copy code"
            style={{ color: currentTheme.text }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Settings Toolbar - Only in edit mode */}
      {!readOnly && isEditing && (
        <div 
          className="code-block-toolbar" 
          style={{ backgroundColor: currentTheme.border }}
          ref={toolbarRef}
          onFocus={handleToolbarFocus}
          onBlur={handleToolbarBlur}
        >
          <div className="toolbar-group">
            <label>Language</label>
            <select
              value={language}
              onChange={(e) => handleUpdateStyle('language', e.target.value)}
              className="toolbar-select"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="toolbar-group">
            <label>Theme</label>
            <select
              value={theme}
              onChange={(e) => handleUpdateStyle('theme', e.target.value)}
              className="toolbar-select"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="dracula">Dracula</option>
            </select>
          </div>

          <div className="toolbar-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showLineNumbers}
                onChange={(e) => handleUpdateStyle('showLineNumbers', e.target.checked)}
              />
              Line Numbers
            </label>
          </div>
        </div>
      )}

      {/* Code Editor */}
      <div className="code-block-container" style={{ backgroundColor: currentTheme.bg }}>
        {showLineNumbers && (
          <div className="code-block-lines" style={{ color: currentTheme.accent }}>
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1} className="code-line-number">
                {i + 1}
              </div>
            ))}
          </div>
        )}
        <pre
          ref={preRef}
          contentEditable={!readOnly}
          suppressContentEditableWarning
          onInput={handleContentChange}
          onFocus={() => setIsEditing(true)}
          onBlur={handlePreBlur}
          className="code-block-editor"
          style={{
            color: currentTheme.text,
            paddingLeft: showLineNumbers ? '8px' : '16px'
          }}
        >
          {element.content || "// Your code here\nconsole.log('Hello World');"}
        </pre>
      </div>
    </div>
  );
}
