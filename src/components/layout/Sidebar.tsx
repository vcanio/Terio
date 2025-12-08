'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Network, Settings, PanelLeftClose } from 'lucide-react';

// Definimos las props que recibirá el componente
interface SidebarProps {
  isOpen?: boolean;
  toggle?: () => void;
}

const menuItems = [
  { name: 'Inicio', href: '/', icon: LayoutDashboard, hidden: true },
  { name: 'Mapa de Red', href: '/tools/sluzki', icon: Network },
];

export function Sidebar({ isOpen = true, toggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside 
      className={`
        fixed left-0 top-0 h-screen w-64 z-40
        bg-slate-900 text-white border-r border-slate-800
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="p-6 border-b border-slate-800 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Terio<span className="text-blue-500">.</span></h1>
          <p className="text-xs text-slate-400 mt-1">Gestión para T.O.</p>
        </div>
        
        {/* Botón para cerrar dentro del Sidebar */}
        <button 
          onClick={toggle}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800"
          title="Ocultar menú"
        >
          <PanelLeftClose size={20} />
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