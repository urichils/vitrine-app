// src/blocks/TextBlock.jsx
import React from "react";

export default function TextBlock({ element, update }) {
  return (
    <div
      className="content-editable"
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => update({ content: e.currentTarget.innerHTML })}
      dangerouslySetInnerHTML={{ __html: element.content || "<p>Edit text…</p>" }}
    />
  );
}
