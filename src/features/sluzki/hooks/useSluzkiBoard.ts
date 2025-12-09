import { useState, useRef, useCallback, useEffect } from "react";
import { toPng } from "html-to-image";
import toast from "react-hot-toast"; 
import { useSluzkiStore } from "../store/useSluzkiStore";
import { LEVELS } from "../utils/constants";

type ToPngOptions = Parameters<typeof toPng>[1];

export const useSluzkiBoard = (diagramRef?: React.RefObject<HTMLDivElement | null>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { 
    nodes, edges, centerName, 
    setCenterName, addNode, deleteNode, 
    updateNodeName, updateNodePosition, updateNodeLevel,
    addEdge, deleteEdge, clearBoard 
  } = useSluzkiStore();

  const [isExporting, setIsExporting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isConnecting) {
          setIsConnecting(false);
          setSourceId(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isConnecting]);

  const onNodeDrag = (id: string, x: number, y: number) => {
    updateNodePosition(id, x, y);

    // Detección automática del nivel
    const distance = Math.sqrt(x * x + y * y);
    
    // Asignar nivel según la distancia
    let newLevel: 1 | 2 | 3 = 3;
    if (distance <= LEVELS[1].boundary) {
      newLevel = 1;
    } else if (distance <= LEVELS[2].boundary) {
      newLevel = 2;
    } else {
      newLevel = 3;
    }

    updateNodeLevel(id, newLevel);
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
    const element = containerRef.current;
    
    if (!element) return;
    
    setSourceId(null);
    setIsConnecting(false);
    setIsExporting(true);

    const exportTask = new Promise<void>(async (resolve, reject) => {
      try {
        await new Promise((r) => setTimeout(r, 500));

        let options: ToPngOptions = {
          cacheBust: true,
          pixelRatio: 2, 
          backgroundColor: "#f8fafc",
          filter: (node: Node) => {
            if (node instanceof Element && node.classList.contains("exclude-from-export")) {
              return false;
            }
            return true;
          },
        };

        if (diagramRef?.current) {
          const containerRect = element.getBoundingClientRect();
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

        const dataUrl = await toPng(element, options);
        const link = document.createElement("a");
        link.download = `mapa-sluzki-${new Date().toISOString().slice(0,10)}.png`;
        link.href = dataUrl;
        link.click();
        
        resolve();
      } catch (err) {
        console.error("Error al exportar:", err);
        reject(err);
      } finally {
        setIsExporting(false);
      }
    });

    toast.promise(exportTask, {
      loading: 'Generando imagen',
      success: '¡Mapa descargado correctamente!',
      error: 'Hubo un error al generar la imagen',
    });

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