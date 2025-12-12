// src/app/tools/vq/page.tsx
"use client";

import { useVQStore } from "@/features/vq/store/useVQStore";
import { VQDashboard } from "@/features/vq/components/VQDashboard";
import { VQEvaluator } from "@/features/vq/components/VQEvaluator";
import { useEffect, useState } from "react";

export default function VQPage() {
  const activeSessionId = useVQStore((state) => state.activeSessionId);
  const [mounted, setMounted] = useState(false);

  // Evitar hidratación incorrecta con persist
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full bg-slate-50 overflow-hidden">
      {activeSessionId ? <VQEvaluator /> : <VQDashboard />}
    </div>
  );
}