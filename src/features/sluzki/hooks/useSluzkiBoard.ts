import { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { NodeData, EdgeData, NodeType } from "../types";

export const useSluzkiBoard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [centerName, setCenterName] = useState("Usuario");
  
  // Estado de interacción
  const [isConnecting, setIsConnecting] = useState(false);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // --- ACCIONES DE NODOS ---
  const addNode = (name: string, type: NodeType) => {
    if (!name.trim()) return;
    const id = Date.now().toString();
    const radius = 200;
    
    let minAngle = 0, maxAngle = 0;
    switch (type) {
      case "family": minAngle = Math.PI; maxAngle = 1.5 * Math.PI; break;
      case "friend": minAngle = 1.5 * Math.PI; maxAngle = 2 * Math.PI; break;
      case "work": minAngle = 0.5 * Math.PI; maxAngle = Math.PI; break;
      case "community": minAngle = 0; maxAngle = 0.5 * Math.PI; break;
    }
    const angle = Math.random() * (maxAngle - minAngle) + minAngle;

    setNodes(prev => [...prev, {
      id, name, type,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    }]);
  };

  const deleteNode = (id: string) => {
    setNodes(prev => prev.filter((n) => n.id !== id));
    setEdges(prev => prev.filter((e) => e.from !== id && e.to !== id));
    if (sourceId === id) setSourceId(null);
  };

  const updateNodeName = (id: string, newName: string) => {
    setNodes(prev => prev.map((n) => (n.id === id ? { ...n, name: newName } : n)));
  };

  const onNodeDrag = (id: string, x: number, y: number) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)));
  };

  // --- ACCIONES DE CONEXIÓN ---
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

  // --- UTILIDADES ---
  const downloadImage = useCallback(() => {
    if (containerRef.current === null) return;
    toPng(containerRef.current, {
      cacheBust: true,
      filter: (node) => !node.classList?.contains("exclude-from-export"),
      backgroundColor: "#f8fafc",
    }).then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "mapa-sluzki.png";
        link.href = dataUrl;
        link.click();
      }).catch((err) => console.error(err));
  }, [containerRef]);

  return {
    containerRef,
    nodes,
    edges,
    centerName,
    setCenterName,
    isConnecting,
    setIsConnecting,
    sourceId,
    setSourceId,
    mousePos,
    // Acciones y Getters
    addNode,
    deleteNode,
    deleteEdge,
    updateNodeName,
    onNodeDrag,
    handleNodeClick,
    handleMouseMove,
    getNodePos,
    downloadImage,
  };
};