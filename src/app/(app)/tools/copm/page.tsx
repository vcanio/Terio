// src/app/(app)/tools/copm/page.tsx
"use client";

import { useEffect } from "react";
import { useClinicalUserStore } from "@/features/users/store/useClinicalStore";
import { useCOPMStore } from "@/features/copm/store/useCOPMStore";
import { COPMDashboard } from "@/features/copm/components/COPMDashboard";
import { Target, AlertCircle } from "lucide-react";

export default function COPMPage() {
  const { activeUserId } = useClinicalUserStore();
  const { initSession } = useCOPMStore();

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
    // Importante: Contenedor con scroll propio
    <div className="h-full overflow-y-auto bg-slate-50">
      <div className="p-4 md:p-8 max-w-6xl mx-auto pb-32">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Target size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Medida Canadiense (COPM)</h1>
          </div>
          <p className="text-slate-500 max-w-2xl text-sm md:text-base">
            Herramienta centrada en el cliente para detectar cambios en el desempeño ocupacional a lo largo del tiempo.
          </p>
        </div>

        <COPMDashboard />
      </div>
    </div>
  );
}