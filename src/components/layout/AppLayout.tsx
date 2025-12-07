'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { PanelLeftOpen } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen relative overflow-hidden bg-slate-50">
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