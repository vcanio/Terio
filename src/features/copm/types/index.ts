// src/features/copm/types/index.ts

// Puntuación del 1 al 10
export type COPMScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface COPMProblem {
  id: string;
  category: string; // "Cuidado Personal", "Productividad", "Ocio"
  description: string;
  importance: COPMScore;
  
  // Evaluación Inicial (T1)
  performanceT1?: COPMScore; // Desempeño
  satisfactionT1?: COPMScore; // Satisfacción

  // Re-evaluación (T2)
  performanceT2?: COPMScore;
  satisfactionT2?: COPMScore;
}

export interface COPMSession {
  id: string;
  userId: string;
  dateT1: string; // Fecha de creación
  dateT2?: string; // Fecha de re-evaluación (opcional al inicio)
  problems: COPMProblem[];
}