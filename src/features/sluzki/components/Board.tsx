"use client";

import React, { useState } from "react";
import { Plus, Link as LinkIcon, Download, Info, ChevronRight, List, Trash2, User, Check } from "lucide-react";
import { useSluzkiBoard } from "@/features/sluzki/hooks/useSluzkiBoard";
import { DraggableNode } from "@/features/sluzki/components/DraggableNode";
import { Modal } from "@/components/ui/Modal";
import { THEME, getInitials } from "@/features/sluzki/utils/constants";
import { NodeType } from "@/features/sluzki/types";

export default function SluzkiBoard() {
  const {
    containerRef, nodes, edges, centerName, setCenterName,
    isConnecting, setIsConnecting, sourceId, setSourceId, mousePos,
    addNode, deleteNode, deleteEdge, updateNodeName, onNodeDrag, 
    handleNodeClick, handleMouseMove, getNodePos, downloadImage
  } = useSluzkiBoard();

  // Estado UI Local (Solo para visualización)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(true);
  const [modalName, setModalName] = useState("");
  const [modalType, setModalType] = useState<NodeType>("family");

  const handleAddSubmit = () => {
    addNode(modalName, modalType);
    setModalName("");
    setModalType("family");
    setIsModalOpen(false);
    setIsListOpen(true);
  };

  const sourcePos = sourceId ? getNodePos(sourceId) : { x: 0, y: 0 };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`w-full h-full relative bg-slate-50 font-sans flex items-center justify-center overflow-hidden ${isConnecting ? "cursor-crosshair" : ""}`}
    >
      {/* --- BARRA DE HERRAMIENTAS IZQUIERDA --- */}
      <div className="exclude-from-export absolute z-50 left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-sm p-2 rounded-xl shadow-xl border border-slate-200 pointer-events-auto flex flex-col gap-2">
          <button onClick={() => setIsModalOpen(true)} className="p-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all active:scale-95" title="Agregar Nodo">
            <Plus size={20} />
          </button>
          <div className="w-full h-px bg-slate-100 mx-1"></div>
          <button onClick={() => { setIsConnecting(!isConnecting); setSourceId(null); }} className={`p-2.5 rounded-lg transition-all border ${isConnecting ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-transparent text-slate-500 hover:bg-slate-50"}`} title="Conectar nodos">
            <LinkIcon size={20} />
          </button>
          <button onClick={downloadImage} className="p-2.5 bg-white border border-transparent text-slate-500 rounded-lg hover:bg-slate-50 transition-all active:scale-95" title="Descargar PNG">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* --- BARRA LATERAL DERECHA (LISTA) --- */}
      <div className={`exclude-from-export absolute z-40 right-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur border-l border-slate-200 shadow-2xl transition-transform duration-300 flex flex-col ${isListOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={() => setIsListOpen(!isListOpen)} className="absolute -left-10 top-4 p-2 bg-white border border-slate-200 rounded-l-xl shadow-md text-slate-500 hover:text-slate-900 z-50">
          {isListOpen ? <ChevronRight size={20} /> : <List size={20} />}
        </button>

        {/* Edición Usuario Central */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 m-2">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1"><User size={10} /> Usuario Principal</div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-slate-800 text-white font-bold text-xs">{getInitials(centerName)}</div>
            <input type="text" value={centerName} onChange={(e) => setCenterName(e.target.value)} className="w-full text-sm font-bold bg-transparent border-b border-slate-300 focus:border-blue-500 p-1 focus:outline-none" />
          </div>
        </div>

        {/* Lista de Nodos */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {nodes.map((node) => {
            const style = THEME[node.type];
            return (
              <div key={node.id} className="group flex items-center gap-3 p-2 rounded-xl border border-slate-100 hover:border-blue-200 bg-white">
                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border-2 ${style.bg} ${style.border} ${style.text} font-bold text-xs`}>{getInitials(node.name)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1"><style.icon size={10} /> {style.label}</div>
                  <input type="text" value={node.name} onChange={(e) => updateNodeName(node.id, e.target.value)} className="w-full text-sm font-medium bg-transparent border-none p-0 focus:ring-0" />
                </div>
                <button onClick={() => deleteNode(node.id)} className="p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- FONDO Y CUADRANTES --- */}
      <div className="pointer-events-none absolute w-full max-w-[90vmin] aspect-square flex items-center justify-center opacity-60">
        <div className="absolute inset-0 z-0 text-3xl font-black uppercase tracking-widest select-none">
            <span className="absolute top-8 left-8 text-emerald-900/50">Familia</span>
            <span className="absolute top-8 right-8 text-amber-900/50 text-right">Amigos</span>
            <span className="absolute bottom-8 left-8 text-blue-900/50">Laboral</span>
            <span className="absolute bottom-8 right-8 text-purple-900/50 text-right">Comunidad</span>
        </div>
        <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 1000 1000">
          <line x1="0" y1="500" x2="1000" y2="500" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 8" />
          <line x1="500" y1="0" x2="500" y2="1000" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 8" />
          <circle cx="500" cy="500" r="150" fill="none" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="500" cy="500" r="300" fill="none" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="500" cy="500" r="450" fill="none" stroke="#cbd5e1" strokeWidth="2" />
        </svg>
      </div>

      {/* --- ÁREA DE JUEGO (CANVAS) --- */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0 z-10 overflow-visible">
        {/* LÍNEAS DE CONEXIÓN */}
        <svg className="absolute overflow-visible -top-[9999px] -left-[9999px] w-[19999px] h-[19999px] pointer-events-none" style={{ left: 0, top: 0 }}>
          {isConnecting && sourceId && (
            <line x1={sourcePos.x} y1={sourcePos.y} x2={mousePos.x} y2={mousePos.y} stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5" className="opacity-60 animate-pulse" />
          )}
          {edges.map((edge) => {
            const start = getNodePos(edge.from);
            const end = getNodePos(edge.to);
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            return (
              <g key={edge.id} className="pointer-events-auto cursor-pointer group" onClick={(e) => { e.stopPropagation(); deleteEdge(edge.id); }}>
                <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="transparent" strokeWidth="20" />
                <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#94a3b8" className="stroke-slate-400 stroke-[2px] transition-colors duration-300 group-hover:stroke-red-400" />
                <foreignObject x={midX - 12} y={midY - 12} width={24} height={24} className="overflow-visible pointer-events-none exclude-from-export">
                  <div className="w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
                    <div className="bg-white text-red-500 rounded-full shadow-md border border-red-100 p-1"><Trash2 size={12} /></div>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        {/* NODO CENTRAL */}
        <div onClick={() => handleNodeClick("center")} title={centerName} className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-800 text-white flex flex-col items-center justify-center shadow-xl cursor-pointer transition-all duration-300 border-4 border-white ring-1 ring-slate-200 ${isConnecting && sourceId === "center" ? "ring-4 ring-blue-400 scale-105" : ""}`}>
          <User size={24} className="mb-1 text-slate-200 opacity-80" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-100 max-w-[90%] truncate px-1">{centerName.length > 3 ? getInitials(centerName) : centerName}</span>
        </div>

        {/* NODOS DRAGGABLE */}
        {nodes.map((node) => (
          <DraggableNode key={node.id} node={node} onDrag={onNodeDrag} onClick={() => handleNodeClick(node.id)} isTarget={isConnecting && sourceId === node.id} isSelected={sourceId === node.id} />
        ))}
      </div>

      {isConnecting && (
        <div className="exclude-from-export absolute bottom-8 bg-slate-800 text-white px-4 py-2 rounded-full shadow-lg text-xs flex gap-2 items-center pointer-events-none animate-in fade-in slide-in-from-bottom-4">
          <Info size={14} className="text-blue-300" /> <span>Selecciona dos nodos para conectarlos</span>
        </div>
      )}

      {/* --- MODAL NUEVO INTEGRANTE (USANDO EL MODAL GENÉRICO) --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Integrante">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre Completo</label>
            <input autoFocus type="text" value={modalName} onChange={(e) => setModalName(e.target.value)} placeholder="Ej: María Pérez" className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" onKeyDown={(e) => e.key === "Enter" && handleAddSubmit()} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cuadrante / Relación</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(THEME).map(([key, style]) => {
                const isSelected = modalType === key;
                const Icon = style.icon;
                return (
                  <button key={key} onClick={() => setModalType(key as NodeType)} className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left ${isSelected ? `${style.bg} ${style.border} ${style.text} ring-1 ring-offset-1 ring-transparent` : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isSelected ? "bg-white/50" : style.bg}`}><Icon size={12} className={isSelected ? style.text : ""} /></div>
                    <span className="text-xs font-bold">{style.label}</span>
                    {isSelected && <Check size={14} className="ml-auto opacity-60" />}
                  </button>
                );
              })}
            </div>
          </div>
          <button onClick={handleAddSubmit} disabled={!modalName.trim()} className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/5 mt-4 flex items-center justify-center gap-2 transition-all ${!modalName.trim() ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02] active:scale-95"}`}>
            <Plus size={18} strokeWidth={3} /> Agregar al Mapa
          </button>
        </div>
      </Modal>
    </div>
  );
}