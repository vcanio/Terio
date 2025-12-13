"use client";

import React, { useState, useRef, useCallback } from "react";
import { Info, Loader2 } from "lucide-react"; 
import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

// Hooks
import { useSluzkiBoard } from "@/features/sluzki/hooks/useSluzkiBoard";
import { useSluzkiStore } from "@/features/sluzki/store/useSluzkiStore";
import { useBoardResponsive } from "@/features/sluzki/hooks/useBoardResponsive";

// Componentes
import { ZoomableCanvas } from "./ZoomableCanvas"; // <--- NUEVO IMPORT
import { DraggableNode } from "@/features/sluzki/components/DraggableNode";
import { AddNodeModal } from "@/features/sluzki/components/AddNodeModal";
import { BoardBackground } from "@/features/sluzki/components/BoardBackground";
import { BoardToolbar } from "@/features/sluzki/components/BoardToolbar";
import { EditSidebar } from "@/features/sluzki/components/EditSidebar";
import { ConnectionLayer } from "@/features/sluzki/components/ConnectionLayer";
import { BoardLegend } from "@/features/sluzki/components/BoardLegend";
import { DownloadModal } from "@/features/sluzki/components/DownloadModal";
import { Modal } from "@/components/ui/Modal";

// Templates de Exportación (Ocultos)
import { ExportTableTemplate } from "@/features/sluzki/components/ExportTableTemplate";
import { ExportCombinedTemplate } from "@/features/sluzki/components/ExportCombinedTemplate";

export default function SluzkiBoard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const transformComponentRef = useRef<ReactZoomPanPinchRef>(null); 
  
  const { nodeScale, setNodeScale } = useSluzkiStore(); 
  const { scale: initialScale, BOARD_SIZE } = useBoardResponsive(containerRef);

  const {
    tableRef, combinedRef,
    nodes, edges, centerName, setCenterName,
    isConnecting, setIsConnecting, sourceId, setSourceId, mousePos,
    addNode, deleteNode, deleteEdge, updateNodeName,
    onNodeDrag, handleNodeClick, handleMouseMove, getNodePos,
    downloadImage, downloadTable, downloadTableImage, downloadCombinedImage,
    clearBoard, isLoaded, isExporting,
  } = useSluzkiBoard(diagramRef, containerRef, initialScale || 1);

  // Gestión de Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  
  // Utilidad para convertir coordenadas de pantalla a tablero
  const screenToBoard = useCallback((screenX: number, screenY: number) => {
    if (!diagramRef.current) return { x: 0, y: 0 };
    const rect = diagramRef.current.getBoundingClientRect();
    const currentScale = rect.width / 1000; 
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return {
      x: (screenX - centerX) / currentScale,
      y: (screenY - centerY) / currentScale,
    };
  }, []);

  const sourcePos = sourceId ? getNodePos(sourceId) : { x: 0, y: 0 };

  const handleNodeScale = (delta: number) => {
    const newScale = Math.min(Math.max(nodeScale + delta, 0.4), 1.5);
    setNodeScale(newScale);
  };

  if (!isLoaded) {
    return <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400">Cargando mapa...</div>;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`w-full h-dvh relative bg-slate-50 flex items-center justify-center overflow-hidden pb-48 md:pb-0 ${isConnecting ? "cursor-crosshair" : ""}`}
    >
      {/* --- Templates Ocultos para Exportación --- */}
      <div className="fixed top-0 -left-[9999px] overflow-hidden pointer-events-none z-0">
        <div ref={tableRef}>
          <ExportTableTemplate nodes={nodes} centerName={centerName} />
        </div>
        <div ref={combinedRef}>
          <ExportCombinedTemplate nodes={nodes} edges={edges} centerName={centerName} />
        </div>
      </div>

      {/* --- UI Tools --- */}
      <BoardToolbar
        onOpenModal={() => setIsModalOpen(true)}
        onToggleConnect={() => { setIsConnecting(!isConnecting); setSourceId(null); }}
        isConnecting={isConnecting}
        onToggleLegend={() => setShowLegend(!showLegend)}
        showLegend={showLegend}
        onToggleList={() => setIsListOpen(!isListOpen)}
        isListOpen={isListOpen}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
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

      {/* --- LIENZO PRINCIPAL --- */}
      {initialScale === null ? (
        <div className="flex items-center justify-center h-full w-full opacity-0 animate-pulse">
           <Loader2 className="animate-spin text-slate-300" />
        </div>
      ) : (
        <ZoomableCanvas
          initialScale={initialScale}
          width={BOARD_SIZE}
          height={BOARD_SIZE}
          isDisabled={isConnecting}
          transformRef={transformComponentRef}
          canvasRef={diagramRef}
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
                screenToBoard={screenToBoard}
                isConnecting={isConnecting}
              />
            ))}
          </div>
        </ZoomableCanvas>
      )}

      {/* --- Indicador Flotante de Conexión --- */}
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

      {/* --- MODALES --- */}
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
            <button onClick={() => { clearBoard(); setIsClearModalOpen(false); }} className="px-4 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-md shadow-red-500/20 active:scale-95">Sí, reiniciar todo</button>
          </div>
        </div>
      </Modal>

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onDownloadMap={downloadImage}
        onDownloadTableImage={downloadTableImage}
        onDownloadCSV={downloadTable}
        onDownloadCombined={downloadCombinedImage}
        isExporting={isExporting}
      />
    </div>
  );
}