import { useEffect, useRef } from "react";
import { motion, useMotionValue } from "framer-motion"; // Importamos useMotionValue
import { NodeData } from "../types";
import { THEME, LEVELS } from "../utils/constants";

interface DraggableNodeProps {
  node: NodeData;
  displayNumber: number;
  onDrag: (id: string, x: number, y: number) => void;
  onClick: () => void;
  isTarget: boolean;
  isSelected: boolean;
  scale: number;
  screenToBoard: (x: number, y: number) => { x: number; y: number };
}

export const DraggableNode = ({ 
  node, 
  displayNumber, 
  onDrag, 
  onClick, 
  isTarget, 
  isSelected, 
  scale, 
  screenToBoard 
}: DraggableNodeProps) => {
  const style = THEME[node.type];
  
  // 1. Creamos valores de movimiento controlados manualmente
  const x = useMotionValue(node.x);
  const y = useMotionValue(node.y);

  // 2. Sincronizamos: Si la posición cambia por algo que NO es arrastre (ej: carga inicial, deshacer), actualizamos.
  useEffect(() => {
    x.set(node.x);
    y.set(node.y);
  }, [node.x, node.y, x, y]);

  // Guardamos el punto exacto de agarre
  const grabOffset = useRef({ x: 0, y: 0 });

  return (
    <motion.div
      // 3. Vinculamos la posición visual a nuestros valores controlados
      style={{ x, y }} 
      
      drag
      dragMomentum={false}
      dragElastic={0} // Importante: cero elasticidad para que no parezca que se estira
      
      onDragStart={(_, info) => {
        const mousePosOnBoard = screenToBoard(info.point.x, info.point.y);
        grabOffset.current = {
          x: node.x - mousePosOnBoard.x,
          y: node.y - mousePosOnBoard.y
        };
      }}
      
      onDrag={(_, info) => {
        // A. Calcular posición deseada basada en el mouse
        const mousePosOnBoard = screenToBoard(info.point.x, info.point.y);
        let newX = mousePosOnBoard.x + grabOffset.current.x;
        let newY = mousePosOnBoard.y + grabOffset.current.y;
        
        // B. Lógica de "Clamping" (Restricción Circular)
        const maxRadius = LEVELS[3].boundary; // Límite del círculo exterior (480px)
        const distance = Math.sqrt(newX * newX + newY * newY);

        if (distance > maxRadius) {
          // Si se pasa, calculamos el punto exacto en el borde en el mismo ángulo
          const scaleFactor = maxRadius / distance;
          newX *= scaleFactor;
          newY *= scaleFactor;
        }
        
        // C. ACTUALIZAR VISUALMENTE (Esto arregla el bug)
        // Forzamos al componente visual a quedarse en la coordenada restringida
        x.set(newX);
        y.set(newY);
        
        // D. ACTUALIZAR LÓGICA (Líneas y Store)
        onDrag(node.id, newX, newY);
      }}
      
      className="absolute z-20 cursor-grab active:cursor-grabbing group"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      dragListener={!isTarget}
    >
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: scale, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        
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