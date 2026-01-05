import React, { useState, useRef, useEffect } from "react";
import { Palette } from "lucide-react";

const BUTTON_PRESETS = {
  primary: {
    bgColor: "#3b82f6",
    textColor: "#ffffff",
    borderRadius: 8,
    paddingX: 20,
    paddingY: 12,
    fontSize: 14,
    fontWeight: 500,
  },
  secondary: {
    bgColor: "#6b7280",
    textColor: "#ffffff",
    borderRadius: 8,
    paddingX: 20,
    paddingY: 12,
    fontSize: 14,
    fontWeight: 500,
  },
  success: {
    bgColor: "#10b981",
    textColor: "#ffffff",
    borderRadius: 8,
    paddingX: 20,
    paddingY: 12,
    fontSize: 14,
    fontWeight: 500,
  },
  danger: {
    bgColor: "#ef4444",
    textColor: "#ffffff",
    borderRadius: 8,
    paddingX: 20,
    paddingY: 12,
    fontSize: 14,
    fontWeight: 500,
  },
  outline: {
    bgColor: "transparent",
    textColor: "#3b82f6",
    borderRadius: 8,
    paddingX: 20,
    paddingY: 12,
    fontSize: 14,
    fontWeight: 500,
    border: "2px solid #3b82f6"
  },
};

export default function ButtonBlock({ element = {}, update, readOnly }) {
  const [showOptions, setShowOptions] = useState(false);
  const panelRef = useRef(null);

  const buttonStyle = element.style || {};
  const bgColor = buttonStyle.bgColor || "#3b82f6";
  const textColor = buttonStyle.textColor || "#ffffff";
  const borderRadius = buttonStyle.borderRadius ?? 8;
  const paddingX = buttonStyle.paddingX ?? 20;
  const paddingY = buttonStyle.paddingY ?? 12;
  const fontSize = buttonStyle.fontSize ?? 14;
  const fontWeight = buttonStyle.fontWeight ?? 500;
  const border = buttonStyle.border || "none";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showOptions]);

  const updateStyle = (styleUpdates) => {
    if (update) {
      update({
        ...element,
        style: { ...buttonStyle, ...styleUpdates }
      });
    }
  };

  const updateContent = (content) => {
    if (update) {
      update({ ...element, content });
    }
  };

  const updateLink = (link) => {
    if (update) {
      update({ ...element, link });
    }
  };

  const applyPreset = (presetName) => {
    if (update) {
      update({
        ...element,
        style: BUTTON_PRESETS[presetName]
      });
    }
  };

  const handleButtonClick = (e) => {
    if (readOnly && element.link) {
      window.open(element.link, "_blank");
    }
  };

  return (
    <div className="relative inline-block group">
      <button
        className="button-main transition-all hover:opacity-90 active:scale-95"
        style={{
          backgroundColor: bgColor,
          color: textColor,
          borderRadius: `${borderRadius}px`,
          padding: `${paddingY}px ${paddingX}px`,
          fontSize: `${fontSize}px`,
          fontWeight: fontWeight,
          border: border,
          minWidth: '120px',
          cursor: readOnly ? 'pointer' : 'default',
          outline: 'none',
          fontFamily: 'inherit'
        }}
        onClick={handleButtonClick}
      >
        <span
          contentEditable={!readOnly}
          suppressContentEditableWarning
          onInput={(e) => updateContent(e.currentTarget.innerText)}
          style={{ outline: 'none', cursor: readOnly ? 'pointer' : 'text' }}
        >
          {element.content || "Button"}
        </span>
      </button>

      {!readOnly && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowOptions(!showOptions);
          }}
          className="absolute -top-2 -right-2 bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md z-10"
          title="Button settings"
        >
          <Palette size={14} />
        </button>
      )}

      {!readOnly && showOptions && (
        <div
          ref={panelRef}
          className="absolute left-0 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-4 z-50"
          style={{
            top: '100%',
            marginTop: '8px',
            minWidth: '300px',
            maxWidth: '340px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Quick Styles
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(BUTTON_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key)}
                    className="px-3 py-2 text-xs font-medium rounded-md transition-all capitalize hover:scale-105"
                    style={{
                      backgroundColor: preset.bgColor,
                      color: preset.textColor,
                      border: preset.border || 'none'
                    }}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Link URL
              </label>
              <input
                type="text"
                value={element.link || ""}
                onChange={(e) => updateLink(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-md focus:border-blue-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Background
                </label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => updateStyle({ bgColor: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer border-2 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Text Color
                </label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => updateStyle({ textColor: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer border-2 border-gray-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Horizontal: {paddingX}px
                </label>
                <input
                  type="range"
                  min="8"
                  max="40"
                  value={paddingX}
                  onChange={(e) => updateStyle({ paddingX: parseInt(e.target.value) })}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Vertical: {paddingY}px
                </label>
                <input
                  type="range"
                  min="6"
                  max="24"
                  value={paddingY}
                  onChange={(e) => updateStyle({ paddingY: parseInt(e.target.value) })}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={fontSize}
                  onChange={(e) => updateStyle({ fontSize: parseInt(e.target.value) })}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Weight
                </label>
                <select
                  value={fontWeight}
                  onChange={(e) => updateStyle({ fontWeight: parseInt(e.target.value) })}
                  className="w-full px-2 py-1.5 text-sm border-2 border-gray-200 rounded-md focus:border-blue-400 focus:outline-none"
                >
                  <option value="400">Normal</option>
                  <option value="500">Medium</option>
                  <option value="600">Semibold</option>
                  <option value="700">Bold</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Roundness: {borderRadius}px
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={borderRadius}
                onChange={(e) => updateStyle({ borderRadius: parseInt(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>

            <button
              onClick={() => setShowOptions(false)}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
