import React from "react";
import { LEVELS } from "../utils/constants"; //

export const BoardBackground = () => {
  return (
    <div className="pointer-events-none absolute w-full max-w-[95vmin] aspect-square flex items-center justify-center opacity-50">
      <div className="absolute inset-0 z-0 font-black uppercase tracking-widest select-none">
        <span className="absolute top-6 left-6 text-sm md:text-2xl text-emerald-900/80">Familia</span>
        <span className="absolute top-6 right-6 text-sm md:text-2xl text-amber-900/80 text-right">Amigos</span>
        <span className="absolute bottom-6 left-6 text-sm md:text-2xl text-blue-900/80">Laboral</span>
        <span className="absolute bottom-6 right-6 text-sm md:text-2xl text-purple-900/80 text-right">Comunidad</span>
      </div>
      
      <svg className="absolute inset-0 w-full h-full z-0 overflow-visible" viewBox="0 0 1000 1000">
        <line x1="0" y1="500" x2="1000" y2="500" stroke="#475569" strokeWidth="2" strokeDasharray="8 8" />
        <line x1="500" y1="0" x2="500" y2="1000" stroke="#475569" strokeWidth="2" strokeDasharray="8 8" />
        
        {/* Renderizado dinámico basado en las constantes */}
        {Object.values(LEVELS).map((lvl, index) => (
          <React.Fragment key={index}>
            <circle cx="500" cy="500" r={lvl.boundary} fill="none" stroke="#475569" strokeWidth="2" />
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
};