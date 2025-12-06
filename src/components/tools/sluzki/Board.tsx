'use client';

import React, { useState, useRef } from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import styled from 'styled-components';
import { X, Link as LinkIcon, User } from 'lucide-react';

// --- TIPOS DE DATOS ---
type NodeType = 'family' | 'friend' | 'work' | 'community';

interface NodeData {
  id: string;
  name: string;
  type: NodeType;
  x: number;
  y: number;
}

interface EdgeData {
  id: string;
  from: string;
  to: string;
}

// --- CONFIGURACIÓN VISUAL ---
const COLORS = {
  family: { bg: '#dcfce7', border: '#86efac', text: '#15803d', label: 'FAMILIA' },
  friend: { bg: '#fef9c3', border: '#fde047', text: '#a16207', label: 'AMIGOS' },
  work:   { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af', label: 'TRABAJO' },
  community: { bg: '#f3e8ff', border: '#d8b4fe', text: '#7e22ce', label: 'COMUNIDAD' },
};

// --- ESTILOS ---
const BoardContainer = styled.div`
  position: relative; width: 800px; height: 800px; background-color: white;
  border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); margin: 0 auto; user-select: none;
`;

const Toolbar = styled.div`
  position: absolute; top: 10px; left: 10px; z-index: 50;
  background: white; padding: 8px; border-radius: 8px; border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  display: flex; flex-direction: column; gap: 8px;
`;

const ActionButton = styled.button<{ $active?: boolean }>`
  display: flex; align-items: center; gap: 8px; padding: 6px 12px;
  background: ${props => props.$active ? '#eff6ff' : 'white'};
  border: 1px solid ${props => props.$active ? '#3b82f6' : '#cbd5e1'};
  color: ${props => props.$active ? '#1d4ed8' : '#475569'};
  border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #f8fafc; border-color: #94a3b8; }
`;

const BackgroundSVG = styled.svg`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;
  z-index: 1;
  .axis-line { stroke: #cbd5e1; stroke-width: 1; }
  .circle-line { stroke: #e2e8f0; stroke-width: 1; stroke-dasharray: 5, 5; fill: none; }
  .connection-line { stroke: #64748b; stroke-width: 2; }
`;

const QuadrantLabel = styled.div`
  position: absolute; font-weight: 700; color: #94a3b8; font-size: 14px; text-transform: uppercase; z-index: 0;
  &.familia { top: 20px; left: 20px; }
  &.amigos { top: 20px; right: 20px; }
  &.laborales { bottom: 20px; left: 20px; }
  &.comunitarias { bottom: 20px; right: 20px; }
`;

const CenterNode = styled.div<{ $isTarget?: boolean }>`
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 60px; height: 60px; background-color: ${props => props.$isTarget ? '#3b82f6' : '#1e293b'};
  color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  z-index: 10; font-weight: bold; font-size: 12px; cursor: pointer;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.2);
  transition: background-color 0.2s;
`;

const CardContainer = styled.div<{ $bgColor: string; $borderColor: string; $textColor: string; $isTarget?: boolean }>`
  background-color: ${props => props.$bgColor};
  border: 2px solid ${props => props.$isTarget ? '#3b82f6' : props.$borderColor};
  color: ${props => props.$textColor};
  border-radius: 8px; padding: 8px; width: 120px; text-align: center; cursor: grab;
  /* position: absolute se maneja vía style inline en el componente padre para draggable */
  box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
  display: flex; flex-direction: column; align-items: center;
  &:active { cursor: grabbing; z-index: 30; }

  input {
    background: transparent; border: none; text-align: center; width: 100%;
    font-weight: 600; color: inherit; outline: none; font-size: 14px;
    &::placeholder { color: inherit; opacity: 0.7; }
  }

  .delete-btn {
    position: absolute; top: -8px; right: -8px; width: 20px; height: 20px;
    background: #ef4444; color: white; border-radius: 50%; display: flex;
    align-items: center; justify-content: center; cursor: pointer; opacity: 0;
    transition: opacity 0.2s;
    border: none;
  }

  &:hover .delete-btn { opacity: 1; }
  .label { font-size: 9px; font-weight: 800; text-transform: uppercase; margin-top: 4px; opacity: 0.8; }
`;

// --- COMPONENTE AISLADO PARA EL NODO ARRASTRABLE (SOLUCIÓN REACT 19) ---
const DraggableNode = ({ 
  node, 
  onDrag, 
  onDelete, 
  onChangeName, 
  onClick, 
  isTarget 
}: {
  node: NodeData;
  onDrag: (id: string, x: number, y: number) => void;
  onDelete: () => void;
  onChangeName: (val: string) => void;
  onClick: () => void;
  isTarget: boolean;
}) => {
  // ESTO ES LA CLAVE: El useRef debe estar dentro del componente hijo
  const nodeRef = useRef(null);
  const config = COLORS[node.type];

  return (
    <Draggable
      nodeRef={nodeRef} // Pasamos la referencia a Draggable
      bounds="parent"
      position={{ x: node.x, y: node.y }}
      onDrag={(e, data) => onDrag(node.id, data.x, data.y)}
    >
      <div 
        ref={nodeRef} // Y asignamos la referencia al div contenedor
        style={{ position: 'absolute' }} // Importante para posicionamiento
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <CardContainer 
          $bgColor={config.bg} 
          $borderColor={config.border} 
          $textColor={config.text}
          $isTarget={isTarget}
        >
          <button className="delete-btn" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <X size={12} />
          </button>
          
          <input 
            value={node.name} 
            onChange={(e) => onChangeName(e.target.value)} 
            placeholder="Nombre"
            onMouseDown={(e) => e.stopPropagation()} 
          />
          <span className="label">{config.label}</span>
        </CardContainer>
      </div>
    </Draggable>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function SluzkiBoard() {
  const [nodes, setNodes] = useState<NodeData[]>([
    { id: '1', name: 'Mamá', type: 'family', x: 360, y: 250 },
  ]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [sourceId, setSourceId] = useState<string | null>(null);

  const addNode = (type: NodeType) => {
    const id = Date.now().toString();
    const randomOffset = () => Math.floor(Math.random() * 60) - 30;
    const newNode: NodeData = {
      id,
      name: 'Nuevo',
      type,
      x: 400 + randomOffset(),
      y: 300 + randomOffset()
    };
    setNodes([...nodes, newNode]);
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    setEdges(edges.filter(e => e.from !== id && e.to !== id));
  };

  const updateNodeName = (id: string, newName: string) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, name: newName } : n));
  };

  const onNodeDrag = (id: string, x: number, y: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
  };

  const handleNodeClick = (id: string) => {
    if (!isConnecting) return;

    if (sourceId === null) {
      setSourceId(id);
    } else {
      if (sourceId === id) {
        setSourceId(null);
        return;
      }
      
      const edgeExists = edges.find(e => 
        (e.from === sourceId && e.to === id) || (e.from === id && e.to === sourceId)
      );

      if (edgeExists) {
        setEdges(edges.filter(e => e.id !== edgeExists.id));
      } else {
        setEdges([...edges, { id: `${sourceId}-${id}`, from: sourceId, to: id }]);
      }
      setSourceId(null);
    }
  };

  const toggleConnectMode = () => {
    setIsConnecting(!isConnecting);
    setSourceId(null);
  };

  const getPosition = (id: string) => {
    if (id === 'center') return { x: 400, y: 400 };
    const node = nodes.find(n => n.id === id);
    // Ajuste de centro: x + (ancho/2), y + (alto/2) aprox
    return node ? { x: node.x + 60, y: node.y + 30 } : { x: 0, y: 0 }; 
  };

  return (
    <BoardContainer>
      {/* --- BARRA DE HERRAMIENTAS --- */}
      <Toolbar>
        <span className="text-xs font-bold text-slate-400 mb-1 uppercase">Agregar</span>
        <ActionButton onClick={() => addNode('family')}>
          <div className="w-3 h-3 rounded-full bg-green-500"/> Familia
        </ActionButton>
        <ActionButton onClick={() => addNode('friend')}>
          <div className="w-3 h-3 rounded-full bg-yellow-400"/> Amigo
        </ActionButton>
        <ActionButton onClick={() => addNode('work')}>
          <div className="w-3 h-3 rounded-full bg-blue-500"/> Trabajo
        </ActionButton>
        <ActionButton onClick={() => addNode('community')}>
          <div className="w-3 h-3 rounded-full bg-purple-500"/> Comunidad
        </ActionButton>
        
        <div className="h-px bg-slate-200 my-1"></div>
        
        <ActionButton $active={isConnecting} onClick={toggleConnectMode}>
          <LinkIcon size={14} /> 
          {isConnecting ? 'Cancelar Unión' : 'Conectar'}
        </ActionButton>
        {isConnecting && <div className="text-[10px] text-blue-600 px-1">Selecciona dos nodos</div>}
      </Toolbar>

      {/* --- FONDO Y LÍNEAS --- */}
      <BackgroundSVG viewBox="0 0 800 800">
        <line x1="0" y1="400" x2="800" y2="400" className="axis-line" />
        <line x1="400" y1="0" x2="400" y2="800" className="axis-line" />
        <circle cx="400" cy="400" r="130" className="circle-line" />
        <circle cx="400" cy="400" r="260" className="circle-line" />
        <circle cx="400" cy="400" r="390" className="circle-line" />

        {edges.map(edge => {
          const start = getPosition(edge.from);
          const end = getPosition(edge.to);
          return (
            <line 
              key={edge.id}
              x1={start.x} y1={start.y}
              x2={end.x} y2={end.y}
              className="connection-line"
            />
          );
        })}
      </BackgroundSVG>

      <QuadrantLabel className="familia">Familia</QuadrantLabel>
      <QuadrantLabel className="amigos">Amigos</QuadrantLabel>
      <QuadrantLabel className="laborales">Laboral</QuadrantLabel>
      <QuadrantLabel className="comunitarias">Comunidad</QuadrantLabel>

      {/* --- NODO CENTRAL --- */}
      <CenterNode 
        onClick={() => handleNodeClick('center')}
        $isTarget={isConnecting && sourceId === 'center'}
      >
        <User size={24} />
      </CenterNode>

      {/* --- NODOS ARRASTRABLES (AHORA USANDO EL COMPONENTE AISLADO) --- */}
      {nodes.map((node) => (
        <DraggableNode 
          key={node.id} 
          node={node}
          onDrag={onNodeDrag}
          onDelete={() => deleteNode(node.id)}
          onChangeName={(val) => updateNodeName(node.id, val)}
          onClick={() => handleNodeClick(node.id)}
          isTarget={isConnecting && sourceId === node.id}
        />
      ))}
    </BoardContainer>
  );
}