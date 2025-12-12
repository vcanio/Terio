"use client";

import { useVQStore } from "../store/useVQStore";
import { VQ_GROUPS, SCORES, VQScore, ALL_VQ_ITEMS_COUNT } from "../utils/constants";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { useState } from "react";

export const VQEvaluator = () => {
  const { sessions, activeSessionId, setActiveSession, updateObservation, updateNote } = useVQStore();
  const [openNoteId, setOpenNoteId] = useState<number | null>(null);

  const currentSession = sessions.find(s => s.id === activeSessionId);

  if (!currentSession) return null;

  // Calculamos progreso
  const scoredCount = Object.values(currentSession.observations).filter(o => o.score !== null).length;
  const progress = Math.round((scoredCount / ALL_VQ_ITEMS_COUNT) * 100);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      
      {/* Header Fijo */}
      <div className="bg-white border-b border-slate-200 p-4 shrink-0 sticky top-0 z-20 shadow-sm">
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

        {/* Leyenda de Puntuación */}
        <div className="flex justify-between gap-2">
          {Object.entries(SCORES).map(([key, val]) => (
            <div key={key} className={`text-[10px] sm:text-xs font-bold px-2 py-1.5 rounded-lg border flex-1 text-center ${val.color}`}>
              {val.code} - {val.label}
            </div>
          ))}
        </div>
      </div>

      {/* Contenido Scrollable con Grupos */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 scroll-smooth">
        
        {VQ_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-3">
            
            {/* Título de la Dimensión (Lateral en la tabla, Encabezado aquí) */}
            <div className="flex items-center gap-2 px-1">
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
                  <div className="flex justify-between items-start mb-3 gap-4">
                    <p className="font-medium text-slate-800 text-sm sm:text-base leading-snug">
                        {item.text}
                    </p>
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
                        className="w-full text-sm p-3 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-y min-h-20"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <div className="h-8"></div> {/* Espacio extra al final */}
      </div>
    </div>
  );
};