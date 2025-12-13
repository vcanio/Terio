// src/features/vq/components/VQEvaluator.tsx
"use client";

import { useVQStore } from "../store/useVQStore";
import { VQ_GROUPS, SCORES, VQScore, ALL_VQ_ITEMS_COUNT, ITEM_DEFINITIONS } from "../utils/constants";
import { ArrowLeft, MessageSquare, FilePenLine, CheckCircle, Info } from "lucide-react";
import { useState } from "react";

export const VQEvaluator = () => {
  const { sessions, activeSessionId, setActiveSession, updateObservation, updateNote, updateConclusion } = useVQStore();
  const [openNoteId, setOpenNoteId] = useState<number | null>(null);

  const currentSession = sessions.find(s => s.id === activeSessionId);

  if (!currentSession) return null;

  // Calculamos progreso
  const scoredCount = Object.values(currentSession.observations).filter(o => o.score !== null).length;
  const progress = Math.round((scoredCount / ALL_VQ_ITEMS_COUNT) * 100);

  // --- NUEVO: Estadísticas en tiempo real ---
  const stats = {
    P: Object.values(currentSession.observations).filter(o => o.score === 1).length,
    D: Object.values(currentSession.observations).filter(o => o.score === 2).length,
    I: Object.values(currentSession.observations).filter(o => o.score === 3).length,
    E: Object.values(currentSession.observations).filter(o => o.score === 4).length,
  };

  // --- NUEVO: Función de scroll suave ---
  const scrollToGroup = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
        // Ajuste de offset para que no quede tapado por el header sticky
        const y = el.getBoundingClientRect().top + window.scrollY - 180;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      
      {/* Header Fijo */}
      <div className="bg-white border-b border-slate-200 shrink-0 sticky top-0 z-30 shadow-sm">
        <div className="p-4 pb-2">
            <div className="flex items-center gap-3 mb-3">
            <button onClick={() => setActiveSession(null)} className="p-2 -ml-2 text-slate-400 hover:text-slate-800 transition-colors">
                <ArrowLeft size={20} />
            </button>
            <div className="flex-1 min-w-0">
                <h2 className="font-bold text-slate-900 truncate">{currentSession.activity}</h2>
                <p className="text-xs text-slate-500 truncate">{currentSession.environment}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
                <div className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                    {progress}%
                </div>
            </div>
            </div>

            {/* --- NUEVO: Dashboard de Resumen Rápido --- */}
            <div className="grid grid-cols-4 gap-2 mb-2">
                <div className="bg-red-50 border border-red-100 p-2 rounded-lg flex flex-col items-center">
                    <span className="text-xl font-black text-red-600 leading-none">{stats.P}</span>
                    <span className="text-[9px] font-bold text-red-400 uppercase">Pasivo</span>
                </div>
                <div className="bg-orange-50 border border-orange-100 p-2 rounded-lg flex flex-col items-center">
                    <span className="text-xl font-black text-orange-600 leading-none">{stats.D}</span>
                    <span className="text-[9px] font-bold text-orange-400 uppercase">Dudoso</span>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg flex flex-col items-center">
                    <span className="text-xl font-black text-blue-600 leading-none">{stats.I}</span>
                    <span className="text-[9px] font-bold text-blue-400 uppercase">Invol.</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-lg flex flex-col items-center">
                    <span className="text-xl font-black text-emerald-600 leading-none">{stats.E}</span>
                    <span className="text-[9px] font-bold text-emerald-400 uppercase">Espont.</span>
                </div>
            </div>
        </div>

        {/* --- NUEVO: Barra de Navegación Sticky --- */}
        <div className="flex gap-2 overflow-x-auto px-4 py-2 bg-slate-50/90 backdrop-blur border-t border-slate-100 hide-scrollbar">
            {VQ_GROUPS.map((group, idx) => (
                <button
                key={idx}
                onClick={() => scrollToGroup(`group-${idx}`)}
                className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:border-slate-300 whitespace-nowrap shadow-sm transition-all active:scale-95"
                >
                {group.name}
                </button>
            ))}
        </div>
      </div>

      {/* Contenido Scrollable con Grupos */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-32 scroll-smooth">
        
        {VQ_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} id={`group-${groupIndex}`} className="space-y-3 scroll-mt-48">
            
            {/* Título de la Dimensión */}
            <div className="flex items-center gap-2 px-1 sticky top-0 bg-slate-50/95 py-2 z-10">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-200/50 px-2 py-1 rounded">
                    {group.name}
                </span>
                <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            {/* Items del Grupo */}
            {group.items.map((item) => {
              const obs = currentSession.observations[item.id];
              const currentScore = obs?.score;

              return (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 transition-all hover:shadow-md">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    
                    {/* --- NUEVO: Tooltip con Definición --- */}
                    <div className="flex items-start gap-2">
                        <p className="font-medium text-slate-800 text-sm sm:text-base leading-snug pt-0.5">
                            {item.text}
                        </p>
                        <div className="group relative pt-1">
                             <Info size={16} className="text-slate-300 hover:text-blue-400 cursor-help transition-colors" />
                             <div className="absolute left-0 top-6 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed font-medium">
                                {ITEM_DEFINITIONS[item.id] || "Sin definición disponible."}
                                {/* Triángulo decorativo */}
                                <div className="absolute -top-1 left-3 w-2 h-2 bg-slate-800 rotate-45"></div>
                             </div>
                        </div>
                    </div>

                    <button 
                      onClick={() => setOpenNoteId(openNoteId === item.id ? null : item.id)}
                      className={`p-1.5 shrink-0 rounded-lg transition-colors ${obs?.note ? 'text-blue-500 bg-blue-50 ring-1 ring-blue-100' : 'text-slate-300 hover:bg-slate-50'}`}
                    >
                      <MessageSquare size={18} />
                    </button>
                  </div>

                  {/* Botones de Puntuación */}
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {([1, 2, 3, 4] as VQScore[]).map((score) => {
                      const style = SCORES[score];
                      const isActive = currentScore === score;
                      
                      return (
                        <button
                          key={score}
                          onClick={() => updateObservation(item.id, score)}
                          className={`
                            h-11 rounded-lg text-sm font-bold border transition-all active:scale-95 flex items-center justify-center
                            ${isActive 
                                ? `${style.color} ring-2 ring-offset-1 ring-blue-200 shadow-sm scale-[1.02]` 
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-white hover:border-slate-300'
                            }
                          `}
                        >
                          {style.code}
                        </button>
                      );
                    })}
                  </div>

                  {/* Área de Notas (Expandible) */}
                  {(openNoteId === item.id || obs?.note) && (
                    <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                      <textarea
                        placeholder="Observación cualitativa..."
                        value={obs?.note || ''}
                        onChange={(e) => updateNote(item.id, e.target.value)}
                        className="w-full text-sm p-3 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-y min-h-20 text-slate-800 placeholder:text-slate-400"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* --- SECCIÓN DE CONCLUSIÓN Y CIERRE --- */}
        <div className="pt-6">
          <div className="flex items-center gap-2 px-1 mb-4">
              <span className="text-xs font-black text-blue-500 uppercase tracking-widest bg-blue-50 border border-blue-100 px-2 py-1 rounded">
                  Cierre de Evaluación
              </span>
              <div className="h-px bg-blue-100 flex-1"></div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold">
              <FilePenLine size={20} className="text-blue-600"/>
              <h3>Conclusión y Sugerencias</h3>
            </div>
            <textarea
              value={currentSession.conclusion || ''}
              onChange={(e) => updateConclusion(e.target.value)}
              placeholder="Escribe aquí tu análisis general, conclusiones profesionales y sugerencias de intervención..."
              className="w-full min-h-[150px] p-4 text-base bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400 resize-y"
            />
            <p className="text-xs text-slate-400 mt-2 text-right">
              Esta información aparecerá al final del reporte PDF.
            </p>
          </div>

          <button 
            onClick={() => setActiveSession(null)}
            className="w-full mt-6 bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} /> Finalizar y Guardar
          </button>
        </div>

        <div className="h-8"></div>
      </div>
    </div>
  );
};