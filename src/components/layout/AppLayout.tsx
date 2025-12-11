'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, PanelLeftOpen } from 'lucide-react'; 
import { Toaster } from 'react-hot-toast';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Estado único para la visibilidad del menú
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Efecto para cerrar el menú automáticamente al entrar en vista móvil
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    // Ejecutar al inicio para ajustar según el dispositivo actual
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen w-screen relative overflow-hidden bg-slate-50 flex-col md:flex-row">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'exclude-from-export',
          style: { background: '#334155', color: '#fff', borderRadius: '10px' },
        }} 
      />

      {/* 1. HEADER MÓVIL (Solo visible en < md) */}
      <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 text-white shrink-0 z-30 shadow-md">
        <div className="font-bold text-lg tracking-tight">Terio<span className="text-blue-500">.</span></div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors active:scale-95"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* 2. OVERLAY OSCURO (Solo en móvil cuando el menú está abierto) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 3. SIDEBAR (Componente compartido) */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      {/* 4. BOTÓN FLOTANTE DE ESCRITORIO (Solo visible si está cerrado y es > md) */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="hidden md:flex fixed top-4 left-4 z-30 p-2.5 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-95"
          title="Mostrar menú"
        >
          <PanelLeftOpen size={20} />
        </button>
      )}

      {/* 5. CONTENIDO PRINCIPAL */}
      <main 
        className={`
          flex-1 h-full relative overflow-hidden flex flex-col transition-all duration-300 ease-in-out
          /* ESCRITORIO: Margen izquierdo dinámico */
          ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}
          /* MÓVIL: Siempre ancho completo (el sidebar es overlay) */
          w-full
        `}
      >
        {children}
      </main>
    </div>
  );
}