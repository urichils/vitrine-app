
import React from "react";
export default function QuoteBlock({ element, update }) {
  return (
    <blockquote
      className="content-editable"
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => update({ content: e.currentTarget.innerHTML })}
      dangerouslySetInnerHTML={{ __html: element.content || "<blockquote>Quote</blockquote>" }}
      style={{ margin: 0, paddingLeft: 12, borderLeft: "3px solid #eee" }}
    />
  );
}
