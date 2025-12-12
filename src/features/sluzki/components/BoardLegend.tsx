import { BookOpen } from "lucide-react";
import { NodeData } from "../types";
import { THEME } from "../utils/constants";

interface BoardLegendProps {
  nodes: NodeData[];
  show: boolean;
}

export const BoardLegend = ({ nodes, show }: BoardLegendProps) => {
  if (!show || nodes.length === 0) return null;

  return (
    <div className={`
      absolute z-20 
      transition-all duration-300 ease-in-out
      bg-white/95 backdrop-blur-sm shadow-xl border border-slate-200 
      
      /* --- CAMBIOS PARA MÓVIL --- */
      
      /* 1. POSICIÓN: Lo movemos ARRIBA (top-4) para usar el espacio vacío */
      top-4 left-4 right-4 bottom-auto translate-y-0 
      
      /* 2. TAMAÑO: Ancho automático y bordes redondeados */
      w-auto rounded-2xl
      
      /* 3. SCROLL: Limitamos la altura a aprox. 3 elementos + encabezado (~180px). 
            Si pasa de eso, aparece scroll vertical. */
      max-h-[180px] overflow-y-auto 
      
      /* -------------------------- */

      pointer-events-auto

      /* ESTILOS ESCRITORIO (Se mantienen a la derecha y centrados) */
      lg:top-1/2 lg:-translate-y-1/2 lg:right-4 lg:bottom-auto lg:left-auto lg:w-64 lg:max-h-[60vh]
      
      animate-in fade-in zoom-in-95
    `}>
      
      {/* Encabezado fijo (sticky) para que no se pierda al hacer scroll */}
      <div className="p-3 sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 z-10 flex items-center gap-2">
        <BookOpen size={16} className="text-blue-500" />
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leyenda</h3>
      </div>

      {/* Lista de Nodos */}
      <ul className="p-3 space-y-2">
        {nodes.map((node, index) => {
          const style = THEME[node.type];
          return (
            <li key={node.id} className="flex items-start gap-3">
              {/* Número del nodo */}
              <span className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold border shadow-sm ${style.bg} ${style.border} ${style.text}`}>
                {index + 1}
              </span>
              {/* Nombre del nodo */}
              <span className="text-sm font-medium text-slate-700 leading-snug pt-0.5 wrap-break-words w-full">
                {node.name}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};