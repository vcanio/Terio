import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { VQScore } from '../utils/constants';

interface Observation {
  itemId: number;
  score: VQScore | null;
  note: string;
}

interface Session {
  id: string;
  userId: string; // Foreign Key al Usuario
  date: string;
  activity: string;
  environment: string;
  conclusion?: string;
  observations: Record<number, Observation>;
}

interface VQState {
  sessions: Session[];
  activeSessionId: string | null;
  
  // Acciones
  createSession: (activity: string, environment: string) => void;
  updateObservation: (itemId: number, score: VQScore) => void;
  updateNote: (itemId: number, note: string) => void;
  updateConclusion: (text: string) => void;
  deleteSession: (id: string) => void;
  setActiveSession: (id: string | null) => void;
}

export const useVQStore = create<VQState>()(
  persist(
    (set) => ({
      sessions: [],
      activeSessionId: null,

      createSession: (activity, environment) => {
        // Obtenemos ID del usuario activo del otro store via localStorage
        const userStoreStr = localStorage.getItem('terio-users-db');
        let currentUserId = "guest";
        
        if (userStoreStr) {
            try {
                const { state } = JSON.parse(userStoreStr);
                if (state.activeUserId) currentUserId = state.activeUserId;
            } catch (e) {
                console.error("Error leyendo usuario activo", e);
            }
        }

        const newSession: Session = {
          id: Date.now().toString(),
          userId: currentUserId, 
          date: new Date().toISOString(),
          activity,
          environment,
          conclusion: '',
          observations: {},
        };
        
        set(produce((state: VQState) => {
          state.sessions.unshift(newSession);
          state.activeSessionId = newSession.id;
        }));
      },

      updateObservation: (itemId, score) => set(produce((state: VQState) => {
        if (!state.activeSessionId) return;
        const session = state.sessions.find(s => s.id === state.activeSessionId);
        if (session) {
          if (!session.observations[itemId]) {
            session.observations[itemId] = { itemId, score: null, note: '' };
          }
          session.observations[itemId].score = score;
        }
      })),

      updateNote: (itemId, note) => set(produce((state: VQState) => {
        if (!state.activeSessionId) return;
        const session = state.sessions.find(s => s.id === state.activeSessionId);
        if (session) {
           if (!session.observations[itemId]) {
            session.observations[itemId] = { itemId, score: null, note: '' };
          }
          session.observations[itemId].note = note;
        }
      })),

      updateConclusion: (text) => set(produce((state: VQState) => {
        if (!state.activeSessionId) return;
        const session = state.sessions.find(s => s.id === state.activeSessionId);
        if (session) {
          session.conclusion = text;
        }
      })),

      deleteSession: (id) => set(produce((state: VQState) => {
        state.sessions = state.sessions.filter(s => s.id !== id);
        if (state.activeSessionId === id) state.activeSessionId = null;
      })),

      setActiveSession: (id) => set({ activeSessionId: id }),
    }),
    {
      name: 'terio-vq-data',
      storage: createJSONStorage(() => localStorage),
    }
  )
);