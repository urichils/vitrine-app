// src/blocks/ColumnsBlock.jsx
import React from "react";
export default function ColumnsBlock({ element }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <div style={{ flex: 1, border: "1px dashed #eee", padding: 8 }}>Column 1</div>
      <div style={{ flex: 1, border: "1px dashed #eee", padding: 8 }}>Column 2</div>
    </div>
  );
}
