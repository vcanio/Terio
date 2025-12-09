import { 
  Plus, 
  Link as LinkIcon, 
  Download, 
  RotateCcw, 
  BookOpen, 
  ZoomIn, 
  ZoomOut,
  Loader2 
} from "lucide-react";

interface BoardToolbarProps {
  onOpenModal: () => void;
  onToggleConnect: () => void;
  isConnecting: boolean;
  onToggleLegend: () => void;
  showLegend: boolean;
  onDownload: () => void;
  isExporting: boolean;
  onClear: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  currentScale: number;
}

export const BoardToolbar = ({
  onOpenModal, onToggleConnect, isConnecting,
  onToggleLegend, showLegend, onDownload, isExporting, onClear,
  onZoomIn, onZoomOut, currentScale
}: BoardToolbarProps) => {
  return (
    <div className="exclude-from-export absolute z-50 bottom-6 left-1/2 -translate-x-1/2 flex-row gap-4 lg:left-4 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2 lg:translate-x-0 lg:flex-col lg:gap-2 pointer-events-none transition-all duration-300">
      <div className="bg-white/95 backdrop-blur-sm p-2 rounded-2xl shadow-xl border border-slate-200 pointer-events-auto flex flex-row gap-3 items-center lg:flex-col lg:gap-2">
        
        {/* Agregar Nodo */}
        <button onClick={onOpenModal} className="p-3 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95" title="Agregar Nodo">
          <Plus size={22} />
        </button>
        
        <div className="w-px h-8 bg-slate-200 lg:w-8 lg:h-px"></div>

        {/* Zoom In */}
        <button onClick={onZoomIn} className="p-3 bg-white text-slate-500 hover:bg-slate-50 rounded-xl transition-all" title="Aumentar tamaño">
          <ZoomIn size={22} />
        </button>
        
        {/* Indicador de Zoom */}
        <div className="hidden lg:flex items-center justify-center w-8 h-8 text-[10px] font-bold text-slate-400 select-none">
          {Math.round(currentScale * 100)}%
        </div>

        {/* Zoom Out */}
        <button onClick={onZoomOut} className="p-3 bg-white text-slate-500 hover:bg-slate-50 rounded-xl transition-all" title="Reducir tamaño">
          <ZoomOut size={22} />
        </button>

        <div className="w-px h-8 bg-slate-200 lg:w-8 lg:h-px"></div>
        
        {/* Conectar */}
        <button onClick={onToggleConnect} className={`p-3 rounded-xl transition-all border ${isConnecting ? "bg-blue-600 border-blue-600 text-white shadow-md animate-pulse" : "bg-white border-transparent text-slate-500 hover:bg-slate-50"}`} title="Conectar">
          <LinkIcon size={22} />
        </button>
        
        {/* Leyenda */}
        <button onClick={onToggleLegend} className={`p-3 rounded-xl transition-all border ${showLegend ? "bg-slate-100 text-slate-900" : "bg-white border-transparent text-slate-500 hover:bg-slate-50"}`} title="Ver Leyenda">
          <BookOpen size={22} />
        </button>

        {/* Descargar (Con Feedback Visual) */}
        <button 
          onClick={onDownload} 
          disabled={isExporting} 
          className="p-3 bg-white border border-transparent text-slate-500 rounded-xl hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" 
          title="Descargar"
        >
          {isExporting ? (
            <Loader2 size={22} className="animate-spin text-blue-600" />
          ) : (
            <Download size={22} />
          )}
        </button>
        
        <div className="w-px h-8 bg-slate-200 lg:w-8 lg:h-px"></div>
        
        {/* Limpiar */}
        <button onClick={onClear} className="p-3 bg-white border border-transparent text-red-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all active:scale-95" title="Limpiar">
          <RotateCcw size={22} />
        </button>
      </div>
    </div>
  );
};