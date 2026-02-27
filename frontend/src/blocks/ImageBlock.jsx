import React, { useState, useRef } from "react";
import { Image, ZoomIn, ZoomOut, Maximize2, Upload as UploadIcon } from "lucide-react";
import { useImageUpload } from "../hooks/useImageUpload";

export default function ImageBlock({ element = {}, update, openModal, readOnly, portfolioId }) {
  const [scale, setScale] = useState(element?.scale || 100);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);
  const { uploadFiles, uploading, error: uploadError } = useImageUpload(portfolioId);

  const handleScaleChange = (newScale) => {
    const clampedScale = Math.max(10, Math.min(200, newScale));
    setScale(clampedScale);
    if (update) {
      update({ ...element, scale: clampedScale });
    }
  };

  const scaleUp = (e) => {
    e.stopPropagation();
    handleScaleChange(scale + 10);
  };

  const scaleDown = (e) => {
    e.stopPropagation();
    handleScaleChange(scale - 10);
  };

  const resetScale = (e) => {
    e.stopPropagation();
    handleScaleChange(100);
  };

  const handleClick = () => {
    if (!element?.content && !readOnly) {
      fileInputRef.current?.click();
    }
  };

  const handleDoubleClick = () => {
    if (!readOnly && openModal) {
      openModal(element.id);
    }
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadedUrls = await uploadFiles(files);
    if (uploadedUrls && uploadedUrls.length > 0) {
      update({ ...element, content: uploadedUrls[0] });
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className={`
          relative overflow-hidden rounded-lg border-2 transition-all duration-200
          ${element?.content
            ? 'border-gray-200 hover:border-blue-400 cursor-pointer'
            : 'border-dashed border-gray-300 hover:border-blue-400 cursor-pointer bg-gray-50'
          }
          ${isHovered && element?.content ? 'shadow-lg' : 'shadow-sm'}
        `}
        style={{ minHeight: '200px' }}
      >
        {element.content ? (
          <div className="w-full h-full p-4 flex items-center justify-center min-h-[200px]">
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <img
                src={element.content}
                alt="User uploaded content"
                className="transition-transform duration-200"
                style={{
                  transform: `scale(${scale / 100})`,
                  transformOrigin: 'center',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-400">
            <Image size={48} strokeWidth={1.5} />
            <p className="mt-3 text-sm font-medium">Click to add image</p>
            <p className="mt-1 text-xs text-gray-400">or double-click to edit</p>
            {!readOnly && <p className="mt-2 text-xs text-blue-500">Upload or paste URL</p>}
          </div>
        )}
      </div>

      {uploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <div className="text-white text-sm flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Uploading...
          </div>
        </div>
      )}

      {uploadError && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-2 rounded-b-lg">
          {uploadError}
        </div>
      )}

      {element.content && isHovered && !readOnly && (
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              scaleDown(e);
            }}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Zoom out"
          >
            <ZoomOut size={16} className="text-gray-700" />
          </button>

          <div className="flex items-center gap-1 px-2 border-x border-gray-200">
            <span className="text-xs font-medium text-gray-700 min-w-[3ch] text-center">
              {scale}%
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              scaleUp(e);
            }}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Zoom in"
          >
            <ZoomIn size={16} className="text-gray-700" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              resetScale(e);
            }}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors border-l border-gray-200 ml-1 pl-2"
            title="Reset scale"
          >
            <Maximize2 size={16} className="text-gray-700" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors border-l border-gray-200 ml-1 pl-2"
            title="Replace image"
          >
            <UploadIcon size={16} className="text-gray-700" />
          </button>
        </div>
      )}

      {element.content && scale !== 100 && (
        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {scale}%
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={uploading}
      />
    </div>
  );
}