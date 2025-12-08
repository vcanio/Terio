import { LucideIcon } from "lucide-react";

export type NodeType = "family" | "friend" | "work" | "community";
export type NetworkLevel = 1 | 2 | 3; // 1: Íntimo, 2: Social, 3: Ocasional

export interface NodeData {
  id: string;
  name: string;
  type: NodeType;
  level: NetworkLevel; // Nuevo campo para el nivel
  x: number;
  y: number;
}

export interface EdgeData {
  id: string;
  from: string;
  to: string;
}

export interface ThemeConfig {
  bg: string;
  border: string;
  text: string;
  label: string;
  icon: LucideIcon;
}