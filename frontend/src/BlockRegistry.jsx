// src/BlockRegistry.js
import React from "react";
import {
  Type,
  List as ListIcon,
  Sparkles,
  Image as ImageIcon,
  Video,
  SquareChevronRight,
  SquareSplitVertical,
  Cuboid,
  ChartColumn,
  Code,
  Gamepad2,
  Space,
  Github,
} from "lucide-react";
import TextBlock from "./blocks/TextBlock";
import ImageBlock from "./blocks/ImageBlock";
import ReposBlock from "./blocks/ReposBlock";
import ContainerBlock from "./blocks/ContainerBlock";
import DividerBlock from "./blocks/DividerBlock";
import ButtonBlock from "./blocks/ButtonBlock";
import IconBlock from "./blocks/IconBlock";
import CodeBlock from "./blocks/CodeBlock";

// Simple contentEditable block for specialized use cases
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
  text: {
    type: "text",
    label: "Text",
    icon: <Type size={18} />,
    defaultWidth: 600,
    defaultHeight: 150,
    defaultContent: "",
    Render: (props) => <TextBlock {...props} />,
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

  icon: {
    type: "icon",
    label: "Icon",
    icon: <Sparkles size={18} />,
    defaultWidth: 120,
    defaultHeight: 120,
    defaultContent: "",
    defaultStyle: {
      iconSize: 48,
      iconColor: "#3b82f6",
      bgColor: "transparent",
      padding: 16,
      borderRadius: 8,
    },
    Render: (props) => <IconBlock {...props} />,
  },

  image: {
    type: "image",
    label: "Image",
    icon: <ImageIcon size={18} />,
    defaultWidth: 400,
    defaultHeight: 260,
    defaultContent: "",
    Render: (props) => <ImageBlock {...props} />,
  },

  // gallery: {
  //   type: "gallery",
  //   label: "Gallery",
  //   icon: <Images size={18} />,
  //   defaultWidth: 700,
  //   defaultHeight: 300,
  //   defaultContent: "",
  //   Render: ({ element, update, openModal }) => {
  //     const images = element.content ? JSON.parse(element.content) : [];
  //     return (
  //       <div className="grid grid-cols-3 gap-2">
  //         {images.length ? (
  //           images.map((src, i) => (
  //             <img key={i} src={src} alt={`Gallery ${i + 1}`} className="h-24 object-cover rounded" />
  //           ))
  //         ) : (
  //           <div
  //             className="text-gray-500 p-4 border w-full cursor-pointer"
  //             onClick={() => openModal && openModal(element.id, "Gallery Image URL")}
  //           >
  //             Empty Gallery – click to add images
  //           </div>
  //         )}
  //       </div>
  //     );
  //   },
  // },

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
        onClick={() => openModal && openModal(element.id, "Video URL", element.content)}
      >
        {element.content ? (
          <iframe
            width="100%"
            height="100%"
            src={element.content.replace("watch?v=", "embed/")}
            allowFullScreen
            title="Embedded video"
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
    defaultHeight: 60,
    defaultContent: "",
    Render: (props) => <DividerBlock {...props} />,
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
    defaultContent: "",
    Render: (props) => <ContainerBlock {...props} />,
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
    defaultWidth: 200,
    defaultHeight: 60,
    defaultContent: "Click me",
    defaultStyle: {
      bgColor: "#3b82f6",
      textColor: "#ffffff",
      borderRadius: 8,
      paddingX: 16,
      paddingY: 10,
      fontSize: 14,
      fontWeight: 500,
    },
    Render: (props) => <ButtonBlock {...props} />,
  },

  // cta: {
  //   type: "cta",
  //   label: "Call to Action",
  //   icon: <MessageSquareWarning size={18} />,
  //   defaultWidth: 500,
  //   defaultHeight: 150,
  //   defaultContent: "Your call to action",
  //   Render: ({ element, update }) => (
  //     <div 
  //       className="p-4 border rounded bg-yellow-100 cursor-pointer"
  //       contentEditable
  //       suppressContentEditableWarning
  //       onInput={(e) => update && update({ content: e.currentTarget.innerHTML })}
  //       dangerouslySetInnerHTML={{ __html: element.content || "Your call to action" }}
  //     />
  //   ),
  // },

  embed: {
    type: "embed",
    label: "Embed",
    icon: <SquareChevronRight size={18} />,
    defaultWidth: 600,
    defaultHeight: 300,
    defaultContent: "",
    Render: ({ element, update, openModal }) => (
      <div
        className="border bg-gray-100 p-4 cursor-pointer min-h-[100px] flex items-center justify-center"
        onClick={() => openModal && openModal(element.id, "Embed Code", element.content)}
      >
        {element.content ? (
          <div dangerouslySetInnerHTML={{ __html: element.content }} />
        ) : (
          <span className="text-gray-500">Click to add embed code</span>
        )}
      </div>
    ),
  },

  code: {
    type: "code",
    label: "Code Block",
    icon: <Code size={18} />,
    defaultWidth: 600,
    defaultHeight: 300,
    defaultContent: "console.log('hello');",
    defaultStyle: {
      theme: 'dark',
      language: 'javascript',
      showLineNumbers: true,
    },
    Render: (props) => <CodeBlock {...props} />,
  },

  // slideshow: {
  //   type: "slideshow",
  //   label: "Slideshow",
  //   icon: <Projector size={18} />,
  //   defaultWidth: 700,
  //   defaultHeight: 300,
  //   defaultContent: "",
  //   Render: (props) => <SlideshowBlock {...props} />,
  // },

  repos: {
    type: "repos",
    label: "GitHub Repos",
    icon: <Github size={18} />,
    defaultWidth: 600,
    defaultHeight: 400,
    defaultContent: "",
    Render: (props) => <ReposBlock {...props} />,
  },
};