import { create } from 'zustand';
import { TaskItem } from '@/lib/types';

interface AppState {
  boardTasks: TaskItem[];
  setBoardTasks: (tasks: TaskItem[]) => void;
  upsertTask: (task: TaskItem) => void;
}

export const useAppStore = create<AppState>((set) => ({
  boardTasks: [],
  setBoardTasks: (tasks) => set({ boardTasks: tasks }),
  upsertTask: (task) =>
    set((state) => ({
      boardTasks: state.boardTasks.some((item) => item.id === task.id)
        ? state.boardTasks.map((item) => (item.id === task.id ? { ...item, ...task } : item))
        : [task, ...state.boardTasks],
    })),
}));
