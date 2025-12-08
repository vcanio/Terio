"use client";

import React, { useState } from "react";
import { Plus, Link as LinkIcon, Download, Info, ChevronRight, List, Trash2, User, Check, X, RotateCcw, MousePointerClick } from "lucide-react";
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
    handleNodeClick, handleMouseMove, getNodePos, downloadImage,
    isLoaded, clearBoard
  } = useSluzkiBoard();

  // Estado UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
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

  // Evitar renderizado hasta que cargue localStorage
  if (!isLoaded) return <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400">Cargando mapa...</div>;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`
        w-full h-full relative bg-slate-50 font-sans flex items-center justify-center overflow-hidden 
        ${isConnecting ? "cursor-crosshair" : ""}
      `}
    >
      {/* --- BARRA DE HERRAMIENTAS (Se excluye de la foto) --- */}
      <div className="exclude-from-export absolute z-50 
        bottom-6 left-1/2 -translate-x-1/2 flex-row gap-4
        md:left-4 md:top-1/2 md:bottom-auto md:-translate-y-1/2 md:translate-x-0 md:flex-col md:gap-2
        pointer-events-none transition-all duration-300"
      >
        <div className="bg-white/95 backdrop-blur-sm p-2 rounded-2xl shadow-xl border border-slate-200 pointer-events-auto flex 
          flex-row gap-3 items-center md:flex-col md:gap-2"
        >
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="p-3 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center" 
            title="Agregar Nodo"
          >
            <Plus size={22} />
          </button>
          
          <div className="w-px h-8 bg-slate-200 md:w-8 md:h-px"></div>
          
          <button 
            onClick={() => { setIsConnecting(!isConnecting); setSourceId(null); }} 
            className={`p-3 rounded-xl transition-all border
              ${isConnecting 
                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20 animate-pulse" 
                : "bg-white border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`} 
            title={isConnecting ? "Modo conexión activo" : "Conectar nodos"}
          >
            <LinkIcon size={22} />
          </button>

          <button 
            onClick={downloadImage} 
            className="p-3 bg-white border border-transparent text-slate-500 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95" 
            title="Descargar imagen"
          >
            <Download size={22} />
          </button>

          <div className="w-px h-8 bg-slate-200 md:w-8 md:h-px"></div>

          <button 
            onClick={clearBoard} 
            className="p-3 bg-white border border-transparent text-red-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all active:scale-95" 
            title="Limpiar mapa"
          >
            <RotateCcw size={22} />
          </button>
        </div>
      </div>

      {/* --- SIDEBAR / LISTADO DE NODOS --- */}
      {/* IMPORTANTE: id="sluzki-sidebar" permite que el hook lo encuentre para abrirlo en la foto */}
      <div 
        id="sluzki-sidebar"
        className={`absolute z-40 right-0 top-0 bottom-0 w-full sm:w-80 md:w-96 bg-white/95 backdrop-blur border-l border-slate-200 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isListOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* El botón toggle se excluye de la exportación */}
        <button onClick={() => setIsListOpen(!isListOpen)} className="exclude-from-export absolute -left-10 top-4 p-2.5 bg-white border border-slate-200 rounded-l-xl shadow-sm text-slate-500 hover:text-slate-900 z-50 flex items-center justify-center">
            {isListOpen ? <ChevronRight size={20} /> : <List size={20} />}
        </button>

        <div className="flex justify-between items-center p-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2"><List size={16} /> Red de Apoyo ({nodes.length})</h2>
            {/* El botón cerrar móvil se excluye de la exportación */}
            <button onClick={() => setIsListOpen(false)} className="exclude-from-export md:hidden p-1 text-slate-400"><X size={20}/></button>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 m-3 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1"><User size={10} /> Usuario Principal</div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-slate-800 text-white font-bold text-sm shadow-md ring-2 ring-white">{getInitials(centerName)}</div>
            <input type="text" value={centerName} onChange={(e) => setCenterName(e.target.value)} className="w-full text-base font-bold bg-transparent border-b border-slate-300 focus:border-blue-500 p-1 focus:outline-none transition-colors text-slate-800" placeholder="Nombre..." />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {nodes.length === 0 && <div className="text-center text-slate-400 text-sm py-10 opacity-60">Sin nodos aún.</div>}
          {nodes.map((node) => {
            const style = THEME[node.type];
            return (
              <div key={node.id} className="group flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all bg-white">
                <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center border-2 ${style.bg} ${style.border} ${style.text} font-bold text-xs`}>{getInitials(node.name)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-0.5"><style.icon size={10} /> {style.label}</div>
                  <input type="text" value={node.name} onChange={(e) => updateNodeName(node.id, e.target.value)} className="w-full text-sm font-medium bg-transparent border-none p-0 focus:ring-0 text-slate-700 placeholder:text-slate-300" />
                </div>
                {/* Botón borrar nodo se excluye de la exportación */}
                <button onClick={() => deleteNode(node.id)} className="exclude-from-export p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- FONDO --- */}
      <div className="pointer-events-none absolute w-full max-w-[95vmin] aspect-square flex items-center justify-center opacity-50">
        <div className="absolute inset-0 z-0 font-black uppercase tracking-widest select-none">
            <span className="absolute top-6 left-6 text-sm md:text-3xl text-emerald-900/40">Familia</span>
            <span className="absolute top-6 right-6 text-sm md:text-3xl text-amber-900/40 text-right">Amigos</span>
            <span className="absolute bottom-6 left-6 text-sm md:text-3xl text-blue-900/40">Laboral</span>
            <span className="absolute bottom-6 right-6 text-sm md:text-3xl text-purple-900/40 text-right">Comunidad</span>
        </div>
        <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 1000 1000">
          <line x1="0" y1="500" x2="1000" y2="500" stroke="#64748b" strokeWidth="2" strokeDasharray="12 12" />
          <line x1="500" y1="0" x2="500" y2="1000" stroke="#64748b" strokeWidth="2" strokeDasharray="12 12" />
          <circle cx="500" cy="500" r="150" fill="none" stroke="#64748b" strokeWidth="2" />
          <circle cx="500" cy="500" r="300" fill="none" stroke="#64748b" strokeWidth="2" />
          <circle cx="500" cy="500" r="450" fill="none" stroke="#64748b" strokeWidth="2" />
        </svg>
      </div>

      {/* --- EMPTY STATE --- */}
      {nodes.length === 0 && (
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-24 text-center opacity-40 animate-in fade-in zoom-in duration-700">
            <MousePointerClick className="w-12 h-12 mx-auto mb-2 text-slate-400" />
            <p className="text-slate-500 font-medium">Usa el botón <span className="font-bold text-slate-700 mx-1">+</span> para agregar nodos</p>
        </div>
      )}

      {/* --- ÁREA DE JUEGO --- */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0 z-10 overflow-visible">
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
                <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="transparent" strokeWidth="30" />
                <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#94a3b8" className="stroke-slate-400 stroke-[2px] transition-colors duration-300 group-hover:stroke-red-400 group-hover:stroke-[3px]" />
                
                {/* TACHO DE BASURA: Tiene 'exclude-from-export', el hook lo borrará a la fuerza en el onClone */}
                <foreignObject x={midX - 12} y={midY - 12} width={24} height={24} className="overflow-visible pointer-events-none exclude-from-export">
                  <div className="w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-125 md:scale-100">
                    <div className="bg-white text-red-500 rounded-full shadow-md border border-red-100 p-1 hover:bg-red-50"><Trash2 size={12} /></div>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        {/* NODO CENTRAL */}
        <div onClick={() => handleNodeClick("center")} title={centerName} className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-900 text-white flex flex-col items-center justify-center shadow-2xl cursor-pointer transition-all duration-300 border-4 border-white ring-1 ring-slate-200 hover:scale-105 active:scale-95 ${isConnecting && sourceId === "center" ? "ring-4 ring-blue-400 scale-105" : ""}`}>
          <User size={24} className="mb-1 text-slate-200 opacity-80" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-100 max-w-[90%] truncate px-1">{centerName.length > 3 ? getInitials(centerName) : centerName}</span>
        </div>

        {/* NODOS */}
        {nodes.map((node) => (
          <DraggableNode key={node.id} node={node} onDrag={onNodeDrag} onClick={() => handleNodeClick(node.id)} isTarget={isConnecting && sourceId === node.id} isSelected={sourceId === node.id} />
        ))}
      </div>

      {isConnecting && (
        <div className="exclude-from-export absolute top-20 md:bottom-8 md:top-auto bg-slate-900/90 backdrop-blur text-white px-6 py-3 rounded-full shadow-2xl text-sm font-medium flex gap-3 items-center pointer-events-none animate-in fade-in slide-in-from-top-4 md:slide-in-from-bottom-4 z-50 border border-white/10">
          <Info size={18} className="text-blue-400 animate-pulse" /> <span>Toca otro nodo para conectar</span>
        </div>
      )}

      {/* --- MODAL --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Integrante">
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre Completo</label>
            <input autoFocus type="text" value={modalName} onChange={(e) => setModalName(e.target.value)} placeholder="Ej: María Pérez" className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" onKeyDown={(e) => e.key === "Enter" && handleAddSubmit()} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cuadrante / Relación</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(THEME).map(([key, style]) => {
                const isSelected = modalType === key;
                const Icon = style.icon;
                return (
                  <button key={key} onClick={() => setModalType(key as NodeType)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isSelected ? `${style.bg} ${style.border} ${style.text} ring-1 ring-offset-1 ring-transparent` : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSelected ? "bg-white/50" : style.bg}`}><Icon size={14} className={isSelected ? style.text : ""} /></div>
                    <span className="text-sm font-bold">{style.label}</span>
                    {isSelected && <Check size={16} className="ml-auto opacity-60" />}
                  </button>
                );
              })}
            </div>
          </div>
          <button onClick={handleAddSubmit} disabled={!modalName.trim()} className={`w-full py-4 rounded-xl font-bold text-sm shadow-xl shadow-blue-900/5 mt-2 flex items-center justify-center gap-2 transition-all ${!modalName.trim() ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02] active:scale-95"}`}>
            <Plus size={20} strokeWidth={2.5} /> Agregar al Mapa
          </button>
        </div>
      </Modal>
    </div>
  );
}