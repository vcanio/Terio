export type OSAScaleValue = 1 | 2 | 3 | 4;

export interface OSAItem {
  id: string;
  category: string;
  statement: string; // La afirmación (ej: "Concentrarme en mis tareas")
}

export interface OSAResponse {
  itemId: string;
  performance: OSAScaleValue | null; // Desempeño
  importance: OSAScaleValue | null;  // Importancia
}

export interface OSASession {
  id: string;
  userId: string;
  date: string;
  responses: Record<string, OSAResponse>; // Mapa de respuestas por ID de ítem
  notes?: string;
}