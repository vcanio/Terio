"use client";

import React, { useRef } from 'react';
import { useVQStore } from "../store/useVQStore";
import { useSluzkiStore } from "../../sluzki/store/useSluzkiStore";
import { VQ_GROUPS } from "../utils/constants";
import { Download, X } from "lucide-react"; // Usamos Download en vez de Printer

interface VQReportProps {
  sessionId: string;
  onClose: () => void;
}

export const VQReport = ({ sessionId, onClose }: VQReportProps) => {
  const session = useVQStore(state => state.sessions.find(s => s.id === sessionId));
  // Obtenemos el nombre del paciente del store global
  const { centerName } = useSluzkiStore(); 
  
  const componentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    const printContent = componentRef.current;
    if (printContent) {
      // Técnica para imprimir solo el contenido del reporte
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      
      // Al llamar a print, el navegador ofrecerá "Guardar como PDF"
      window.print();
      
      // Restauramos la app
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

        {/* CONTENIDO DEL REPORTE (Diseño "Papel") */}
        <div className="overflow-y-auto p-8 bg-slate-100">
          <div ref={componentRef} className="bg-white p-8 shadow-sm mx-auto max-w-[21cm] min-h-[29.7cm] text-slate-900" style={{ fontFamily: 'Arial, sans-serif' }}>
            
            {/* Encabezado del Documento */}
            <div className="mb-6 border-b-2 border-slate-800 pb-4">
              <h1 className="text-2xl font-black uppercase mb-4">Cuestionario Volitivo (VQ)</h1>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-bold">Paciente:</span> {centerName || "Paciente"}</div>
                <div><span className="font-bold">Fecha:</span> {new Date(session.date).toLocaleDateString()}</div>
                <div><span className="font-bold">Actividad:</span> {session.activity}</div>
                <div><span className="font-bold">Ambiente:</span> {session.environment}</div>
              </div>
            </div>

            {/* TABLA CLÁSICA */}
            <table className="w-full border-collapse border-2 border-slate-800 text-sm">
              <thead>
                <tr>
                  <th className="border border-slate-800 bg-slate-100 p-2 w-8 text-center -rotate-90 whitespace-nowrap h-32">PROCESO</th>
                  <th className="border border-slate-800 bg-slate-100 p-2 text-left">DIMENSIONES / ÍTEMS</th>
                  <th className="border border-slate-800 p-1 w-8 text-center bg-red-50">P</th>
                  <th className="border border-slate-800 p-1 w-8 text-center bg-orange-50">D</th>
                  <th className="border border-slate-800 p-1 w-8 text-center bg-blue-50">I</th>
                  <th className="border border-slate-800 p-1 w-8 text-center bg-emerald-50">E</th>
                </tr>
              </thead>
              <tbody>
                {VQ_GROUPS.map((group) => (
                  <React.Fragment key={group.name}>
                    {group.items.map((item, index) => {
                      const score = session.observations[item.id]?.score;
                      return (
                        <tr key={item.id}>
                          {/* Celda agrupada del nombre de la dimensión */}
                          {index === 0 && (
                            <td 
                              rowSpan={group.items.length} 
                              className="border border-slate-800 p-2 text-center font-bold uppercase -rotate-90 whitespace-nowrap w-8 bg-slate-50 text-xs"
                            >
                              {group.name}
                            </td>
                          )}
                          
                          <td className="border border-slate-800 p-2 px-3">{item.text}</td>
                          
                          {/* Celdas de Puntuación */}
                          {[1, 2, 3, 4].map((colScore) => (
                            <td key={colScore} className="border border-slate-800 p-0 text-center align-middle">
                              {score === colScore && (
                                <div className="w-full h-full flex items-center justify-center font-bold text-lg text-slate-900 bg-slate-200 print:bg-transparent">
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

            {/* Sección de Observaciones Cualitativas */}
            <div className="mt-8 break-inside-avoid">
              <h3 className="font-bold border-b border-slate-800 mb-2">NOTAS Y OBSERVACIONES</h3>
              <div className="border border-slate-800 min-h-[150px] p-2 text-sm whitespace-pre-wrap">
                {Object.values(session.observations)
                  .filter(o => o.note)
                  .map(o => {
                    const itemText = VQ_GROUPS.flatMap(g => g.items).find(i => i.id === o.itemId)?.text;
                    return `• [${itemText}]: ${o.note}\n`;
                  })}
              </div>
            </div>

            {/* Claves / Leyenda al pie */}
            <div className="mt-6 border border-slate-800 w-64 text-xs break-inside-avoid">
              <div className="font-bold border-b border-slate-800 p-1 bg-slate-100 text-center">CLAVES</div>
              <div className="p-2 space-y-1">
                <div>P: Pasivo</div>
                <div>D: Dudoso</div>
                <div>I: Involucrado</div>
                <div>E: Espontáneo</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};