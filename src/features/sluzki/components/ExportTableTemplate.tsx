import { NodeData } from "../types";
import { THEME, LEVELS } from "../utils/constants";
import { Calendar, User } from "lucide-react";

interface ExportTableTemplateProps {
  nodes: NodeData[];
  centerName: string;
}

export const ExportTableTemplate = ({ nodes, centerName }: ExportTableTemplateProps) => {
  const date = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-[800px] bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-slate-900 font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b-2 border-slate-100 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Mapa de Red Social
          </h1>
          <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
              <User size={14} /> Usuario: <strong className="text-slate-700">{centerName}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {date}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-blue-600/20">Terio.</div>
        </div>
      </div>

      {/* TABLA VISUAL */}
      {nodes.length === 0 ? (
        <div className="text-center py-10 text-slate-400 italic">
          No hay contactos registrados en la red.
        </div>
      ) : (
        /* CORRECCIÓN: El comentario se movió fuera o se eliminó para evitar error de hidratación */
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-slate-200">
              {/* COLUMNA 1: NÚMERO */}
              <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-16 text-center">Nº</th>
              
              {/* COLUMNA 2: NOMBRE */}
              <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-auto">Nombre</th>
              
              {/* COLUMNA 3: VÍNCULO */}
              <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-32">Vínculo</th>
              
              {/* COLUMNA 4: NIVEL */}
              <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-48 text-right">Nivel / Cercanía</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {nodes.map((node, index) => {
              const theme = THEME[node.type];
              const level = LEVELS[node.level];
              const Icon = theme.icon;

              return (
                <tr key={node.id} className="border-b border-slate-50 last:border-0 even:bg-slate-50/50">
                  <td className="py-3 px-4 text-slate-400 font-mono text-xs text-center">{index + 1}</td>
                  
                  <td className="py-3 px-4 font-bold text-slate-700 truncate pr-8">
                    {node.name}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${theme.bg} ${theme.border} ${theme.text} bg-opacity-50`}>
                      <Icon size={12} />
                      {theme.label}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 border border-slate-200">
                        {node.level}
                      </span>
                      <span className="text-slate-500 text-xs w-32 text-left truncate">{level.label}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
        <span>Generado con Terio - Plataforma para Terapeutas Ocupacionales</span>
      </div>
    </div>
  );
};