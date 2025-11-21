// src/blocks/ContainerBlock.jsx
import React from "react";
export default function ContainerBlock({ element }) {
  return (
    <div style={{ padding: 12, borderRadius: 8, background: element.style?.bg || "#fff", minHeight: "100%" }}>
      {/* empty container — designers put blocks inside programmatically later */}
      <div style={{ color: "#999" }}>Container</div>
    </div>
  );
}
