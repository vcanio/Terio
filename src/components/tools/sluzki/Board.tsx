'use client';

import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { Plus, X, Link as LinkIcon, User, Download, Info } from 'lucide-react';

// --- TIPOS DE DATOS ---
type NodeType = 'family' | 'friend' | 'work' | 'community';

interface NodeData {
  id: string;
  name: string;
  type: NodeType;
  x: number; // Coordenada X relativa al centro
  y: number; // Coordenada Y relativa al centro
}

interface EdgeData {
  id: string;
  from: string;
  to: string;
}

// --- CONFIGURACIÓN VISUAL (Temas de color) ---
const THEME = {
  family:    { bg: 'bg-emerald-50',  border: 'border-emerald-400', text: 'text-emerald-700', label: 'Familia', dot: 'bg-emerald-500' },
  friend:    { bg: 'bg-amber-50',    border: 'border-amber-400',   text: 'text-amber-700',   label: 'Amigos',  dot: 'bg-amber-400' },
  work:      { bg: 'bg-blue-50',     border: 'border-blue-400',    text: 'text-blue-700',    label: 'Laboral', dot: 'bg-blue-500' },
  community: { bg: 'bg-purple-50',   border: 'border-purple-400',  text: 'text-purple-700',  label: 'Comunidad', dot: 'bg-purple-500' },
};

// --- SUB-COMPONENTE: NODO INDIVIDUAL ---
const DraggableNode = ({ node, onDrag, onDelete, onChangeName, onClick, isTarget, isSelected }: any) => {
  const nodeRef = useRef(null); // Referencia necesaria para React 18+
  const style = THEME[node.type as NodeType];

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: node.x, y: node.y }}
      onDrag={(e, data) => onDrag(node.id, data.x, data.y)}
    >
      <div 
        ref={nodeRef} 
        className="absolute z-20 cursor-grab active:cursor-grabbing group"
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        {/* Círculo Visual del Nodo */}
        <div className={`
          w-20 h-20 rounded-full flex flex-col items-center justify-center
          border-2 shadow-sm transition-all duration-200 bg-white
          ${style.border}
          ${isTarget ? 'ring-4 ring-blue-300 scale-105' : ''} /* Efecto al seleccionar para unir */
          ${isSelected ? 'ring-2 ring-slate-400' : ''}
          hover:shadow-md
          -translate-x-1/2 -translate-y-1/2 /* Centrado perfecto en la coordenada */
        `}>
          {/* Fondo coloreado suave */}
          <div className={`absolute inset-1 rounded-full opacity-30 ${style.bg} -z-10`}></div>

          {/* Botón Eliminar (Visible solo al pasar el mouse) */}
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 
                       opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600 scale-75"
            title="Eliminar persona"
          >
            <X size={14} />
          </button>

          {/* Input para el Nombre */}
          <input 
            value={node.name} 
            onChange={(e) => onChangeName(e.target.value)} 
            className={`w-16 bg-transparent text-center text-xs font-bold focus:outline-none ${style.text} placeholder-slate-400`}
            placeholder="Nombre"
            onMouseDown={(e) => e.stopPropagation()} // Permite seleccionar texto sin arrastrar el nodo
          />
          
          {/* Etiqueta del Rol */}
          <span className="text-[8px] uppercase tracking-wider opacity-60 mt-1 font-bold text-slate-500">
            {style.label}
          </span>
        </div>
      </div>
    </Draggable>
  );
};

// --- COMPONENTE PRINCIPAL: TABLERO ---
export default function SluzkiBoard() {
  // Estado
  const [nodes, setNodes] = useState<NodeData[]>([
    { id: '1', name: 'Mamá', type: 'family', x: -120, y: -120 },
  ]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sourceId, setSourceId] = useState<string | null>(null);

  // -- FUNCIONES DE LÓGICA --

  // Agregar nuevo nodo en posición aleatoria circular
  const addNode = (type: NodeType) => {
    const id = Date.now().toString();
    const angle = Math.random() * Math.PI * 2;
    const radius = 180; 
    setNodes([...nodes, {
      id, name: 'Nuevo', type,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    }]);
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    setEdges(edges.filter(e => e.from !== id && e.to !== id));
  };

  const deleteEdge = (edgeId: string) => {
    setEdges(edges.filter(e => e.id !== edgeId));
  };

  const updateNodeName = (id: string, newName: string) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, name: newName } : n));
  };

  const onNodeDrag = (id: string, x: number, y: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
  };

  // Lógica de conexión (Unir A con B)
  const handleNodeClick = (id: string) => {
    if (!isConnecting) return;

    if (sourceId === null) {
      setSourceId(id); // Primer clic
    } else {
      // Segundo clic
      if (sourceId === id) { setSourceId(null); return; } // Cancelar si es el mismo
      
      const exists = edges.find(e => (e.from === sourceId && e.to === id) || (e.from === id && e.to === sourceId));
      
      if (exists) {
        // Si ya existe, la borramos (toggle)
        setEdges(edges.filter(e => e.id !== exists.id));
      } else {
        // Si no existe, la creamos
        setEdges([...edges, { id: `${sourceId}-${id}`, from: sourceId, to: id }]);
      }
      setSourceId(null); // Resetear selección
    }
  };

  // Obtener coordenadas (0,0 es el centro para el Usuario)
  const getNodePos = (id: string) => {
    if (id === 'center') return { x: 0, y: 0 };
    const n = nodes.find(x => x.id === id);
    return n ? { x: n.x, y: n.y } : { x: 0, y: 0 };
  };

  return (
    <div className="w-full h-full relative bg-slate-50 overflow-hidden select-none font-sans">
      
      {/* --- 1. BARRA DE HERRAMIENTAS (FLOTANTE IZQUIERDA) --- */}
      {/* top-32: Bajamos la barra para que no tape el título 'FAMILIA' */}
      <div className="absolute top-32 left-6 z-50 flex flex-col gap-4 w-60 animate-in slide-in-from-left-4 duration-500">
        
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-slate-100">
          <h1 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Herramientas</h1>
          
          {/* Botones de Acción */}
          <div className="flex gap-2 mb-6">
            <button 
              onClick={() => setIsConnecting(!isConnecting)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all border
                ${isConnecting 
                  ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-inner ring-2 ring-blue-100' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm hover:shadow'}`}
            >
              <LinkIcon size={16} /> {isConnecting ? 'Uniendo...' : 'Unir'}
            </button>
            <button className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 shadow-sm hover:shadow transition-all" title="Descargar PDF">
              <Download size={18} />
            </button>
          </div>

          <h1 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Nuevo Integrante</h1>
          
          {/* Lista de Tipos de Persona */}
          <div className="space-y-2">
            {[
              { type: 'family', label: 'Familia', theme: THEME.family },
              { type: 'friend', label: 'Amigo', theme: THEME.friend },
              { type: 'work', label: 'Laboral', theme: THEME.work },
              { type: 'community', label: 'Comunidad', theme: THEME.community }
            ].map((item) => (
              <button 
                key={item.type} 
                onClick={() => addNode(item.type as NodeType)} 
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
              >
                <div className={`w-3 h-3 rounded-full ${item.theme.dot} shadow-sm group-hover:scale-125 transition-transform`}></div>
                <span className="text-sm text-slate-600 font-medium">{item.label}</span>
                <Plus size={16} className="ml-auto text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Tip Flotante cuando se está conectando */}
        {isConnecting && (
          <div className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-200 text-xs flex gap-3 items-center animate-pulse">
             <Info size={18} className="shrink-0" /> 
             <span>Toca dos personas para crear o borrar una conexión.</span>
          </div>
        )}
      </div>

      {/* --- 2. ETIQUETAS DE FONDO (Cuadrantes) --- */}
      <div className="absolute inset-0 pointer-events-none p-10 z-0">
        <span className="absolute top-8 left-8 text-emerald-900/5 text-6xl font-black uppercase tracking-widest">Familia</span>
        <span className="absolute top-8 right-8 text-amber-900/5 text-6xl font-black uppercase tracking-widest">Amigos</span>
        <span className="absolute bottom-8 left-8 text-blue-900/5 text-6xl font-black uppercase tracking-widest">Laboral</span>
        <span className="absolute bottom-8 right-8 text-purple-900/5 text-6xl font-black uppercase tracking-widest">Comunidad</span>
      </div>

      {/* --- 3. ESTRUCTURA DEL MAPA (SVG Fondo) --- */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {/* Ejes Infinitos */}
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#cbd5e1" strokeWidth="2" />
        
        {/* Círculos Concéntricos */}
        <circle cx="50%" cy="50%" r="150" fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="6 4" />
        <circle cx="50%" cy="50%" r="280" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
        <circle cx="50%" cy="50%" r="420" fill="none" stroke="#f1f5f9" strokeWidth="1.5" />
      </svg>

      {/* --- 4. CONTENEDOR CENTRAL (Punto 0,0) --- */}
      {/* Todo lo que está aquí adentro se posiciona relativo al centro exacto de la pantalla */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0 z-10">
        
        {/* SVG de Conexiones (Edges) */}
        {/* Overflow visible para que las líneas se puedan dibujar fuera del div 0x0 */}
        <svg className="absolute overflow-visible -top-[9999px] -left-[9999px] w-[19999px] h-[19999px] pointer-events-none" style={{ left: 0, top: 0 }}>
          {edges.map(edge => {
            const start = getNodePos(edge.from);
            const end = getNodePos(edge.to);
            return (
              <g 
                key={edge.id} 
                className="pointer-events-auto cursor-pointer group" 
                onClick={(e) => { e.stopPropagation(); deleteEdge(edge.id); }}
              >
                {/* Línea invisible gruesa (Hit area) */}
                <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="transparent" strokeWidth="25" />
                {/* Línea visible */}
                <line 
                  x1={start.x} y1={start.y} x2={end.x} y2={end.y} 
                  className="stroke-blue-400 stroke-[3px] transition-all duration-300 group-hover:stroke-red-500 group-hover:stroke-[4px]" 
                  strokeLinecap="round"
                />
                {/* Icono X al pasar el mouse */}
                <foreignObject x={(start.x+end.x)/2 - 12} y={(start.y+end.y)/2 - 12} width={24} height={24} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                   <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                     <X size={14}/>
                   </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        {/* NODO CENTRAL (Usuario) */}
        <div 
          onClick={() => handleNodeClick('center')}
          className={`
            absolute -translate-x-1/2 -translate-y-1/2 z-30 
            w-24 h-24 rounded-full bg-slate-900 text-white flex flex-col items-center justify-center 
            shadow-2xl cursor-pointer transition-all duration-300 border-4 border-white
            ${isConnecting && sourceId === 'center' ? 'ring-4 ring-blue-500 scale-105' : 'hover:scale-105'}
          `}
        >
          <User size={32} className="mb-1 opacity-90" />
          <span className="text-[10px] font-black uppercase tracking-widest">Usuario</span>
        </div>

        {/* NODOS ARRASTRABLES (Personas) */}
        {nodes.map((node) => (
          <DraggableNode 
            key={node.id} 
            node={node}
            onDrag={onNodeDrag}
            onDelete={() => deleteNode(node.id)}
            onChangeName={(val: string) => updateNodeName(node.id, val)}
            onClick={() => handleNodeClick(node.id)}
            isTarget={isConnecting && sourceId === node.id}
            isSelected={sourceId === node.id}
          />
        ))}
      </div>
    </div>
  );
}