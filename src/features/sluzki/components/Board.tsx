"use client";

import React, { useState, useRef } from "react";
import { Info, Trash2 } from "lucide-react"; // Trash2 aun se usa en las conexiones manuales si no extraes esa capa, o si decides dejarla aqui por simplicidad temporal.
import { useSluzkiBoard } from "@/features/sluzki/hooks/useSluzkiBoard"; //
import { DraggableNode } from "@/features/sluzki/components/DraggableNode"; //
import { AddNodeModal } from "@/features/sluzki/components/AddNodeModal"; //

// Nuevos componentes importados
import { BoardBackground } from "./BoardBackground";
import { BoardToolbar } from "./BoardToolbar";
import { EditSidebar } from "./EditSidebar";
import { THEME } from "../utils/constants"; // Necesario si la leyenda sigue inline o se mueve a otro componente
import { BookOpen } from "lucide-react"; // Para la leyenda inline

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
      className={`w-full h-full relative bg-slate-50 font-sans flex items-center justify-center overflow-hidden ${isConnecting ? "cursor-crosshair" : ""}`}
    >
      {/* 1. Fondo modularizado */}
      <div ref={diagramRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <BoardBackground />
      </div>

      {/* 2. Barra de Herramientas modularizada */}
      <BoardToolbar 
        onOpenModal={() => setIsModalOpen(true)}
        onToggleConnect={() => { setIsConnecting(!isConnecting); setSourceId(null); }}
        isConnecting={isConnecting}
        onToggleLegend={() => setShowLegend(!showLegend)}
        showLegend={showLegend}
        onDownload={downloadImage}
        isExporting={isExporting}
        onClear={clearBoard}
      />

      {/* 3. Leyenda (Podrías extraerla a BoardLegend.tsx si quisieras pulir más) */}
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

      {/* 4. Sidebar de Edición modularizado */}
      <EditSidebar 
        isOpen={isListOpen} 
        toggle={() => setIsListOpen(!isListOpen)}
        nodes={nodes} 
        centerName={centerName} 
        setCenterName={setCenterName}
        updateNodeName={updateNodeName} 
        deleteNode={deleteNode}
      />

      {/* 5. Capa de Nodos y Conexiones (Canvas interactivo) */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0 z-10 overflow-visible">
        {/* Conexiones SVG */}
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

        {/* Nodo Central */}
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

        {/* Nodos Arrastrables */}
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

      <AddNodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => addNode(data.name, data.type, data.level)}
      />
    </div>
  );
}