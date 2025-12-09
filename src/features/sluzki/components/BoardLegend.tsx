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
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-64 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border border-slate-200 p-4 pointer-events-none sm:pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-200">
      
      {/* Encabezado de la Leyenda */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
        <BookOpen size={16} className="text-blue-500" />
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Referencias</h3>
      </div>

      {/* Lista de Nodos (Ya vienen ordenados desde el Store) */}
      <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
        {nodes.map((node, index) => {
          const style = THEME[node.type];
          return (
            <li key={node.id} className="flex items-start gap-3">
              {/* Número del nodo */}
              <span className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold border shadow-sm ${style.bg} ${style.border} ${style.text}`}>
                {index + 1}
              </span>
              {/* Nombre del nodo */}
              <span className="text-sm font-medium text-slate-700 leading-snug pt-0.5 wrap-break-word w-full">
                {node.name}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};