import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OSASession, OSAScaleValue } from '../types';

interface OSAState {
  activeSession: OSASession | null;
  startSession: (userId: string) => void;
  setResponse: (itemId: string, type: 'performance' | 'importance', value: OSAScaleValue) => void;
  clearSession: () => void;
}

export const useOSAStore = create<OSAState>()(
  persist(
    (set, get) => ({
      activeSession: null,

      startSession: (userId) => {
        set({
          activeSession: {
            id: crypto.randomUUID(),
            userId,
            date: new Date().toISOString(),
            responses: {},
          }
        });
      },

      setResponse: (itemId, type, value) => {
        const session = get().activeSession;
        if (!session) return;

        const currentResponse = session.responses[itemId] || { itemId, performance: null, importance: null };
        
        const newResponse = {
            ...currentResponse,
            [type]: value
        };

        set({
          activeSession: {
            ...session,
            responses: {
              ...session.responses,
              [itemId]: newResponse
            }
          }
        });
      },

      clearSession: () => set({ activeSession: null }),
    }),
    { name: 'terio-osa-storage' }
  )
);