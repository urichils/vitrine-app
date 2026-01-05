// import React, { useState } from "react";
// import { Images, Plus, X, Grid3x3 } from "lucide-react";
// import "../styles/Hero.css";

// export default function GalleryBlock({ element = {}, update, openModal, readOnly }) {
//   const [showOptions, setShowOptions] = useState(false);
//   const images = element.content ? element.content.split(',').map(s => s.trim()).filter(Boolean) : [];
//   const columns = element.style?.columns || 3;
//   const gap = element.style?.gap || 8;

//   const addImage = () => {
//     openModal && openModal(element.id);
//   };

//   const removeImage = (index) => {
//     const newImages = images.filter((_, i) => i !== index);
//     update(element.id, { ...element, content: newImages.join(', ') });
//   };

//   return (
//     <div className="relative group">
//       {images.length > 0 ? (
//         <div 
//           className="grid"
//           style={{ 
//             gridTemplateColumns: `repeat(${columns}, 1fr)`,
//             gap: `${gap}px`
//           }}
//         >
//           {images.map((url, i) => (
//             <div key={i} className="relative group/item">
//               <img 
//                 src={url} 
//                 alt={`Gallery ${i + 1}`}
//                 className="w-full h-32 object-cover rounded-lg"
//               />
//               {!readOnly && (
//                 <button
//                   onClick={() => removeImage(i)}
//                   className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity"
//                 >
//                   <X size={12} />
//                 </button>
//               )}
//             </div>
//           ))}
//           {!readOnly && (
//             <button
//               onClick={addImage}
//               className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-400 transition-colors"
//             >
//               <Plus size={24} className="text-gray-400" />
//             </button>
//           )}
//         </div>
//       ) : (
//         <div 
//           className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
//           onClick={() => !readOnly && addImage()}
//         >
//           <Images size={48} className="text-gray-400" />
//           <p className="get-started">Click to add images</p>
//           <p className="text-xs text-gray-400">Comma-separated URLs</p>
//         </div>
//       )}

//       {/* Layout Options */}
//       {!readOnly && showOptions && images.length > 0 && (
//         <div className="absolute top-full mt-2 left-0 bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 z-20 min-w-[200px]">
//           <div className="space-y-3">
//             <div>
//               <label className="text-xs font-medium text-gray-700 block mb-1">Columns: {columns}</label>
//               <input
//                 type="range"
//                 min="1"
//                 max="6"
//                 value={columns}
//                 onChange={(e) => update(element.id, { 
//                   ...element, 
//                   style: { ...element.style, columns: parseInt(e.target.value) }
//                 })}
//                 className="w-full"
//               />
//             </div>
//             <div>
//               <label className="text-xs font-medium text-gray-700 block mb-1">Gap: {gap}px</label>
//               <input
//                 type="range"
//                 min="0"
//                 max="32"
//                 value={gap}
//                 onChange={(e) => update(element.id, { 
//                   ...element, 
//                   style: { ...element.style, gap: parseInt(e.target.value) }
//                 })}
//                 className="w-full"
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {!readOnly && images.length > 0 && (
//         <button
//           onClick={() => setShowOptions(!showOptions)}
//           className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//         >
//           <Grid3x3 size={14} />
//         </button>
//       )}
//     </div>
//   );
// }
