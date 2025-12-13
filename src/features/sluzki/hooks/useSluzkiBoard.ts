import { useState, useRef, useCallback, useEffect, RefObject } from "react";
import { toPng } from "html-to-image";
import toast from "react-hot-toast"; 
import { useSluzkiStore } from "../store/useSluzkiStore";
import { LEVELS, THEME } from "../utils/constants";

type ToPngOptions = Parameters<typeof toPng>[1];

export const useSluzkiBoard = (
  diagramRef: React.RefObject<HTMLDivElement | null> | undefined,
  containerRef: React.RefObject<HTMLDivElement | null>, 
  scale: number
) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const combinedRef = useRef<HTMLDivElement>(null);
  
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
    const distance = Math.sqrt(x * x + y * y);
    let newLevel: 1 | 2 | 3 = 3;
    if (distance <= LEVELS[1].boundary) newLevel = 1;
    else if (distance <= LEVELS[2].boundary) newLevel = 2;
    else newLevel = 3;
    updateNodeLevel(id, newLevel);
  };

  const handleNodeClick = (id: string) => {
    if (!isConnecting) return;
    if (sourceId === null) {
      setSourceId(id);
    } else {
      if (sourceId !== id) addEdge(sourceId, id);
      setSourceId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isConnecting && sourceId) {
      if (diagramRef?.current) {
        const rect = diagramRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const currentScale = rect.width / 1000;

        setMousePos({
          x: (e.clientX - centerX) / currentScale,
          y: (e.clientY - centerY) / currentScale,
        });
        return;
      }

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        setMousePos({
          x: (e.clientX - rect.left - centerX) / scale,
          y: (e.clientY - rect.top - centerY) / scale,
        });
      }
    }
  };

  const getNodePos = (id: string) => {
    if (id === "center") return { x: 0, y: 0 };
    const n = nodes.find((x) => x.id === id);
    return n ? { x: n.x, y: n.y } : { x: 0, y: 0 };
  };

  const downloadTable = useCallback(() => {
    if (nodes.length === 0) {
      toast.error("No hay nodos para exportar");
      return;
    }
    try {
      const headers = ["Nombre", "Categoría", "Nivel", "Descripción Nivel"];
      const rows = nodes.map(node => {
        const categoryLabel = THEME[node.type].label; 
        const levelLabel = LEVELS[node.level].label;
        return [`"${node.name}"`, `"${categoryLabel}"`, node.level, `"${levelLabel}"`].join(",");
      });
      const csvContent = [headers.join(","), ...rows].join("\n");
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `detalle-red-${new Date().toISOString().slice(0,10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exportado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al generar CSV");
    }
  }, [nodes]);

  const downloadTableImage = useCallback(async () => {
    const tableElement = tableRef.current;
    if (!tableElement || nodes.length === 0) {
      toast.error("No hay datos para generar la imagen");
      return;
    }
    const exportTask = new Promise<void>(async (resolve, reject) => {
      try {
        setIsExporting(true);
        await new Promise((r) => setTimeout(r, 100));
        const dataUrl = await toPng(tableElement, { cacheBust: true, pixelRatio: 2, backgroundColor: "#ffffff" });
        const link = document.createElement("a");
        link.download = `tabla-sluzki-${new Date().toISOString().slice(0,10)}.png`;
        link.href = dataUrl;
        link.click();
        resolve();
      } catch (err) {
        console.error(err); reject(err);
      } finally {
        setIsExporting(false);
      }
    });
    toast.promise(exportTask, { loading: 'Generando imagen...', success: '¡Descarga lista!', error: 'Error al generar' });
  }, [tableRef, nodes]);

  const downloadImage = useCallback(async () => {
    const element = containerRef.current;
    const targetElement = diagramRef?.current || element; 

    if (!targetElement) return;
    setSourceId(null); setIsConnecting(false); setIsExporting(true);
    
    const exportTask = new Promise<void>(async (resolve, reject) => {
      try {
        await new Promise((r) => setTimeout(r, 500));
        
        let options: ToPngOptions = {
          cacheBust: true, pixelRatio: 2, backgroundColor: "#f8fafc",
          filter: (node: Node) => !(node instanceof Element && node.classList.contains("exclude-from-export")),
        };

        if (targetElement === diagramRef?.current) {
             options = { 
                 ...options, 
                 width: 1000, 
                 height: 1000, 
                 style: { 
                     transform: 'scale(1)', 
                     transformOrigin: 'top left' 
                 } 
             };
        }

        const dataUrl = await toPng(targetElement as HTMLElement, options);
        const link = document.createElement("a");
        link.download = `mapa-sluzki-${new Date().toISOString().slice(0,10)}.png`;
        link.href = dataUrl;
        link.click();
        resolve();
      } catch (err) { console.error(err); reject(err); } finally { setIsExporting(false); }
    });
    toast.promise(exportTask, { loading: 'Generando mapa...', success: '¡Mapa descargado!', error: 'Error al generar' });
  }, [containerRef, diagramRef]);

  const downloadCombinedImage = useCallback(async () => {
    const combinedElement = combinedRef.current;
    if (!combinedElement) return;

    const exportTask = new Promise<void>(async (resolve, reject) => {
      try {
        setIsExporting(true);
        await new Promise((r) => setTimeout(r, 100)); 
        
        const dataUrl = await toPng(combinedElement, { 
          cacheBust: true, 
          pixelRatio: 2, 
          backgroundColor: "#ffffff" 
        });
        
        const link = document.createElement("a");
        link.download = `reporte-completo-${new Date().toISOString().slice(0,10)}.png`;
        link.href = dataUrl;
        link.click();
        resolve();
      } catch (err) {
        console.error(err); reject(err);
      } finally {
        setIsExporting(false);
      }
    });

    toast.promise(exportTask, { 
        loading: 'Creando reporte completo...', 
        success: '¡Reporte listo!', 
        error: 'Error al crear reporte' 
    });
  }, [combinedRef]);

  return {
    containerRef, tableRef, combinedRef,
    nodes, edges, centerName, setCenterName,
    isConnecting, setIsConnecting, sourceId, setSourceId, mousePos,
    isLoaded: true,
    addNode, deleteNode, clearBoard, deleteEdge,
    updateNodeName, onNodeDrag, handleNodeClick, 
    handleMouseMove, getNodePos,
    downloadImage,
    downloadTable,
    downloadTableImage,
    downloadCombinedImage,
    isExporting, 
  };
};