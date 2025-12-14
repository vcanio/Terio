import { Plus, Search } from "lucide-react";
import { useClinicalUserStore } from "@/features/users/store/useClinicalStore";
import { useSluzkiStore } from "@/features/sluzki/store/useSluzkiStore";
import { useState, useMemo } from "react";

interface UserListSidebarProps {
  onOpenNewUserModal: () => void;
}

export const UserListSidebar = ({ onOpenNewUserModal }: UserListSidebarProps) => {
  const { users, activeUserId, setActiveUser } = useClinicalUserStore();
  const { loadUserMap, setCenterName } = useSluzkiStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => 
    users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.diagnosis && u.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), 
  [users, searchTerm]);

  const handleSelectUser = (userId: string) => {
    setActiveUser(userId);
    loadUserMap(userId);
    const user = users.find(u => u.id === userId);
    if (user) setCenterName(user.name);
  };

  return (
    <aside className={`w-full md:w-96 flex flex-col border-l border-slate-200 bg-white ${activeUserId ? 'hidden md:flex' : 'flex'}`}>
      <div className="p-5 border-b border-slate-200 bg-slate-50/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-slate-800 text-lg">Expedientes</h2>
          <button 
            onClick={onOpenNewUserModal}
            className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 active:scale-95"
            title="Nuevo Paciente"
          >
            <Plus size={18} />
          </button>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Buscar paciente..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2 bg-slate-50/30">
        {users.length === 0 ? (
          <div className="text-center py-12 px-4 text-slate-400">
            <p className="text-sm">Sin expedientes activos.</p>
            <button onClick={onOpenNewUserModal} className="text-blue-600 text-xs font-bold mt-2 hover:underline">Crear el primero</button>
          </div>
        ) : filteredUsers.map(user => (
          <div 
            key={user.id}
            onClick={() => handleSelectUser(user.id)}
            className={`
              group p-3.5 rounded-xl cursor-pointer transition-all border relative
              ${activeUserId === user.id 
                ? 'bg-white border-blue-200 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/10 z-10' 
                : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200 hover:shadow-sm'
              }
            `}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors
                  ${activeUserId === user.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500 group-hover:bg-slate-100'}
                `}>
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-bold truncate ${activeUserId === user.id ? 'text-slate-900' : 'text-slate-700'}`}>
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user.diagnosis || "Sin diagnóstico"}
                  </p>
                </div>
              </div>
              {/* Indicador de estado "fake" para darle vida */}
              <div className="flex flex-col items-end gap-1">
                 {activeUserId === user.id && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                 <span className="text-[10px] text-slate-300">{new Date(user.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-slate-200 text-[10px] uppercase font-bold text-slate-400 text-center bg-slate-50 tracking-wider">
        {filteredUsers.length} Expedientes Totales
      </div>
    </aside>
  );
};