import { Trash2 } from "lucide-react";
import { EdgeData, NodeData } from "../types";

interface ConnectionLayerProps {
  edges: EdgeData[];
  nodes: NodeData[];
  isConnecting: boolean;
  sourceId: string | null;
  sourcePos: { x: number; y: number };
  mousePos: { x: number; y: number };
  centerName: string;
  isExporting: boolean;
  getNodePos: (id: string) => { x: number; y: number };
  deleteEdge: (id: string) => void;
  onCenterClick: () => void;
}

export const ConnectionLayer = ({
  edges,
  isConnecting,
  sourceId,
  sourcePos,
  mousePos,
  centerName,
  isExporting,
  getNodePos,
  deleteEdge,
  onCenterClick,
}: ConnectionLayerProps) => {
  return (
    <>
      {/* Capa de Líneas SVG */}
      <svg className="absolute overflow-visible -top-[9999px] -left-[9999px] w-[19999px] h-[19999px] pointer-events-none" style={{ left: 0, top: 0 }}>
        {/* Línea temporal mientras se conecta */}
        {isConnecting && sourceId && (
          <line 
            x1={sourcePos.x} y1={sourcePos.y} 
            x2={mousePos.x} y2={mousePos.y} 
            stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5" 
            className="opacity-60 animate-pulse" 
          />
        )}

        {/* Conexiones existentes */}
        {edges.map((edge) => {
          const start = getNodePos(edge.from);
          const end = getNodePos(edge.to);
          const midX = (start.x + end.x) / 2;
          const midY = (start.y + end.y) / 2;
          
          return (
            <g key={edge.id} className="pointer-events-auto cursor-pointer group" onClick={(e) => { e.stopPropagation(); deleteEdge(edge.id); }}>
              {/* Zona de click ampliada invisible */}
              <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="transparent" strokeWidth="30" />
              {/* Línea visible */}
              <line 
                x1={start.x} y1={start.y} x2={end.x} y2={end.y} 
                stroke="#94a3b8" 
                className="stroke-slate-600 stroke-[2px] transition-colors duration-300 group-hover:stroke-red-400 group-hover:stroke-[3px]" 
              />
              
              {/* Icono de eliminar al hacer hover */}
              {!isExporting && (
                <foreignObject x={midX - 12} y={midY - 12} width={24} height={24} className="overflow-visible pointer-events-none exclude-from-export">
                  <div className="w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-125 md:scale-100">
                    <div className="bg-white text-red-500 rounded-full shadow-md border border-red-100 p-1 hover:bg-red-50">
                      <Trash2 size={12} />
                    </div>
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>

      {/* Nodo Central (Usuario) */}
      <div 
        onClick={onCenterClick} 
        title={centerName} 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 
          w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-900 text-white flex flex-col items-center justify-center shadow-2xl cursor-pointer 
          transition-all duration-300 border-4 border-white ring-1 ring-slate-200 hover:scale-105 active:scale-95 
          ${isConnecting && sourceId === "center" ? "ring-4 ring-blue-400 scale-105" : ""}`}
      >
        <span className="text-[10px] md:text-xs font-bold text-center leading-tight px-1 overflow-hidden text-ellipsis line-clamp-2 max-w-full">
          {centerName || "Usuario"}
        </span>
      </div>
    </>
  );
};