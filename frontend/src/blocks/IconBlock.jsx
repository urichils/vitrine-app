// src/blocks/IconBlock.jsx
import React from "react";
import { Star } from "lucide-react";
export default function IconBlock({ element }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Star size={36} />
    </div>
  );
}
