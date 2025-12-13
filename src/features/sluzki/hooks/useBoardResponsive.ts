import { useState, useEffect, RefObject } from 'react';

// Definimos el tamaño "lógico" del tablero. 
const BOARD_SIZE = 1000; 

export const useBoardResponsive = (containerRef: RefObject<HTMLDivElement | null>) => {
  // Inicializamos en null para indicar que aún no se ha calculado
  const [scale, setScale] = useState<number | null>(null);
  
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      const { width, height } = containerRef.current.getBoundingClientRect();
      
      if (width === 0 || height === 0) return;

      // Calculamos cuánto escalar los 1000px para que quepan (contain)
      const scaleX = width / BOARD_SIZE;
      const scaleY = height / BOARD_SIZE;
      
      // Multiplicamos por 0.95 para dejar un pequeño margen y que no toque los bordes exactos
      const newScale = Math.min(scaleX, scaleY, 1) * 0.95; 

      setScale(newScale);
    };

    const observer = new ResizeObserver(() => handleResize());
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
      handleResize(); 
    }

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [containerRef]);

  return { scale, BOARD_SIZE };
};