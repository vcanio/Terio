import { useRef } from "react";
import Draggable from "react-draggable";
import { NodeData } from "../types";
import { THEME, getInitials } from "../utils/constants";

interface DraggableNodeProps {
  node: NodeData;
  onDrag: (id: string, x: number, y: number) => void;
  onClick: () => void;
  isTarget: boolean;
  isSelected: boolean;
}

export const DraggableNode = ({ node, onDrag, onClick, isTarget, isSelected }: DraggableNodeProps) => {
  const nodeRef = useRef(null);
  const style = THEME[node.type];
  const Icon = style.icon;
  const initials = getInitials(node.name || "?");

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: node.x, y: node.y }}
      onDrag={(e, data) => onDrag(node.id, data.x, data.y)}
      disabled={isTarget}
    >
      <div
        ref={nodeRef}
        className="absolute z-20 cursor-grab active:cursor-grabbing group"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <div className={`
          w-12 h-12 md:w-14 md:h-14 rounded-full flex flex-col items-center justify-center
          border-[3px] shadow-sm transition-all duration-200 bg-white
          ${style.border}
          ${isTarget ? "ring-4 ring-blue-400 ring-offset-2 scale-110 z-30" : ""} 
          ${isSelected ? "ring-4 ring-slate-400 ring-offset-2" : ""}
          hover:shadow-lg -translate-x-1/2 -translate-y-1/2
        `} title={node.name}>
          <div className={`absolute inset-1 rounded-full opacity-40 ${style.bg} -z-10`}></div>
          <Icon size={10} className={`mb-0.5 opacity-60 ${style.text}`} />
          <span className={`text-xs md:text-sm font-black ${style.text} leading-none select-none`}>
            {initials}
          </span>
        </div>
      </div>
    </Draggable>
  );
};