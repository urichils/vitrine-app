import React from "react";
import { ArrowRight } from "lucide-react";

export default function CTABlock({ element = {}, update, readOnly }) {
  const bgColor = element.style?.bgColor || '#fef3c7';
  const borderColor = element.style?.borderColor || '#fbbf24';

  return (
    <div
      className="relative p-6 rounded-lg border-2 transition-all hover:shadow-md"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h3
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onInput={(e) => update && update(element.id, { ...element, title: e.currentTarget.innerText })}
            className="text-xl font-bold text-gray-900 outline-none mb-2"
          >
            {element.title || "Ready to get started?"}
          </h3>
          <p
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onInput={(e) => update && update(element.id, { ...element, description: e.currentTarget.innerText })}
            className="text-gray-700 outline-none"
          >
            {element.description || "Take action now and see results."}
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
          onClick={() => {
            if (readOnly && element.buttonLink) {
              window.open(element.buttonLink, '_blank');
            }
          }}
        >
          <span
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onInput={(e) => update && update(element.id, { ...element, buttonText: e.currentTarget.innerText })}
            className="outline-none"
          >
            {element.buttonText || "Get Started"}
          </span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}