import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function SectionBlock({ element = {}, update, readOnly }) {
  const [showSettings, setShowSettings] = useState(false);

  const style = element.style || {};
  const bgColor = style.bgColor || "transparent";
  const padding = style.padding || 24;
  const borderRadius = style.borderRadius || 8;
  const minHeight = style.minHeight || 200;

  const updateStyle = (styleUpdates) => {
    if (update) {
      update({
        style: { ...style, ...styleUpdates }
      });
    }
  };

  return (
    <div
      style={{
        backgroundColor: bgColor,
        padding:  `${padding}px`,
        borderRadius: `${borderRadius}px`,
        minHeight: `${minHeight}px`,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {! readOnly && (
        <div style={{
          padding: '12px',
          backgroundColor: 'rgba(0,0,0,0.02)',
          borderRadius: '4px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#666',
          marginBottom: '12px',
          border: '1px dashed #999'
        }}>
          Section Block (Padding: {padding}px)
        </div>
      )}

      <div style={{ flex: 1 }} />

      {! readOnly && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          backgroundColor: '#f0f9ff',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Settings
            <ChevronDown size={14} style={{
              transform: showSettings ? 'rotate(180deg)' : 'rotate(0deg)',
              transition:  'transform 0.2s'
            }} />
          </button>
          
          {showSettings && (
            <div style={{
              display: 'flex',
              gap: '16px',
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #e5e7eb',
              flexWrap: 'wrap'
            }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  Padding: {padding}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="64"
                  value={padding}
                  onChange={(e) => updateStyle({ padding: parseInt(e.target.value) })}
                  style={{ width: '120px' }}
                />
              </div>

              <div>
                <label style={{ fontSize:  '11px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  Min Height: {minHeight}px
                </label>
                <input
                  type="range"
                  min="100"
                  max="600"
                  value={minHeight}
                  onChange={(e) => updateStyle({ minHeight: parseInt(e.target.value) })}
                  style={{ width: '120px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight:  '600', display: 'block', marginBottom: '4px' }}>
                  Border Radius:  {borderRadius}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={borderRadius}
                  onChange={(e) => updateStyle({ borderRadius: parseInt(e.target.value) })}
                  style={{ width:  '120px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    Background
                  </label>
                  <input
                    type="color"
                    value={bgColor === 'transparent' ? '#ffffff' : bgColor}
                    onChange={(e) => updateStyle({ bgColor: e.target.value })}
                    style={{
                      width:  '40px',
                      height: '32px',
                      border: '1px solid #ddd',
                      borderRadius:  '4px',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}