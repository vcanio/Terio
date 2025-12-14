import { useClinicalUserStore } from "@/features/users/store/useClinicalStore";
import { ArrowLeft, MoreVertical, Clock, Network, ClipboardCheck, FileText, Brain, Activity } from "lucide-react";
import { ToolCard } from "./ToolCard";
import { PatientStats } from "./PatientStats";
import { ActivityFeed } from "./ActivityFeed";

interface ActivePatientViewProps {
  setActiveUser: (id: string | null) => void;
}

export const ActivePatientView = ({ setActiveUser }: ActivePatientViewProps) => {
  const { users, activeUserId } = useClinicalUserStore();
  const activeUser = users.find((u) => u.id === activeUserId);

  if (!activeUser) return null;

  return (
    <>
      {/* Header del Paciente */}
      <header className="px-6 py-6 border-b border-slate-100 flex justify-between items-start bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveUser(null)}
            className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="w-14 h-14 bg-linear-to-tr from-blue-600 to-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-2xl font-bold shrink-0">
            {activeUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">{activeUser.name}</h1>
              <span className="hidden md:inline px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider border border-green-200">Activo</span>
            </div>
            <p className="text-slate-500 text-sm flex items-center gap-2">
              <span className="font-medium">{activeUser.diagnosis || "Sin diagnóstico"}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock size={12} /> Ingreso: {new Date(activeUser.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>
        
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <MoreVertical size={20} />
        </button>
      </header>

      {/* Contenido Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-slate-50/30">
        
        {/* Estadísticas Visuales (NUEVO) */}
        <PatientStats />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Columna Izquierda: Herramientas */}
            <div className="xl:col-span-2 space-y-8">
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Evaluaciones Disponibles</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ToolCard 
                        href="/tools/sluzki"
                        title="Mapa de Red"
                        subtitle="Modelo Sluzki"
                        description="Visualiza la red social personal, nodos de apoyo y vínculos."
                        icon={Network}
                        color="text-blue-600"
                        bg="bg-blue-50"
                        hover="group-hover:border-blue-300 group-hover:shadow-blue-500/10"
                        />
                        <ToolCard 
                        href="/tools/vq"
                        title="Volitivo"
                        subtitle="Cuestionario VQ"
                        description="Evalúa la motivación e impacto ambiental en la volición."
                        icon={ClipboardCheck}
                        color="text-emerald-600"
                        bg="bg-emerald-50"
                        hover="group-hover:border-emerald-300 group-hover:shadow-emerald-500/10"
                        />
                        <ToolCard 
                        href="/tools/osa"
                        title="Autoevaluación"
                        subtitle="Escala OSA"
                        description="Percepción del usuario sobre su propio desempeño."
                        icon={FileText}
                        color="text-indigo-600"
                        bg="bg-indigo-50"
                        hover="group-hover:border-indigo-300 group-hover:shadow-indigo-500/10"
                        />
                        {/* Herramienta Fake para rellenar */}
                        <ToolCard 
                        href="#"
                        title="Evaluación Cognitiva"
                        subtitle="Minimental / Moca"
                        description="Screening rápido de funciones cognitivas."
                        icon={Brain}
                        color="text-slate-400"
                        bg="bg-slate-100"
                        hover=""
                        disabled={true}
                        />
                    </div>
                </div>
            </div>

            {/* Columna Derecha: Activity Feed (NUEVO) */}
            <div className="xl:col-span-1">
                <ActivityFeed />
            </div>

        </div>
      </div>
    </>
  );
};