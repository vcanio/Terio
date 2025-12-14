import { TrendingUp, Target, CalendarDays, Activity } from "lucide-react";

export const PatientStats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
      
      {/* Stat 1 */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-400 mb-2">
          <Target size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Objetivos</span>
        </div>
        <div>
          <span className="text-2xl font-black text-slate-800">8/12</span>
          <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-blue-500 w-[70%] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Stat 2 */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-400 mb-2">
          <Activity size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Volición</span>
        </div>
        <div>
          <span className="text-2xl font-black text-emerald-600">+24%</span>
          <p className="text-[10px] text-slate-400 mt-1">vs. mes anterior</p>
        </div>
      </div>

      {/* Stat 3 */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-400 mb-2">
          <CalendarDays size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Sesiones</span>
        </div>
        <div>
          <span className="text-2xl font-black text-slate-800">4</span>
          <p className="text-[10px] text-slate-400 mt-1">Este mes</p>
        </div>
      </div>

      {/* Stat 4 */}
      <div className="bg-linear-to-br from-slate-900 to-slate-800 p-4 rounded-2xl border border-slate-700 shadow-sm text-white flex flex-col justify-between relative overflow-hidden group cursor-pointer">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-slate-300 mb-2">
            <TrendingUp size={16} className="text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Próxima</span>
          </div>
          <span className="text-lg font-bold">Mañana, 15:00</span>
          <p className="text-[10px] text-slate-400 mt-1">Evaluación OPHI-II</p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform">
            <CalendarDays size={64} />
        </div>
      </div>

    </div>
  );
};