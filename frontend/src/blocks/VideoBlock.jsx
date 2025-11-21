// src/blocks/VideoBlock.jsx
import React from "react";

export default function VideoBlock({ element, update }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "#000" }}>
      {element.content ? (
        <video src={element.content} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div style={{ color: "#ccc", padding: 12 }}>Double-click to set video URL</div>
      )}
    </div>
  );
}
