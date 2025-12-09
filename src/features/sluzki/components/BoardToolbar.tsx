import { 
  Plus, 
  Link as LinkIcon, 
  Download, 
  RotateCcw, 
  BookOpen, 
  ZoomIn, 
  ZoomOut,
  Loader2,
  List
} from "lucide-react";

interface BoardToolbarProps {
  onOpenModal: () => void;
  onToggleConnect: () => void;
  isConnecting: boolean;
  onToggleLegend: () => void;
  showLegend: boolean;
  onToggleList: () => void; // Nueva prop
  isListOpen: boolean;      // Nueva prop
  onDownload: () => void;
  isExporting: boolean;
  onClear: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  currentScale: number;
}

export const BoardToolbar = ({
  onOpenModal, onToggleConnect, isConnecting,
  onToggleLegend, showLegend, 
  onToggleList, isListOpen,
  onDownload, isExporting, onClear,
  onZoomIn, onZoomOut, currentScale
}: BoardToolbarProps) => {
  
  const btnClass = "p-3 rounded-xl transition-all active:scale-95 shrink-0";
  const btnActive = "bg-blue-600 border-blue-600 text-white shadow-md";
  const btnInactive = "bg-white border-transparent text-slate-500 hover:bg-slate-50";

  return (
    <div className="exclude-from-export absolute z-30 bottom-6 left-0 right-0 flex justify-center pointer-events-none lg:left-4 lg:right-auto lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2">
      <div className="
        pointer-events-auto
        bg-white/90 backdrop-blur-md 
        p-2 mx-4 rounded-2xl shadow-xl border border-slate-200/60
        flex flex-row gap-2 items-center 
        overflow-x-auto max-w-[90vw] no-scrollbar
        lg:flex-col lg:max-w-none lg:overflow-visible
      ">
        
        {/* Agregar Nodo */}
        <button onClick={onOpenModal} className={`${btnClass} bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20`} title="Agregar Nodo">
          <Plus size={20} />
        </button>
        
        <div className="w-px h-6 bg-slate-200 shrink-0 lg:w-6 lg:h-px"></div>

        {/* Editar Lista (Nuevo Botón) */}
        <button onClick={onToggleList} className={`${btnClass} ${isListOpen ? "bg-slate-100 text-slate-900 font-bold" : btnInactive}`} title="Editar Lista">
          <List size={20} />
        </button>

        {/* Conectar */}
        <button onClick={onToggleConnect} className={`${btnClass} border ${isConnecting ? btnActive + " animate-pulse" : btnInactive}`} title="Conectar">
          <LinkIcon size={20} />
        </button>
        
        {/* Leyenda */}
        <button onClick={onToggleLegend} className={`${btnClass} border ${showLegend ? "bg-slate-100 text-slate-900" : btnInactive}`} title="Ver Leyenda">
          <BookOpen size={20} />
        </button>

        <div className="w-px h-6 bg-slate-200 shrink-0 lg:w-6 lg:h-px"></div>

        {/* Zoom In */}
        <button onClick={onZoomIn} className={btnClass + " " + btnInactive} title="Zoom +">
          <ZoomIn size={20} />
        </button>
        
        {/* Indicador */}
        <div className="hidden lg:flex items-center justify-center w-8 h-8 text-[9px] font-bold text-slate-400 select-none">
          {Math.round(currentScale * 100)}%
        </div>

        {/* Zoom Out */}
        <button onClick={onZoomOut} className={btnClass + " " + btnInactive} title="Zoom -">
          <ZoomOut size={20} />
        </button>

        <div className="w-px h-6 bg-slate-200 shrink-0 lg:w-6 lg:h-px"></div>

        {/* Descargar */}
        <button onClick={onDownload} disabled={isExporting} className={`${btnClass} ${btnInactive} disabled:opacity-50`} title="Descargar">
          {isExporting ? <Loader2 size={20} className="animate-spin text-blue-600" /> : <Download size={20} />}
        </button>
        
        {/* Limpiar */}
        <button onClick={onClear} className={`${btnClass} bg-white text-red-400 hover:text-red-600 hover:bg-red-50`} title="Limpiar">
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};