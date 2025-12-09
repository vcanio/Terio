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
  scale: number;
}

export const DraggableNode = ({ node, displayNumber, onDrag, onClick, isTarget, isSelected, scale }: DraggableNodeProps) => {
  const style = THEME[node.type];
  // Guardamos la posición inicial para calcular el delta del arrastre
  const dragStartPos = useRef({ x: node.x, y: node.y });

  return (
    <motion.div
      // 1. PADRE: Maneja SOLO posición (x, y). NO le pasamos 'scale' aquí.
      // Esto asegura que el sistema de coordenadas del arrastre sea siempre 1:1 con el mouse.
      initial={{ x: node.x, y: node.y }}
      animate={{ x: node.x, y: node.y }}
      
      // Transición suave solo para posición (opcional, puedes quitarlo si quieres movimiento instantáneo)
      transition={{ duration: 0.1, ease: "easeOut" }}
      
      // Configuración de Arrastre
      drag
      dragMomentum={false}
      onDragStart={() => {
        dragStartPos.current = { x: node.x, y: node.y };
      }}
      onDrag={(_, info) => {
        // Al no escalar este div, info.offset siempre es correcto en píxeles de pantalla
        const newX = dragStartPos.current.x + info.offset.x;
        const newY = dragStartPos.current.y + info.offset.y;
        onDrag(node.id, newX, newY);
      }}
      
      // Clases de posicionamiento
      className="absolute z-20 cursor-grab active:cursor-grabbing group"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      dragListener={!isTarget}
    >
      {/* 2. HIJO: Maneja SOLO la escala y la apariencia visual.
          Al ser un hijo, su escala es visual y no afecta la lógica de coordenadas del padre.
      */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: scale, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }} // Animación suave al hacer zoom
        
        className={`
          w-10 h-10 md:w-12 md:h-12 rounded-full flex flex-col items-center justify-center
          border-[3px] shadow-sm transition-colors duration-200 bg-white
          ${style.border}
          ${isTarget ? "ring-4 ring-blue-400 ring-offset-2 z-30" : ""} 
          ${isSelected ? "ring-4 ring-slate-400 ring-offset-2" : ""}
          hover:shadow-lg -translate-x-1/2 -translate-y-1/2
        `} 
        title={node.name}
      >
        <div className={`absolute inset-1 rounded-full opacity-30 ${style.bg} -z-10`}></div>
        <span className={`text-sm md:text-base font-black ${style.text} leading-none select-none`}>
          {displayNumber}
        </span>
      </motion.div>
    </motion.div>
  );
};