import { LucideIcon } from "lucide-react";

export type NodeType = "family" | "friend" | "work" | "community";

export interface NodeData {
  id: string;
  name: string;
  type: NodeType;
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