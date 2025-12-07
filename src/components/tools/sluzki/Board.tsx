"use client";

import React, { useState, useRef, useCallback } from "react";
import Draggable from "react-draggable";
import { toPng } from "html-to-image";
import {
  Plus,
  X,
  Link as LinkIcon,
  User,
  Download,
  Info,
  Heart,
  Briefcase,
  Home,
  Users,
  Trash2,
  Check,
  List,
  ChevronRight,
  Search
} from "lucide-react";

// --- TIPOS DE DATOS ---
type NodeType = "family" | "friend" | "work" | "community";

interface NodeData {
  id: string;
  name: string;
  type: NodeType;
  x: number;
  y: number;
}

interface EdgeData {
  id: string;
  from: string;
  to: string;
}

// --- CONFIGURACIÓN VISUAL ---
const THEME = {
  family: {
    bg: "bg-emerald-100",
    border: "border-emerald-500",
    text: "text-emerald-800",
    label: "Familia",
    icon: Home,
  },
  friend: {
    bg: "bg-amber-100",
    border: "border-amber-500",
    text: "text-amber-800",
    label: "Amigos",
    icon: Heart,
  },
  work: {
    bg: "bg-blue-100",
    border: "border-blue-500",
    text: "text-blue-800",
    label: "Laboral",
    icon: Briefcase,
  },
  community: {
    bg: "bg-purple-100",
    border: "border-purple-500",
    text: "text-purple-800",
    label: "Comunidad",
    icon: Users,
  },
};

// --- UTILIDADES ---
const getInitials = (name: string) => {
  return name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

// --- SUB-COMPONENTE: NODO INDIVIDUAL (SOLO VISUAL) ---
const DraggableNode = ({
  node,
  onDrag,
  onClick,
  isTarget,
  isSelected,
}: any) => {
  const nodeRef = useRef(null);
  const style = THEME[node.type as NodeType];
  const Icon = style.icon;
  const initials = getInitials(node.name || "?");

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: node.x, y: node.y }}
      onDrag={(e, data) => onDrag(node.id, data.x, data.y)}
      disabled={isTarget}
    >
      <div
        ref={nodeRef}
        className="absolute z-20 cursor-grab active:cursor-grabbing group"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <div
          className={`
          w-12 h-12 md:w-14 md:h-14 rounded-full flex flex-col items-center justify-center
          border-[3px] shadow-sm transition-all duration-200 bg-white
          ${style.border}
          ${
            isTarget ? "ring-4 ring-blue-400 ring-offset-2 scale-110 z-30" : ""
          } 
          ${isSelected ? "ring-4 ring-slate-400 ring-offset-2" : ""}
          hover:shadow-lg
          -translate-x-1/2 -translate-y-1/2
        `}
          title={node.name} // Tooltip nativo con el nombre completo
        >
          <div
            className={`absolute inset-1 rounded-full opacity-40 ${style.bg} -z-10`}
          ></div>

          {/* Icono pequeño arriba */}
          <Icon size={10} className={`mb-0.5 opacity-60 ${style.text}`} />

          {/* Iniciales en lugar de input completo */}
          <span className={`text-xs md:text-sm font-black ${style.text} leading-none select-none`}>
            {initials}
          </span>
        </div>
      </div>
    </Draggable>
  );
};

// --- COMPONENTE PRINCIPAL: TABLERO ---
export default function SluzkiBoard() {
  // Estado para el nombre del nodo central
  const [centerName, setCenterName] = useState("Usuario");
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(true); // Estado para el panel lateral
  const [modalName, setModalName] = useState("");
  const [modalType, setModalType] = useState<NodeType>("family");

  // --- EXPORTAR A PNG ---
  const downloadImage = useCallback(() => {
    if (containerRef.current === null) return;
    toPng(containerRef.current, {
      cacheBust: true,
      filter: (node) => {
        const exclusionClasses = ["exclude-from-export"];
        return !exclusionClasses.some((classname) =>
          node.classList?.contains(classname)
        );
      },
      backgroundColor: "#f8fafc",
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "mapa-sluzki.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error(err));
  }, [containerRef]);

  // --- AGREGAR NODO ---
  const handleAddMember = () => {
    if (!modalName.trim()) return;

    const id = Date.now().toString();
    const radius = 200; // Radio inicial un poco más amplio

    let minAngle = 0,
      maxAngle = 0;

    switch (modalType) {
      case "family": // Arriba Izquierda
        minAngle = Math.PI;
        maxAngle = 1.5 * Math.PI;
        break;
      case "friend": // Arriba Derecha
        minAngle = 1.5 * Math.PI;
        maxAngle = 2 * Math.PI;
        break;
      case "work": // Abajo Izquierda
        minAngle = 0.5 * Math.PI;
        maxAngle = Math.PI;
        break;
      case "community": // Abajo Derecha
        minAngle = 0;
        maxAngle = 0.5 * Math.PI;
        break;
    }

    const angle = Math.random() * (maxAngle - minAngle) + minAngle;

    setNodes([
      ...nodes,
      {
        id,
        name: modalName,
        type: modalType,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      },
    ]);

    setModalName("");
    setModalType("family");
    setIsModalOpen(false);
    // Abrir lista automáticamente al agregar para confirmar
    setIsListOpen(true);
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id));
    setEdges(edges.filter((e) => e.from !== id && e.to !== id));
    if (sourceId === id) setSourceId(null);
  };

  const deleteEdge = (edgeId: string) => {
    setEdges(edges.filter((e) => e.id !== edgeId));
  };

  const updateNodeName = (id: string, newName: string) => {
    setNodes(nodes.map((n) => (n.id === id ? { ...n, name: newName } : n)));
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
        (e) =>
          (e.from === sourceId && e.to === id) ||
          (e.from === id && e.to === sourceId)
      );
      if (exists) {
        setEdges(edges.filter((e) => e.id !== exists.id));
      } else {
        setEdges([
          ...edges,
          { id: `${sourceId}-${id}`, from: sourceId, to: id },
        ]);
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

  const sourcePos = sourceId ? getNodePos(sourceId) : { x: 0, y: 0 };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`
        w-full h-full relative bg-slate-50 font-sans flex items-center justify-center overflow-hidden
        ${isConnecting ? "cursor-crosshair" : ""}
      `}
    >
      {/* --- 1. BARRA DE HERRAMIENTAS (IZQUIERDA) --- */}
      <div 
        className="exclude-from-export absolute z-50 
          left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 animate-in slide-in-from-left-4 duration-500 pointer-events-none"
      >
        <div className="bg-white/95 backdrop-blur-sm p-2 rounded-xl shadow-xl border border-slate-200 pointer-events-auto flex flex-col gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2.5 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center"
              title="Agregar Nodo"
            >
              <Plus size={20} />
            </button>
            <div className="w-full h-px bg-slate-100 mx-1"></div>
            <button
              onClick={() => {
                setIsConnecting(!isConnecting);
                setSourceId(null);
              }}
              className={`p-2.5 rounded-lg transition-all border
                ${
                  isConnecting
                    ? "bg-blue-600 border-blue-600 text-white shadow-md"
                    : "bg-white border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              title="Conectar nodos"
            >
              <LinkIcon size={20} />
            </button>

            <button
              onClick={downloadImage}
              className="p-2.5 bg-white border border-transparent text-slate-500 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
              title="Descargar PNG"
            >
              <Download size={20} />
            </button>
        </div>
      </div>

      {/* --- 2. BARRA LATERAL DE DETALLE (DERECHA) --- */}
      <div 
        className={`exclude-from-export absolute z-40 right-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur border-l border-slate-200 shadow-2xl transition-transform duration-300 flex flex-col
          ${isListOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Toggle Button */}
        <button
            onClick={() => setIsListOpen(!isListOpen)}
            className="absolute -left-10 top-4 p-2 bg-white border border-slate-200 rounded-l-xl shadow-md text-slate-500 hover:text-slate-900 z-50"
            title={isListOpen ? "Cerrar lista" : "Ver lista de integrantes"}
        >
            {isListOpen ? <ChevronRight size={20} /> : <List size={20} />}
        </button>

        {/* --- SECCIÓN NUEVA: EDICIÓN NODO CENTRAL --- */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1">
                <User size={10} /> Usuario Principal (Centro)
            </div>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-slate-800 text-white font-bold text-xs border-2 border-white shadow-sm">
                    {getInitials(centerName)}
                </div>
                <input 
                    type="text" 
                    value={centerName}
                    onChange={(e) => setCenterName(e.target.value)}
                    className="w-full text-sm font-bold text-slate-800 bg-transparent border-b border-slate-300 focus:border-blue-500 p-1 focus:outline-none placeholder:text-slate-300 transition-colors"
                    placeholder="Nombre del usuario..."
                />
            </div>
        </div>

        <div className="w-full h-px bg-slate-100"></div>

        <div className="p-4 border-b border-slate-100 bg-white">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <List size={16} /> Detalle de Red ({nodes.length})
            </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {nodes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm text-center px-4">
                    <Users size={32} className="mb-2 opacity-20" />
                    <p>No hay integrantes.</p>
                    <p className="text-xs">Usa el botón <Plus size={10} className="inline"/> para agregar.</p>
                </div>
            ) : (
                nodes.map((node) => {
                    const style = THEME[node.type];
                    const initials = getInitials(node.name);
                    
                    return (
                        <div key={node.id} className="group flex items-center gap-3 p-2 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all bg-white">
                            {/* Visual Indicator (Coincide con el nodo) */}
                            <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border-2 ${style.bg} ${style.border} ${style.text} font-bold text-xs`}>
                                {initials}
                            </div>
                            
                            {/* Editable Info */}
                            <div className="flex-1 min-w-0">
                                <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 flex items-center gap-1">
                                    <style.icon size={10} /> {style.label}
                                </div>
                                <input 
                                    type="text" 
                                    value={node.name}
                                    onChange={(e) => updateNodeName(node.id, e.target.value)}
                                    className="w-full text-sm font-medium text-slate-700 bg-transparent border-none p-0 focus:ring-0 placeholder:text-slate-300"
                                    placeholder="Nombre..."
                                />
                            </div>

                            <button 
                                onClick={() => deleteNode(node.id)}
                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="Eliminar"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    );
                })
            )}
        </div>
      </div>

      {isConnecting && (
          <div className="exclude-from-export absolute bottom-8 bg-slate-800 text-white px-4 py-2 rounded-full shadow-lg text-xs flex gap-2 items-center animate-in fade-in slide-in-from-bottom-4 pointer-events-none">
            <Info size={14} className="text-blue-300" />
            <span>Selecciona dos nodos para conectarlos</span>
          </div>
      )}

      {/* --- 3. CONTENEDOR VISUAL CUADRADO (FONDO Y ETIQUETAS) --- */}
      <div className="pointer-events-none absolute w-full max-w-[90vmin] aspect-square flex items-center justify-center opacity-60">
        
        {/* ETIQUETAS DE TEXTO */}
        <div className="absolute inset-0 z-0 text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-widest select-none">
            <span className="absolute top-8 left-8 text-emerald-900/50">Familia</span>
            <span className="absolute top-8 right-8 text-amber-900/50 text-right">Amigos</span>
            <span className="absolute bottom-8 left-8 text-blue-900/50">Laboral</span>
            <span className="absolute bottom-8 right-8 text-purple-900/50 text-right">Comunidad</span>
        </div>

        {/* SVG DE FONDO */}
        <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 1000 1000">
          <line x1="0" y1="500" x2="1000" y2="500" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 8" />
          <line x1="500" y1="0" x2="500" y2="1000" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 8" />
          <circle cx="500" cy="500" r="150" fill="none" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="500" cy="500" r="300" fill="none" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="500" cy="500" r="450" fill="none" stroke="#cbd5e1" strokeWidth="2" />
        </svg>
      </div>

      {/* --- 4. ÁREA DE JUEGO (NODOS Y CONEXIONES) --- */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0 z-10 overflow-visible">
        {/* LÍNEAS DE CONEXIÓN */}
        <svg
          className="absolute overflow-visible -top-[9999px] -left-[9999px] w-[19999px] h-[19999px] pointer-events-none"
          style={{ left: 0, top: 0 }}
        >
          {isConnecting && sourceId && (
            <line
              x1={sourcePos.x} y1={sourcePos.y}
              x2={mousePos.x} y2={mousePos.y}
              stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5"
              className="opacity-60 animate-pulse"
            />
          )}

          {edges.map((edge) => {
            const start = getNodePos(edge.from);
            const end = getNodePos(edge.to);
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            return (
              <g
                key={edge.id}
                className="pointer-events-auto cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteEdge(edge.id);
                }}
              >
                <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="transparent" strokeWidth="20" />
                <line
                  x1={start.x} y1={start.y} x2={end.x} y2={end.y}
                  stroke="#94a3b8"
                  className="stroke-slate-400 stroke-[2px] transition-colors duration-300 group-hover:stroke-red-400"
                />
                <foreignObject
                  x={midX - 12} y={midY - 12} width={24} height={24}
                  className="overflow-visible pointer-events-none exclude-from-export"
                >
                  <div className="w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-75 group-hover:scale-100">
                    <div className="bg-white text-red-500 rounded-full shadow-md border border-red-100 p-1">
                      <Trash2 size={12} />
                    </div>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        {/* NODO CENTRAL (ACTUALIZADO) */}
        <div
          onClick={() => handleNodeClick("center")}
          title={centerName} // Tooltip nativo con el nombre completo al pasar el mouse
          className={`
            absolute -translate-x-1/2 -translate-y-1/2 z-30 
            w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-800 text-white flex flex-col items-center justify-center 
            shadow-xl cursor-pointer transition-all duration-300 border-4 border-white ring-1 ring-slate-200
            ${isConnecting && sourceId === "center" ? "ring-4 ring-blue-400 scale-105" : ""}
          `}
        >
          <User size={24} className="mb-1 text-slate-200 opacity-80" />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-100 max-w-[90%] truncate px-1">
            {/* Muestra iniciales si es largo, o el texto si es corto (ej: YO) */}
            {centerName.length > 3 ? getInitials(centerName) : centerName}
          </span>
        </div>

        {/* NODOS */}
        {nodes.map((node) => (
          <DraggableNode
            key={node.id}
            node={node}
            onDrag={onNodeDrag}
            onClick={() => handleNodeClick(node.id)}
            isTarget={isConnecting && sourceId === node.id}
            isSelected={sourceId === node.id}
          />
        ))}
      </div>

      {/* --- MODAL NUEVO INTEGRANTE --- */}
      {isModalOpen && (
        <div className="exclude-from-export fixed inset-0 z-100 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">
                Nuevo Integrante
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Nombre Completo
                </label>
                <input
                  autoFocus
                  type="text"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  placeholder="Ej: María Pérez"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Cuadrante / Relación
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(THEME).map(([key, style]) => {
                    const isSelected = modalType === key;
                    const Icon = style.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setModalType(key as NodeType)}
                        className={`
                          flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left
                          ${
                            isSelected
                              ? `${style.bg} ${style.border} ${style.text} ring-1 ring-offset-1 ring-transparent`
                              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                          }
                        `}
                      >
                        <div
                          className={`
                          w-6 h-6 rounded-full flex items-center justify-center shrink-0
                          ${isSelected ? "bg-white/50" : style.bg}
                        `}
                        >
                          <Icon
                            size={12}
                            className={isSelected ? style.text : ""}
                          />
                        </div>
                        <span className="text-xs font-bold">{style.label}</span>
                        {isSelected && (
                          <Check size={14} className="ml-auto opacity-60" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleAddMember}
                disabled={!modalName.trim()}
                className={`
                  w-full py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/5 mt-4 flex items-center justify-center gap-2 transition-all
                  ${
                    !modalName.trim()
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02] active:scale-95"
                  }
                `}
              >
                <Plus size={18} strokeWidth={3} /> Agregar al Mapa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}