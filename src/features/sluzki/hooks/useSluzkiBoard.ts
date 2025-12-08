import { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { useSluzkiStore } from "../store/useSluzkiStore";

// TRUCO: Extraemos el tipo de 'Options' directamente de la función toPng
// ya que la librería no lo exporta explícitamente.
type ToPngOptions = Parameters<typeof toPng>[1];

export const useSluzkiBoard = (diagramRef?: React.RefObject<HTMLDivElement | null>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { 
    nodes, edges, centerName, 
    setCenterName, addNode, deleteNode, 
    updateNodeName, updateNodePosition, 
    addEdge, deleteEdge, clearBoard 
  } = useSluzkiStore();

  const [isExporting, setIsExporting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const onNodeDrag = (id: string, x: number, y: number) => {
    updateNodePosition(id, x, y);
  };

  const handleNodeClick = (id: string) => {
    if (!isConnecting) return;
    if (sourceId === null) {
      setSourceId(id);
    } else {
      if (sourceId !== id) {
        addEdge(sourceId, id);
      }
      setSourceId(null);
    }
  };

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

  const getNodePos = (id: string) => {
    if (id === "center") return { x: 0, y: 0 };
    const n = nodes.find((x) => x.id === id);
    return n ? { x: n.x, y: n.y } : { x: 0, y: 0 };
  };

  const downloadImage = useCallback(async () => {
    if (containerRef.current === null) return;
    
    setSourceId(null);
    setIsConnecting(false);
    setIsExporting(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      // Usamos el tipo extraído aquí
      let options: ToPngOptions = {
        cacheBust: true,
        pixelRatio: 2, 
        backgroundColor: "#f8fafc",
        // Tipamos el nodo como 'any' para evitar conflictos con la librería, 
        // pero validamos que sea un Elemento HTML antes de acceder a classList
        filter: (node: Node) => {
          if (node instanceof Element && node.classList.contains("exclude-from-export")) {
            return false;
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
    isLoaded: true,
    addNode, deleteNode, clearBoard, deleteEdge,
    updateNodeName, onNodeDrag, handleNodeClick, 
    handleMouseMove,
    getNodePos,
    downloadImage,
    isExporting, 
  };
};