import React, { ReactNode, useState, RefObject } from "react";
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

interface ZoomableCanvasProps {
  children: ReactNode;
  width: number;
  height: number;
  initialScale: number;
  minScale?: number;
  maxScale?: number;
  isDisabled?: boolean;
  transformRef: RefObject<ReactZoomPanPinchRef | null>;
  canvasRef: RefObject<HTMLDivElement | null>; // Para poder exportar la imagen luego
}

export const ZoomableCanvas = ({
  children,
  width,
  height,
  initialScale,
  minScale,
  maxScale = 4,
  isDisabled = false,
  transformRef,
  canvasRef
}: ZoomableCanvasProps) => {
  // Estado local para controlar el paneo (extraído de Board.tsx)
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <TransformWrapper
      ref={transformRef}
      initialScale={initialScale}
      minScale={minScale ?? initialScale} // Por defecto, no alejar más que el inicio
      maxScale={maxScale}
      centerOnInit={true}
      limitToBounds={true}
      centerZoomedOut={true}
      wheel={{ step: 0.1 }}
      disabled={isDisabled}
      // Lógica de paneo encapsulada aquí
      panning={{ 
        disabled: !isZoomed, 
        excluded: ["nopan-node"] 
      }}
      onTransformed={(e) => {
         // Margen de error pequeño para floats
         setIsZoomed(e.state.scale > initialScale + 0.001);
      }}
      onZoomStop={(e) => {
         // Efecto de "snap back" si se aleja demasiado
         if (e.state.scale <= initialScale + 0.01) {
            e.centerView(initialScale, 300, "easeOut");
         }
      }}
    >
      <TransformComponent
        wrapperStyle={{ width: "100%", height: "100%" }}
        wrapperClass="w-full h-full"
        contentClass="w-full h-full flex items-center justify-center"
      >
        <div
          ref={canvasRef}
          style={{ width, height }}
          className="relative shadow-2xl rounded-full bg-white shrink-0"
        >
          {children}
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
};