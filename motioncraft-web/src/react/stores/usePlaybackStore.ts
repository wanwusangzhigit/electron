// 文件路径: src/react/stores/usePlaybackStore.ts

/**
 * 播放状态管理 - Zustand
 * 专门处理播放循环和动画更新
 */

import { create } from 'zustand';

interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  fps: number;
  isLooping: boolean;
  lastFrameTime: number;
  animationFrameId: number | null;
  
  // Actions
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  update: (deltaTime: number) => void;
  setDuration: (duration: number) => void;
  setFps: (fps: number) => void;
  setLooping: (isLooping: boolean) => void;
  stop: () => void;
}

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  isPlaying: false,
  currentTime: 0,
  duration: 30000,
  fps: 30,
  isLooping: false,
  lastFrameTime: 0,
  animationFrameId: null,

  play: () => {
    const state = get();
    if (state.isPlaying) return;
    
    set({ 
      isPlaying: true, 
      lastFrameTime: performance.now() 
    });
  },

  pause: () => {
    const state = get();
    if (!state.isPlaying) return;
    
    if (state.animationFrameId !== null) {
      cancelAnimationFrame(state.animationFrameId);
    }
    
    set({ isPlaying: false, animationFrameId: null });
  },

  toggle: () => {
    const state = get();
    if (state.isPlaying) {
      get().pause();
    } else {
      get().play();
    }
  },

  seek: (time) => {
    set({ 
      currentTime: Math.max(0, Math.min(time, get().duration)) 
    });
  },

  update: (deltaTime) => {
    const state = get();
    if (!state.isPlaying) return;
    
    const newTime = state.currentTime + deltaTime;
    
    if (newTime >= state.duration) {
      if (state.isLooping) {
        set({ currentTime: 0 });
      } else {
        set({ currentTime: state.duration, isPlaying: false });
        get().pause();
      }
    } else {
      set({ currentTime: newTime });
    }
  },

  setDuration: (duration) => {
    set({ duration });
  },

  setFps: (fps) => {
    set({ fps });
  },

  setLooping: (isLooping) => {
    set({ isLooping });
  },

  stop: () => {
    get().pause();
    set({ currentTime: 0 });
  },
}));

// 启动播放循环的辅助函数
export const startPlaybackLoop = (callback: (deltaTime: number) => void): (() => void) => {
  let frameId: number;
  let lastTime = performance.now();
  
  const loop = (currentTime: number) => {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    callback(deltaTime);
    frameId = requestAnimationFrame(loop);
  };
  
  frameId = requestAnimationFrame(loop);
  
  return () => cancelAnimationFrame(frameId);
};
