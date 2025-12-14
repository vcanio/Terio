"use client";

import { useState } from "react";
import { useCOPMStore } from "../store/useCOPMStore";
import { useClinicalUserStore } from "@/features/users/store/useClinicalStore";
import { 
  Plus, 
  Trash2, 
  History, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  X 
} from "lucide-react";
import { COPMScore } from "../types";
import { COPMChart } from "./COPMChart"; 

export const COPMDashboard = () => {
  const { activeUserId } = useClinicalUserStore();
  // Agregamos cancelReevaluation aquí
  const { sessions, addProblem, deleteProblem, setScore, startReevaluation, cancelReevaluation } = useCOPMStore();
  
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("Cuidado Personal");
  const [imp, setImp] = useState<COPMScore>(5);

  const session = activeUserId ? sessions[activeUserId] : null;

  if (!session || !activeUserId) return null;

  const isReevaluating = !!session.dateT2;

  // --- CÁLCULOS ---
  const calculateAvg = (field: 'performanceT1' | 'satisfactionT1' | 'performanceT2' | 'satisfactionT2') => {
    if (session.problems.length === 0) return 0;
    const total = session.problems.reduce((acc, p) => acc + (p[field] || 0), 0);
    return Number((total / session.problems.length).toFixed(1));
  };

  const avgPerfT1 = calculateAvg('performanceT1');
  const avgSatT1 = calculateAvg('satisfactionT1');
  const avgPerfT2 = calculateAvg('performanceT2');
  const avgSatT2 = calculateAvg('satisfactionT2');

  const diffPerf = Number((avgPerfT2 - avgPerfT1).toFixed(1));
  const diffSat = Number((avgSatT2 - avgSatT1).toFixed(1));
  const isSignificant = diffPerf >= 2 || diffSat >= 2;

  const handleAdd = () => {
    if (!desc.trim()) return;
    addProblem(activeUserId, desc, cat, imp);
    setDesc(""); setImp(5);
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* 1. HEADER / GRÁFICOS */}
      {session.problems.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row gap-8 items-center justify-between animate-in fade-in slide-in-from-top-4 relative">
            
            {/* Botón para SALIR del modo re-evaluación */}
            {isReevaluating && (
                <button 
                    onClick={() => cancelReevaluation(activeUserId)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
                    title="Salir de modo Re-evaluación (Volver a editar problemas)"
                >
                    <X size={20} />
                </button>
            )}

            <div className="flex gap-4 md:gap-12 w-full md:w-auto justify-center">
                <COPMChart 
                    t1={avgPerfT1} 
                    t2={isReevaluating ? avgPerfT2 : undefined} 
                    label="Desempeño" 
                    colorT1="#93c5fd" 
                    colorT2="#2563eb" 
                />
                <COPMChart 
                    t1={avgSatT1} 
                    t2={isReevaluating ? avgSatT2 : undefined} 
                    label="Satisfacción" 
                    colorT1="#6ee7b7" 
                    colorT2="#059669" 
                />
            </div>

            <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                {!isReevaluating ? (
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
                           <AlertCircle size={14} /> Etapa 1: Evaluación Inicial
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">Puntuaciones Basales</h3>
                        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                            Registra los problemas identificados. Cuando termines la intervención, usa el botón <strong>"Iniciar Re-evaluación"</strong> abajo.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${isSignificant ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                {isSignificant ? <TrendingUp size={28} /> : <History size={28} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-xl leading-none">
                                    {isSignificant ? "Cambio Significativo" : "Cambio Moderado"}
                                </h3>
                                <div className="text-sm text-slate-500 mt-1 flex gap-3">
                                    <span>Desempeño: <strong className={diffPerf > 0 ? "text-blue-600" : "text-slate-600"}>{diffPerf > 0 ? "+" : ""}{diffPerf}</strong></span>
                                    <span>Satisfacción: <strong className={diffSat > 0 ? "text-emerald-600" : "text-slate-600"}>{diffSat > 0 ? "+" : ""}{diffSat}</strong></span>
                                </div>
                            </div>
                        </div>
                        
                        {isSignificant && (
                            <div className="bg-emerald-50/80 border border-emerald-100 rounded-lg p-3 text-xs text-emerald-800 flex items-start gap-2">
                                <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
                                <span className="font-medium">El cambio de 2 o más puntos indica una mejora clínicamente relevante.</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      )}

      {/* 2. FORMULARIO */}
      {!isReevaluating ? (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Nuevo Problema Ocupacional</label>
               <input 
                 value={desc} 
                 onChange={e => setDesc(e.target.value)} 
                 className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300" 
                 placeholder="Ej: No logro subir las escaleras..." 
               />
            </div>
            <div className="w-full md:w-48">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Categoría</label>
               <select value={cat} onChange={e => setCat(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none cursor-pointer">
                  <option>Cuidado Personal</option>
                  <option>Productividad</option>
                  <option>Ocio</option>
               </select>
            </div>
            <div className="w-full md:w-32">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Importancia</label>
                <select value={imp} onChange={e => setImp(Number(e.target.value) as COPMScore)} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none cursor-pointer font-bold text-slate-700">
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
            </div>
            <button 
              onClick={handleAdd} 
              disabled={!desc} 
              className="w-full md:w-auto p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all shadow-md active:scale-95"
            >
                <Plus size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center justify-center gap-2 text-sm text-amber-800">
            <AlertCircle size={16} />
            <span>Lista de problemas bloqueada durante re-evaluación. <button onClick={() => cancelReevaluation(activeUserId)} className="underline hover:text-amber-900 font-bold">Salir para editar</button></span>
        </div>
      )}

      {/* 3. TABLA */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-2 p-3 bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
            <div className="col-span-4 text-left pl-4">Problema</div>
            <div className="col-span-1">Imp.</div>
            <div className="col-span-3 text-blue-600 bg-blue-50/50 rounded py-1 mx-1">Evaluación T1</div>
            <div className={`col-span-3 rounded py-1 mx-1 ${isReevaluating ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-300'}`}>Evaluación T2</div>
            <div className="col-span-1"></div>
        </div>

        <div className="divide-y divide-slate-100 text-sm">
            {session.problems.map(p => {
                const changeP = (p.performanceT2 || 0) - (p.performanceT1 || 0);
                const changeS = (p.satisfactionT2 || 0) - (p.satisfactionT1 || 0);
                const hasImproved = isReevaluating && (changeP > 0 || changeS > 0);

                return (
                <div key={p.id} className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-slate-50/80 transition-colors group relative">
                    <div className="col-span-4 pl-4 pr-2">
                        <div className="font-medium text-slate-900 leading-snug">{p.description}</div>
                        <span className="inline-block mt-1 text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase tracking-wide">
                            {p.category}
                        </span>
                    </div>

                    <div className="col-span-1 flex justify-center">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm border border-slate-200">
                            {p.importance}
                        </div>
                    </div>

                    <div className="col-span-3 grid grid-cols-2 gap-2 px-2 relative">
                        <ScoreInput val={p.performanceT1} onChange={(v) => setScore(activeUserId, p.id, 'performanceT1', v)} placeholder="D" label="Desempeño" />
                        <ScoreInput val={p.satisfactionT1} onChange={(v) => setScore(activeUserId, p.id, 'satisfactionT1', v)} placeholder="S" label="Satisfacción" />
                        <div className="absolute right-0 top-2 bottom-2 w-px bg-slate-100"></div>
                    </div>

                    <div className="col-span-3 grid grid-cols-2 gap-2 px-2 relative">
                        {isReevaluating ? (
                            <>
                                <ScoreInput val={p.performanceT2} onChange={(v) => setScore(activeUserId, p.id, 'performanceT2', v)} color="text-emerald-700 bg-emerald-50/30 border-emerald-200 focus:border-emerald-500" placeholder="D" label="Desempeño T2" />
                                <ScoreInput val={p.satisfactionT2} onChange={(v) => setScore(activeUserId, p.id, 'satisfactionT2', v)} color="text-emerald-700 bg-emerald-50/30 border-emerald-200 focus:border-emerald-500" placeholder="S" label="Satisfacción T2" />
                                {hasImproved && (
                                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full opacity-0 group-hover:opacity-100 transition-all duration-300 hidden xl:block">
                                        <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1 whitespace-nowrap">
                                            <TrendingUp size={10} /> +{changeP + changeS}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="col-span-2 flex items-center justify-center text-xs text-slate-300 italic select-none">--</div>
                        )}
                    </div>

                    <div className="col-span-1 flex justify-end pr-2">
                        {!isReevaluating && (
                            <button onClick={() => deleteProblem(activeUserId, p.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>
            )})}
            
            {session.problems.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 opacity-60">
                    <div className="bg-slate-100 p-3 rounded-full mb-3"><Plus size={24} /></div>
                    <p className="text-sm italic">No hay problemas definidos.</p>
                </div>
            )}
        </div>

        {session.problems.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-200 p-4 grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5 text-right font-bold text-xs uppercase text-slate-500 pr-6">Promedios</div>
                <div className="col-span-3 flex gap-4 justify-center">
                    <div className="text-center"><span className="block text-[10px] text-slate-400 font-bold mb-0.5">DES</span><span className="text-xl font-black text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-100 shadow-sm">{avgPerfT1}</span></div>
                    <div className="text-center"><span className="block text-[10px] text-slate-400 font-bold mb-0.5">SAT</span><span className="text-xl font-black text-emerald-600 bg-white px-2 py-0.5 rounded border border-emerald-100 shadow-sm">{avgSatT1}</span></div>
                </div>
                {isReevaluating && (
                    <div className="col-span-3 flex gap-4 justify-center border-l border-slate-200 pl-4 relative">
                        <div className="text-center"><span className="block text-[10px] text-slate-400 font-bold mb-0.5">DES</span><span className="text-xl font-black text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-100 shadow-sm">{avgPerfT2}</span></div>
                        <div className="text-center"><span className="block text-[10px] text-slate-400 font-bold mb-0.5">SAT</span><span className="text-xl font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-100 shadow-sm">{avgSatT2}</span></div>
                    </div>
                )}
            </div>
        )}
      </div>

      {!isReevaluating && session.problems.length > 0 && (
        <div className="flex justify-end pt-4">
            <button onClick={() => startReevaluation(activeUserId)} className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-xl font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all hover:-translate-y-0.5 active:translate-y-0">
                <History size={20} /> <span>Finalizar T1 e Iniciar Re-evaluación</span>
            </button>
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE INPUT CORREGIDO ---
interface ScoreInputProps {
  val?: number;
  onChange: (value: COPMScore) => void;
  color?: string;
  placeholder?: string;
  label?: string;
}

const ScoreInput = ({ val, onChange, color = "bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-200", placeholder, label }: ScoreInputProps) => (
    <div className="relative group">
        <select 
            value={val || ""} 
            onChange={e => onChange(Number(e.target.value) as COPMScore)}
            className={`w-full p-2 text-center text-sm font-bold rounded-lg border outline-none focus:ring-4 transition-all appearance-none cursor-pointer ${color}`}
        >
            <option value="" disabled className="text-slate-300 opacity-50">-</option>
            {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        {!val && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 font-medium text-xs">
                {placeholder}
            </div>
        )}
        {label && val && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {label}: {val}
            </div>
        )}
    </div>
);