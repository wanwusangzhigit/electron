// 文件路径: src/react/stores/useProjectStore.ts

/**
 * 项目状态管理 - Zustand
 * 管理整个项目的核心状态
 */

import { create } from 'zustand';
import type { Project, Asset } from '@types';

interface ProjectState {
  project: Project | null;
  selectedLayerIds: string[];
  isDirty: boolean;
  
  // Actions
  setProject: (project: Project) => void;
  updateProject: (changes: Partial<Project>) => void;
  addAsset: (asset: Asset) => void;
  removeAsset: (assetId: string) => void;
  selectLayers: (layerIds: string[]) => void;
  markDirty: () => void;
  resetProject: () => void;
}

const createDefaultProject = (): Project => ({
  id: `proj-${Date.now()}`,
  name: 'Untitled Project',
  width: 1920,
  height: 1080,
  fps: 30,
  duration: 30000,
  backgroundColor: '#000000',
  layers: [],
  timeline: {
    duration: 30000,
    fps: 30,
    currentTime: 0,
    isPlaying: false,
    isLooping: false,
    zoom: 50,
    scrollX: 0,
    selectedClipId: null,
    selectedKeyframeIds: [],
    tracks: [],
  },
  assets: [],
  version: '1.0.0',
  createdAt: Date.now(),
  modifiedAt: Date.now(),
});

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: null,
  selectedLayerIds: [],
  isDirty: false,

  setProject: (project) => {
    set({ project, isDirty: false });
  },

  updateProject: (changes) => {
    const current = get().project;
    if (current) {
      set({
        project: {
          ...current,
          ...changes,
          modifiedAt: Date.now(),
        },
        isDirty: true,
      });
    }
  },

  addAsset: (asset) => {
    const current = get().project;
    if (current) {
      set({
        project: {
          ...current,
          assets: [...current.assets, asset],
          modifiedAt: Date.now(),
        },
        isDirty: true,
      });
    }
  },

  removeAsset: (assetId) => {
    const current = get().project;
    if (current) {
      set({
        project: {
          ...current,
          assets: current.assets.filter(a => a.id !== assetId),
          modifiedAt: Date.now(),
        },
        isDirty: true,
      });
    }
  },

  selectLayers: (layerIds) => {
    set({ selectedLayerIds: layerIds });
  },

  markDirty: () => {
    set({ isDirty: true });
  },

  resetProject: () => {
    set({ project: createDefaultProject(), isDirty: false, selectedLayerIds: [] });
  },
}));

// 初始化默认项目
useProjectStore.getState().resetProject();
