'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Network, Settings, PanelLeftClose, X, ClipboardCheck } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const menuItems = [
  { name: 'Inicio', href: '/', icon: LayoutDashboard, hidden: false },
  { name: 'Mapa de Red', href: '/tools/sluzki', icon: Network },
  { name: 'OPHI-II', href: '/tools/ophi', icon: Network, hidden: true },
  { name: 'Cuestionario Volitivo', href: '/tools/vq', icon: ClipboardCheck, hidden: false },
];

export function Sidebar({ isOpen, toggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside 
      className={`
        fixed top-0 left-0 h-screen w-64
        bg-slate-900 text-white border-r border-slate-800
        flex flex-col transition-transform duration-300 ease-in-out
        z-50 shadow-2xl md:shadow-none
        
        /* Control total de visibilidad vía isOpen */
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="p-6 border-b border-slate-800 flex justify-between items-start h-[88px] md:h-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Terio<span className="text-blue-500">.</span></h1>
          <p className="text-xs text-slate-400 mt-1">Gestión para T.O.</p>
        </div>
        
        {/* Botón de cerrar (Funciona en móvil y escritorio) */}
        <button 
          onClick={toggle}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800"
          title="Ocultar menú"
        >
          {/* Usamos X en móvil (más común) y PanelLeftClose en escritorio */}
          <X className="md:hidden" size={24} />
          <PanelLeftClose className="hidden md:block" size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems
          .filter(item => !item.hidden)
          .map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                // En móvil, cerramos el menú al hacer click. En escritorio, lo mantenemos.
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

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-2 w-full transition-colors rounded-lg hover:bg-slate-800">
          <Settings size={20} />
          <span className="text-sm">Configuración</span>
        </button>
      </div>
    </aside>
  );
}