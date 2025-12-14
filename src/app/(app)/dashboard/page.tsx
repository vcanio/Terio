"use client";

import { useState, useEffect } from "react";
import { useClinicalUserStore } from "@/features/users/store/useClinicalStore";
import { Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

// Nuevos componentes modulares
import { UserListSidebar } from "@/features/dashboard/components/UserListSidebar";
import { ActivePatientView } from "@/features/dashboard/components/ActivePatientView";

export default function Dashboard() {
  const { activeUserId, addUser, setActiveUser } = useClinicalUserStore();
  
  const [isNewUserModal, setIsNewUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [greeting, setGreeting] = useState("Hola");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Buenos días");
    else if (hour < 20) setGreeting("Buenas tardes");
    else setGreeting("Buenas noches");
  }, []);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newUserName) return;
    addUser({ name: newUserName, diagnosis: "Ingreso" });
    setIsNewUserModal(false);
    setNewUserName("");
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] md:h-full overflow-hidden bg-white md:rounded-2xl shadow-sm border border-slate-200 m-0 md:m-4 relative">
      
      {/* ÁREA PRINCIPAL (Panel Izquierdo) */}
      <main className={`
        flex-1 bg-white flex-col h-full relative overflow-hidden transition-all
        ${activeUserId ? 'flex z-20 absolute inset-0 md:static md:z-auto' : 'hidden md:flex'}
      `}>
        {activeUserId ? (
          <ActivePatientView setActiveUser={setActiveUser} />
        ) : (
          /* Empty State (Bienvenida) */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/30">
             <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/5 border border-slate-100 mb-6 rotate-3 hover:rotate-6 transition-transform duration-500">
                <Sparkles size={32} className="text-blue-500 md:w-10 md:h-10 animate-pulse" />
             </div>
             
             <h2 className="text-2xl md:text-4xl font-black text-slate-800 mb-4 tracking-tight">
               ¡{greeting}, Terapeuta!
             </h2>
             
             <p className="text-sm md:text-base text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">
               Tu espacio de trabajo está listo. Selecciona un paciente a la derecha o crea uno nuevo para comenzar a documentar.
             </p>
             
             <div className="flex items-center gap-3 text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest opacity-60">
                <div className="w-6 md:w-12 h-px bg-slate-300"></div>
                Terio Workspace v1.0
                <div className="w-6 md:w-12 h-px bg-slate-300"></div>
             </div>
          </div>
        )}
      </main>

      {/* BARRA LATERAL (Lista de Usuarios) */}
      <UserListSidebar onOpenNewUserModal={() => setIsNewUserModal(true)} />

      {/* MODAL DE CREACIÓN */}
      <Modal isOpen={isNewUserModal} onClose={() => setIsNewUserModal(false)} title="Crear Expediente">
        <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre Completo</label>
                <input 
                    autoFocus
                    value={newUserName}
                    onChange={e => setNewUserName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-slate-900 placeholder:text-slate-400 text-base"
                    placeholder="Ej: Ana María Pérez"
                />
            </div>
            <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                Confirmar Creación
            </button>
        </form>
      </Modal>

    </div>
  );
}