import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import toast from 'react-hot-toast';
import { NodeData, EdgeData, NodeType, NetworkLevel } from '../types';
import { LEVELS } from '../utils/constants';
import { SluzkiStateSchema } from '../schemas';

interface SluzkiState {
  nodes: NodeData[];
  edges: EdgeData[];
  centerName: string;
  
  // Nuevos campos para recordar la última selección
  lastNodeType: NodeType;
  lastNodeLevel: NetworkLevel;

  // CAMBIO 1: Estado para el tamaño de los nodos
  nodeScale: number;
  
  // Acciones
  setCenterName: (name: string) => void;
  addNode: (name: string, type: NodeType, level: NetworkLevel) => void;
  updateNodeName: (id: string, name: string) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  deleteNode: (id: string) => void;
  addEdge: (sourceId: string, targetId: string) => void;
  deleteEdge: (edgeId: string) => void;
  clearBoard: () => void;
  // CAMBIO 2: Acción para cambiar el tamaño
  setNodeScale: (scale: number) => void;
}

export const useSluzkiStore = create<SluzkiState>()(
  persist(
    (set) => ({
      nodes: [],
      edges: [],
      centerName: "Usuario",
      
      // Valores por defecto
      lastNodeType: "family",
      lastNodeLevel: 1,
      nodeScale: 1, // Tamaño normal por defecto

      setCenterName: (name) => set({ centerName: name }),

      // CAMBIO 3: Implementación del setter
      setNodeScale: (scale) => set({ nodeScale: scale }),

      addNode: (name, type, level) => {
        set(produce((state: SluzkiState) => {
          if (!name.trim()) return;
          
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

          state.lastNodeType = type;
          state.lastNodeLevel = level;
        }));
        toast.success("Nodo agregado");
      },

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

      deleteNode: (id) => {
        set(produce((state: SluzkiState) => {
          state.nodes = state.nodes.filter(n => n.id !== id);
          state.edges = state.edges.filter(e => e.from !== id && e.to !== id);
        }));
        toast("Nodo eliminado", { icon: '🗑️' });
      },

      addEdge: (sourceId, targetId) => set(produce((state: SluzkiState) => {
        if (sourceId === targetId) return;
        
        const exists = state.edges.find(
          e => (e.from === sourceId && e.to === targetId) || (e.from === targetId && e.to === sourceId)
        );

        if (exists) {
          state.edges = state.edges.filter(e => e.id !== exists.id);
          toast("Conexión eliminada", { icon: '🔌' });
        } else {
          state.edges.push({ 
            id: `${sourceId}-${targetId}`, 
            from: sourceId, 
            to: targetId 
          });
          toast.success("Conexión creada");
        }
      })),

      deleteEdge: (edgeId) => {
        set(produce((state: SluzkiState) => {
          state.edges = state.edges.filter(e => e.id !== edgeId);
        }));
        toast("Conexión eliminada", { icon: '✂️' });
      },

      clearBoard: () => {
        set({ nodes: [], edges: [], centerName: "Usuario" });
        toast.success("Mapa reiniciado");
      },
    }),
    {
      name: 'terio-sluzki-data',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          try {
            SluzkiStateSchema.parse({
              nodes: state.nodes,
              edges: state.edges,
              centerName: state.centerName
            });
            console.log("✅ Estado rehidratado y validado correctamente");
          } catch (error) {
            console.error("❌ Error de validación en localStorage:", error);
            toast.error("Datos corruptos detectados. Se ha reiniciado el estado por seguridad.");
          }
        }
      },
    }
  )
);