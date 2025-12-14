// src/features/barthel/utils/constants.ts
import { BarthelItem } from "../types";

export const BARTHEL_ITEMS: BarthelItem[] = [
  {
    id: "comer",
    label: "Comer",
    options: [
      { value: 0, label: "Incapaz / Dependiente" },
      { value: 5, label: "Necesita ayuda (cortar, untar...)" },
      { value: 10, label: "Independiente" },
    ],
  },
  {
    id: "lavarse",
    label: "Lavarse (baño/ducha)",
    options: [
      { value: 0, label: "Dependiente" },
      { value: 5, label: "Independiente (entra/sale solo)" },
    ],
  },
  {
    id: "vestirse",
    label: "Vestirse",
    options: [
      { value: 0, label: "Dependiente" },
      { value: 5, label: "Necesita ayuda (aprox 50%)" },
      { value: 10, label: "Independiente (incluye botones/cierres)" },
    ],
  },
  {
    id: "arreglarse",
    label: "Arreglarse (aseo personal)",
    options: [
      { value: 0, label: "Dependiente" },
      { value: 5, label: "Independiente (cara, pelo, dientes...)" },
    ],
  },
  {
    id: "deposicion",
    label: "Deposición (intestino)",
    options: [
      { value: 0, label: "Incontinente" },
      { value: 5, label: "Accidente ocasional / Ayuda supositorio" },
      { value: 10, label: "Continente" },
    ],
  },
  {
    id: "miccion",
    label: "Micción (vejiga)",
    options: [
      { value: 0, label: "Incontinente / Sonda no cuidada" },
      { value: 5, label: "Accidente ocasional / Sonda cuidada" },
      { value: 10, label: "Continente" },
    ],
  },
  {
    id: "retrete",
    label: "Uso del Retrete",
    options: [
      { value: 0, label: "Dependiente" },
      { value: 5, label: "Necesita ayuda (ropa/limpieza)" },
      { value: 10, label: "Independiente (entra/sale/limpia)" },
    ],
  },
  {
    id: "traslado",
    label: "Traslado (cama - sillón)",
    options: [
      { value: 0, label: "Imposible / Incapaz" },
      { value: 5, label: "Gran ayuda (física, 1-2 pers)" },
      { value: 10, label: "Ayuda menor (verbal/física leve)" },
      { value: 15, label: "Independiente" },
    ],
  },
  {
    id: "deambulacion",
    label: "Deambulación",
    options: [
      { value: 0, label: "Inmóvil" },
      { value: 5, label: "Independiente en silla de ruedas" },
      { value: 10, label: "Camina con ayuda (física/verbal)" },
      { value: 15, label: "Independiente (>50m)" },
    ],
  },
  {
    id: "escaleras",
    label: "Escaleras",
    options: [
      { value: 0, label: "Incapaz" },
      { value: 5, label: "Necesita ayuda (física/verbal)" },
      { value: 10, label: "Independiente" },
    ],
  },
];

export const getBarthelInterpretation = (score: number) => {
  if (score < 20) return "Dependencia Total";
  if (score < 60) return "Dependencia Severa";
  if (score < 90) return "Dependencia Moderada";
  if (score < 100) return "Dependencia Leve";
  return "Independencia";
};

// Función auxiliar para color del resultado
export const getScoreColor = (score: number) => {
  if (score < 20) return "text-red-600 bg-red-50 border-red-200";
  if (score < 60) return "text-orange-600 bg-orange-50 border-orange-200";
  if (score < 90) return "text-yellow-600 bg-yellow-50 border-yellow-200";
  return "text-emerald-600 bg-emerald-50 border-emerald-200";
};