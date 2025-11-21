// src/blocks/ProfileBlock.jsx
import React from "react";
export default function ProfileBlock({ element, update }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: 10, background: "#eee" }} />
      <div>
        <div contentEditable suppressContentEditableWarning onInput={(e) => update({ content: e.currentTarget.innerText })} style={{ fontWeight: 700 }}>
          {element.content || "Name"}
        </div>
        <div style={{ color: "#777", fontSize: 13 }}>Role / short bio</div>
      </div>
    </div>
  );
}
