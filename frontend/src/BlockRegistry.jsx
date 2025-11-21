// src/BlockRegistry.js
import React from "react";
import {
  Heading1,
  Heading2,
  Pilcrow,
  List as ListIcon,
  Quote,
  Image as ImageIcon,
  Images,
  Video,
  SquareChevronRight,
  SquareSplitVertical,
  Cuboid,
  ChartColumn,
  UserRoundPen,
  Code,
  Gamepad2,
  MessageSquareWarning,
  Projector,
  Space,
  Github,
} from "lucide-react";
import SlideshowBlock from "./blocks/SlideshowBlock.jsx";

// Simple contentEditable block
export const EditableBlock = ({ element, update, className, placeholder }) => {
  return (
    <div
      className={className}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => update({ content: e.currentTarget.innerHTML })}
      dangerouslySetInnerHTML={{ __html: element.content || placeholder }}
      style={{ minHeight: "40px", outline: "none" }}
    />
  );
};

export const BLOCKS = {
  title: {
    type: "title",
    label: "Title",
    icon: <Heading1 size={18} />,
    defaultWidth: 600,
    defaultHeight: 110,
    defaultContent: "",
    Render: (props) => (
      <EditableBlock {...props} className="text-4xl font-bold" placeholder="Your Title" />
    ),
  },

  subheading: {
    type: "subheading",
    label: "Subheading",
    icon: <Heading2 size={18} />,
    defaultWidth: 600,
    defaultHeight: 90,
    defaultContent: "",
    Render: (props) => (
      <EditableBlock {...props} className="text-2xl font-semibold" placeholder="Your Subtitle" />
    ),
  },

  paragraph: {
    type: "paragraph",
    label: "Paragraph",
    icon: <Pilcrow size={18} />,
    defaultWidth: 600,
    defaultHeight: 180,
    defaultContent: "",
    Render: (props) => (
      <EditableBlock {...props} className="text-base leading-6" placeholder="Type your text here..." />
    ),
  },

  list: {
    type: "list",
    label: "List",
    icon: <ListIcon size={18} />,
    defaultWidth: 500,
    defaultHeight: 150,
    defaultContent: "",
    Render: (props) => (
      <EditableBlock {...props} className="pl-4 list-disc" placeholder="<ul><li>Item 1</li></ul>" />
    ),
  },

  quote: {
    type: "quote",
    label: "Quote",
    icon: <Quote size={18} />,
    defaultWidth: 550,
    defaultHeight: 160,
    defaultContent: "",
    Render: (props) => (
      <EditableBlock {...props} className="italic border-l-4 pl-4" placeholder="Quote..." />
    ),
  },

  image: {
    type: "image",
    label: "Image",
    icon: <ImageIcon size={18} />,
    defaultWidth: 400,
    defaultHeight: 260,
    defaultContent: "",
    Render: ({ element, update, openModal }) => (
      <div
        className="border bg-gray-100 flex items-center justify-center cursor-pointer"
        onClick={() => openModal(element.id, "Image URL", element.content)}
      >
        {element.content ? (
          <img src={element.content} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500">Click to add image</span>
        )}
      </div>
    ),
  },

  gallery: {
    type: "gallery",
    label: "Gallery",
    icon: <Images size={18} />,
    defaultWidth: 700,
    defaultHeight: 300,
    defaultContent: "",
    Render: ({ element, update, openModal }) => {
      const images = element.content ? JSON.parse(element.content) : [];
      return (
        <div className="grid grid-cols-3 gap-2">
          {images.length ? (
            images.map((src, i) => (
              <img key={i} src={src} className="h-24 object-cover rounded" />
            ))
          ) : (
            <div
              className="text-gray-500 p-4 border w-full cursor-pointer"
              onClick={() => openModal(element.id, "Gallery Image URL")}
            >
              Empty Gallery – click to add images
            </div>
          )}
        </div>
      );
    },
  },

  video: {
    type: "video",
    label: "Video",
    icon: <Video size={18} />,
    defaultWidth: 600,
    defaultHeight: 340,
    defaultContent: "",
    Render: ({ element, update, openModal }) => (
      <div
        className="border bg-black text-white flex items-center justify-center cursor-pointer"
        onClick={() => openModal(element.id, "Video URL", element.content)}
      >
        {element.content ? (
          <iframe
            width="100%"
            height="100%"
            src={element.content.replace("watch?v=", "embed/")}
            allowFullScreen
            style={{ borderRadius: "8px" }}
          />
        ) : (
          <span>Add Video</span>
        )}
      </div>
    ),
  },

  divider: {
    type: "divider",
    label: "Divider",
    icon: <SquareSplitVertical size={18} />,
    defaultWidth: 600,
    defaultHeight: 20,
    defaultContent: "",
    Render: () => <div className="border-t w-full my-4" />,
  },

  spacer: {
    type: "spacer",
    label: "Spacer",
    icon: <Space size={18} />,
    defaultWidth: 200,
    defaultHeight: 60,
    defaultContent: "",
    Render: () => <div className="w-full h-full opacity-20 bg-gray-200" />,
  },

  container: {
    type: "container",
    label: "Container",
    icon: <Cuboid size={18} />,
    defaultWidth: 700,
    defaultHeight: 400,
    defaultContent: "Container",
    Render: ({ element }) => <div className="border rounded-lg p-4 opacity-60">{element.content}</div>,
  },

  columns: {
    type: "columns",
    label: "Columns",
    icon: <ChartColumn size={18} />,
    defaultWidth: 700,
    defaultHeight: 250,
    defaultContent: "",
    Render: ({ element }) => {
      const cols = element.content ? JSON.parse(element.content) : ["Left", "Right"];
      return (
        <div className="grid grid-cols-2 gap-4">
          {cols.map((t, i) => (
            <div key={i} className="p-3 border rounded bg-gray-50">
              {t}
            </div>
          ))}
        </div>
      );
    },
  },

  button: {
    type: "button",
    label: "Button",
    icon: <Gamepad2 size={18} />,
    defaultWidth: 150,
    defaultHeight: 50,
    defaultContent: "Click me",
    Render: ({ element, update, openModal }) => (
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => openModal(element.id, "Button Text", element.content)}
      >
        {element.content}
      </button>
    ),
  },

  cta: {
    type: "cta",
    label: "Call to Action",
    icon: <MessageSquareWarning size={18} />,
    defaultWidth: 500,
    defaultHeight: 150,
    defaultContent: "Your call to action",
    Render: ({ element }) => (
      <div className="p-4 border rounded bg-yellow-100 cursor-pointer">{element.content}</div>
    ),
  },

  embed: {
    type: "embed",
    label: "Embed",
    icon: <SquareChevronRight size={18} />,
    defaultWidth: 600,
    defaultHeight: 300,
    defaultContent: "",
    Render: ({ element, update, openModal }) => (
      <div
        className="border bg-gray-100 p-4 cursor-pointer"
        onClick={() => openModal(element.id, "Embed Code", element.content)}
        dangerouslySetInnerHTML={{ __html: element.content }}
      />
    ),
  },

  code: {
    type: "code",
    label: "Code Block",
    icon: <Code size={18} />,
    defaultWidth: 600,
    defaultHeight: 200,
    defaultContent: "console.log('hello');",
    Render: ({ element, update }) => (
      <textarea
        className="w-full h-full font-mono text-sm p-2 border rounded"
        value={element.content}
        onChange={(e) => update({ content: e.target.value })}
      />
    ),
  },

  slideshow: {
    type: "slideshow",
    label: "Slideshow",
    icon: <Projector size={18} />,
    defaultWidth: 700,
    defaultHeight: 300,
    defaultContent: "",
    Render: ({ element, update, openModal }) => (
      <SlideshowBlock element={element} update={update} openModal={openModal} />
    ),
  },

  profile: {
    type: "profile",
    label: "Profile",
    icon: <UserRoundPen size={18} />,
    defaultWidth: 400,
    defaultHeight: 200,
    defaultContent: "Your Name",
    Render: ({ element }) => <div className="p-4 border rounded">{element.content}</div>,
  },

  github: {
    type: "github",
    label: "GitHub Repos",
    icon: <Github size={18} />,
    defaultWidth: 600,
    defaultHeight: 260,
    defaultContent: "",
    Render: ({ element, update, openModal }) => (
      <div
        className="border p-4 text-gray-500 cursor-pointer"
        onClick={() => openModal(element.id, "GitHub Username", element.content)}
      >
        {element.content || "Click to set GitHub username"}
      </div>
    ),
  },
};
