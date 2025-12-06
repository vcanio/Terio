import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Terio | Gestión T.O.',
  description: 'Plataforma para Terapeutas Ocupacionales',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 text-slate-900 overflow-hidden`}>
        <div className="flex h-screen w-screen">
          
          {/* 1. La Barra Lateral (Fija) */}
          <Sidebar />
          
          {/* 2. El Contenido Principal */}
          {/* AGREGADO: 'ml-64' es vital. Empuja el contenido 256px a la derecha para respetar el menú */}
          <main className="flex-1 ml-64 h-full relative bg-white">
            {children}
          </main>
          
        </div>
      </body>
    </html>
  );
}