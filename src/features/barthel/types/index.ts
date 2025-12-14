// src/features/barthel/types/index.ts

export type BarthelValue = 0 | 5 | 10 | 15;

export interface BarthelOption {
  value: BarthelValue;
  label: string;
  description?: string; // Para mostrar detalles al pasar el mouse si quieres
}

export interface BarthelItem {
  id: string;
  label: string;
  options: BarthelOption[];
}

export interface BarthelSession {
  id: string;
  userId: string;
  date: string;
  scores: Record<string, BarthelValue>; // Mapa: { 'comer': 10, 'lavarse': 5 }
  totalScore: number;
  interpretation: string; // "Dependencia Severa", etc.
}