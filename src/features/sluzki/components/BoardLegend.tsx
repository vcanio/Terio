import { BookOpen } from "lucide-react";
import { NodeData } from "../types";
import { THEME } from "../utils/constants";

interface BoardLegendProps {
  nodes: NodeData[];
  show: boolean;
}

export const BoardLegend = ({ nodes, show }: BoardLegendProps) => {
  // Si no se debe mostrar o no hay nodos, no renderizamos nada
  if (!show || nodes.length === 0) return null;

  return (
    <div className={`
      absolute z-20 
      transition-all duration-300 ease-in-out
      bg-white/95 backdrop-blur-sm shadow-xl border border-slate-200 
      
      /* ESTILOS MÓVIL: Panel inferior ancho completo con margen */
      bottom-32 left-4 right-4 top-auto translate-y-0 w-auto rounded-2xl
      max-h-[30vh] overflow-y-auto pointer-events-auto

      /* ESTILOS ESCRITORIO: Panel flotante a la derecha */
      lg:top-1/2 lg:-translate-y-1/2 lg:right-4 lg:bottom-auto lg:left-auto lg:w-64 lg:max-h-[60vh]
      
      animate-in fade-in zoom-in-95
    `}>
      
      {/* Encabezado fijo */}
      <div className="p-4 sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 z-10 flex items-center gap-2">
        <BookOpen size={16} className="text-blue-500" />
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Referencias</h3>
      </div>

      {/* Lista de Nodos */}
      <ul className="p-4 pt-2 space-y-2">
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