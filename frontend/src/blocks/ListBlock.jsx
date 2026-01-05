// import React, { useState, useRef, useEffect } from "react";
// import { List as ListIcon, Bold, Italic, AlignLeft, AlignCenter, AlignRight, ChevronDown, Rainbow } from "lucide-react";
// import "../styles/TextBlock.css";
// import { marked } from "marked";

// // Popular Google Fonts
// const GOOGLE_FONTS = [
//   { name: 'Inter', value: 'Inter' },
//   { name: 'Roboto', value: 'Roboto' },
//   { name: 'Open Sans', value: 'Open Sans' },
//   { name: 'Lato', value: 'Lato' },
//   { name:  'Montserrat', value: 'Montserrat' },
//   { name: 'Poppins', value: 'Poppins' },
//   { name:  'Raleway', value: 'Raleway' },
//   { name:  'Playfair Display', value: 'Playfair Display' },
//   { name: 'Merriweather', value: 'Merriweather' },
//   { name: 'Source Sans Pro', value: 'Source Sans Pro' },
// ];

// export default function ListBlock({ element = {}, update, readOnly }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isFocused, setIsFocused] = useState(false);
//   const [showFontMenu, setShowFontMenu] = useState(false);
//   const editorRef = useRef(null);
//   const fontMenuRef = useRef(null);
//   const rootRef = useRef(null);
//   const [mode, setMode] = useState("rich");
//   const [markdown, setMarkdown] = useState("");

//   const selectedFont = element.style?.fontFamily || 'Inter';

//   // Load Google Font dynamically
//   useEffect(() => {
//     if (selectedFont && selectedFont !== 'Inter') {
//       const link = document.createElement('link');
//       link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(selectedFont)}: wght@300;400;500;600;700&display=swap`;
//       link.rel = 'stylesheet';
//       document.head.appendChild(link);
//     }
//   }, [selectedFont]);

//   // Close font menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (fontMenuRef.current && !fontMenuRef.current.contains(e.target)) {
//         setShowFontMenu(false);
//       }
//     };

//     if (showFontMenu) {
//       document.addEventListener('mousedown', handleClickOutside);
//       return () => document.removeEventListener('mousedown', handleClickOutside);
//     }
//   }, [showFontMenu]);

//   const handleInput = (e) => {
//     update?.({
//       content: e.currentTarget.innerHTML
//     });
//   };

//   useEffect(() => {
//     if (!editorRef.current) return;
//     if (!element?.content) return;

//     editorRef.current.innerHTML = element.content;
//   }, []);

//   const handleFocus = () => {
//     if (readOnly) return;
//     setIsFocused(true);
//     setIsEditing(true);
//   };

//   const handleBlur = () => {
//     setIsFocused(false);
//     setTimeout(() => setIsEditing(false), 150);
//   };

//   const applyFormat = (command, value = null) => {
//     document.execCommand(command, false, value);
//     editorRef.current?.focus();
//   };

//   const handleFontChange = (fontFamily) => {
//     if (typeof update === 'function') {
//       update({
//         style: { ...element.style, fontFamily }
//       });
//     }
//     setShowFontMenu(false);
//     editorRef.current?.focus();
//   };

//   const isEmpty = !element?.content || element.content === "<ul><li>Item</li></ul>" || element.content.trim() === "";

//   return (
//     <div 
//       ref={rootRef}
//       className="text-block-root"
//       style={{
//         position: 'relative',
//         overflow: 'visible',
//         marginTop: isEditing || isFocused ? '56px' : '0px',
//       }}
//     >
//       {/* Formatting Toolbar */}
//       {(isEditing || isFocused) && !readOnly && (
//         <div className="text-toolbar">
//           {/* Font Family Dropdown */}
//           <div style={{ position: 'relative' }} ref={fontMenuRef}>
//             <button
//               onMouseDown={(e) => {
//                 e.preventDefault();
//                 setShowFontMenu(! showFontMenu);
//               }} 
//               className="text-toolbar-btn"
//               title="Font family"
//             >
//               <span className="max-w-[80px] truncate">{selectedFont}</span>
//               <ChevronDown size={14} />
//             </button>
            
//             {showFontMenu && (
//               <div className="font-menu">
//                 {GOOGLE_FONTS.map((font) => (
//                   <button
//                     key={font.value}
//                     onMouseDown={(e) => {
//                       e.preventDefault();
//                       handleFontChange(font.value);
//                     }}
//                     className={`font-menu-item ${selectedFont === font.value ? "active" : ""}`}
//                   >
//                     {font.name}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="toolbar-divider" />

//           <button
//             onMouseDown={(e) => {
//               e.preventDefault();
//               applyFormat('bold');
//             }}
//             className="text-toolbar-btn"
//             title="Bold"
//           >
//             <Bold size={16} />
//           </button>

//           <button
//             onMouseDown={(e) => {
//               e.preventDefault();
//               applyFormat('italic');
//             }}
//             className="text-toolbar-btn"
//             title="Italic"
//           >
//             <Italic size={16} />
//           </button>

//           <div className="toolbar-divider" />

//           <button
//             onMouseDown={(e) => {
//               e.preventDefault();
//               applyFormat('justifyLeft');
//             }}
//             className="text-toolbar-btn"
//             title="Align Left"
//           >
//             <AlignLeft size={16} />
//           </button>

//           <button
//             onMouseDown={(e) => {
//               e.preventDefault();
//               applyFormat('justifyCenter');
//             }}
//             className="text-toolbar-btn"
//             title="Align Center"
//           >
//             <AlignCenter size={16} />
//           </button>

//           <button
//             onMouseDown={(e) => {
//               e.preventDefault();
//               applyFormat('justifyRight');
//             }}
//             className="text-toolbar-btn"
//             title="Align Right"
//           >
//             <AlignRight size={16} />
//           </button>

//           <div className="toolbar-divider" />

//           <select
//             onMouseDown={(e) => e.preventDefault()}
//             onChange={(e) => {
//               applyFormat('fontSize', e.target.value);
//               e.target.value = '3';
//             }}
//             className="text-toolbar-select"
//             defaultValue="3"
//           >
//             <option value="1">Small</option>
//             <option value="3">Normal</option>
//             <option value="5">Large</option>
//             <option value="7">Huge</option>
//           </select>

//           <div className="toolbar-divider" />

//           <button
//             className="text-toolbar-btn"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               if (mode === "rich") {
//                 setMarkdown(editorRef.current?.innerText || "");
//                 setMode("markdown");
//               } else {
//                 const html = marked.parse(markdown || "");
//                 update?.({ content: html });
//                 setMode("rich");
//                 setTimeout(() => {
//                   if (editorRef.current) {
//                     editorRef.current.innerHTML = html;
//                   }
//                 }, 0);
//               }
//             }}
//             title="Toggle Markdown"
//           >
//             <Rainbow size={16} />
//           </button>
//         </div>
//       )}

//       {/* List Editor */}
//       <div
//         ref={editorRef}
//         className="text-editor"
//         contentEditable={! readOnly}
//         suppressContentEditableWarning
//         data-placeholder="Click to edit list..."
//         onInput={handleInput}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         style={{ fontFamily: selectedFont }}
//       />

//       {/* Empty State Hint */}
//       {!isFocused && isEmpty && !readOnly && (
//         <div style={{ display: 'flex', alignItems:  'center', justifyContent:  'center', color: '#d1d5db', padding: '12px' }}>
//           <ListIcon size={24} />
//         </div>
//       )}
//     </div>
//   );
// }