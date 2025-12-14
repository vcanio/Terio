import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { COPMSession, COPMScore } from '../types';

interface COPMState {
  sessions: Record<string, COPMSession>;

  initSession: (userId: string) => void;
  addProblem: (userId: string, description: string, category: string, importance: COPMScore) => void;
  deleteProblem: (userId: string, problemId: string) => void;
  setScore: (
    userId: string, 
    problemId: string, 
    field: 'performanceT1' | 'satisfactionT1' | 'performanceT2' | 'satisfactionT2', 
    score: COPMScore
  ) => void;
  startReevaluation: (userId: string) => void;
  cancelReevaluation: (userId: string) => void; // <--- NUEVA ACCIÓN
}

export const useCOPMStore = create<COPMState>()(
  persist(
    (set, get) => ({
      sessions: {},

      initSession: (userId) => {
        const { sessions } = get();
        if (sessions[userId]) return;

        set(produce((state: COPMState) => {
          state.sessions[userId] = {
            id: crypto.randomUUID(),
            userId,
            dateT1: new Date().toISOString(),
            problems: [],
          };
        }));
      },

      addProblem: (userId, description, category, importance) => {
        set(produce((state: COPMState) => {
          const session = state.sessions[userId];
          if (session) {
            session.problems.push({
              id: crypto.randomUUID(),
              description,
              category,
              importance,
            });
          }
        }));
      },

      deleteProblem: (userId, problemId) => {
        set(produce((state: COPMState) => {
          const session = state.sessions[userId];
          if (session) {
            session.problems = session.problems.filter(p => p.id !== problemId);
          }
        }));
      },

      setScore: (userId, problemId, field, score) => {
        set(produce((state: COPMState) => {
          const problem = state.sessions[userId]?.problems.find(p => p.id === problemId);
          if (problem) {
            problem[field] = score;
          }
        }));
      },

      startReevaluation: (userId) => {
        set(produce((state: COPMState) => {
          const session = state.sessions[userId];
          if (session && !session.dateT2) {
            session.dateT2 = new Date().toISOString();
          }
        }));
      },

      // <--- IMPLEMENTACIÓN PARA SALIR DEL MODO RE-EVALUACIÓN
      cancelReevaluation: (userId) => {
        set(produce((state: COPMState) => {
          const session = state.sessions[userId];
          if (session) {
            session.dateT2 = undefined; // Borramos la fecha T2 para "abrir" el candado
          }
        }));
      }
    }),
    {
      name: 'terio-copm-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);