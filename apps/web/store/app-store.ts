import { create } from 'zustand';
import { TaskItem } from '@/lib/types';

interface AppState {
  boardTasks: TaskItem[];
  isCreatingTask: boolean;
  setBoardTasks: (tasks: TaskItem[]) => void;
  upsertTask: (task: TaskItem) => void;
  moveTaskStatus: (taskId: string, status: string) => void;
  setCreatingTask: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  boardTasks: [],
  isCreatingTask: false,
  setBoardTasks: (tasks) => set({ boardTasks: tasks }),
  upsertTask: (task) =>
    set((state) => ({
      boardTasks: state.boardTasks.some((item) => item.id === task.id)
        ? state.boardTasks.map((item) => (item.id === task.id ? { ...item, ...task } : item))
        : [task, ...state.boardTasks],
    })),
  moveTaskStatus: (taskId, status) =>
    set((state) => ({
      boardTasks: state.boardTasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
    })),
  setCreatingTask: (value) => set({ isCreatingTask: value }),
}));
