// src/blocks/ImageBlock.jsx
import React from "react";
import { Image as ImageIcon } from "lucide-react";

export default function ImageBlock({ element, update, openModal }) {
  return (
    <div
      className={`image-placeholder ${element.content ? "has" : "empty"}`}
      onDoubleClick={() => openModal && openModal(element.id)}
      onClick={() => element.content || (openModal && openModal(element.id))}
    >
      {element.content ? <img src={element.content} alt="user" /> : (
        <div style={{ textAlign: "center", color: "#888" }}>
          <ImageIcon size={28} />
          <div>Click to set image</div>
        </div>
      )}
    </div>
  );
}
