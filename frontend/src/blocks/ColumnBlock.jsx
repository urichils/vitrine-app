import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ColumnBlock({ element = {}, update, readOnly }) {
  const [showSettings, setShowSettings] = useState(false);

  const style = element.style || {};
  const columnCount = style.columnCount || 2;
  const gap = style.gap || 16;
  const bgColor = style.bgColor || "transparent";
  const padding = style.padding || 0;

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
        display: 'grid',
        gridTemplateColumns:  `repeat(${columnCount}, 1fr)`,
        gap: `${gap}px`,
        backgroundColor: bgColor,
        padding: `${padding}px`,
        borderRadius: '8px',
        minHeight: '200px',
        width: '100%',
      }}
    >
      {! readOnly && (
        <div style={{
          gridColumn: '1 / -1',
          padding: '16px',
          backgroundColor: 'rgba(0,0,0,0.02)',
          borderRadius: '4px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#666',
          marginBottom: '8px'
        }}>
          {columnCount} Column Layout (Gap: {gap}px)
        </div>
      )}

      {Array.from({ length: columnCount }).map((_, i) => (
        <div
          key={i}
          style={{
            minHeight: '100px',
            backgroundColor: readOnly ? 'transparent' : 'rgba(59, 130, 246, 0.05)',
            border: readOnly ? 'none' : '1px dashed #3b82f6',
            borderRadius: '4px',
            padding: '12px',
          }}
        >
          {! readOnly && (
            <div style={{
              fontSize: '11px',
              color: '#3b82f6',
              fontWeight: '600'
            }}>
              Column {i + 1}
            </div>
          )}
        </div>
      ))}

      {!readOnly && (
        <div style={{
          gridColumn: '1 / -1',
          marginTop: '12px',
          padding: '12px',
          backgroundColor: '#f0f9ff',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius:  '4px',
              cursor:  'pointer',
              fontSize:  '12px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Settings
            <ChevronDown size={14} style={{
              transform: showSettings ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }} />
          </button>
          
          {showSettings && (
            <div style={{
              gridColumn: '1 / -1',
              display: 'flex',
              gap: '16px',
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #e5e7eb'
            }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom:  '4px' }}>
                  Columns: {columnCount}
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={columnCount}
                  onChange={(e) => updateStyle({ columnCount: parseInt(e.target.value) })}
                  style={{ width: '120px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', display:  'block', marginBottom: '4px' }}>
                  Gap: {gap}px
                </label>
                <input
                  type="range"
                  min="4"
                  max="48"
                  value={gap}
                  onChange={(e) => updateStyle({ gap: parseInt(e.target.value) })}
                  style={{ width: '120px' }}
                />
              </div>

              <div>
                <label style={{ fontSize:  '11px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  Padding: {padding}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={padding}
                  onChange={(e) => updateStyle({ padding: parseInt(e.target.value) })}
                  style={{ width: '120px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight:  '600', display: 'block', marginBottom: '4px' }}>
                    Background
                  </label>
                  <input
                    type="color"
                    value={bgColor === 'transparent' ? '#ffffff' : bgColor}
                    onChange={(e) => updateStyle({ bgColor: e.target.value })}
                    style={{
                      width: '40px',
                      height: '32px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor:  'pointer'
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