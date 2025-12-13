import { OSAItem } from "@/features/osa/types";

export const PERFORMANCE_SCALE = [
  { value: 1, label: "Mucho problema", color: "bg-red-100 text-red-700 border-red-200" },
  { value: 2, label: "Algún problema", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: 3, label: "Bien", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: 4, label: "Muy bien", color: "bg-green-100 text-green-700 border-green-200" },
];

export const IMPORTANCE_SCALE = [
  { value: 1, label: "Nada importante", color: "bg-slate-100 text-slate-500" },
  { value: 2, label: "Importante", color: "bg-indigo-50 text-indigo-600" },
  { value: 3, label: "Más importante", color: "bg-indigo-100 text-indigo-700" },
  { value: 4, label: "Lo más importante", color: "bg-indigo-200 text-indigo-800" },
];

// Lista resumida de ítems OSA (puedes agregar los 21 completos)
export const OSA_ITEMS: OSAItem[] = [
  { id: "1", category: "Habilidades Básicas", statement: "Concentrarme en mis tareas" },
  { id: "2", category: "Habilidades Básicas", statement: "Recordar lo que tengo que hacer" },
  { id: "3", category: "Manejo de Vida", statement: "Manejar mis finanzas" },
  { id: "4", category: "Manejo de Vida", statement: "Cuidar el lugar donde vivo" },
  { id: "5", category: "Relaciones", statement: "Llevarme bien con otros" },
  { id: "6", category: "Bienestar", statement: "Relajarme y disfrutar" },
  // ... agrega el resto según el manual
];