"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useClinicalUserStore } from "@/features/users/store/useClinicalStore";
import { useSluzkiStore } from "@/features/sluzki/store/useSluzkiStore";
import { 
  Plus, Search, Network, ClipboardCheck, 
  FileText, ChevronRight, MoreVertical, Clock, Sparkles, ArrowLeft 
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";

export default function Dashboard() {
  const { users, activeUserId, addUser, setActiveUser } = useClinicalUserStore();
  const { loadUserMap, setCenterName } = useSluzkiStore();
  
  const [isNewUserModal, setIsNewUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [greeting, setGreeting] = useState("Hola");

  // Lógica para el saludo según la hora (Client-side para evitar errores de hidratación)
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Buenos días");
    else if (hour < 20) setGreeting("Buenas tardes");
    else setGreeting("Buenas noches");
  }, []);

  // Usuario Activo (Detalle)
  const activeUser = useMemo(() => 
    users.find(u => u.id === activeUserId), 
  [users, activeUserId]);

  // Filtrado de la lista (Maestro)
  const filteredUsers = useMemo(() => 
    users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.diagnosis && u.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), 
  [users, searchTerm]);

  const handleSelectUser = (userId: string) => {
    setActiveUser(userId);
    loadUserMap(userId);
    const user = users.find(u => u.id === userId);
    if (user) setCenterName(user.name);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newUserName) return;
    addUser({ name: newUserName, diagnosis: "Ingreso" });
    setIsNewUserModal(false);
    setNewUserName("");
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] md:h-full overflow-hidden bg-white md:rounded-2xl shadow-sm border border-slate-200 m-0 md:m-4 relative">
      
      {/* ----------------------------------------------------------------------
          COLUMNA IZQUIERDA (ÁREA DE TRABAJO / BIENVENIDA)
      ----------------------------------------------------------------------- */}
      <main className={`
        flex-1 bg-white flex-col h-full relative overflow-hidden transition-all
        ${activeUser ? 'flex z-20 absolute inset-0 md:static md:z-auto' : 'hidden md:flex'}
      `}>
        {activeUser ? (
          <>
            {/* Header del Paciente */}
            <header className="px-4 md:px-8 py-4 md:py-6 border-b border-slate-100 flex justify-between items-start animate-in fade-in slide-in-from-right-4 md:slide-in-from-top-0 duration-300">
              <div className="flex items-center gap-3 md:gap-5">
                {/* Botón Volver (Solo Móvil) */}
                <button 
                  onClick={() => setActiveUser(null)}
                  className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="w-12 h-12 md:w-16 md:h-16 bg-linear-to-tr from-blue-600 to-indigo-500 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-xl md:text-2xl font-bold shrink-0">
                  {activeUser.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h1 className="text-lg md:text-2xl font-bold text-slate-900 leading-tight">{activeUser.name}</h1>
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider border border-green-200">Activo</span>
                  </div>
                  <p className="text-slate-500 text-xs md:text-sm flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                    <span className="font-medium">{activeUser.diagnosis || "Sin diagnóstico"}</span>
                    <span className="hidden md:inline w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-slate-400 flex items-center gap-1">
                        <Clock size={12} /> {new Date(activeUser.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
              
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                <MoreVertical size={20} />
              </button>
            </header>

            {/* Contenido Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-50/10">
              <h3 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 md:mb-5">Herramientas de Evaluación</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
                {/* Cards de Herramientas... */}
                <ToolCard 
                  href="/tools/sluzki"
                  title="Mapa de Red"
                  subtitle="Modelo Sluzki"
                  description="Visualiza la red social personal, nodos de apoyo y tipos de vínculos."
                  icon={Network}
                  color="text-blue-600"
                  bg="bg-blue-50"
                  hover="group-hover:border-blue-300 group-hover:shadow-blue-500/10"
                />
                <ToolCard 
                  href="/tools/vq"
                  title="Volitivo"
                  subtitle="Observación VQ"
                  description="Evalúa la motivación y el impacto del ambiente en la volición."
                  icon={ClipboardCheck}
                  color="text-emerald-600"
                  bg="bg-emerald-50"
                  hover="group-hover:border-emerald-300 group-hover:shadow-emerald-500/10"
                />
                 <ToolCard 
                  href="/tools/osa"
                  title="Autoevaluación"
                  subtitle="OSA Desempeño"
                  description="Identifica la percepción del usuario sobre su propio funcionamiento."
                  icon={FileText}
                  color="text-indigo-600"
                  bg="bg-indigo-50"
                  hover="group-hover:border-indigo-300 group-hover:shadow-indigo-500/10"
                />
              </div>

              <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-slate-100 opacity-60">
                 <h3 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Notas Rápidas</h3>
                 <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 min-h-[100px] flex items-center justify-center text-slate-400 text-sm italic">
                   Próximamente: Historial de sesiones y notas de evolución.
                 </div>
              </div>
            </div>
          </>
        ) : (
          /* ----------------------------------------------------------------------
             EMPTY STATE AMIGABLE
             Se muestra cuando no hay paciente seleccionado.
          ----------------------------------------------------------------------- */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/30">
             <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/5 border border-slate-100 mb-6 rotate-3">
                <Sparkles size={32} className="text-blue-500 md:w-10 md:h-10 animate-pulse" />
             </div>
             
             {/* Saludo Dinámico */}
             <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 tracking-tight">
               ¡{greeting}, Terapeuta!
             </h2>
             
             <p className="text-sm md:text-base text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">
               ¿Listo para continuar? Selecciona un expediente del panel derecho para comenzar a trabajar.
             </p>
             
             <div className="flex items-center gap-3 text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-widest opacity-60">
                <div className="w-6 md:w-10 h-px bg-slate-300"></div>
                Terio Workspace
                <div className="w-6 md:w-10 h-px bg-slate-300"></div>
             </div>
          </div>
        )}
      </main>

      {/* ----------------------------------------------------------------------
          COLUMNA DERECHA (LISTA DE PACIENTES)
      ----------------------------------------------------------------------- */}
      <aside className={`
        w-full md:w-96 flex flex-col border-l border-slate-200 bg-slate-50/50
        ${activeUser ? 'hidden md:flex' : 'flex'}
      `}>
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-slate-800 text-lg">Mis Usuarios</h2>
            <button 
              onClick={() => setIsNewUserModal(true)}
              className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm active:scale-95"
              title="Nuevo Paciente"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por nombre..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {users.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-400">
              <p className="text-sm">Aún no hay pacientes registrados.</p>
              <button onClick={() => setIsNewUserModal(true)} className="text-blue-600 text-xs font-bold mt-2 hover:underline">Crear el primero</button>
            </div>
          ) : filteredUsers.map(user => (
            <div 
              key={user.id}
              onClick={() => handleSelectUser(user.id)}
              className={`
                group p-3 rounded-xl cursor-pointer transition-all border
                ${activeUserId === user.id 
                  ? 'bg-white border-blue-200 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/20 z-10' 
                  : 'bg-transparent border-transparent hover:bg-slate-200/50 hover:border-slate-200'
                }
              `}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors
                    ${activeUserId === user.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500 group-hover:bg-white'}
                  `}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold truncate ${activeUserId === user.id ? 'text-slate-900' : 'text-slate-700'}`}>
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user.diagnosis || "Sin diagnóstico"}
                    </p>
                  </div>
                </div>
                {activeUserId === user.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-1"></span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-3 border-t border-slate-200 text-xs text-slate-400 text-center bg-slate-50">
          {filteredUsers.length} expediente{filteredUsers.length !== 1 && 's'}
        </div>
      </aside>

      {/* MODAL (Reutilizado) */}
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
            <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all">
                Confirmar Creación
            </button>
        </form>
      </Modal>

    </div>
  );
}

// Componente ToolCard igual al anterior...
function ToolCard({ href, title, subtitle, description, icon: Icon, color, bg, hover }: any) {
  return (
    <Link 
      href={href}
      className={`
        group flex flex-col bg-white border border-slate-200 rounded-2xl p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-lg h-full
        ${hover}
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
          <Icon size={20} className="md:w-6 md:h-6" />
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-colors">
          <ChevronRight size={14} />
        </div>
      </div>
      
      <div className="mb-2">
        <h3 className="font-bold text-slate-900 text-base md:text-lg group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">{subtitle}</p>
      </div>
      
      <p className="text-xs md:text-sm text-slate-500 leading-relaxed mt-auto">
        {description}
      </p>
    </Link>
  );
}