import { Home, Heart, Briefcase, Users } from "lucide-react";
import { ThemeConfig, NodeType } from "../types";

export const THEME: Record<NodeType, ThemeConfig> = {
  family: {
    bg: "bg-emerald-100",
    border: "border-emerald-500",
    text: "text-emerald-800",
    label: "Familia",
    icon: Home,
  },
  friend: {
    bg: "bg-amber-100",
    border: "border-amber-500",
    text: "text-amber-800",
    label: "Amigos",
    icon: Heart,
  },
  work: {
    bg: "bg-blue-100",
    border: "border-blue-500",
    text: "text-blue-800",
    label: "Laboral",
    icon: Briefcase,
  },
  community: {
    bg: "bg-purple-100",
    border: "border-purple-500",
    text: "text-purple-800",
    label: "Comunidad",
    icon: Users,
  },
};

export const getInitials = (name: string) =>
  name.trim().split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();