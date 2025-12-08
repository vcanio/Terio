'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { PanelLeftOpen } from 'lucide-react';
import { Toaster } from 'react-hot-toast'; // Importar Toaster

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen relative overflow-hidden bg-slate-50">
      {/* Configuración global de las notificaciones */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'exclude-from-export', // ¡Importante! Para que no salgan en la foto
          style: {
            background: '#334155',
            color: '#fff',
            borderRadius: '10px',
          },
        }} 
      />

      <Sidebar 
        isOpen={isSidebarOpen} 
        toggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2.5 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-95"
          title="Mostrar menú"
        >
          <PanelLeftOpen size={20} />
        </button>
      )}

      <main 
        className={`
          flex-1 h-full relative transition-all duration-300 ease-in-out flex flex-col overflow-hidden
          ${isSidebarOpen ? 'ml-64' : 'ml-0'}
        `}
      >
        {children}
      </main>
    </div>
  );
}