// src/app/(app)/tools/barthel/page.tsx
"use client";

import { useEffect } from "react";
import { useClinicalUserStore } from "@/features/users/store/useClinicalStore";
import { useBarthelStore } from "@/features/barthel/store/useBarthelStore";
import { BarthelEvaluator } from "@/features/barthel/components/BarthelEvaluator";
import { Activity, AlertCircle } from "lucide-react";

export default function BarthelPage() {
  const { activeUserId } = useClinicalUserStore();
  const { initSession } = useBarthelStore();

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
    <div className="h-full overflow-y-auto bg-slate-50">
      <div className="p-4 md:p-8 max-w-5xl mx-auto pb-32"> {/* pb-32 da espacio extra al final */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Activity size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Índice de Barthel</h1>
          </div>
          <p className="text-slate-500 max-w-2xl">
            Evaluación de la independencia funcional en actividades básicas de la vida diaria (ABVD).
          </p>
        </div>

        <BarthelEvaluator />
      </div>
    </div>
  );
}