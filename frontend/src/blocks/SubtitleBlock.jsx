// src/blocks/SubheadingBlock.jsx
import React from "react";

export default function SubheadingBlock({ element, update }) {
  return (
    <h3
      className="content-editable"
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => update({ content: e.currentTarget.innerText })}
    >
      {element.content || "Subheading"}
    </h3>
  );
}
