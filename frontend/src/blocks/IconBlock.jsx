import React, { useState, useRef, useEffect } from "react";
import { Palette, Link as LinkIcon, X } from "lucide-react";
import "../styles/IconBlock.css";

const ICON_OPTIONS = [
  "Star",
  "Heart",
  "Zap",
  "Award",
  "Smile",
  "Thumbs Up",
  "Rocket",
  "Target",
  "Shield",
  "Lightbulb",
  "Code",
  "Settings",
];

const DEFAULT_ICON_SIZE = 48;
const DEFAULT_ICON_COLOR = "#3b82f6";
const DEFAULT_BG_COLOR = "transparent";
const DEFAULT_PADDING = 16;

export default function IconBlock({ element = {}, update, readOnly }) {
  const [showOptions, setShowOptions] = useState(false);

  const style = element.style || {};
  const iconSize = style.iconSize ?? DEFAULT_ICON_SIZE;
  const iconColor = style.iconColor || DEFAULT_ICON_COLOR;
  const bgColor = style.bgColor || DEFAULT_BG_COLOR;
  const padding = style.padding ?? DEFAULT_PADDING;
  const borderRadius = style.borderRadius ?? 8;

  const handleUpdateElement = (updates) => {
    if (typeof update === 'function') {
      update({ ...element, ...updates });
    }
  };

  const handleStyleChange = (styleUpdates) => {
    handleUpdateElement({ style: { ...style, ...styleUpdates } });
  };

  const handleIconChange = (value) => {
    handleUpdateElement({ icon: value });
  };

  const handleLinkChange = (value) => {
    handleUpdateElement({ link: value });
  };

  const handleLabelChange = (e) => {
    handleUpdateElement({ label: e.currentTarget.innerText });
  };

  const handleIconSizeChange = (value) => {
    handleStyleChange({ iconSize: Number(value) });
  };

  const handleIconColorChange = (value) => {
    handleStyleChange({ iconColor: value });
  };

  const handleBgColorChange = (value) => {
    handleStyleChange({ bgColor: value });
  };

  const handlePaddingChange = (value) => {
    handleStyleChange({ padding: Number(value) });
  };

  const handleBorderRadiusChange = (value) => {
    handleStyleChange({ borderRadius: Number(value) });
  };

  const handleBlockClick = () => {
    if (readOnly && element.link) {
      window.open(element.link, "_blank");
    }
  };

  // Dynamic icon import
  const getIcon = () => {
    try {
      const iconName = element.icon || "Star";
      const lucideIcons = require("lucide-react");
      const IconComponent = lucideIcons[iconName];
      if (IconComponent) {
        return <IconComponent size={iconSize} color={iconColor} />;
      }
    } catch (e) {
      console.error("Icon not found:", element.icon);
    }
    return null;
  };

  return (
    <div className="icon-block-root">
      <div
        className="icon-block"
        style={{
          backgroundColor: bgColor,
          padding: `${padding}px`,
          borderRadius: `${borderRadius}px`,
          cursor: readOnly && element.link ? "pointer" : "default",
        }}
        onClick={handleBlockClick}
      >
        <div className="icon-container">
          {getIcon()}
        </div>
        {element.label && (
          <div
            className="icon-label"
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onInput={handleLabelChange}
            style={{ color: iconColor }}
          >
            {element.label}
          </div>
        )}
      </div>

      {!readOnly && showOptions && (
        <div className="icon-settings-panel">
          <div className="space-y-4">
            {/* Icon Selection */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-2">
                Icon
              </label>
              <select
                value={element.icon || "Star"}
                onChange={(e) => handleIconChange(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>

            {/* Label */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Label (optional)
              </label>
              <input
                type="text"
                value={element.label || ""}
                onChange={(e) => handleUpdateElement({ label: e.target.value })}
                placeholder="Icon label"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              />
            </div>

            {/* Link */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Link URL
              </label>
              <input
                type="text"
                value={element.link || ""}
                onChange={(e) => handleLinkChange(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Icon Color
                </label>
                <input
                  type="color"
                  value={iconColor}
                  onChange={(e) => handleIconColorChange(e.target.value)}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Background
                </label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => handleBgColorChange(e.target.value)}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Sizing */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Icon Size: {iconSize}px
              </label>
              <input
                type="range"
                min="16"
                max="128"
                value={iconSize}
                onChange={(e) => handleIconSizeChange(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Padding */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Padding: {padding}px
              </label>
              <input
                type="range"
                min="0"
                max="48"
                value={padding}
                onChange={(e) => handlePaddingChange(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Border Radius */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Border Radius: {borderRadius}px
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={borderRadius}
                onChange={(e) => handleBorderRadiusChange(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {!readOnly && (
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="icon-settings-btn"
          title="Icon settings"
        >
          <Palette size={14} />
        </button>
      )}
    </div>
  );
}
