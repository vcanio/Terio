import { CheckCircle2, FileText, Network, MessageSquare } from "lucide-react";

const activities = [
  { id: 1, icon: Network, color: "text-blue-500", bg: "bg-blue-100", title: "Mapa de Red actualizado", date: "Hoy, 10:30 AM" },
  { id: 2, icon: FileText, color: "text-purple-500", bg: "bg-purple-100", title: "Reporte VQ generado", date: "Ayer, 16:45 PM" },
  { id: 3, icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-100", title: "Nota de evolución agregada", date: "12 Oct, 09:15 AM" },
  { id: 4, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-100", title: "Objetivo 'Autocuidado' cumplido", date: "10 Oct, 14:00 PM" },
];

export const ActivityFeed = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-full">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">Actividad Reciente</h3>
      <div className="space-y-6 relative">
        {/* Línea vertical conectora */}
        <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-slate-100"></div>

        {activities.map((item) => (
          <div key={item.id} className="relative flex items-start gap-4">
            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm ${item.bg} ${item.color}`}>
              <item.icon size={16} />
            </div>
            <div className="pt-1">
              <p className="text-sm font-bold text-slate-700">{item.title}</p>
              <p className="text-xs text-slate-400 font-medium">{item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};