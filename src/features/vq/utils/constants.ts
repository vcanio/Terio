// src/features/vq/utils/constants.ts

export type VQScore = 1 | 2 | 3 | 4;

export const SCORES = {
  1: { label: "Pasivo", code: "P", color: "bg-red-100 text-red-700 border-red-200" },
  2: { label: "Dudoso", code: "D", color: "bg-orange-100 text-orange-700 border-orange-200" },
  3: { label: "Involucrado", code: "I", color: "bg-blue-100 text-blue-700 border-blue-200" },
  4: { label: "Espontáneo", code: "E", color: "bg-emerald-100 text-emerald-700 border-emerald-200" }, 
};

// Estructura agrupada según la imagen
export const VQ_GROUPS = [
  {
    name: "Exploración",
    items: [
      { id: 1, text: "Muestra curiosidad" },
      { id: 2, text: "Inicia acciones / tareas" },
      { id: 3, text: "Intenta cosas nuevas" },
      { id: 4, text: "Muestra preferencias" },
      { id: 5, text: "Muestra que una actividad es especial o significativa" },
    ]
  },
  {
    name: "Competencia",
    items: [
      { id: 6, text: "Indica objetivos" },
      { id: 7, text: "Permanece involucrado" },
      { id: 8, text: "Muestra orgullo" },
      { id: 9, text: "Trata de resolver problemas" },
      { id: 10, text: "Trata de corregir errores" },
    ]
  },
  {
    name: "Logro",
    items: [
      { id: 11, text: "Realiza una actividad hasta completarla/lograrla" },
      { id: 12, text: "Invierte energía/emoción/atención adicional" },
      { id: 13, text: "Busca responsabilidad adicional" },
      { id: 14, text: "Busca desafíos" },
    ]
  }
];

// Helper para obtener todos los items planos si se necesita calcular progreso total
export const ALL_VQ_ITEMS_COUNT = VQ_GROUPS.reduce((acc, group) => acc + group.items.length, 0);