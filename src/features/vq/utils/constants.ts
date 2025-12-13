// src/features/vq/utils/constants.ts

export type VQScore = 1 | 2 | 3 | 4;

export const SCORES = {
  1: { label: "Pasivo", code: "P", color: "bg-red-100 text-red-700 border-red-200" },
  2: { label: "Dudoso", code: "D", color: "bg-orange-100 text-orange-700 border-orange-200" },
  3: { label: "Involucrado", code: "I", color: "bg-blue-100 text-blue-700 border-blue-200" },
  4: { label: "Espontáneo", code: "E", color: "bg-emerald-100 text-emerald-700 border-emerald-200" }, 
};

// Definiciones clínicas para ayuda contextual
export const ITEM_DEFINITIONS: Record<number, string> = {
  1: "Explora objetos, tareas o el entorno. Mira a su alrededor, toca objetos o hace preguntas sobre el ambiente.",
  2: "Comienza una acción o tarea sin necesidad de ser instado repetidamente. Muestra iniciativa física o verbal.",
  3: "Se involucra en tareas, objetos o situaciones desconocidas. Acepta cambios en la rutina o nuevos métodos.",
  4: "Elige o indica lo que le gusta o disgusta. Selecciona materiales, herramientas o métodos específicos.",
  5: "Indica que una actividad tiene valor personal. Sonríe, verbaliza disfrute o conecta la actividad con su vida.",
  6: "Expresa verbalmente o mediante acciones lo que pretende lograr. Define una meta clara.",
  7: "Mantiene la atención y el esfuerzo en la tarea a lo largo del tiempo sin distraerse fácilmente.",
  8: "Muestra satisfacción con su propio desempeño o producto. Sonríe, lo muestra a otros o hace comentarios positivos.",
  9: "Identifica un obstáculo y genera o intenta una solución para superarlo.",
  10: "Reconoce un error y realiza acciones para enmendarlo o mejorarlo.",
  11: "Lleva la tarea hasta su fin lógico o hasta el criterio establecido, persistiendo hasta terminar.",
  12: "Demuestra un nivel alto de concentración, entusiasmo o esfuerzo físico/mental más allá de lo básico.",
  13: "Pide hacer más, ayudar a otros o encargarse de aspectos adicionales de la tarea o el entorno.",
  14: "Elige tareas o metas que requieren mayor habilidad o esfuerzo, buscando superar su nivel actual.",
};

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

export const ALL_VQ_ITEMS_COUNT = VQ_GROUPS.reduce((acc, group) => acc + group.items.length, 0);