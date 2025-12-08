import { useRef } from "react";
import { motion } from "framer-motion";
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
  const style = THEME[node.type];
  const dragStartPos = useRef({ x: node.x, y: node.y });

  return (
    <motion.div
      // 1. Posición: Mantenemos la entrada suave pero sin rebote
      initial={{ x: node.x, y: node.y, opacity: 0, scale: 0.9 }} 
      animate={{ x: node.x, y: node.y, opacity: 1, scale: 1 }}
      
      // CAMBIO CLAVE AQUÍ: Usamos 'easeOut' en lugar de 'spring'
      // Esto hace que el movimiento sea fluido y se detenga en seco al llegar.
      transition={{ duration: 0.2, ease: "easeOut" }} 
      
      // 2. Configuración de Arrastre (Sin cambios)
      drag
      dragMomentum={false}
      onDragStart={() => {
        dragStartPos.current = { x: node.x, y: node.y };
      }}
      onDrag={(_, info) => {
        const newX = dragStartPos.current.x + info.offset.x;
        const newY = dragStartPos.current.y + info.offset.y;
        onDrag(node.id, newX, newY);
      }}
      className="absolute z-20 cursor-grab active:cursor-grabbing group"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      dragListener={!isTarget}
    >
      <div className={`
        w-10 h-10 md:w-12 md:h-12 rounded-full flex flex-col items-center justify-center
        border-[3px] shadow-sm transition-all duration-200 bg-white
        ${style.border}
        ${isTarget ? "ring-4 ring-blue-400 ring-offset-2 scale-110 z-30" : ""} 
        ${isSelected ? "ring-4 ring-slate-400 ring-offset-2" : ""}
        hover:shadow-lg -translate-x-1/2 -translate-y-1/2
      `} title={node.name}>
        
        <div className={`absolute inset-1 rounded-full opacity-30 ${style.bg} -z-10`}></div>
        <span className={`text-sm md:text-base font-black ${style.text} leading-none select-none`}>
          {displayNumber}
        </span>
      </div>
    </motion.div>
  );
};