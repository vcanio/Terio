import { ChevronRight, List, Trash2, User, X } from "lucide-react";
import { NodeData } from "../types";
import { THEME } from "../utils/constants";

interface EditSidebarProps {
  isOpen: boolean;
  toggle: () => void;
  nodes: NodeData[];
  centerName: string;
  setCenterName: (name: string) => void;
  updateNodeName: (id: string, name: string) => void;
  deleteNode: (id: string) => void;
}

export const EditSidebar = ({ 
  isOpen, toggle, nodes, centerName, setCenterName, updateNodeName, deleteNode 
}: EditSidebarProps) => {
  return (
    <div id="sluzki-sidebar" className={`
      exclude-from-export absolute z-40 right-0 top-0 bottom-0 
      bg-white/95 backdrop-blur border-l border-slate-200 shadow-2xl 
      transition-transform duration-300 ease-in-out flex flex-col
      
      /* Ancho responsivo */
      w-full sm:w-80 md:w-96
      
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    `}>
      {/* Botón de pestaña: SOLO visible en Desktop */}
      <button onClick={toggle} className="hidden md:flex absolute -left-10 top-24 p-2.5 bg-white border border-slate-200 rounded-l-xl shadow-sm text-slate-500 hover:text-slate-900 items-center justify-center">
          {isOpen ? <ChevronRight size={20} /> : <List size={20} />}
      </button>

      <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2"><List size={16} /> Editar Red</h2>
          <button onClick={toggle} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20}/>
          </button>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 m-3 shadow-sm">
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1"><User size={10} /> Usuario Central</div>
        <input type="text" value={centerName} onChange={(e) => setCenterName(e.target.value)} className="w-full text-base font-bold bg-transparent border-b border-slate-300 focus:border-blue-500 p-1 focus:outline-none text-slate-800" placeholder="Nombre..." />
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
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
  );
};