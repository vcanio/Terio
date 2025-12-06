'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Network, Settings } from 'lucide-react';

const menuItems = [
  { name: 'Inicio', href: '/', icon: LayoutDashboard },
  { name: 'Mapa de Red (Sluzki)', href: '/tools/sluzki', icon: Network },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight">Terio<span className="text-blue-500">.</span></h1>
        <p className="text-xs text-slate-400 mt-1">Gestión para T.O.</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
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
        <button className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-2 w-full">
          <Settings size={20} />
          <span className="text-sm">Configuración</span>
        </button>
      </div>
    </aside>
  );
}