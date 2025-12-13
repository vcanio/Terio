// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Terio | Gestión T.O.',
  description: 'Plataforma para Terapeutas Ocupacionales',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {/* Aquí YA NO ponemos AppLayout, solo children */}
        {children}
      </body>
    </html>
  );
}