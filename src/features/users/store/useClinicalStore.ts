import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';

export interface ClinicalUser {
  id: string;
  name: string; // Nombre del Usuario
  age?: string;
  diagnosis?: string; // Motivo de consulta o diagnóstico ocupacional
  createdAt: string;
}

interface ClinicalUserState {
  users: ClinicalUser[];
  activeUserId: string | null; // ID del Usuario que estás atendiendo actualmente

  addUser: (user: Omit<ClinicalUser, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, data: Partial<ClinicalUser>) => void;
  deleteUser: (id: string) => void;
  setActiveUser: (id: string | null) => void;
  getActiveUser: () => ClinicalUser | undefined;
}

export const useClinicalUserStore = create<ClinicalUserState>()(
  persist(
    (set, get) => ({
      users: [],
      activeUserId: null,

      addUser: (data) => set(produce((state: ClinicalUserState) => {
        const newUser = {
          ...data,
          id: crypto.randomUUID(), // Genera un ID único real
          createdAt: new Date().toISOString(),
        };
        state.users.unshift(newUser);
        state.activeUserId = newUser.id; // Seleccionar automáticamente al crear
      })),

      updateUser: (id, data) => set(produce((state: ClinicalUserState) => {
        const index = state.users.findIndex(u => u.id === id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...data };
        }
      })),

      deleteUser: (id) => set(produce((state: ClinicalUserState) => {
        state.users = state.users.filter(u => u.id !== id);
        if (state.activeUserId === id) state.activeUserId = null;
      })),

      setActiveUser: (id) => set({ activeUserId: id }),

      getActiveUser: () => {
        const { users, activeUserId } = get();
        return users.find(u => u.id === activeUserId);
      }
    }),
    {
      name: 'terio-users-db', // Nombre clave en localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);