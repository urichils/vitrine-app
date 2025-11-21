// src/blocks/EmbedBlock.jsx
import React from "react";

export default function EmbedBlock({ element, update }) {
  return (
    <div>
      {element.content ? (
        <div style={{ width: "100%", height: "100%" }} dangerouslySetInnerHTML={{ __html: element.content }} />
      ) : (
        <div style={{ color: "#888" }}>Double-click to set embed HTML / iframe</div>
      )}
    </div>
  );
}
