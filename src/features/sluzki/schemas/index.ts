import { z } from 'zod';

// Esquema para el Nivel (1, 2, 3)
export const NetworkLevelSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);

// Esquema para el Tipo de Nodo
export const NodeTypeSchema = z.enum(["family", "friend", "work", "community"]);

// Esquema de un Nodo
export const NodeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "El nombre es obligatorio"),
  type: NodeTypeSchema,
  level: NetworkLevelSchema,
  x: z.number(),
  y: z.number(),
});

// Esquema de una Conexión (Edge)
export const EdgeSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
});

// Esquema del Estado Completo (para validar lo que viene del localStorage)
export const SluzkiStateSchema = z.object({
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
  centerName: z.string(),
});