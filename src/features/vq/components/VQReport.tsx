// src/features/vq/components/VQReport.tsx
"use client";

import React, { useRef } from 'react';
import { useVQStore } from "../store/useVQStore";
import { useSluzkiStore } from "../../sluzki/store/useSluzkiStore";
import { VQ_GROUPS } from "../utils/constants";
import { Download, X } from "lucide-react";

interface VQReportProps {
  sessionId: string;
  onClose: () => void;
}

export const VQReport = ({ sessionId, onClose }: VQReportProps) => {
  const session = useVQStore(state => state.sessions.find(s => s.id === sessionId));
  const { centerName } = useSluzkiStore(); 
  
  const componentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    const printContent = componentRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); 
    }
  };

  if (!session) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        
        {/* Toolbar Superior */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="font-bold text-lg text-slate-800">Vista Previa del Informe</h2>
          <div className="flex gap-2">
            <button 
              onClick={handleExportPDF} 
              className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg"
            >
              <Download size={18} /> Exportar PDF
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* CONTENIDO DEL REPORTE */}
        <div className="overflow-y-auto p-8 bg-slate-100">
          <div ref={componentRef} className="bg-white p-8 shadow-sm mx-auto max-w-[21cm] min-h-[29.7cm] text-slate-900" style={{ fontFamily: 'Arial, sans-serif' }}>
            
            {/* Encabezado */}
            <div className="mb-6 border-b-2 border-slate-800 pb-4">
              <h1 className="text-2xl font-black uppercase mb-4">Cuestionario Volitivo (VQ)</h1>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-bold">Paciente:</span> {centerName || "Paciente"}</div>
                <div><span className="font-bold">Fecha:</span> {new Date(session.date).toLocaleDateString()}</div>
                <div><span className="font-bold">Actividad:</span> {session.activity}</div>
                <div><span className="font-bold">Ambiente:</span> {session.environment}</div>
              </div>
            </div>

            {/* --- NUEVO: Gráfico de Perfil Volitivo --- */}
            <div className="mb-8 break-inside-avoid">
                <h3 className="text-sm font-bold uppercase border-b border-slate-200 mb-4 pb-1 text-slate-500">Perfil Volitivo</h3>
                <div className="grid grid-cols-3 gap-6">
                {VQ_GROUPS.map(group => {
                    // Calculamos puntaje real vs ideal
                    const groupItems = group.items.map(i => i.id);
                    // Sumamos score (si es null asumimos 0)
                    const totalScore = groupItems.reduce((acc, id) => acc + (session.observations[id]?.score || 0), 0);
                    const maxScore = groupItems.length * 4; // 4 es el puntaje máximo (E)
                    
                    // Porcentaje seguro
                    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
                    
                    // Semáforo clínico
                    let barColor = "bg-red-500";
                    if (percentage > 50) barColor = "bg-orange-400";
                    if (percentage > 70) barColor = "bg-blue-500";
                    if (percentage > 85) barColor = "bg-emerald-500";

                    return (
                    <div key={group.name} className="border border-slate-200 p-4 rounded-lg bg-slate-50 print:bg-white print:border-slate-300">
                        <div className="flex justify-between items-baseline mb-2">
                            <span className="text-xs font-black uppercase text-slate-600">{group.name}</span>
                            <span className="text-lg font-bold text-slate-800">{percentage}%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden print:border print:border-slate-300">
                             {/* Usamos !important en print para forzar color oscuro si la impresora es B/N */}
                            <div style={{ width: `${percentage}%` }} className={`h-full ${barColor} print:bg-slate-600! transition-all duration-500`}></div> 
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 text-right">
                             {totalScore} / {maxScore} pts
                        </div>
                    </div>
                    )
                })}
                </div>
            </div>

            {/* TABLA DE RESULTADOS */}
            <table className="w-full border-collapse border-2 border-slate-800 text-sm mb-6">
              <thead>
                <tr>
                  <th className="border border-slate-800 bg-slate-100 p-2 w-12 text-center [writing-mode:vertical-rl] rotate-180 whitespace-nowrap h-32 align-middle text-xs font-bold uppercase">PROCESO</th>
                  <th className="border border-slate-800 bg-slate-100 p-2 text-left align-middle font-bold uppercase">DIMENSIONES / ÍTEMS</th>
                  <th className="border border-slate-800 p-1 w-8 text-center bg-red-50 align-middle font-bold">P</th>
                  <th className="border border-slate-800 p-1 w-8 text-center bg-orange-50 align-middle font-bold">D</th>
                  <th className="border border-slate-800 p-1 w-8 text-center bg-blue-50 align-middle font-bold">I</th>
                  <th className="border border-slate-800 p-1 w-8 text-center bg-emerald-50 align-middle font-bold">E</th>
                </tr>
              </thead>
              <tbody>
                {VQ_GROUPS.map((group) => (
                  <React.Fragment key={group.name}>
                    {group.items.map((item, index) => {
                      const score = session.observations[item.id]?.score;
                      return (
                        <tr key={item.id}>
                          {/* Celda agrupada de dimensión */}
                          {index === 0 && (
                            <td 
                              rowSpan={group.items.length} 
                              className="border border-slate-800 p-2 text-center font-bold uppercase [writing-mode:vertical-rl] rotate-180 whitespace-nowrap w-12 bg-slate-50 text-[10px] align-middle"
                            >
                              {group.name}
                            </td>
                          )}
                          
                          <td className="border border-slate-800 p-2 pl-4">{item.text}</td>
                          
                          {/* Celdas de Puntuación */}
                          {[1, 2, 3, 4].map((colScore) => (
                            <td key={colScore} className="border border-slate-800 p-0 text-center align-middle">
                              {score === colScore && (
                                <div className="w-full h-full flex items-center justify-center font-black text-lg text-slate-900 bg-slate-200 print:bg-slate-300">
                                  X
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* Sección Notas */}
            <div className="mt-8 break-inside-avoid">
              <h3 className="font-bold border-b border-slate-800 mb-2 bg-slate-100 p-1 pl-2 text-xs uppercase">Notas de Observación</h3>
              <div className="border border-slate-800 min-h-20 p-4 text-sm whitespace-pre-wrap bg-white">
                {Object.values(session.observations).some(o => o.note) ? (
                    Object.values(session.observations)
                    .filter(o => o.note)
                    .map(o => {
                        const itemText = VQ_GROUPS.flatMap(g => g.items).find(i => i.id === o.itemId)?.text;
                        return (
                            <div key={o.itemId} className="mb-2">
                                <span className="font-bold mr-2">• {itemText}:</span>
                                <span>{o.note}</span>
                            </div>
                        );
                    })
                ) : (
                    <span className="text-slate-400 italic">Sin notas específicas registradas.</span>
                )}
              </div>
            </div>

            {/* Sección Conclusión */}
            <div className="mt-6 break-inside-avoid">
                <h3 className="font-bold border-b border-slate-800 mb-2 bg-slate-100 p-1 pl-2 text-xs uppercase">Conclusión y Sugerencias</h3>
                <div className="border border-slate-800 min-h-[120px] p-4 text-sm whitespace-pre-wrap leading-relaxed bg-white">
                  {session.conclusion || <span className="text-slate-400 italic">Sin conclusiones registradas.</span>}
                </div>
            </div>

            {/* Footer con Claves y Firma */}
            <div className="mt-8 flex justify-between items-end break-inside-avoid">
                <div className="border border-slate-800 text-xs w-48">
                    <div className="font-bold border-b border-slate-800 p-1 bg-slate-100 text-center uppercase">Claves</div>
                    <div className="p-2 space-y-1">
                        <div><strong>P:</strong> Pasivo (1)</div>
                        <div><strong>D:</strong> Dudoso (2)</div>
                        <div><strong>I:</strong> Involucrado (3)</div>
                        <div><strong>E:</strong> Espontáneo (4)</div>
                    </div>
                </div>
                
                <div className="text-center w-64">
                    <div className="border-b border-slate-800 h-10"></div>
                    <p className="text-sm font-bold mt-2">Firma Terapeuta Ocupacional</p>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};