import React from "react";
import { Video, ExternalLink } from "lucide-react";

export default function VideoBlock({ element = {}, update, openModal, readOnly }) {
  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
    
    return url;
  };

  const embedUrl = getEmbedUrl(element.content);

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden group">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded video"
        />
      ) : (
        <div 
          className="w-full h-full flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-900 transition-colors"
          onClick={() => !readOnly && openModal && openModal(element.id)}
        >
          <Video size={48} strokeWidth={1.5} />
          <p className="mt-3 text-sm">Click to add video</p>
          <p className="mt-1 text-xs">YouTube or Vimeo URL</p>
        </div>
      )}
      
      {embedUrl && !readOnly && (
        <button
          onClick={() => openModal && openModal(element.id)}
          className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="Change video"
        >
          <ExternalLink size={16} />
        </button>
      )}
    </div>
  );
}