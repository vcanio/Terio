// src/features/vq/components/VQDashboard.tsx
"use client";

import { useState } from "react"; 
import { useVQStore } from "../store/useVQStore";
import { Plus, Trash2, Calendar, MapPin, FileText } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { VQReport } from "./VQReport"; 

export const VQDashboard = () => {
  const { sessions, createSession, deleteSession, setActiveSession } = useVQStore();
  
  // Estados para el modal de creación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ activity: '', environment: '' });

  // Nuevo estado para el reporte
  const [reportSessionId, setReportSessionId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.activity) return;
    createSession(formData.activity, formData.environment);
    setFormData({ activity: '', environment: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      {/* ... (código del encabezado y listado de sesiones sin cambios) ... */}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cuestionario Volitivo (VQ)</h1>
          <p className="text-slate-500 text-sm">Registro de observaciones volitivas</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
        >
          <Plus size={20} /> Nueva Observación
        </button>
      </div>

      <div className="grid gap-4">
        {sessions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-400">No hay observaciones registradas aún.</p>
          </div>
        )}
        
        {sessions.map((session) => (
          <div key={session.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between gap-4 group">
            <div className="flex-1 cursor-pointer" onClick={() => setActiveSession(session.id)}>
              <h3 className="font-bold text-lg text-slate-800 mb-1">{session.activity}</h3>
              <div className="flex gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(session.date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {session.environment || 'No especificado'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
              
              {/* BOTÓN REPORTE */}
              <button 
                onClick={() => setReportSessionId(session.id)}
                className="text-slate-500 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                title="Generar Informe PDF"
              >
                <FileText size={18} />
              </button>

              <button 
                onClick={() => setActiveSession(session.id)}
                className="flex-1 sm:flex-none text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Continuar / Ver
              </button>
              
              <button 
                onClick={() => deleteSession(session.id)}
                className="text-slate-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RENDERIZADO CONDICIONAL DEL REPORTE */}
      {reportSessionId && (
        <VQReport 
          sessionId={reportSessionId} 
          onClose={() => setReportSessionId(null)} 
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Sesión VQ">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Actividad / Tarea</label>
            <input 
              autoFocus
              // --- CAMBIO CLAVE AQUÍ ---
              // Cambiamos el color base del texto a 'text-slate-800' y el del placeholder a 'placeholder:text-slate-400'
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-slate-800 placeholder:text-slate-400"
              placeholder="Ej: Preparar desayuno, Juego grupal..."
              value={formData.activity}
              onChange={e => setFormData({...formData, activity: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ambiente / Contexto</label>
            <input 
              // --- CAMBIO CLAVE AQUÍ ---
              // Cambiamos el color base del texto a 'text-slate-800' y el del placeholder a 'placeholder:text-slate-400'
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-slate-800 placeholder:text-slate-400"
              placeholder="Ej: Sala de terapia, Hogar, Escuela..."
              value={formData.environment}
              onChange={e => setFormData({...formData, environment: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            disabled={!formData.activity}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 disabled:opacity-50 mt-2"
          >
            Comenzar Observación
          </button>
        </form>
      </Modal>
    </div>
  );
};