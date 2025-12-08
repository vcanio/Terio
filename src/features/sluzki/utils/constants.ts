import { Home, Heart, Briefcase, Users } from "lucide-react";
import { ThemeConfig, NodeType } from "../types";

export const THEME: Record<NodeType, ThemeConfig> = {
  // ... (El contenido de THEME se mantiene igual) ...
  family: {
    bg: "bg-emerald-100",
    border: "border-emerald-500",
    text: "text-emerald-900",
    label: "Familia",
    icon: Home,
  },
  friend: {
    bg: "bg-amber-100",
    border: "border-amber-500",
    text: "text-amber-900",
    label: "Amigos",
    icon: Heart,
  },
  work: {
    bg: "bg-blue-100",
    border: "border-blue-500",
    text: "text-blue-900",
    label: "Laboral",
    icon: Briefcase,
  },
  community: {
    bg: "bg-purple-100",
    border: "border-purple-500",
    text: "text-purple-900",
    label: "Comunidad",
    icon: Users,
  },
};

// AJUSTE CLAVE: Separamos dónde va el nodo (radius) de dónde se dibuja la línea (boundary)
export const LEVELS = {
  1: { radius: 100, boundary: 180, label: "Nivel 1" },       // Nodo en 100px, Línea en 180px
  2: { radius: 250, boundary: 330, label: "Nivel 2" },       // Nodo en 250px, Línea en 330px
  3: { radius: 400, boundary: 480, label: "Nivel 3" }, // Nodo en 400px, Línea en 480px (Casi al borde del viewBox 500)
};

export const getInitials = (name: string) =>
  name.trim().split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();