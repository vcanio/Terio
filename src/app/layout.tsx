import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Terio | Plataforma TO',
  description: 'Herramientas digitales para Terapia Ocupacional',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}