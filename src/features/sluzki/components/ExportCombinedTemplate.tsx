import { NodeData, EdgeData } from "../types";
import { THEME } from "../utils/constants";
import { Calendar, User, Share2 } from "lucide-react";
import { BoardBackground } from "./BoardBackground";

interface ExportCombinedTemplateProps {
  nodes: NodeData[];
  edges: EdgeData[];
  centerName: string;
}

export const ExportCombinedTemplate = ({ nodes, edges, centerName }: ExportCombinedTemplateProps) => {
  const date = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Helper local para obtener posiciones (coincide con la lógica del store)
  const getNodePos = (id: string) => {
    if (id === "center") return { x: 0, y: 0 };
    const n = nodes.find((x) => x.id === id);
    return n ? { x: n.x, y: n.y } : { x: 0, y: 0 };
  };

  return (
    // Contenedor principal de ancho fijo para asegurar consistencia en la imagen
    <div className="w-[1000px] bg-white p-12 rounded-none text-slate-900 font-sans flex flex-col gap-10">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b-2 border-slate-100 pb-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
            Reporte de Red Social
          </h1>
          <div className="flex items-center gap-4 text-slate-500 text-base font-medium">
            <span className="flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200">
              <User size={18} className="text-blue-500" /> Usuario: <strong className="text-slate-700">{centerName}</strong>
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={18} className="text-slate-400" /> {date}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-6xl font-black text-blue-600/10 tracking-tighter">Terio.</div>
        </div>
      </div>

      <div className="flex items-start gap-12">
        
        {/* COLUMNA IZQUIERDA: EL MAPA (Miniatura) */}
        <div className="shrink-0 flex flex-col gap-4">
            <div className="relative w-[450px] h-[450px] bg-slate-50/50 rounded-full border border-slate-200 overflow-hidden shadow-sm">
                
                {/* Truco: Usamos scale(0.45) porque el diseño original es de 1000px */}
                <div className="absolute inset-0 w-[1000px] h-[1000px] origin-top-left scale-[0.45] pointer-events-none">
                    <BoardBackground />
                    
                    {/* Capa de Conexiones Manual (SVG) */}
                    <svg className="absolute inset-0 w-full h-full overflow-visible">
                        {edges.map((edge) => {
                            const start = getNodePos(edge.from);
                            const end = getNodePos(edge.to);
                            return (
                                <line 
                                    key={edge.id}
                                    x1={start.x + 500} y1={start.y + 500} // +500 porque el 0,0 es el centro
                                    x2={end.x + 500} y2={end.y + 500} 
                                    stroke="#94a3b8" strokeWidth="4" 
                                />
                            );
                        })}
                    </svg>

                    {/* Nodo Central */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-24 rounded-full bg-slate-900 text-white flex items-center justify-center border-4 border-white shadow-xl">
                        <span className="text-xs font-bold text-center px-1 line-clamp-2">{centerName}</span>
                    </div>

                    {/* Nodos */}
                    {nodes.map((node, index) => {
                        const style = THEME[node.type];
                        return (
                            <div
                                key={node.id}
                                style={{ left: node.x + 500, top: node.y + 500 }}
                                className={`
                                    absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 z-20 
                                    rounded-full flex flex-col items-center justify-center 
                                    border-4 shadow-lg bg-white ${style.border}
                                `}
                            >
                                <div className={`absolute inset-1 rounded-full opacity-30 ${style.bg} -z-10`}></div>
                                <span className={`text-2xl font-black ${style.text}`}>{index + 1}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* Mini leyenda de resumen */}
            <div className="flex justify-between px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>{nodes.length} Nodos</span>
                <span>{edges.length} Conexiones</span>
            </div>
        </div>

        {/* COLUMNA DERECHA: LA TABLA */}
        <div className="flex-1 pt-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Share2 size={16} /> Detalle de Vínculos
            </h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase w-12 text-center">#</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Nombre</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Vínculo</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right">Nivel</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {nodes.map((node, index) => {
                            const theme = THEME[node.type];
                            const Icon = theme.icon;
                            return (
                                <tr key={node.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                                    <td className="py-3 px-4 font-bold text-slate-400 text-center">{index + 1}</td>
                                    <td className="py-3 px-4 font-bold text-slate-800">{node.name}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${theme.bg} ${theme.border} ${theme.text} bg-opacity-30`}>
                                            <Icon size={12} /> {theme.label}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                                            {node.level}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        {nodes.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-slate-400 italic">No hay nodos en el mapa.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
        <span>Generado el {date} con Terio</span>
        <span>Gestión para Terapeutas Ocupacionales</span>
      </div>
    </div>
  );
};