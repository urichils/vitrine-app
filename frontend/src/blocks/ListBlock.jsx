
import React from "react";
export default function ListBlock({ element, update }) {
  return (
    <div
      className="content-editable"
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => update({ content: e.currentTarget.innerHTML })}
      dangerouslySetInnerHTML={{ __html: element.content || "<ul><li>Item</li></ul>" }}
    />
  );
}
