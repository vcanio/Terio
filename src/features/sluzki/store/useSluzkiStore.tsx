import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import toast from 'react-hot-toast';
import { NodeData, EdgeData, NodeType, NetworkLevel } from '../types';
import { LEVELS } from '../utils/constants';
import { SluzkiStateSchema } from '../schemas';

// Definimos el orden de prioridad de los grupos para el ordenamiento
const GROUP_ORDER: Record<NodeType, number> = {
  family: 1,
  friend: 2,
  work: 3,
  community: 4,
};

interface SluzkiState {
  nodes: NodeData[];
  edges: EdgeData[];
  centerName: string;
  
  // Campos para recordar la última selección en el modal
  lastNodeType: NodeType;
  
  // Estado para el zoom global de los nodos
  nodeScale: number;
  
  // Acciones
  setCenterName: (name: string) => void;
  addNode: (name: string, type: NodeType, level?: NetworkLevel) => void;
  updateNodeName: (id: string, name: string) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  updateNodeLevel: (id: string, level: NetworkLevel) => void; // Nueva acción
  deleteNode: (id: string) => void;
  addEdge: (sourceId: string, targetId: string) => void;
  deleteEdge: (edgeId: string) => void;
  clearBoard: () => void;
  setNodeScale: (scale: number) => void;
}

export const useSluzkiStore = create<SluzkiState>()(
  persist(
    (set) => ({
      nodes: [],
      edges: [],
      centerName: "Usuario",
      
      // Valores por defecto iniciales
      lastNodeType: "family",
      nodeScale: 1,

      setCenterName: (name) => set({ centerName: name }),

      setNodeScale: (scale) => set({ nodeScale: scale }),

      addNode: (name, type, level = 1) => {
        set(produce((state: SluzkiState) => {
          if (!name.trim()) return;
          
          // Cálculo simple: Ponerlo cerca del centro aleatoriamente
          const radius = 50 + (Math.random() * 50);

          let minAngle = 0, maxAngle = 0;
          switch (type) {
            case "family": minAngle = Math.PI; maxAngle = 1.5 * Math.PI; break;
            case "friend": minAngle = 1.5 * Math.PI; maxAngle = 2 * Math.PI; break;
            case "work": minAngle = 0.5 * Math.PI; maxAngle = Math.PI; break;
            case "community": minAngle = 0; maxAngle = 0.5 * Math.PI; break;
          }
          const angle = Math.random() * (maxAngle - minAngle) + minAngle;

          // 1. Insertamos el nuevo nodo
          state.nodes.push({
            id: Date.now().toString(),
            name,
            type,
            level: 1, // Siempre nace en nivel 1
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
          });

          // 2. ORDENAMIENTO AUTOMÁTICO
          state.nodes.sort((a, b) => {
            const diffGroup = GROUP_ORDER[a.type] - GROUP_ORDER[b.type];
            if (diffGroup !== 0) return diffGroup;
            return a.level - b.level;
          });

          // Actualizamos la memoria del último tipo usado
          state.lastNodeType = type;
        }));
        toast.success("Nodo agregado al centro");
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

      updateNodeLevel: (id, newLevel) => set(produce((state: SluzkiState) => {
        const node = state.nodes.find(n => n.id === id);
        if (node && node.level !== newLevel) {
          node.level = newLevel;
          // Reordenar nodos si cambia el nivel
          state.nodes.sort((a, b) => {
            const diffGroup = GROUP_ORDER[a.type] - GROUP_ORDER[b.type];
            if (diffGroup !== 0) return diffGroup;
            return a.level - b.level;
          });
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
          }
        }
      },
    }
  )
);