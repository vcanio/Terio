import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer'; // Facilita la inmutabilidad
import { NodeData, EdgeData, NodeType, NetworkLevel } from '../types';
import { LEVELS } from '../utils/constants';

interface SluzkiState {
  nodes: NodeData[];
  edges: EdgeData[];
  centerName: string;
  
  // Acciones
  setCenterName: (name: string) => void;
  addNode: (name: string, type: NodeType, level: NetworkLevel) => void;
  updateNodeName: (id: string, name: string) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  deleteNode: (id: string) => void;
  addEdge: (sourceId: string, targetId: string) => void;
  deleteEdge: (edgeId: string) => void;
  clearBoard: () => void;
}

export const useSluzkiStore = create<SluzkiState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      centerName: "Usuario",

      setCenterName: (name) => set({ centerName: name }),

      addNode: (name, type, level) => set(produce((state: SluzkiState) => {
        if (!name.trim()) return;
        
        // Lógica de posicionamiento aleatorio basada en tus constantes
        const baseRadius = LEVELS[level].radius;
        const variation = (Math.random() * 40) - 20;
        const radius = baseRadius + variation;

        let minAngle = 0, maxAngle = 0;
        switch (type) {
          case "family": minAngle = Math.PI; maxAngle = 1.5 * Math.PI; break;
          case "friend": minAngle = 1.5 * Math.PI; maxAngle = 2 * Math.PI; break;
          case "work": minAngle = 0.5 * Math.PI; maxAngle = Math.PI; break;
          case "community": minAngle = 0; maxAngle = 0.5 * Math.PI; break;
        }
        const angle = Math.random() * (maxAngle - minAngle) + minAngle;

        state.nodes.push({
          id: Date.now().toString(),
          name,
          type,
          level,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        });
      })),

      updateNodeName: (id, newName) => set(produce((state: SluzkiState) => {
        const node = state.nodes.find(n => n.id === id);
        if (node) node.name = newName;
      })),

      updateNodePosition: (id, x, y) => set(produce((state: SluzkiState) => {
        const node = state.nodes.find(n => n.id === id);
        if (node) {
          node.x = x;
          node.y = y;
        }
      })),

      deleteNode: (id) => set(produce((state: SluzkiState) => {
        state.nodes = state.nodes.filter(n => n.id !== id);
        state.edges = state.edges.filter(e => e.from !== id && e.to !== id);
      })),

      addEdge: (sourceId, targetId) => set(produce((state: SluzkiState) => {
        if (sourceId === targetId) return;
        
        const exists = state.edges.find(
          e => (e.from === sourceId && e.to === targetId) || (e.from === targetId && e.to === sourceId)
        );

        if (exists) {
          // Si existe, la borramos (toggle)
          state.edges = state.edges.filter(e => e.id !== exists.id);
        } else {
          // Si no, la creamos
          state.edges.push({ 
            id: `${sourceId}-${targetId}`, 
            from: sourceId, 
            to: targetId 
          });
        }
      })),

      deleteEdge: (edgeId) => set(produce((state: SluzkiState) => {
        state.edges = state.edges.filter(e => e.id !== edgeId);
      })),

      clearBoard: () => set({ nodes: [], edges: [], centerName: "Usuario" }),
    }),
    {
      name: 'terio-sluzki-data', // Nombre en localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);