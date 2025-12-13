"use client";

import { useOSAStore } from "../store/useOSAStore";
import { useClinicalUserStore } from "@/features/users/store/useClinicalStore";
import { OSA_ITEMS, PERFORMANCE_SCALE, IMPORTANCE_SCALE } from "../utils/constants";
import { OSAScaleValue } from "../types";
import { Check } from "lucide-react";

export const OSAEvaluator = () => {
  const { activeUserId } = useClinicalUserStore();
  const { sessions, setResponse } = useOSAStore();

  // Seleccionamos la sesión específica del usuario activo
  const activeSession = activeUserId ? sessions[activeUserId] : null;

  if (!activeSession || !activeUserId) return null;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Encabezado de Columnas */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 sticky top-0 z-10">
          <div className="col-span-4">Actividad / Tarea</div>
          <div className="col-span-4 text-center">Desempeño (¿Qué tan bien lo hago?)</div>
          <div className="col-span-4 text-center">Importancia (¿Cuánto vale para mí?)</div>
        </div>

        {/* Lista de Ítems */}
        <div className="divide-y divide-slate-100">
          {OSA_ITEMS.map((item) => {
            const response = activeSession.responses[item.id];
            const perfVal = response?.performance;
            const impVal = response?.importance;

            return (
              <div key={item.id} className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-slate-50/50 transition-colors">
                
                {/* 1. La Pregunta */}
                <div className="col-span-4">
                  <p className="text-sm font-medium text-slate-900">{item.statement}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.category}</p>
                </div>

                {/* 2. Escala de Desempeño */}
                <div className="col-span-4 flex justify-between gap-1 px-2">
                  {PERFORMANCE_SCALE.map((scale) => (
                    <button
                      key={scale.value}
                      // Pasamos el activeUserId al hacer clic
                      onClick={() => setResponse(activeUserId, item.id, 'performance', scale.value as OSAScaleValue)}
                      className={`
                        w-full aspect-square rounded-lg flex flex-col items-center justify-center gap-1 transition-all border
                        ${perfVal === scale.value 
                          ? `${scale.color} ring-2 ring-offset-1 ring-blue-500 shadow-md transform scale-105` 
                          : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:border-slate-300"}
                      `}
                      title={scale.label}
                    >
                      <span className="text-lg font-bold">{scale.value}</span>
                      {perfVal === scale.value && <Check size={12} />}
                    </button>
                  ))}
                </div>

                {/* 3. Escala de Importancia */}
                <div className="col-span-4 flex justify-between gap-1 px-2 border-l border-slate-100">
                  {IMPORTANCE_SCALE.map((scale) => (
                    <button
                      key={scale.value}
                      // Pasamos el activeUserId al hacer clic
                      onClick={() => setResponse(activeUserId, item.id, 'importance', scale.value as OSAScaleValue)}
                      className={`
                        w-full aspect-square rounded-lg flex flex-col items-center justify-center gap-1 transition-all border
                        ${impVal === scale.value 
                          ? `${scale.color} ring-2 ring-offset-1 ring-indigo-500 shadow-md transform scale-105` 
                          : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:border-slate-300"}
                      `}
                      title={scale.label}
                    >
                      <span className="text-lg font-bold">{scale.value}</span>
                      {impVal === scale.value && <Check size={12} />}
                    </button>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};