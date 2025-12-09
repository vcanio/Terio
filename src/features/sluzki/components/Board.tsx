"use client";

import React, { useState, useRef } from "react";
import { Info, BookOpen } from "lucide-react";
import { useSluzkiBoard } from "@/features/sluzki/hooks/useSluzkiBoard";
import { useSluzkiStore } from "@/features/sluzki/store/useSluzkiStore";
import { THEME } from "@/features/sluzki/utils/constants";

// Componentes modulares
import { DraggableNode } from "@/features/sluzki/components/DraggableNode";
import { AddNodeModal } from "@/features/sluzki/components/AddNodeModal";
import { BoardBackground } from "@/features/sluzki/components/BoardBackground";
import { BoardToolbar } from "@/features/sluzki/components/BoardToolbar";
import { EditSidebar } from "@/features/sluzki/components/EditSidebar";
import { ConnectionLayer } from "@/features/sluzki/components/ConnectionLayer";

export default function SluzkiBoard() {
  const diagramRef = useRef<HTMLDivElement>(null);
  
  // Estado global para el zoom
  const { nodeScale, setNodeScale } = useSluzkiStore();

  // Hook principal de lógica
  const {
    containerRef, nodes, edges, centerName, setCenterName,
    isConnecting, setIsConnecting, sourceId, setSourceId, mousePos,
    addNode, deleteNode, deleteEdge, updateNodeName, onNodeDrag, 
    handleNodeClick, handleMouseMove, getNodePos, downloadImage,
    isLoaded, clearBoard, isExporting 
  } = useSluzkiBoard(diagramRef);

  // Estados locales de UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  
  const sourcePos = sourceId ? getNodePos(sourceId) : { x: 0, y: 0 };

  // Manejador de Zoom
  const handleNodeScale = (delta: number) => {
    const newScale = Math.min(Math.max(nodeScale + delta, 0.4), 1.5); 
    setNodeScale(newScale);
  };

  if (!isLoaded) return <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400">Cargando mapa...</div>;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onWheel={(e) => handleNodeScale(e.deltaY > 0 ? -0.1 : 0.1)}
      className={`
        w-full h-full relative bg-slate-50 font-sans flex items-center justify-center overflow-hidden 
        ${isConnecting ? "cursor-crosshair" : ""}
      `}
    >
      {/* 1. Barra de Herramientas Modularizada */}
      <BoardToolbar 
        onOpenModal={() => setIsModalOpen(true)}
        onToggleConnect={() => { setIsConnecting(!isConnecting); setSourceId(null); }}
        isConnecting={isConnecting}
        onToggleLegend={() => setShowLegend(!showLegend)}
        showLegend={showLegend}
        onDownload={downloadImage}
        isExporting={isExporting}
        onClear={clearBoard}
        onZoomIn={() => handleNodeScale(0.1)}
        onZoomOut={() => handleNodeScale(-0.1)}
        currentScale={nodeScale}
      />

      {/* 2. Leyenda Flotante */}
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

      {/* 3. Sidebar de Edición */}
      <EditSidebar 
        isOpen={isListOpen}
        toggle={() => setIsListOpen(!isListOpen)}
        nodes={nodes}
        centerName={centerName}
        setCenterName={setCenterName}
        updateNodeName={updateNodeName}
        deleteNode={deleteNode}
      />

      {/* 4. Fondo del Tablero (Círculos concéntricos) */}
      <div ref={diagramRef} className="pointer-events-none absolute w-full max-w-[85vmin] aspect-square flex items-center justify-center opacity-50">
        <BoardBackground />
      </div>

      {/* 5. Área Interactiva Central */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0 z-10 overflow-visible">
        
        {/* Capa de Conexiones y Nodo Central */}
        <ConnectionLayer 
          edges={edges}
          nodes={nodes}
          isConnecting={isConnecting}
          sourceId={sourceId}
          sourcePos={sourcePos}
          mousePos={mousePos}
          centerName={centerName}
          isExporting={isExporting}
          getNodePos={getNodePos}
          deleteEdge={deleteEdge}
          onCenterClick={() => handleNodeClick("center")}
        />

        {/* Nodos Draggable (Renderizados sobre las líneas) */}
        {nodes.map((node, index) => (
          <DraggableNode 
            key={node.id} 
            node={node} 
            displayNumber={index + 1} 
            onDrag={onNodeDrag} 
            onClick={() => handleNodeClick(node.id)} 
            isTarget={isConnecting && sourceId === node.id} 
            isSelected={sourceId === node.id} 
            scale={nodeScale} 
          />
        ))}
      </div>

      {/* 6. Indicadores de Estado (Toast flotante) */}
      {isConnecting && (
        <div className="exclude-from-export absolute top-20 md:bottom-8 md:top-auto bg-slate-900/90 backdrop-blur text-white px-5 py-3 rounded-full shadow-2xl text-sm font-medium flex gap-3 items-center pointer-events-none animate-in fade-in slide-in-from-top-4 md:slide-in-from-bottom-4 z-50 border border-white/10">
          <Info size={18} className="text-blue-400 animate-pulse" /> 
          <div className="flex items-center gap-2">
            <span>Toca otro nodo para conectar</span>
            <span className="hidden sm:inline w-px h-4 bg-slate-600 mx-1"></span>
            <span className="text-slate-300 font-normal text-xs flex items-center gap-1.5">
              <kbd className="font-sans bg-slate-700 px-1.5 py-0.5 rounded border border-slate-600 shadow-sm text-[10px] min-w-24px text-center">Esc</kbd> 
              <span className="hidden sm:inline">para salir</span>
            </span>
          </div>
        </div>
      )}

      {/* 7. Modal de Creación */}
      <AddNodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => addNode(data.name, data.type, data.level)}
      />
    </div>
  );
}