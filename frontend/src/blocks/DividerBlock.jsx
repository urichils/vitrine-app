import React, { useState } from "react";
import { Settings } from "lucide-react";
import "../styles/DividerBlock.css";

export default function DividerBlock({ element = {}, update, readOnly }) {
  const [showOptions, setShowOptions] = useState(false);
  
  const style = element.style || {};
  const thickness = style.thickness ?? 2;
  const color = style.color ?? "#e5e7eb";
  const dividerStyle = style.style ?? "solid";
  const width = style.width ?? 100;
  const spacing = style.spacing ?? 24;

  const handleUpdateStyle = (key, value) => {
    if (typeof update === 'function') {
      update({ 
        style: { ...style, [key]: value }
      });
    }
  };

  return (
    <div 
      className="divider-root"
      style={{ 
        paddingTop: `${spacing}px`,
        paddingBottom: `${spacing}px`
      }}
    >
      {/* The Divider Line */}
      <div
        className="divider-line"
        style={{
          width: `${width}%`,
          borderTop: dividerStyle === 'solid' 
            ? `${thickness}px solid ${color}`
            : `${thickness}px ${dividerStyle} ${color}`,
        }}
      />

      {/* Settings Button - Only in edit mode */}
      {!readOnly && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions(!showOptions);
            }}
            className="divider-settings-btn"
            title="Divider settings"
          >
            <Settings size={16} />
          </button>

          {/* Settings Panel */}
          {showOptions && (
            <div className="divider-settings-panel">
              <div className="space-y-4">
                {/* Style Type */}
                <div>
                  <label className="divider-label">Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['solid', 'dashed', 'dotted'].map((styleType) => (
                      <button
                        key={styleType}
                        onClick={() => handleUpdateStyle('style', styleType)}
                        className={`divider-style-btn ${dividerStyle === styleType ? 'active' : ''}`}
                      >
                        {styleType.charAt(0).toUpperCase() + styleType.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Picker */}
                <div>
                  <label className="divider-label">Color</label>
                  <div className="flex gap-2 items-center mb-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleUpdateStyle('color', e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer border-2 border-gray-200"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => handleUpdateStyle('color', e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border-2 border-gray-200 rounded-md focus:border-blue-400 focus:outline-none"
                      placeholder="#e5e7eb"
                    />
                  </div>
                  {/* Color Presets */}
                  <div className="flex gap-2">
                    {['#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#000000'].map((presetColor) => (
                      <button
                        key={presetColor}
                        onClick={() => handleUpdateStyle('color', presetColor)}
                        className={`divider-color-preset ${color === presetColor ? 'active' : ''}`}
                        style={{ backgroundColor: presetColor }}
                        title={presetColor}
                      />
                    ))}
                  </div>
                </div>

                {/* Thickness Slider */}
                <div>
                  <label className="divider-label">Thickness: {thickness}px</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={thickness}
                    onChange={(e) => handleUpdateStyle('thickness', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Width Slider */}
                <div>
                  <label className="divider-label">Width: {width}%</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={width}
                    onChange={(e) => handleUpdateStyle('width', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Spacing Slider */}
                <div>
                  <label className="divider-label">Spacing: {spacing}px</label>
                  <input
                    type="range"
                    min="8"
                    max="80"
                    value={spacing}
                    onChange={(e) => handleUpdateStyle('spacing', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowOptions(false)}
                  className="divider-done-btn"
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
