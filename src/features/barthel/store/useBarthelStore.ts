// src/features/barthel/store/useBarthelStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { BarthelSession, BarthelValue } from '../types';
import { getBarthelInterpretation, BARTHEL_ITEMS } from '../utils/constants';

interface BarthelState {
  sessions: Record<string, BarthelSession>; // key: userId

  initSession: (userId: string) => void;
  setScore: (userId: string, itemId: string, value: BarthelValue) => void;
  clearSession: (userId: string) => void;
}

export const useBarthelStore = create<BarthelState>()(
  persist(
    (set, get) => ({
      sessions: {},

      initSession: (userId) => {
        const { sessions } = get();
        if (sessions[userId]) return;

        set(produce((state: BarthelState) => {
          state.sessions[userId] = {
            id: crypto.randomUUID(),
            userId,
            date: new Date().toISOString(),
            scores: {},
            totalScore: 0,
            interpretation: getBarthelInterpretation(0)
          };
        }));
      },

      setScore: (userId, itemId, value) => {
        set(produce((state: BarthelState) => {
          const session = state.sessions[userId];
          if (!session) return;

          // 1. Actualizar el puntaje individual
          session.scores[itemId] = value;

          // 2. Recalcular el total automáticamente
          let total = 0;
          Object.values(session.scores).forEach((val) => {
            total += val;
          });
          session.totalScore = total;

          // 3. Actualizar interpretación
          session.interpretation = getBarthelInterpretation(total);
        }));
      },

      clearSession: (userId) => set(produce((state: BarthelState) => {
        delete state.sessions[userId];
      })),
    }),
    {
      name: 'terio-barthel-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);