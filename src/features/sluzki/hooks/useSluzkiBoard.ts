import { useState, useRef, useCallback, useEffect } from "react";
import { toPng } from "html-to-image";
import { NodeData, EdgeData, NodeType, NetworkLevel } from "../types";
import { LEVELS } from "../utils/constants";

export const useSluzkiBoard = (diagramRef?: React.RefObject<HTMLDivElement | null>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [centerName, setCenterName] = useState("Usuario");
  const [isLoaded, setIsLoaded] = useState(false);

  // Estado para controlar la UI durante la exportación
  const [isExporting, setIsExporting] = useState(false);

  const [isConnecting, setIsConnecting] = useState(false);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Persistencia
  useEffect(() => {
    const savedData = localStorage.getItem("terio-sluzki-data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setNodes(parsed.nodes || []);
        setEdges(parsed.edges || []);
        setCenterName(parsed.centerName || "Usuario");
      } catch (e) {
        console.error("Error cargando datos", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("terio-sluzki-data", JSON.stringify({ nodes, edges, centerName }));
    }
  }, [nodes, edges, centerName, isLoaded]);

  // Agregar Nodo con Nivel
  const addNode = (name: string, type: NodeType, level: NetworkLevel) => {
    if (!name.trim()) return;
    const id = Date.now().toString();
    
    const baseRadius = LEVELS[level].radius;
    const variation = (Math.random() * 40) - 20; 
    const radius = baseRadius + variation;
    
    let minAngle = 0, maxAngle = 0;
    switch (type) {
      case "family": minAngle = Math.PI; maxAngle = 1.5 * Math.PI; break;
      case "friend": minAngle = 1.5 * Math.PI; maxAngle = 2 * Math.PI; break;
      case "work": minAngle = 0.5 * Math.PI; maxAngle = Math.PI; break;
      case "community": minAngle = 0; maxAngle = 0.5 * Math.PI; break;
    }
    const angle = Math.random() * (maxAngle - minAngle) + minAngle;

    setNodes(prev => [...prev, {
      id, name, type, level,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    }]);
  };

  const deleteNode = (id: string) => {
    setNodes(prev => prev.filter((n) => n.id !== id));
    setEdges(prev => prev.filter((e) => e.from !== id && e.to !== id));
    if (sourceId === id) setSourceId(null);
  };

  const clearBoard = () => {
    if (window.confirm("¿Borrar todo el mapa?")) {
      setNodes([]);
      setEdges([]);
      setCenterName("Usuario");
    }
  };

  const updateNodeName = (id: string, newName: string) => {
    setNodes(prev => prev.map((n) => (n.id === id ? { ...n, name: newName } : n)));
  };

  const onNodeDrag = (id: string, x: number, y: number) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)));
  };

  const handleNodeClick = (id: string) => {
    if (!isConnecting) return;
    if (sourceId === null) {
      setSourceId(id);
    } else {
      if (sourceId === id) {
        setSourceId(null);
        return;
      }
      const exists = edges.find(
        (e) => (e.from === sourceId && e.to === id) || (e.from === id && e.to === sourceId)
      );
      if (exists) {
        setEdges(prev => prev.filter((e) => e.id !== exists.id));
      } else {
        setEdges(prev => [...prev, { id: `${sourceId}-${id}`, from: sourceId, to: id }]);
      }
      setSourceId(null);
    }
  };

  const deleteEdge = (edgeId: string) => {
    setEdges(prev => prev.filter((e) => e.id !== edgeId));
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
    
    // 1. Preparar estado (ocultar UI no deseada)
    setSourceId(null);
    setIsConnecting(false);
    setIsExporting(true);

    // 2. Esperar renderizado de React (para quitar los iconos de basura)
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      // Definimos el tipo 'any' temporalmente en options para evitar conflictos de tipado estrictos
      // aunque usamos las propiedades estándar soportadas.
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

      // 3. Lógica de Recorte con 'style' (SOLUCIÓN AL ERROR X/Y)
      if (diagramRef?.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const diagramRect = diagramRef.current.getBoundingClientRect();

        // Calculamos cuánto hay que mover el contenido para que el diagrama quede en (0,0)
        const cropX = diagramRect.left - containerRect.left;
        const cropY = diagramRect.top - containerRect.top;

        options = {
          ...options,
          // Definimos el tamaño del lienzo final igual al tamaño del diagrama (recorte)
          width: diagramRect.width,
          height: diagramRect.height,
          // Usamos style para desplazar el contenedor original
          style: {
            transform: `translate(-${cropX}px, -${cropY}px)`,
            transformOrigin: "top left",
            // Forzamos que el contenedor mantenga su tamaño original para no romper el layout al moverlo
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
      // 4. Restaurar estado normal
      setIsExporting(false);
    }
  }, [containerRef, diagramRef]);

  return {
    containerRef, nodes, edges, centerName, setCenterName,
    isConnecting, setIsConnecting, sourceId, setSourceId, mousePos,
    isLoaded, addNode, deleteNode, clearBoard, deleteEdge,
    updateNodeName, onNodeDrag, handleNodeClick, handleMouseMove, getNodePos, downloadImage,
    isExporting, 
  };
};