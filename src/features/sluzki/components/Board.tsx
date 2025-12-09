"use client";

import React, { useState, useRef } from "react";
import { Info } from "lucide-react";

// Hooks y store
import { useSluzkiBoard } from "@/features/sluzki/hooks/useSluzkiBoard";
import { useSluzkiStore } from "@/features/sluzki/store/useSluzkiStore";

// Componentes modulares
import { DraggableNode } from "@/features/sluzki/components/DraggableNode";
import { AddNodeModal } from "@/features/sluzki/components/AddNodeModal";
import { BoardBackground } from "@/features/sluzki/components/BoardBackground";
import { BoardToolbar } from "@/features/sluzki/components/BoardToolbar";
import { EditSidebar } from "@/features/sluzki/components/EditSidebar";
import { ConnectionLayer } from "@/features/sluzki/components/ConnectionLayer";
import { BoardLegend } from "@/features/sluzki/components/BoardLegend";

export default function SluzkiBoard() {
  /* -------------------------------------------------------------------------- */
  /*                                   Refs                                     */
  /* -------------------------------------------------------------------------- */
  const diagramRef = useRef<HTMLDivElement>(null);

  /* -------------------------------------------------------------------------- */
  /*                           Estado global (Zustand)                           */
  /* -------------------------------------------------------------------------- */
  const { nodeScale, setNodeScale } = useSluzkiStore();

  /* -------------------------------------------------------------------------- */
  /*                          Hook principal de lógica                           */
  /* -------------------------------------------------------------------------- */
  const {
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
    addNode,
    deleteNode,
    deleteEdge,
    updateNodeName,
    onNodeDrag,
    handleNodeClick,
    handleMouseMove,
    getNodePos,
    downloadImage,
    clearBoard,
    isLoaded,
    isExporting,
  } = useSluzkiBoard(diagramRef);

  /* -------------------------------------------------------------------------- */
  /*                            Estado local de la UI                            */
  /* -------------------------------------------------------------------------- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [showLegend, setShowLegend] = useState(true);

  /* -------------------------------------------------------------------------- */
  /*                    Derivados (posiciones, cálculos útiles)                 */
  /* -------------------------------------------------------------------------- */
  const sourcePos = sourceId ? getNodePos(sourceId) : { x: 0, y: 0 };

  /* -------------------------------------------------------------------------- */
  /*                              Manejadores de Zoom                            */
  /* -------------------------------------------------------------------------- */
  const handleNodeScale = (delta: number) => {
    const newScale = Math.min(Math.max(nodeScale + delta, 0.4), 1.5);
    setNodeScale(newScale);
  };

  /* -------------------------------------------------------------------------- */
  /*                                 Loading                                     */
  /* -------------------------------------------------------------------------- */
  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400">
        Cargando mapa...
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Render                                     */
  /* -------------------------------------------------------------------------- */
  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onWheel={(e) => handleNodeScale(e.deltaY > 0 ? -0.1 : 0.1)}
      className={`
        w-full h-full relative bg-slate-50 flex items-center justify-center overflow-hidden 
        ${isConnecting ? "cursor-crosshair" : ""}
      `}
    >
      {/* ---------------------------------------------------------------------- */}
      {/*                            1. Toolbar superior                          */}
      {/* ---------------------------------------------------------------------- */}
      <BoardToolbar
        onOpenModal={() => setIsModalOpen(true)}
        onToggleConnect={() => {
          setIsConnecting(!isConnecting);
          setSourceId(null);
        }}
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

      {/* ---------------------------------------------------------------------- */}
      {/*                           2. Leyenda flotante                          */}
      {/* ---------------------------------------------------------------------- */}
      <BoardLegend nodes={nodes} show={showLegend} />

      {/* ---------------------------------------------------------------------- */}
      {/*                           3. Sidebar lateral                           */}
      {/* ---------------------------------------------------------------------- */}
      <EditSidebar
        isOpen={isListOpen}
        toggle={() => setIsListOpen(!isListOpen)}
        nodes={nodes}
        centerName={centerName}
        setCenterName={setCenterName}
        updateNodeName={updateNodeName}
        deleteNode={deleteNode}
      />

      {/* ---------------------------------------------------------------------- */}
      {/*                          4. Fondo circular grid                        */}
      {/* ---------------------------------------------------------------------- */}
      <div
        ref={diagramRef}
        className="pointer-events-none absolute w-full max-w-[85vmin] aspect-square flex items-center justify-center opacity-50"
      >
        <BoardBackground />
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/*                       5. Área interactiva del tablero                   */}
      {/* ---------------------------------------------------------------------- */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0 z-10 overflow-visible">
        {/* Conexiones y nodo central */}
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

        {/* Nodos interactivos */}
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

      {/* ---------------------------------------------------------------------- */}
      {/*                     6. Notificación flotante (Conexión)                */}
      {/* ---------------------------------------------------------------------- */}
      {isConnecting && (
        <div className="exclude-from-export absolute top-20 md:bottom-8 md:top-auto bg-slate-900/90 backdrop-blur text-white px-5 py-3 rounded-full shadow-2xl text-sm font-medium flex gap-3 items-center pointer-events-none animate-in fade-in slide-in-from-top-4 md:slide-in-from-bottom-4 z-50 border border-white/10">
          <Info size={18} className="text-blue-400 animate-pulse" />
          <div className="flex items-center gap-2">
            <span>Toca otro nodo para conectar</span>
            <span className="hidden sm:inline w-px h-4 bg-slate-600 mx-1"></span>
            <span className="text-slate-300 text-xs flex items-center gap-1.5">
              <kbd className="bg-slate-700 px-1.5 py-0.5 rounded border border-slate-600 shadow-sm text-[10px]">
                Esc
              </kbd>
              <span className="hidden sm:inline">para salir</span>
            </span>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/*                         7. Modal para agregar nodos                    */}
      {/* ---------------------------------------------------------------------- */}
      <AddNodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => addNode(data.name, data.type, data.level)}
      />
    </div>
  );
}
