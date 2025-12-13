"use client";

import { useClinicalUserStore } from "@/features/users/store/useClinicalStore";
import { useSluzkiStore } from "@/features/sluzki/store/useSluzkiStore";
import { useVQStore } from "@/features/vq/store/useVQStore";
import { User, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export const SessionBar = () => {
  const { users, activeUserId, setActiveUser } = useClinicalUserStore();
  const { clearBoard } = useSluzkiStore(); // Para limpiar visualmente al cerrar
  const { setActiveSession } = useVQStore();
  const router = useRouter();
  const pathname = usePathname();

  const activeUser = users.find(u => u.id === activeUserId);

  // No mostrar la barra en el Dashboard (ya tiene su propia info) 
  // Opcional: puedes dejarla si prefieres consistencia total
  if (!activeUser || pathname === "/dashboard") return null;

  const handleCloseSession = () => {
    // 1. Limpiar estado global
    setActiveUser(null);
    clearBoard(); // Limpia el lienzo visual de Sluzki
    setActiveSession(null); // Deselecciona sesión VQ
    
    // 2. Redirigir al dashboard
    router.push("/dashboard");
  };

  return (
    <div className="bg-slate-900 text-white px-4 py-3 shadow-md sticky top-0 z-50 flex justify-between items-center animate-in slide-in-from-top-2">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-1.5 rounded-full">
          <User size={16} className="text-white" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider leading-none">Expediente Abierto</p>
          <p className="text-sm font-bold leading-tight">{activeUser.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-slate-400 hidden sm:inline-block">
            {activeUser.diagnosis || "Sin diagnóstico"}
        </span>
        <button 
          onClick={handleCloseSession}
          className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-red-600/80 hover:text-white px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
        >
          <X size={14} /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
};