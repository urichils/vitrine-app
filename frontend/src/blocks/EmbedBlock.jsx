import React, { useState } from "react";
import { Code, ChevronDown } from "lucide-react";

export default function EmbedBlock({ element = {}, update, readOnly }) {
  const [showSettings, setShowSettings] = useState(false);

  const style = element.style || {};
  const bgColor = style.bgColor || "#f9fafb";
  const padding = style.padding || 16;
  const borderRadius = style.borderRadius || 8;
  const borderColor = style.borderColor || "#e5e7eb";
  const borderWidth = style.borderWidth || 1;

  const updateStyle = (styleUpdates) => {
    if (update) {
      update({
        style: { ...style, ...styleUpdates }
      });
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: bgColor,
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: `${borderRadius}px`,
        overflow: "hidden",
      }}
    >
      {/* Content Area */}
      <div
        style={{
          flex: 1,
          padding: `${padding}px`,
          overflow: "auto",
          width: "100%",
        }}
      >
        {element.content ? (
          <div
            style={{
              width: "100%",
              height: "100%",
            }}
            dangerouslySetInnerHTML={{ __html: element.content }}
          />
        ) : (
          <div
            style={{
              color: "#9ca3af",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              flexDirection: "column",
              gap: "8px",
              textAlign: "center",
            }}
          >
            <Code size={32} strokeWidth={1.5} />
            <div style={{ fontSize: "14px", fontWeight: "500" }}>
              No embed content yet
            </div>
            {! readOnly && (
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Click "Set" to add embed HTML or iframe code
              </div>
            )}
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {! readOnly && (
        <div
          style={{
            borderTop: `1px solid ${borderColor}`,
            padding: "12px",
            backgroundColor: "#f0f9ff",
            display: "flex",
            alignItems: "center",
            gap:  "12px",
          }}
        >
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: "6px 12px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize:  "12px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap:  "4px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            Style
            <ChevronDown
              size={14}
              style={{
                transform: showSettings ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </button>

          {showSettings && (
            <div
              style={{
                display: "flex",
                gap: "12px",
                padding: "12px",
                backgroundColor: "white",
                borderRadius: "4px",
                border: "1px solid #e5e7eb",
                flexWrap: "wrap",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "11px",
                    fontWeight:  "600",
                    display: "block",
                    marginBottom: "4px",
                    color: "#374151",
                  }}
                >
                  Padding:  {padding}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={padding}
                  onChange={(e) =>
                    updateStyle({ padding:  parseInt(e.target.value) })
                  }
                  style={{ width: "120px", accentColor: "#3b82f6" }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    display: "block",
                    marginBottom: "4px",
                    color: "#374151",
                  }}
                >
                  Border Radius:  {borderRadius}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="16"
                  value={borderRadius}
                  onChange={(e) =>
                    updateStyle({ borderRadius: parseInt(e.target. value) })
                  }
                  style={{ width: "120px", accentColor: "#3b82f6" }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    display: "block",
                    marginBottom: "4px",
                    color: "#374151",
                  }}
                >
                  Border Width: {borderWidth}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={borderWidth}
                  onChange={(e) =>
                    updateStyle({ borderWidth: parseInt(e.target. value) })
                  }
                  style={{ width: "120px", accentColor: "#3b82f6" }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    display: "block",
                    marginBottom: "4px",
                    color: "#374151",
                  }}
                >
                  Background
                </label>
                <input
                  type="color"
                  value={bgColor === "transparent" ? "#ffffff" : bgColor}
                  onChange={(e) => updateStyle({ bgColor:  e.target.value })}
                  style={{
                    width: "40px",
                    height: "32px",
                    border: "1px solid #ddd",
                    borderRadius:  "4px",
                    cursor: "pointer",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    display: "block",
                    marginBottom: "4px",
                    color: "#374151",
                  }}
                >
                  Border Color
                </label>
                <input
                  type="color"
                  value={borderColor}
                  onChange={(e) => updateStyle({ borderColor: e. target.value })}
                  style={{
                    width: "40px",
                    height:  "32px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor:  "pointer",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}