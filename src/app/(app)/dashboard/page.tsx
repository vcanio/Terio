import Link from "next/link";
import { 
  Network, 
  Users, 
  Calendar, 
  FileText, 
  Activity, 
  Clock,
  ArrowRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 h-full overflow-y-auto custom-scrollbar">
      
      {/* 1. HEADER DE BIENVENIDA */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Hola, Terapeuta 👋
          </h1>
          <p className="text-slate-500 mt-1 text-lg">
            Aquí tienes el resumen de tu actividad hoy.
          </p>
        </div>
        <div className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 flex items-center gap-2">
          <Clock size={16} className="text-blue-500" />
          <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </div>
      </header>

      {/* 2. TARJETAS DE ESTADÍSTICAS (MOCKUP) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={Users} 
          label="Pacientes Activos" 
          value="12" 
          trend="+2 este mes" 
          color="blue"
        />
        <StatCard 
          icon={Calendar} 
          label="Citas para Hoy" 
          value="4" 
          trend="Próxima: 14:00" 
          color="emerald"
        />
        <StatCard 
          icon={Activity} 
          label="Evaluaciones" 
          value="8" 
          trend="Pendientes de revisión" 
          color="amber"
        />
      </div>

      {/* 3. ACCESOS RÁPIDOS A HERRAMIENTAS */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
          <Network size={20} className="text-slate-400" /> Herramientas Clínicas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* TARJETA ACTIVA: MAPA DE SLUZKI */}
          <Link href="/tools/sluzki" className="group relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Network size={80} className="text-blue-600" />
            </div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Network size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Mapa de Red (Sluzki)</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                Grafica y analiza las redes sociales personales de tus pacientes según el modelo de Sluzki.
              </p>
              <span className="text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                Abrir herramienta <ArrowRight size={16} />
              </span>
            </div>
          </Link>

          {/* TARJETA PRÓXIMAMENTE: EVALUACIONES */}
          <div className="group relative bg-slate-50 p-6 rounded-2xl border border-slate-200 border-dashed opacity-70">
            <div className="w-12 h-12 bg-slate-200 text-slate-400 rounded-xl flex items-center justify-center mb-4">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">Evaluaciones (Pronto)</h3>
            <p className="text-slate-400 text-sm">
              Generación de informes y baterías de evaluación estandarizadas.
            </p>
          </div>

           {/* TARJETA PRÓXIMAMENTE: PACIENTES */}
           <div className="group relative bg-slate-50 p-6 rounded-2xl border border-slate-200 border-dashed opacity-70">
            <div className="w-12 h-12 bg-slate-200 text-slate-400 rounded-xl flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">Fichas Clínicas (Pronto)</h3>
            <p className="text-slate-400 text-sm">
              Gestión centralizada de historias clínicas y antecedentes.
            </p>
          </div>

        </div>
      </section>

      {/* 4. LISTA DE ACTIVIDAD RECIENTE (MOCKUP) */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Actividad Reciente</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 last:pb-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                  JP
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Juan Pérez - Mapa de Red actualizado</p>
                  <p className="text-xs text-slate-400">Hace 2 horas • Red Familiar</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

// Componente auxiliar para las tarjetas de estadísticas
function StatCard({ icon: Icon, label, value, trend, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{value}</span>
          <span className="text-xs font-medium text-slate-500">{trend}</span>
        </div>
      </div>
    </div>
  );
}