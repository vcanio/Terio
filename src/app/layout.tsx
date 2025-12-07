import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppLayout from '@/components/layout/AppLayout'; // Importamos el nuevo layout

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
        {/* Reemplazamos la estructura manual por AppLayout que maneja el estado */}
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}