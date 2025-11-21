// src/blocks/ButtonBlock.jsx
import React from "react";

export default function ButtonBlock({ element, update }) {
  return (
    <div>
      <button
        contentEditable={false}
        className="cta-btn"
        onClick={() => {}}
        style={{ padding: "10px 14px", borderRadius: 8 }}
      >
        <span
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => update({ content: e.currentTarget.innerText })}
        >
          {element.content || "Button"}
        </span>
      </button>
    </div>
  );
}
