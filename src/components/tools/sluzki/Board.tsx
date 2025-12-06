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

// --- SUB-COMPONENTE: NODO INDIVIDUAL ---
const DraggableNode = ({
  node,
  onDrag,
  onDelete,
  onChangeName,
  onClick,
  isTarget,
  isSelected,
}: any) => {
  const nodeRef = useRef(null);
  const style = THEME[node.type as NodeType];
  const Icon = style.icon;

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
          w-20 h-20 rounded-full flex flex-col items-center justify-center
          border-[3px] shadow-sm transition-all duration-200 bg-white
          ${style.border}
          ${
            isTarget ? "ring-4 ring-blue-400 ring-offset-2 scale-110 z-30" : ""
          } 
          ${isSelected ? "ring-4 ring-slate-400 ring-offset-2" : ""}
          hover:shadow-lg
          -translate-x-1/2 -translate-y-1/2
        `}
        >
          <div
            className={`absolute inset-1 rounded-full opacity-40 ${style.bg} -z-10`}
          ></div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute -top-2 -right-2 bg-white border border-slate-200 text-slate-400 rounded-full p-1.5 
                      opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-red-50 hover:text-red-500 hover:border-red-200 scale-75 hover:scale-100"
            title="Eliminar persona"
          >
            <X size={12} strokeWidth={3} />
          </button>

          <Icon size={14} className={`mb-1 opacity-70 ${style.text}`} />

          <input
            value={node.name}
            onChange={(e) => onChangeName(e.target.value)}
            className={`w-16 bg-transparent text-center text-xs font-bold focus:outline-none ${style.text} placeholder-slate-400`}
            placeholder="Nombre"
            onMouseDown={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </Draggable>
  );
};

// --- COMPONENTE PRINCIPAL: TABLERO ---
export default function SluzkiBoard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // --- ESTADOS PARA EL MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // --- AGREGAR NODO DESDE EL MODAL ---
  const handleAddMember = () => {
    if (!modalName.trim()) return;

    const id = Date.now().toString();
    const radius = 220;

    let minAngle = 0,
      maxAngle = 0;

    switch (modalType) {
      case "family":
        minAngle = Math.PI;
        maxAngle = 1.5 * Math.PI;
        break;
      case "friend":
        minAngle = 1.5 * Math.PI;
        maxAngle = 2 * Math.PI;
        break;
      case "work":
        minAngle = 0.5 * Math.PI;
        maxAngle = Math.PI;
        break;
      case "community":
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
      className={`w-full h-full relative bg-slate-50 overflow-hidden font-sans 
        ${isConnecting ? "cursor-crosshair" : ""}
      `}
    >
      {/* --- 1. BARRA DE HERRAMIENTAS --- */}
      <div className="exclude-from-export absolute top-1/2 left-6 -translate-y-1/2 z-50 flex flex-col gap-4 w-60 animate-in slide-in-from-right-4 duration-500 select-none">
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-slate-200">
          <h1 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Herramientas
          </h1>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                setIsConnecting(!isConnecting);
                setSourceId(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all border
                ${
                  isConnecting
                    ? "bg-blue-600 border-blue-600 text-white shadow-md ring-2 ring-blue-200 ring-offset-1"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                }`}
            >
              <LinkIcon size={16} /> {isConnecting ? "Uniendo..." : "Unir"}
            </button>

            <button
              onClick={downloadImage}
              className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all active:scale-95"
              title="Descargar PNG"
            >
              <Download size={18} />
            </button>
          </div>

          <div className="w-full h-px bg-slate-100 mb-4"></div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 bg-slate-800 text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-slate-200 hover:bg-slate-700 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="font-semibold text-sm">Agregar Persona</span>
          </button>
        </div>

        {isConnecting && (
          <div className="bg-slate-800 text-white p-3 rounded-xl shadow-lg text-xs flex gap-3 items-center animate-in fade-in slide-in-from-bottom-2">
            <Info size={18} className="shrink-0 text-blue-300" />
            <span>
              Haz clic en dos personas para conectarlas. <br />
              <span className="opacity-60">Esc para cancelar.</span>
            </span>
          </div>
        )}
      </div>

      {/* --- 2. ETIQUETAS DE FONDO --- */}
      <div className="absolute inset-0 pointer-events-none p-10 z-0">
        <span className="absolute top-12 left-12 text-emerald-900/30 text-5xl font-black uppercase tracking-widest select-none">
          Familia
        </span>
        <span className="absolute top-12 right-12 text-amber-900/30 text-5xl font-black uppercase tracking-widest select-none">
          Amigos
        </span>
        <span className="absolute bottom-12 left-12 text-blue-900/30 text-5xl font-black uppercase tracking-widest select-none">
          Laboral
        </span>
        <span className="absolute bottom-12 right-12 text-purple-900/30 text-5xl font-black uppercase tracking-widest select-none">
          Comunidad
        </span>
      </div>

      {/* --- 3. ESTRUCTURA SVG DE FONDO --- */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
        <circle
          cx="50%"
          cy="50%"
          r="150"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="2.5"
        />
        <circle
          cx="50%"
          cy="50%"
          r="280"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="2.5"
        />
        <circle
          cx="50%"
          cy="50%"
          r="420"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="3"
        />
      </svg>

      {/* --- 4. AREA DE JUEGO (NODOS Y CONEXIONES) --- */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0 z-10">
        {/* SVG PARA LÍNEAS DE CONEXIÓN */}
        <svg
          className="absolute overflow-visible -top-[9999px] -left-[9999px] w-[19999px] h-[19999px] pointer-events-none"
          style={{ left: 0, top: 0 }}
        >
          {/* Línea temporal cuando se está arrastrando para conectar */}
          {isConnecting && sourceId && (
            <line
              x1={sourcePos.x}
              y1={sourcePos.y}
              x2={mousePos.x}
              y2={mousePos.y}
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5 5"
              className="opacity-60 animate-pulse"
            />
          )}

          {/* Líneas existentes entre nodos */}
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
                {/* 1. Línea invisible ancha para facilitar el click */}
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="transparent"
                  strokeWidth="20"
                />

                {/* 2. Línea visible (con fallback de color hexadecimal para la exportación) */}
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="#94a3b8"
                  className="stroke-slate-400 stroke-[2px] transition-colors duration-300 group-hover:stroke-red-400"
                />

                {/* 3. Icono de basura (Excluido de la exportación para evitar errores de renderizado) */}
                <foreignObject
                  x={midX - 12}
                  y={midY - 12}
                  width={24}
                  height={24}
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

        {/* NODO CENTRAL */}
        <div
          onClick={() => handleNodeClick("center")}
          className={`
            absolute -translate-x-1/2 -translate-y-1/2 z-30 
            w-24 h-24 rounded-full bg-slate-800 text-white flex flex-col items-center justify-center 
            shadow-xl cursor-pointer transition-all duration-300 border-4 border-white ring-1 ring-slate-200
            
            {/* AQUÍ ESTÁ EL CAMBIO: Se quitó 'hover:scale-105' del final */}
            ${
              isConnecting && sourceId === "center"
                ? "ring-4 ring-blue-400 scale-105"
                : ""
            }
          `}
        >
          <User size={32} className="mb-1 text-slate-200" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
            Usuario
          </span>
        </div>

        {/* NODOS PERSONAS */}
        {nodes.map((node) => (
          <DraggableNode
            key={node.id}
            node={node}
            onDrag={onNodeDrag}
            onDelete={() => deleteNode(node.id)}
            onChangeName={(val: string) => updateNodeName(node.id, val)}
            onClick={() => handleNodeClick(node.id)}
            isTarget={isConnecting && sourceId === node.id}
            isSelected={sourceId === node.id}
          />
        ))}
      </div>

      {/* --- 5. MODAL NUEVO INTEGRANTE --- */}
      {isModalOpen && (
        <div className="exclude-from-export fixed inset-0 z-100 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
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
              {/* Input Nombre */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Nombre
                </label>
                <input
                  autoFocus
                  type="text"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  placeholder="Ej: María, Juan, Jefe..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
                />
              </div>

              {/* Selector de Tipo (Cuadrante) */}
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

              {/* Botón Acción */}
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
