import { 
  Layers,          // Reporte combinado
  PieChart,        // Solo mapa (gráfico)
  Rows,            // Tabla como imagen
  FileSpreadsheet  // CSV / Excel
} from "lucide-react";

import { Modal } from "@/components/ui/Modal";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadMap: () => void;
  onDownloadTableImage: () => void;
  onDownloadCSV: () => void;
  onDownloadCombined: () => void;
  isExporting: boolean;
}

export const DownloadModal = ({
  isOpen,
  onClose,
  onDownloadMap,
  onDownloadTableImage,
  onDownloadCSV,
  onDownloadCombined,
  isExporting
}: DownloadModalProps) => {
  
  const handleDownload = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Opciones de Descarga">
      <div className="grid gap-3">
        
        {/* Opción ESTRELLA: Reporte Completo */}
        <button
          onClick={() => handleDownload(onDownloadCombined)}
          disabled={isExporting}
          className="flex items-center gap-4 p-4 rounded-xl border-2 border-blue-100 bg-blue-50/50 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group active:scale-95"
        >
          <div className="shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
            <Layers size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Reporte Completo</h3>
            <p className="text-xs text-slate-500 leading-tight mt-0.5 font-medium">
              Mapa gráfico + Tabla de detalles en una sola imagen.
            </p>
          </div>
        </button>

        <div className="h-px bg-slate-100 my-1"></div>

        {/* Opción: Solo Mapa */}
        <button
          onClick={() => handleDownload(onDownloadMap)}
          disabled={isExporting}
          className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all text-left group active:scale-95"
        >
          <div className="shrink-0 w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-colors">
            <PieChart size={18} />
          </div>
          <div>
            <h3 className="font-bold text-slate-700 text-sm">Solo Mapa (PNG)</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">El gráfico circular únicamente.</p>
          </div>
        </button>

        {/* Opción: Tabla Imagen */}
        <button
          onClick={() => handleDownload(onDownloadTableImage)}
          disabled={isExporting}
          className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all text-left group active:scale-95"
        >
          <div className="shrink-0 w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-colors">
            <Rows size={18} />
          </div>
          <div>
            <h3 className="font-bold text-slate-700 text-sm">Solo Tabla (PNG)</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Imagen del listado de nodos.</p>
          </div>
        </button>

        {/* Opción: CSV */}
        <button
          onClick={() => handleDownload(onDownloadCSV)}
          disabled={isExporting}
          className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group active:scale-95"
        >
          <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <FileSpreadsheet size={18} />
          </div>
          <div>
            <h3 className="font-bold text-slate-700 text-sm">Datos Excel (CSV)</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Formato texto para hojas de cálculo.</p>
          </div>
        </button>
      </div>
    </Modal>
  );
};
