// src/blocks/CTABlock.jsx
import React from "react";

export default function CTABlock({ element, update }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <h3 contentEditable suppressContentEditableWarning onInput={(e) => update({ content: e.currentTarget.innerText })}>
        {element.content || "Call to action"}
      </h3>
      <button style={{ marginLeft: "auto", padding: "8px 12px", borderRadius: 8 }}>Action</button>
    </div>
  );
}
