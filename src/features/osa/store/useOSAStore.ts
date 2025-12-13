import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OSASession, OSAScaleValue } from '../types';

interface OSAState {
  // Ahora guardamos un diccionario de sesiones: { "user-123": SessionA, "user-456": SessionB }
  sessions: Record<string, OSASession>;

  // Acciones
  initSession: (userId: string) => void;
  setResponse: (userId: string, itemId: string, type: 'performance' | 'importance', value: OSAScaleValue) => void;
  clearAllSessions: () => void;
}

export const useOSAStore = create<OSAState>()(
  persist(
    (set, get) => ({
      sessions: {},

      // Inicializa una sesión para el usuario si no existe
      initSession: (userId) => {
        const { sessions } = get();
        
        // Si ya existe sesión para este usuario, no hacemos nada
        if (sessions[userId]) return;

        // Si no existe, creamos una nueva
        set({
          sessions: {
            ...sessions,
            [userId]: {
              id: crypto.randomUUID(),
              userId,
              date: new Date().toISOString(),
              responses: {},
            }
          }
        });
      },

      setResponse: (userId, itemId, type, value) => {
        const { sessions } = get();
        const userSession = sessions[userId];

        if (!userSession) return;

        const currentResponse = userSession.responses[itemId] || { itemId, performance: null, importance: null };
        
        const newResponse = {
            ...currentResponse,
            [type]: value
        };

        set({
          sessions: {
            ...sessions,
            [userId]: {
              ...userSession,
              responses: {
                ...userSession.responses,
                [itemId]: newResponse
              }
            }
          }
        });
      },

      clearAllSessions: () => set({ sessions: {} }),
    }),
    { name: 'terio-osa-storage' }
  )
);