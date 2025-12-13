'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Agregamos useRouter
import { LayoutDashboard, Network, Settings, PanelLeftClose, X, ClipboardCheck, User, Power } from 'lucide-react';
import { useClinicalUserStore } from "@/features/users/store/useClinicalStore"; // Importar Stores
import { useSluzkiStore } from "@/features/sluzki/store/useSluzkiStore";
import { useVQStore } from "@/features/vq/store/useVQStore";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const menuItems = [
  { name: 'Inicio', href: '/dashboard', icon: LayoutDashboard, hidden: false },
  { name: 'Mapa de Red', href: '/tools/sluzki', icon: Network },
  { name: 'OPHI-II', href: '/tools/ophi', icon: Network, hidden: true },
  { name: 'Cuestionario Volitivo', href: '/tools/vq', icon: ClipboardCheck, hidden: false },
];

export function Sidebar({ isOpen, toggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // 1. Obtener estado del paciente activo
  const { users, activeUserId, setActiveUser } = useClinicalUserStore();
  const { clearBoard } = useSluzkiStore();
  const { setActiveSession } = useVQStore();

  const activeUser = users.find(u => u.id === activeUserId);

  // 2. Función para cerrar sesión (Misma lógica que tenía la SessionBar)
  const handleCloseSession = () => {
    setActiveUser(null);
    clearBoard();
    setActiveSession(null);
    router.push('/dashboard');
  };

  return (
    <aside 
      className={`
        fixed top-0 left-0 h-screen w-64
        bg-slate-900 text-white border-r border-slate-800
        flex flex-col transition-transform duration-300 ease-in-out
        z-50 shadow-2xl md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* HEADER LOGO */}
      <div className="p-6 pb-4 border-b border-slate-800 flex justify-between items-start h-[88px] md:h-auto shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Terio<span className="text-blue-500">.</span></h1>
          <p className="text-xs text-slate-400 mt-1">Gestión para T.O.</p>
        </div>
        <button 
          onClick={toggle}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800"
        >
          <X className="md:hidden" size={24} />
          <PanelLeftClose className="hidden md:block" size={20} />
        </button>
      </div>

      {/* --- NUEVO: TARJETA DE PACIENTE ACTIVO --- */}
      {activeUser && (
        <div className="px-4 pt-4 pb-2 shrink-0 animate-in fade-in slide-in-from-left-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 relative group">
            
            {/* Etiqueta */}
            <div className="text-[10px] uppercase font-bold text-blue-400 mb-1 flex items-center gap-1">
              <User size={10} /> Usuario Activo
            </div>
            
            {/* Nombre y Diagnóstico */}
            <div className="pr-6">
              <div className="font-bold text-sm text-white truncate" title={activeUser.name}>
                {activeUser.name}
              </div>
            </div>

            {/* Botón Flotante de Cerrar */}
            <button 
              onClick={handleCloseSession}
              title="Cerrar expediente"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all"
            >
              <Power size={16} />
            </button>
          </div>
        </div>
      )}

      {/* NAVEGACIÓN */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems
          .filter(item => !item.hidden)
          .map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => window.innerWidth < 768 && toggle()} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-800 shrink-0">
        <button className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-2 w-full transition-colors rounded-lg hover:bg-slate-800">
          <Settings size={20} />
          <span className="text-sm">Configuración</span>
        </button>
      </div>
    </aside>
  );
}