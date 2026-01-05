import React, { useState, useRef } from "react";
import { Box, Plus, AlertCircle, Maximize2, AlignLeft, Grid3x3 } from "lucide-react";

export default function ContainerBlock({
  element = {},
  children = [],
  onDrop,
  onDragOver,
  update,
  depth = 0,
  maxDepth = 3,
  isValidDrop,
  readOnly = false
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showDepthWarning, setShowDepthWarning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const containerRef = useRef(null);
  const dragCounterRef = useRef(0);

  const style = element.style || {};
  const layoutMode = style.layout || "stack";
  const gap = style.gap ?? 12;
  const padding = style.padding ?? 24;
  const bgColor = style.bgColor || "#f9fafb";
  const borderRadius = style.borderRadius ?? 8;
  const alignment = style.alignment || "start";

  const isEmpty = !children || children.length === 0;
  const isMaxDepth = depth >= maxDepth;

  const handleDragEnter = (e) => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();

    dragCounterRef.current++;

    const draggedElementId = e.dataTransfer.getData('elementId');
    const draggedElementType = e.dataTransfer.getData('elementType');

    let valid = true;
    if (isValidDrop) {
      valid = isValidDrop(draggedElementId, draggedElementType, element.id, depth);
    }

    if (!valid || isMaxDepth) {
      setShowDepthWarning(true);
      setTimeout(() => setShowDepthWarning(false), 2000);
      return;
    }

    setIsDragOver(true);
  };

  const handleDragOver = (e) => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();

    if (!isMaxDepth) {
      e.dataTransfer.dropEffect = 'move';
    } else {
      e.dataTransfer.dropEffect = 'none';
    }

    if (onDragOver) {
      onDragOver(e, element.id, depth);
    }
  };

  const handleDragLeave = (e) => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();

    dragCounterRef.current--;

    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();

    dragCounterRef.current = 0;
    setIsDragOver(false);

    if (isMaxDepth) {
      return;
    }

    const draggedElementId = e.dataTransfer.getData('elementId');
    const draggedElementType = e.dataTransfer.getData('elementType');

    if (isValidDrop && !isValidDrop(draggedElementId, draggedElementType, element.id, depth)) {
      return;
    }

    if (onDrop) {
      onDrop(e, element.id, draggedElementId, draggedElementType, depth);
    }
  };

  const updateStyle = (styleUpdates) => {
    if (update) {
      update({
        style: { ...style, ...styleUpdates }
      });
    }
  };

  const getLayoutStyles = () => {
    const baseStyles = {
      display: 'flex',
      gap: `${gap}px`,
      padding: `${padding}px`,
      backgroundColor: bgColor,
      borderRadius: `${borderRadius}px`,
      minHeight: isEmpty ? '200px' : 'auto',
    };

    switch (layoutMode) {
      case 'stack':
        return {
          ...baseStyles,
          flexDirection: 'column',
          alignItems: alignment === 'start' ? 'flex-start' : alignment === 'center' ? 'center' : 'flex-end',
        };
      case 'horizontal':
        return {
          ...baseStyles,
          flexDirection: 'row',
          alignItems: alignment === 'start' ? 'flex-start' : alignment === 'center' ? 'center' : 'flex-end',
          flexWrap: 'wrap',
        };
      case 'grid':
        return {
          ...baseStyles,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        };
      default:
        return baseStyles;
    }
  };

  const getBorderColor = () => {
    if (showDepthWarning) return 'border-red-500';
    if (isDragOver && !isMaxDepth) return 'border-blue-500';
    if (isMaxDepth) return 'border-orange-400';
    return 'border-gray-300';
  };

  return (
    <div
      ref={containerRef}
      className={`
        relative rounded-lg border-2 transition-all duration-200 group
        ${getBorderColor()}
        ${isDragOver && !isMaxDepth ? 'shadow-lg ring-2 ring-blue-300' : ''}
        ${isMaxDepth ? 'border-dashed' : readOnly ? 'border-solid' : 'border-dashed hover:border-gray-400'}
      `}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-container-id={element.id}
      data-depth={depth}
    >
      {/* Depth warning */}
      {showDepthWarning && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span className="font-medium">
              {isMaxDepth ? 'Maximum nesting depth reached' : 'Cannot drop here'}
            </span>
          </div>
        </div>
      )}

      {/* Drop zone indicator */}
      {isDragOver && !isMaxDepth && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-blue-50 bg-opacity-90">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <Plus size={20} />
            <span className="font-medium">Drop here to add to container</span>
          </div>
        </div>
      )}

      {/* Container Settings Button */}
      {!readOnly && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowSettings(!showSettings);
          }}
          className="absolute -top-3 -right-3 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg z-30"
          title="Container settings"
        >
          <Maximize2 size={16} />
        </button>
      )}

      {/* Settings Panel */}
      {!readOnly && showSettings && (
        <div className="absolute top-8 right-0 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-4 z-40 min-w-[280px]">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Layout Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'stack', icon: AlignLeft, label: 'Stack' },
                  { value: 'horizontal', icon: Maximize2, label: 'Row' },
                  { value: 'grid', icon: Grid3x3, label: 'Grid' }
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => updateStyle({ layout: value })}
                    className={`
                      flex flex-col items-center gap-1 px-2 py-2 text-xs font-medium rounded-md
                      transition-all border-2
                      ${layoutMode === value
                        ? 'bg-blue-500 text-white border-blue-600'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300'
                      }
                    `}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Alignment
              </label>
              <select
                value={alignment}
                onChange={(e) => updateStyle({ alignment: e.target.value })}
                className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-md focus:border-blue-400 focus:outline-none"
              >
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Background Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => updateStyle({ bgColor: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer border-2 border-gray-200"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => updateStyle({ bgColor: e.target.value })}
                  className="flex-1 px-3 py-2 text-xs border-2 border-gray-200 rounded-md focus:border-blue-400 focus:outline-none"
                  placeholder="#f9fafb"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Gap: {gap}px
              </label>
              <input
                type="range"
                min="0"
                max="48"
                value={gap}
                onChange={(e) => updateStyle({ gap: parseInt(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Padding: {padding}px
              </label>
              <input
                type="range"
                min="8"
                max="64"
                value={padding}
                onChange={(e) => updateStyle({ padding: parseInt(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Roundness: {borderRadius}px
              </label>
              <input
                type="range"
                min="0"
                max="24"
                value={borderRadius}
                onChange={(e) => updateStyle({ borderRadius: parseInt(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {isEmpty && !isDragOver && (
        <div
          className="flex flex-col items-center justify-center text-gray-400"
          style={getLayoutStyles()}
        >
          <Box size={48} strokeWidth={1.5} />
          <p className="mt-3 text-sm font-medium">
            Container {depth > 0 && `(Level ${depth + 1})`}
          </p>
          <p className="mt-1 text-xs">
            {isMaxDepth ? 'Max depth reached' : 'Drag elements here'}
          </p>
        </div>
      )}

      {/* Child elements */}
      {!isEmpty && (
        <div
          style={getLayoutStyles()}
          className="relative"
        >
          {children}
        </div>
      )}

      {/* Container info badge */}
      {!readOnly && (
        <div className="absolute top-2 left-2 flex items-center gap-2">
          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Container L{depth + 1} • {children.length} item{children.length !== 1 ? 's' : ''}
          </div>
          {isMaxDepth && (
            <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
              Max Depth
            </div>
          )}
        </div>
      )}

      {/* Depth indicator dots */}
      {!readOnly && depth > 0 && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {Array.from({ length: depth + 1 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gray-400"
            />
          ))}
        </div>
      )}
    </div>
  );
}