
import React from "react";
export default function GalleryBlock({ element }) {
  const images = (element.content || "").split(",").map(s => s.trim()).filter(Boolean);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
      {images.length ? images.map((u,i) => <img key={i} src={u} style={{ width: "100%", height: 100, objectFit: "cover" }} />) : <div style={{ color: "#888" }}>Click to set comma-separated image URLs</div>}
    </div>
  );
}
