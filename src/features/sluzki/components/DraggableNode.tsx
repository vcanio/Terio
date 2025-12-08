import { useRef } from "react";
import Draggable from "react-draggable";
import { NodeData } from "../types";
import { THEME } from "../utils/constants";

interface DraggableNodeProps {
  node: NodeData;
  displayNumber: number;
  onDrag: (id: string, x: number, y: number) => void;
  onClick: () => void;
  isTarget: boolean;
  isSelected: boolean;
}

export const DraggableNode = ({ node, displayNumber, onDrag, onClick, isTarget, isSelected }: DraggableNodeProps) => {
  const nodeRef = useRef(null);
  const style = THEME[node.type];
  
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
          w-10 h-10 md:w-12 md:h-12 rounded-full flex flex-col items-center justify-center
          border-[3px] shadow-sm transition-all duration-200 bg-white
          ${style.border}
          ${isTarget ? "ring-4 ring-blue-400 ring-offset-2 scale-110 z-30" : ""} 
          ${isSelected ? "ring-4 ring-slate-400 ring-offset-2" : ""}
          hover:shadow-lg -translate-x-1/2 -translate-y-1/2
        `} title={node.name}> {/* Mantenemos 'title' para que el navegador muestre el nombre nativamente */}
          
          <div className={`absolute inset-1 rounded-full opacity-30 ${style.bg} -z-10`}></div>
          <span className={`text-sm md:text-base font-black ${style.text} leading-none select-none`}>
            {displayNumber}
          </span>
        </div>
        
        {/* Se ha eliminado el div del tooltip personalizado para evitar duplicidad */}
      </div>
    </Draggable>
  );
};