"use client";

import { useEffect } from "react";
import { useClinicalUserStore } from "@/features/users/store/useClinicalStore";
import { useOSAStore } from "@/features/osa/store/useOSAStore";
import { OSAEvaluator } from "@/features/osa/components/OSAEvaluator";
import { FileText, AlertCircle } from "lucide-react";

export default function OSAPage() {
  const { activeUserId } = useClinicalUserStore();
  const { initSession } = useOSAStore();

  // Cada vez que cambia el usuario activo, inicializamos (o cargamos) su sesión
  useEffect(() => {
    if (activeUserId) {
      initSession(activeUserId);
    }
  }, [activeUserId, initSession]);

  if (!activeUserId) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400">
        <AlertCircle size={48} className="mb-4 text-slate-300" />
        <p>Selecciona un paciente en el Dashboard para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <FileText size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Autoevaluación Ocupacional (OSA)</h1>
        </div>
        <p className="text-slate-500 max-w-2xl">
          Evalúa el desempeño y la importancia de diversas actividades cotidianas para identificar brechas y prioridades de intervención.
        </p>
      </div>

      <OSAEvaluator />
    </div>
  );
}