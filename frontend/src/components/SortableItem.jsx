import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    opacity: isDragging ? 0.8 : 1,
    boxShadow: isDragging ? "0 10px 25px rgba(0,0,0,0.15)" : "0 2px 6px rgba(0,0,0,0.03)",
    borderRadius: 10,
    background: isDragging ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
    marginBottom: "1rem",
    cursor: "grab",
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
