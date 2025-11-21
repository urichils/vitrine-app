import React, { useCallback, useMemo } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

export default function SubheadingBlock({ element, update }) {
  const editor = useMemo(() => withReact(createEditor()), []);
  
  const value = useMemo(
    () => element.content ? JSON.parse(element.content) : [
      { type: 'paragraph', children: [{ text: 'Subheading' }] },
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
          fontSize: '1.5rem',
          fontWeight: '500',
          outline: 'none',
        }}
        placeholder="Subheading"
      />
    </Slate>
  );
}
