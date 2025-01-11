import { create } from 'zustand';
import { File } from '../types/file';

console.trace()

interface FilesState {
  files: File[];
  searchQuery: string;
  addFile: () => void;
  updateFile: (id: string, updates: Partial<File>) => void;
  setSearchQuery: (query: string) => void;
}

export const useFilesStore = create<FilesState>((set) => ({
    files: [],
  searchQuery: '',

  addFile: () => {
    const newFile: File = {
      id: crypto.randomUUID(),
      title: 'Untitled File',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
        files: [newFile, ...state.files],
    }));

    // Navigate to the new file using the route path
    window.history.pushState({}, '', `/files/${newFile.id}`);
  },

  updateFile: (id, updates) => {
    set((state) => ({
        files: state.files.map((file) =>
        file.id === id
          ? { ...file, ...updates, updatedAt: new Date() }
          : file
      ),
    }));
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
}));