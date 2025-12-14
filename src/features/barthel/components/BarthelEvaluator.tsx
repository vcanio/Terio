// src/features/barthel/components/BarthelEvaluator.tsx
"use client";

import { useBarthelStore } from "../store/useBarthelStore";
import { useClinicalUserStore } from "@/features/users/store/useClinicalStore";
import { BARTHEL_ITEMS, getScoreColor } from "../utils/constants";
import { Check } from "lucide-react";

export const BarthelEvaluator = () => {
  const { activeUserId } = useClinicalUserStore();
  const { sessions, setScore } = useBarthelStore();

  const session = activeUserId ? sessions[activeUserId] : null;

  if (!session || !activeUserId) return null;

  const scoreColorClass = getScoreColor(session.totalScore);

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      {/* Marcador Flotante - La "Calculadora" visible */}
      <div className="sticky top-4 z-20 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 p-4 mb-8 flex justify-between items-center animate-in slide-in-from-top-4">
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Puntuación Total</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{session.totalScore}</span>
            <span className="text-slate-400 font-medium">/ 100</span>
          </div>
        </div>
        
        <div className={`px-6 py-2 rounded-xl border-2 font-bold text-sm md:text-base transition-colors duration-300 ${scoreColorClass}`}>
          {session.interpretation}
        </div>
      </div>

      {/* Lista de Ítems */}
      <div className="space-y-6">
        {BARTHEL_ITEMS.map((item) => {
          const currentVal = session.scores[item.id];

          return (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">{item.label}</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {item.options.map((option) => {
                  const isSelected = currentVal === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setScore(activeUserId, item.id, option.value)}
                      className={`
                        relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
                        ${isSelected 
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md transform scale-[1.02]' 
                          : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white'}
                      `}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 text-blue-500">
                          <Check size={16} strokeWidth={3} />
                        </div>
                      )}
                      <span className="text-2xl font-black mb-1">{option.value}</span>
                      <span className="text-xs font-medium text-center leading-tight">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};