"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useClinicalUserStore } from "@/features/users/store/useClinicalStore";
import { useSluzkiStore } from "@/features/sluzki/store/useSluzkiStore";
import { Users, Plus, ChevronRight, User } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

export default function Dashboard() {
  const { users, activeUserId, addUser, setActiveUser } = useClinicalUserStore();
  const { loadUserMap, setCenterName } = useSluzkiStore();
  
  const [isNewUserModal, setIsNewUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");

  // Efecto: Cuando cambia el usuario activo, cargamos su mapa automáticamente
  useEffect(() => {
    if (activeUserId) {
      loadUserMap(activeUserId);
      
      // Opcional: Sincronizar el nombre central del mapa con el nombre del usuario
      const currentUser = users.find(u => u.id === activeUserId);
      if (currentUser) {
        setCenterName(currentUser.name);
      }
    }
  }, [activeUserId, loadUserMap, setCenterName, users]);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newUserName) return;
    addUser({ name: newUserName, diagnosis: "Ingreso" });
    setIsNewUserModal(false);
    setNewUserName("");
  };

  const activeUser = users.find(u => u.id === activeUserId);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 h-full overflow-y-auto custom-scrollbar">
      
      {/* 1. HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mis Usuarios</h1>
          <p className="text-slate-500">Gestión de casos y expedientes clínicos</p>
        </div>
        <button 
          onClick={() => setIsNewUserModal(true)}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 font-medium"
        >
          <Plus size={20} /> Nuevo Usuario
        </button>
      </header>

      {/* 2. CONTEXTO: USUARIO ACTIVO */}
      {activeUser ? (
        <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-sm border border-blue-100 shrink-0">
                    <User size={24} />
                </div>
                <div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-0.5">Sesión Actual</p>
                    <h2 className="text-xl font-bold text-slate-900">{activeUser.name}</h2>
                    <p className="text-sm text-slate-500">{activeUser.diagnosis}</p>
                </div>
            </div>
            <div className="w-full sm:w-auto text-right">
                <span className="text-xs text-slate-400 block mb-1">ID: {activeUser.id.slice(0,8)}...</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                    Expediente Abierto
                </span>
            </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-amber-900 flex gap-4 items-center shadow-sm">
            <div className="text-3xl shrink-0">👈</div>
            <div>
                <strong className="block text-lg">Ningún usuario seleccionado.</strong>
                <p className="opacity-80 text-sm">Selecciona uno de la lista o crea uno nuevo para cargar sus datos en las herramientas.</p>
            </div>
        </div>
      )}

      {/* 3. LISTA DE USUARIOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.length === 0 && (
            <div className="col-span-full py-16 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users size={32} className="text-slate-300" />
                </div>
                <p className="text-slate-600 font-bold text-lg">No hay usuarios registrados.</p>
                <p className="text-slate-400 text-sm max-w-xs mx-auto mt-1">Comienza creando tu primer expediente para usar las herramientas clínicas.</p>
            </div>
        )}
        
        {users.map(user => (
            <div 
                key={user.id}
                onClick={() => setActiveUser(user.id)}
                className={`
                    group cursor-pointer p-5 rounded-2xl border transition-all hover:shadow-lg relative overflow-hidden bg-white
                    ${activeUserId === user.id 
                        ? 'border-blue-500 ring-2 ring-blue-500 shadow-md z-10' 
                        : 'border-slate-200 hover:border-blue-300'
                    }
                `}
            >
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {user.name}
                    </h3>
                    {activeUserId === user.id && (
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
                        </span>
                    )}
                </div>
                <p className="text-sm text-slate-500 mb-4 line-clamp-1 h-5">{user.diagnosis || "Sin motivo de consulta"}</p>
                
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`text-xs font-bold flex items-center gap-1 transition-colors ${activeUserId === user.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`}>
                        {activeUserId === user.id ? 'Seleccionado' : 'Abrir'} <ChevronRight size={14} />
                    </span>
                </div>
            </div>
        ))}
      </div>

      {/* 4. HERRAMIENTAS DISPONIBLES (Solo si hay usuario activo) */}
      {activeUserId && (
          <section className="opacity-100 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              Herramientas Clínicas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/tools/sluzki" className="p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all group flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-blue-100">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 group-hover:text-blue-600 text-lg">Mapa de Red</h3>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">Modelo de Sluzki</p>
                    </div>
                    <div className="ml-auto text-slate-300 group-hover:text-blue-500 transition-colors">
                        <ChevronRight />
                    </div>
                </Link>
                
                <Link href="/tools/vq" className="p-5 bg-white border border-slate-200 rounded-xl hover:border-emerald-400 hover:shadow-lg transition-all group flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-emerald-100">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 text-lg">Cuestionario Volitivo</h3>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">Observación VQ</p>
                    </div>
                    <div className="ml-auto text-slate-300 group-hover:text-emerald-500 transition-colors">
                        <ChevronRight />
                    </div>
                </Link>
            </div>
          </section>
      )}

      {/* MODAL CREAR USUARIO */}
      <Modal isOpen={isNewUserModal} onClose={() => setIsNewUserModal(false)} title="Nuevo Usuario">
        <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre Completo</label>
                <input 
                    autoFocus
                    value={newUserName}
                    onChange={e => setNewUserName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-slate-900 placeholder:text-slate-400 text-base"
                    placeholder="Ej: Juan Pérez"
                />
            </div>
            <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/10 active:scale-95 transition-all">
                Crear Expediente
            </button>
        </form>
      </Modal>

    </div>
  );
}