// src/features/copm/components/COPMChart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

interface COPMChartProps {
  t1: number;
  t2?: number; // Opcional, puede no haber re-evaluación
  label: string;
  colorT1: string; // Esperamos un código Hex (ej: #93c5fd) o variable CSS
  colorT2: string;
}

export const COPMChart = ({ t1, t2, label, colorT1, colorT2 }: COPMChartProps) => {
  
  // Preparamos los datos para Recharts
  const data = [
    {
      name: "T1",
      puntaje: t1,
      fill: colorT1, // Color específico para esta barra
    },
    {
      name: "T2",
      puntaje: t2 ?? 0, // Si es undefined, es 0
      fill: colorT2,
    },
  ];

  // Filtramos T2 si no existe para que no salga una barra vacía fea
  const chartData = t2 !== undefined ? data : [data[0]];

  return (
    <div className="flex flex-col items-center w-full max-w-[200px] h-64">
      <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">{label}</h4>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            domain={[0, 10]} 
            tick={{ fontSize: 10, fill: '#94a3b8' }} 
            axisLine={false} 
            tickLine={false} 
            tickCount={6}
          />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="puntaje" radius={[6, 6, 0, 0]} barSize={40}>
            {/* Mapeamos los colores individuales para cada barra */}
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};