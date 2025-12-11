import { useState, useEffect, RefObject } from 'react';

// Definimos el tamaño "lógico" del tablero. 
// Todo el diseño se basará en que el tablero mide 1000x1000px internamente.
const BOARD_SIZE = 1000; 

export const useBoardResponsive = (containerRef: RefObject<HTMLDivElement | null>) => {
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      // Medimos el espacio disponible en la pantalla
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      // Calculamos cuánto tenemos que escalar los 1000px para que quepan
      const scaleX = width / BOARD_SIZE;
      const scaleY = height / BOARD_SIZE;
      
      // Elegimos el menor factor para que quepa todo sin cortarse (contain)
      // Multiplicamos por 0.95 para dejar un pequeño margen de seguridad y que no toque los bordes
      const newScale = Math.min(scaleX, scaleY, 1) * 0.95; 

      setScale(newScale);
    };

    // Ejecutar al inicio y cada vez que cambie el tamaño de la ventana
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [containerRef]);

  return { scale, BOARD_SIZE };
};