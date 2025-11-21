// src/blocks/CodeBlock.jsx
import React from "react";
export default function CodeBlock({ element, update }) {
  return (
    <pre contentEditable suppressContentEditableWarning
      onInput={(e) => update({ content: e.currentTarget.innerText })} style={{ background: "#0f1724", color: "#e6eef8", padding: 12, borderRadius: 8, overflow: "auto" }}>
      {element.content || "// code here"}
    </pre>
  );
}
