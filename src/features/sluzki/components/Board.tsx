"use client";

import React, { useState, useRef } from "react";
import { Plus, Link as LinkIcon, Download, Info, ChevronRight, List, Trash2, User, X, RotateCcw, BookOpen } from "lucide-react";
import { useSluzkiBoard } from "@/features/sluzki/hooks/useSluzkiBoard";
import { DraggableNode } from "@/features/sluzki/components/DraggableNode";
import { AddNodeModal } from "@/features/sluzki/components/AddNodeModal"; // Importamos el nuevo modal
import { THEME, LEVELS } from "@/features/sluzki/utils/constants";

export default function SluzkiBoard() {
  const diagramRef = useRef<HTMLDivElement>(null);

  const {
    containerRef, nodes, edges, centerName, setCenterName,
    isConnecting, setIsConnecting, sourceId, setSourceId, mousePos,
    addNode, deleteNode, deleteEdge, updateNodeName, onNodeDrag, 
    handleNodeClick, handleMouseMove, getNodePos, downloadImage,
    isLoaded, clearBoard, isExporting 
  } = useSluzkiBoard(diagramRef);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  
  const sourcePos = sourceId ? getNodePos(sourceId) : { x: 0, y: 0 };

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
      {/* ... (BARRA DE HERRAMIENTAS - Se mantiene igual) ... */}
      <div className="exclude-from-export absolute z-50 bottom-6 left-1/2 -translate-x-1/2 flex-row gap-4 lg:left-4 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2 lg:translate-x-0 lg:flex-col lg:gap-2 pointer-events-none transition-all duration-300">
        <div className="bg-white/95 backdrop-blur-sm p-2 rounded-2xl shadow-xl border border-slate-200 pointer-events-auto flex flex-row gap-3 items-center lg:flex-col lg:gap-2">
          
          <button onClick={() => setIsModalOpen(true)} className="p-3 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95" title="Agregar Nodo"><Plus size={22} /></button>
          
          <div className="w-px h-8 bg-slate-200 lg:w-8 lg:h-px"></div>
          
          <button onClick={() => { setIsConnecting(!isConnecting); setSourceId(null); }} className={`p-3 rounded-xl transition-all border ${isConnecting ? "bg-blue-600 border-blue-600 text-white shadow-md animate-pulse" : "bg-white border-transparent text-slate-500 hover:bg-slate-50"}`} title="Conectar"><LinkIcon size={22} /></button>
          
          <button onClick={() => setShowLegend(!showLegend)} className={`p-3 rounded-xl transition-all border ${showLegend ? "bg-slate-100 text-slate-900" : "bg-white border-transparent text-slate-500 hover:bg-slate-50"}`} title="Ver Leyenda"><BookOpen size={22} /></button>

          <button onClick={downloadImage} disabled={isExporting} className="p-3 bg-white border border-transparent text-slate-500 rounded-xl hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50" title="Descargar"><Download size={22} /></button>
          
          <div className="w-px h-8 bg-slate-200 lg:w-8 lg:h-px"></div>
          
          <button onClick={clearBoard} className="p-3 bg-white border border-transparent text-red-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all active:scale-95" title="Limpiar"><RotateCcw size={22} /></button>
        </div>
      </div>

      {/* ... (LEYENDA - Se mantiene igual) ... */}
      {showLegend && nodes.length > 0 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-64 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border border-slate-200 p-4 pointer-events-none sm:pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
            <BookOpen size={16} className="text-blue-500" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Referencias</h3>
          </div>
          <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
            {nodes.map((node, index) => {
              const style = THEME[node.type];
              return (
                <li key={node.id} className="flex items-start gap-3">
                  <span className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold border shadow-sm ${style.bg} ${style.border} ${style.text}`}>{index + 1}</span>
                  <span className="text-sm font-medium text-slate-700 leading-snug pt-0.5 wrap-break-word w-full">{node.name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ... (SIDEBAR EDITABLE - Se mantiene igual, solo asegúrate de que use las props correctas) ... */}
      <div id="sluzki-sidebar" className={`exclude-from-export absolute z-40 right-0 top-0 bottom-0 w-full sm:w-80 md:w-96 bg-white/95 backdrop-blur border-l border-slate-200 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isListOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={() => setIsListOpen(!isListOpen)} className="absolute -left-10 top-20 p-2.5 bg-white border border-slate-200 rounded-l-xl shadow-sm text-slate-500 hover:text-slate-900 z-50 flex items-center justify-center">
            {isListOpen ? <ChevronRight size={20} /> : <List size={20} />}
        </button>

        <div className="flex justify-between items-center p-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2"><List size={16} /> Editar Red</h2>
            <button onClick={() => setIsListOpen(false)} className="md:hidden p-1 text-slate-400"><X size={20}/></button>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 m-3 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1"><User size={10} /> Usuario Central</div>
          <input type="text" value={centerName} onChange={(e) => setCenterName(e.target.value)} className="w-full text-base font-bold bg-transparent border-b border-slate-300 focus:border-blue-500 p-1 focus:outline-none text-slate-800" placeholder="Nombre..." />
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {nodes.length === 0 && <div className="text-center text-slate-400 text-sm py-10 opacity-60">Sin Nodos.</div>}
          {nodes.map((node, index) => {
            const style = THEME[node.type];
            return (
              <div key={node.id} className="group flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all bg-white">
                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border ${style.bg} ${style.border} ${style.text} font-bold text-sm`}>{index + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-0.5"><style.icon size={10} /> {style.label}</div>
                    <span className="text-[9px] font-medium px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full">Nivel {node.level}</span>
                  </div>
                  <input type="text" value={node.name} onChange={(e) => updateNodeName(node.id, e.target.value)} className="w-full text-sm font-medium bg-transparent border-none p-0 focus:ring-0 text-slate-700" />
                </div>
                <button onClick={() => deleteNode(node.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ... (FONDO Y LÍNEAS - Se mantienen igual) ... */}
      <div 
        ref={diagramRef}
        className="pointer-events-none absolute w-full max-w-[85vmin] aspect-square flex items-center justify-center opacity-50"
      >
        <div className="absolute inset-0 z-0 font-black uppercase tracking-widest select-none">
            <span className="absolute top-2 left-2 text-sm md:text-2xl text-emerald-900/80">Familia</span>
            <span className="absolute top-2 right-2 text-sm md:text-2xl text-amber-900/80 text-right">Amigos</span>
            <span className="absolute bottom-2 left-2 text-sm md:text-2xl text-blue-900/80">Laboral</span>
            <span className="absolute bottom-2 right-2 text-sm md:text-2xl text-purple-900/80 text-right">Comunidad</span>
        </div>
        
        <svg className="absolute inset-0 w-full h-full z-0 overflow-visible" viewBox="0 0 1000 1000">
          <line x1="0" y1="500" x2="1000" y2="500" stroke="#475569" strokeWidth="2" strokeDasharray="8 8" />
          <line x1="500" y1="0" x2="500" y2="1000" stroke="#475569" strokeWidth="2" strokeDasharray="8 8" />
          <circle cx="500" cy="500" r={LEVELS[1].boundary} fill="none" stroke="#475569" strokeWidth="2" />
          <text x="505" y={500 - LEVELS[1].boundary + 20} className="fill-slate-400 text-[10px] font-bold uppercase">Nivel 1</text>
          <circle cx="500" cy="500" r={LEVELS[2].boundary} fill="none" stroke="#475569" strokeWidth="2" />
          <text x="505" y={500 - LEVELS[2].boundary + 20} className="fill-slate-400 text-[10px] font-bold uppercase">Nivel 2</text>
          <circle cx="500" cy="500" r={LEVELS[3].boundary} fill="none" stroke="#475569" strokeWidth="2" />
          <text x="505" y={500 - LEVELS[3].boundary + 20} className="fill-slate-400 text-[10px] font-bold uppercase">Nivel 3</text>
        </svg>
      </div>

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
                <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#94a3b8" className="stroke-slate-600 stroke-[2px] transition-colors duration-300 group-hover:stroke-red-400 group-hover:stroke-[3px]" />
                
                {!isExporting && (
                  <foreignObject x={midX - 12} y={midY - 12} width={24} height={24} className="overflow-visible pointer-events-none exclude-from-export">
                    <div className="w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-125 md:scale-100">
                      <div className="bg-white text-red-500 rounded-full shadow-md border border-red-100 p-1 hover:bg-red-50"><Trash2 size={12} /></div>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>

        <div onClick={() => handleNodeClick("center")} title={centerName} 
          className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 
            w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-900 text-white flex flex-col items-center justify-center shadow-2xl cursor-pointer 
            transition-all duration-300 border-4 border-white ring-1 ring-slate-200 hover:scale-105 active:scale-95 
            ${isConnecting && sourceId === "center" ? "ring-4 ring-blue-400 scale-105" : ""}`}
        >
          <span className="text-[10px] md:text-xs font-bold text-center leading-tight px-1 overflow-hidden text-ellipsis line-clamp-2 max-w-full">
            {centerName || "Usuario"}
          </span>
        </div>

        {nodes.map((node, index) => (
          <DraggableNode 
            key={node.id} 
            node={node} 
            displayNumber={index + 1} 
            onDrag={onNodeDrag} 
            onClick={() => handleNodeClick(node.id)} 
            isTarget={isConnecting && sourceId === node.id} 
            isSelected={sourceId === node.id} 
          />
        ))}
      </div>

      {isConnecting && (
        <div className="exclude-from-export absolute top-20 md:bottom-8 md:top-auto bg-slate-900/90 backdrop-blur text-white px-6 py-3 rounded-full shadow-2xl text-sm font-medium flex gap-3 items-center pointer-events-none animate-in fade-in slide-in-from-top-4 md:slide-in-from-bottom-4 z-50 border border-white/10">
          <Info size={18} className="text-blue-400 animate-pulse" /> <span>Toca otro nodo para conectar</span>
        </div>
      )}

      {/* MODAL USANDO EL NUEVO COMPONENTE CONTROLADO POR HOOK FORM */}
      <AddNodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => addNode(data.name, data.type, data.level)}
      />
    </div>
  );
}