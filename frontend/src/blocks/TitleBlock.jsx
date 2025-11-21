import React, { useCallback, useMemo } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

export default function TitleBlock({ element, update }) {
  const editor = useMemo(() => withReact(createEditor()), []);
  
  // Initial value for Slate
  const value = useMemo(
    () => element.content ? JSON.parse(element.content) : [
      { type: 'paragraph', children: [{ text: 'Title' }] },
    ],
    [element.content]
  );

  const handleChange = useCallback(
    (newValue) => {
      update({ content: JSON.stringify(newValue) });
    },
    [update]
  );

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
      <Editable
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          outline: 'none',
          minHeight: '50px',
        }}
        placeholder="Title"
      />
    </Slate>
  );
}
