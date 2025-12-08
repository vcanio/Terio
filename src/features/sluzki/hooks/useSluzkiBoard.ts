import { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { useSluzkiStore } from "../store/useSluzkiStore"; // Asegúrate de importar el store

export const useSluzkiBoard = (diagramRef?: React.RefObject<HTMLDivElement | null>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 1. Consumimos el estado y las acciones del store de Zustand
  const { 
    nodes, edges, centerName, 
    setCenterName, addNode, deleteNode, 
    updateNodeName, updateNodePosition, 
    addEdge, deleteEdge, clearBoard 
  } = useSluzkiStore();

  // 2. Estado UI local (Mouse, exportación, conexiones visuales)
  const [isExporting, setIsExporting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 3. Lógica de UI que se mantiene local en el hook
  
  // Actualizar posición al arrastrar (delegando al store)
  const onNodeDrag = (id: string, x: number, y: number) => {
    updateNodePosition(id, x, y);
  };

  // Manejar clics para conectar nodos
  const handleNodeClick = (id: string) => {
    if (!isConnecting) return;
    if (sourceId === null) {
      setSourceId(id);
    } else {
      if (sourceId !== id) {
        addEdge(sourceId, id); // Delegamos la creación de la conexión al store
      }
      setSourceId(null);
    }
  };

  // Rastrear el mouse para la línea punteada temporal
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isConnecting && sourceId && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      setMousePos({
        x: e.clientX - rect.left - centerX,
        y: e.clientY - rect.top - centerY,
      });
    }
  };

  // Obtener posición exacta de un nodo (para dibujar las líneas)
  const getNodePos = (id: string) => {
    if (id === "center") return { x: 0, y: 0 };
    const n = nodes.find((x) => x.id === id);
    return n ? { x: n.x, y: n.y } : { x: 0, y: 0 };
  };

  // Lógica de exportación a imagen
  const downloadImage = useCallback(async () => {
    if (containerRef.current === null) return;
    
    // Preparar estado (ocultar UI no deseada)
    setSourceId(null);
    setIsConnecting(false);
    setIsExporting(true);

    // Esperar renderizado
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      let options: any = {
        cacheBust: true,
        pixelRatio: 2, 
        backgroundColor: "#f8fafc",
        filter: (node: any) => {
          if (node?.classList?.contains) {
             return !node.classList.contains("exclude-from-export");
          }
          return true;
        },
      };

      if (diagramRef?.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const diagramRect = diagramRef.current.getBoundingClientRect();

        const cropX = diagramRect.left - containerRect.left;
        const cropY = diagramRect.top - containerRect.top;

        options = {
          ...options,
          width: diagramRect.width,
          height: diagramRect.height,
          style: {
            transform: `translate(-${cropX}px, -${cropY}px)`,
            transformOrigin: "top left",
            width: `${containerRect.width}px`,
            height: `${containerRect.height}px`,
          }
        };
      }

      const dataUrl = await toPng(containerRef.current, options);
      const link = document.createElement("a");
      link.download = `mapa-sluzki-${new Date().toISOString().slice(0,10)}.png`;
      link.href = dataUrl;
      link.click();

    } catch (err) {
      console.error("Error al exportar:", err);
    } finally {
      setIsExporting(false);
    }
  }, [containerRef, diagramRef]);

  return {
    containerRef, nodes, edges, centerName, setCenterName,
    isConnecting, setIsConnecting, sourceId, setSourceId, mousePos,
    isLoaded: true, // Zustand carga síncronamente el storage por defecto
    addNode, deleteNode, clearBoard, deleteEdge,
    updateNodeName, onNodeDrag, handleNodeClick, 
    handleMouseMove, // <--- Ahora sí está definida
    getNodePos,      // <--- Ahora sí está definida
    downloadImage,   // <--- Ahora sí está definida
    isExporting, 
  };
};