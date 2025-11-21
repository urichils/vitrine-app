import React, { useState } from "react";

export default function SlideshowBlock({ element, update, openModal }) {
  const images = JSON.parse(element.content || "[]");
  const [index, setIndex] = useState(0);

  const addImage = () => {
    openModal(element.id, "Slideshow Image URL", "", (url) => {
      if (url) {
        const newImages = [...images, url];
        update({ content: JSON.stringify(newImages) });
      }
    });
  };

  const removeImage = () => {
    if (!images.length) return;
    const newImages = images.filter((_, i) => i !== index);
    update({ content: JSON.stringify(newImages) });
    setIndex((prev) => (prev >= newImages.length ? newImages.length - 1 : prev));
  };

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="relative w-full h-full border rounded overflow-hidden flex items-center justify-center bg-gray-100">
      {images.length ? (
        <>
          <img src={images[index]} alt="" className="w-full h-full object-cover" />
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white px-2 py-1 rounded"
            onClick={prev}
          >
            ◀
          </button>
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white px-2 py-1 rounded"
            onClick={next}
          >
            ▶
          </button>
          <button
            className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
            onClick={removeImage}
          >
            Remove
          </button>
        </>
      ) : (
        <button
          className="p-4 border rounded bg-gray-200 text-gray-700 cursor-pointer"
          onClick={addImage}
        >
          Add Image
        </button>
      )}
    </div>
  );
}
