"use client";

import React, { useState, useRef, useCallback } from "react";
import { Info } from "lucide-react";

import { useSluzkiBoard } from "@/features/sluzki/hooks/useSluzkiBoard";
import { useSluzkiStore } from "@/features/sluzki/store/useSluzkiStore";
import { useBoardResponsive } from "@/features/sluzki/hooks/useBoardResponsive";

import { DraggableNode } from "@/features/sluzki/components/DraggableNode";
import { AddNodeModal } from "@/features/sluzki/components/AddNodeModal";
import { BoardBackground } from "@/features/sluzki/components/BoardBackground";
import { BoardToolbar } from "@/features/sluzki/components/BoardToolbar";
import { EditSidebar } from "@/features/sluzki/components/EditSidebar";
import { ConnectionLayer } from "@/features/sluzki/components/ConnectionLayer";
import { BoardLegend } from "@/features/sluzki/components/BoardLegend";
import { Modal } from "@/components/ui/Modal";

export default function SluzkiBoard() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const { nodeScale, setNodeScale } = useSluzkiStore();

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

  const { scale: responsiveScale, BOARD_SIZE } = useBoardResponsive(containerRef);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // --- NUEVA FUNCIÓN PROFESIONAL DE PROYECCIÓN DE COORDENADAS ---
  // Convierte cualquier punto X,Y de la pantalla (mouse/touch) a coordenadas X,Y internas del tablero (lógicas)
  const screenToBoard = useCallback((screenX: number, screenY: number) => {
    if (!diagramRef.current) return { x: 0, y: 0 };

    // 1. Obtenemos la posición y dimensiones REALES del tablero en la pantalla
    const rect = diagramRef.current.getBoundingClientRect();

    // 2. Calculamos el centro visual del tablero en la pantalla
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 3. Proyectamos:
    //    - Restamos el centro para que (0,0) esté en el medio.
    //    - Dividimos por la escala para revertir el efecto del zoom/responsividad.
    return {
      x: (screenX - centerX) / responsiveScale,
      y: (screenY - centerY) / responsiveScale,
    };
  }, [responsiveScale]);
  // -------------------------------------------------------------

  const sourcePos = sourceId ? getNodePos(sourceId) : { x: 0, y: 0 };

  const handleNodeScale = (delta: number) => {
    const newScale = Math.min(Math.max(nodeScale + delta, 0.4), 1.5);
    setNodeScale(newScale);
  };

  const handleConfirmClear = () => {
    clearBoard();
    setIsClearModalOpen(false);
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400">
        Cargando mapa...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`
        w-full h-full relative bg-slate-50 flex items-center justify-center overflow-hidden 
        /* AQUÍ ESTÁ EL CAMBIO PARA MÓVIL: */
        pb-40 md:pb-0 
        ${isConnecting ? "cursor-crosshair" : ""}
      `}
    >
      <BoardToolbar
        onOpenModal={() => setIsModalOpen(true)}
        onToggleConnect={() => { setIsConnecting(!isConnecting); setSourceId(null); }}
        isConnecting={isConnecting}
        onToggleLegend={() => setShowLegend(!showLegend)}
        showLegend={showLegend}
        onToggleList={() => setIsListOpen(!isListOpen)}
        isListOpen={isListOpen}
        onDownload={downloadImage}
        isExporting={isExporting}
        onClear={() => setIsClearModalOpen(true)}
        onZoomIn={() => handleNodeScale(0.1)}
        onZoomOut={() => handleNodeScale(-0.1)}
        currentScale={nodeScale}
      />

      <BoardLegend nodes={nodes} show={showLegend} />

      <EditSidebar
        isOpen={isListOpen}
        toggle={() => setIsListOpen(!isListOpen)}
        nodes={nodes}
        centerName={centerName}
        setCenterName={setCenterName}
        updateNodeName={updateNodeName}
        deleteNode={deleteNode}
      />

      <div
        ref={diagramRef}
        style={{
          width: BOARD_SIZE,
          height: BOARD_SIZE,
          transform: `scale(${responsiveScale})`,
          transformOrigin: 'center center',
        }}
        className="relative shadow-2xl rounded-full bg-white transition-transform duration-75 ease-linear shrink-0"
      >
        <BoardBackground />

        <div className="absolute top-1/2 left-1/2 w-0 h-0 overflow-visible z-10">
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
              // PASAMOS LA FUNCIÓN DE PROYECCIÓN EN VEZ DE LA ESCALA
              screenToBoard={screenToBoard} 
            />
          ))}
        </div>
      </div>

      {isConnecting && (
        <div className="exclude-from-export absolute top-24 md:bottom-8 md:top-auto bg-slate-900/90 backdrop-blur text-white px-5 py-3 rounded-full shadow-2xl text-sm font-medium flex gap-3 items-center pointer-events-none animate-in fade-in slide-in-from-top-4 md:slide-in-from-bottom-4 z-50 border border-white/10">
          <Info size={18} className="text-blue-400 animate-pulse" />
          <div className="flex items-center gap-2">
            <span>Toca otro nodo para conectar</span>
            <span className="hidden sm:inline w-px h-4 bg-slate-600 mx-1"></span>
            <span className="text-slate-300 text-xs flex items-center gap-1.5">
              <kbd className="bg-slate-700 px-1.5 py-0.5 rounded border border-slate-600 shadow-sm text-[10px]">Esc</kbd>
              <span className="hidden sm:inline">para salir</span>
            </span>
          </div>
        </div>
      )}

      <AddNodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => addNode(data.name, data.type, data.level)}
      />

      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="¿Reiniciar el mapa?"
      >
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
            <p className="font-medium">⚠️ Advertencia</p>
            <p className="mt-1 text-amber-800/80">Esta acción eliminará permanentemente todos los nodos y conexiones actuales.</p>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setIsClearModalOpen(false)} className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
            <button onClick={handleConfirmClear} className="px-4 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-md shadow-red-500/20 active:scale-95">Sí, reiniciar todo</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}