import React, { useState, useRef, useEffect } from "react";
import { Palette } from "lucide-react";
import "../styles/ButtonBlock.css";

const BUTTON_PRESETS = {
  primary: {
    bgColor: "rgb(0, 219, 166)",
    textColor: "#ffffff",
    borderRadius: 8,
    paddingX: 20,
    paddingY: 12,
    fontSize: 14,
    fontWeight: 500,
  },
  secondary: {
    bgColor: "#6b7280",
    textColor:  "#ffffff",
    borderRadius:  8,
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
    textColor: "rgb(0, 219, 166)",
    borderRadius: 8,
    paddingX: 20,
    paddingY: 12,
    fontSize: 14,
    fontWeight: 500,
    border: "2px solid rgb(0, 219, 166)"
  },
};

export default function ButtonBlock({ element = {}, update, readOnly }) {
  const [showOptions, setShowOptions] = useState(false);

  const buttonStyle = element.style || {};
  const bgColor = buttonStyle.bgColor || "rgb(0, 219, 166)";
  const textColor = buttonStyle.textColor || "#ffffff";
  const borderRadius = buttonStyle.borderRadius ??  8;
  const paddingX = buttonStyle.paddingX ?? 20;
  const paddingY = buttonStyle.paddingY ?? 12;
  const fontSize = buttonStyle.fontSize ?? 14;
  const fontWeight = buttonStyle.fontWeight ?? 500;
  const border = buttonStyle.border || "none";

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
      update({ ... element, content });
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
        style:  BUTTON_PRESETS[presetName]
      });
    }
  };

  const handleButtonClick = (e) => {
    if (readOnly && element.link) {
      window.open(element.link, "_blank");
    }
  };

  return (
    <div className="button-block-root">
      <button
        className="button-main transition-all hover:opacity-90 active:scale-95"
        style={{
          backgroundColor: bgColor,
          color:  textColor,
          borderRadius:  `${borderRadius}px`,
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
          contentEditable={! readOnly}
          suppressContentEditableWarning
          onInput={(e) => updateContent(e.currentTarget.innerText)}
          style={{ outline: 'none', cursor: readOnly ? 'pointer' : 'text' }}
        >
          {element.content || "Button"}
        </span>
      </button>

      {! readOnly && (
        <>
          <button
            onClick={(e) => {
              e. stopPropagation();
              setShowOptions(!showOptions);
            }}
            className="button-settings-btn group-hover:opacity-100"
            title="Button settings"
            style={{
              opacity: showOptions ? 1 : undefined
            }}
          >
            <Palette size={14} />
          </button>

          {showOptions && (
            <div className="button-settings-panel">
              <div className="space-y-4">
                {/* Quick Styles */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Quick Styles
                  </label>
                  <div className="grid grid-cols-2 gap-2">
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

                {/* Link URL */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Link URL
                  </label>
                  <input
                    type="text"
                    value={element.link || ""}
                    onChange={(e) => updateLink(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-md focus:border-teal-400 focus:outline-none"
                  />
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Colors
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
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
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Text Color
                      </label>
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => updateStyle({ textColor:  e.target.value })}
                        className="w-full h-10 rounded cursor-pointer border-2 border-gray-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Padding */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Padding
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Horizontal:  {paddingX}px
                      </label>
                      <input
                        type="range"
                        min="8"
                        max="40"
                        value={paddingX}
                        onChange={(e) => updateStyle({ paddingX: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Vertical: {paddingY}px
                      </label>
                      <input
                        type="range"
                        min="6"
                        max="24"
                        value={paddingY}
                        onChange={(e) => updateStyle({ paddingY: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Typography */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Typography
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Font Size:  {fontSize}px
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="24"
                        value={fontSize}
                        onChange={(e) => updateStyle({ fontSize: parseInt(e. target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Font Weight
                      </label>
                      <select
                        value={fontWeight}
                        onChange={(e) => updateStyle({ fontWeight:  parseInt(e.target.value) })}
                        className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-md focus:border-teal-400 focus:outline-none"
                      >
                        <option value="400">Normal</option>
                        <option value="500">Medium</option>
                        <option value="600">Semibold</option>
                        <option value="700">Bold</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Border Radius */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Roundness:  {borderRadius}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={borderRadius}
                    onChange={(e) => updateStyle({ borderRadius: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowOptions(false)}
                  className="button-done-btn w-full"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}