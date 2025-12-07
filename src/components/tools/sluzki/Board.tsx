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
          w-16 h-16 md:w-20 md:h-20 rounded-full flex flex-col items-center justify-center
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
            className={`w-14 md:w-16 bg-transparent text-center text-[10px] md:text-xs font-bold focus:outline-none ${style.text} placeholder-slate-400`}
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

  // --- AGREGAR NODO ---
  const handleAddMember = () => {
    if (!modalName.trim()) return;

    const id = Date.now().toString();
    // Ajustamos el radio inicial para que caiga visualmente dentro de los círculos nuevos
    const radius = 180; 

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
      {/* --- 1. BARRA DE HERRAMIENTAS --- */}
      <div 
        className="exclude-from-export absolute z-50 
          left-4 right-4 bottom-4 md:bottom-auto md:top-1/2 md:left-6 md:right-auto md:-translate-y-1/2 md:w-60
          flex flex-col gap-4 animate-in slide-in-from-bottom-4 md:slide-in-from-left-4 duration-500 select-none pointer-events-none"
      >
        <div className="bg-white/95 backdrop-blur-sm p-3 md:p-4 rounded-2xl shadow-xl border border-slate-200 pointer-events-auto">
          <h1 className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Herramientas
          </h1>

          <div className="flex gap-2 mb-0 md:mb-4">
            <button
              onClick={() => {
                setIsConnecting(!isConnecting);
                setSourceId(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all border
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
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="md:hidden p-2.5 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-95"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="hidden md:block w-full h-px bg-slate-100 mb-4"></div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden md:flex w-full py-3 bg-slate-900 text-white rounded-xl items-center justify-center gap-2 shadow-lg shadow-slate-200 hover:bg-slate-700 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="font-semibold text-sm leading-none">Agregar Nodo</span>
          </button>
        </div>

        {isConnecting && (
          <div className="bg-slate-800 text-white p-3 rounded-xl shadow-lg text-xs flex gap-3 items-center animate-in fade-in pointer-events-auto mx-auto md:mx-0 w-fit">
            <Info size={18} className="shrink-0 text-blue-300" />
            <span>
              Clic en dos nodos para conectar. <br />
              <span className="opacity-60">Esc para cancelar.</span>
            </span>
          </div>
        )}
      </div>

      {/* --- 2. CONTENEDOR VISUAL CUADRADO (FONDO Y ETIQUETAS) --- */}
      <div className="pointer-events-none absolute w-full max-w-[95vmin] aspect-square flex items-center justify-center">
        
        {/* ETIQUETAS DE TEXTO (Posicionadas en las esquinas, con fondo suave para evitar superposición visual) */}
        <div className="absolute inset-0 z-0 text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-widest select-none">
            {/* Usamos 'backdrop-blur' y un fondo muy sutil para que si una línea pasa por debajo, el texto se lea */}
            <span className="absolute top-4 left-4 text-emerald-900/40 bg-slate-50/50 backdrop-blur-[2px] px-2 rounded-lg">
                Familia
            </span>
            <span className="absolute top-4 right-4 text-amber-900/40 bg-slate-50/50 backdrop-blur-[2px] px-2 rounded-lg">
                Amigos
            </span>
            <span className="absolute bottom-4 left-4 text-blue-900/40 bg-slate-50/50 backdrop-blur-[2px] px-2 rounded-lg">
                Laboral
            </span>
            <span className="absolute bottom-4 right-4 text-purple-900/40 bg-slate-50/50 backdrop-blur-[2px] px-2 rounded-lg">
                Comunidad
            </span>
        </div>

        {/* SVG DE FONDO (Circulos reducidos para no tocar las esquinas) */}
        <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 1000 1000">
          {/* Líneas Cruzadas */}
          <line
            x1="0" y1="500" x2="1000" y2="500"
            stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 8"
          />
          <line
            x1="500" y1="0" x2="500" y2="1000"
            stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 8"
          />
          
          {/* Círculos Concéntricos - RADIO REDUCIDO para dejar esquinas libres */}
          {/* Antes r=450 (90% del espacio), ahora r=380 (76% del espacio) */}
          <circle cx="500" cy="500" r="130" fill="none" stroke="#cbd5e1" strokeWidth="3" />
          <circle cx="500" cy="500" r="260" fill="none" stroke="#cbd5e1" strokeWidth="3" />
          <circle cx="500" cy="500" r="390" fill="none" stroke="#cbd5e1" strokeWidth="4" />
        </svg>
      </div>

      {/* --- 3. ÁREA DE JUEGO (NODOS Y CONEXIONES) --- */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0 z-10 overflow-visible">
        {/* SVG PARA LÍNEAS DE CONEXIÓN */}
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
                <line
                  x1={start.x} y1={start.y}
                  x2={end.x} y2={end.y}
                  stroke="transparent" strokeWidth="20"
                />
                <line
                  x1={start.x} y1={start.y}
                  x2={end.x} y2={end.y}
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

        {/* NODO CENTRAL */}
        <div
          onClick={() => handleNodeClick("center")}
          className={`
            absolute -translate-x-1/2 -translate-y-1/2 z-30 
            w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-800 text-white flex flex-col items-center justify-center 
            shadow-xl cursor-pointer transition-all duration-300 border-4 border-white ring-1 ring-slate-200
            ${isConnecting && sourceId === "center" ? "ring-4 ring-blue-400 scale-105" : ""}
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
                  Nombre
                </label>
                <input
                  autoFocus
                  type="text"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  placeholder="Ej: María, Juan..."
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