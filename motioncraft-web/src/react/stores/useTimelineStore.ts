// 文件路径: src/react/stores/useTimelineStore.ts

/**
 * 时间轴状态管理 - Zustand
 * 管理播放、时间轴缩放、选中状态等
 */

import { create } from 'zustand';
import type { TimelineState, Track, Clip } from '@types';

interface TimelineActions {
  setPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setZoom: (zoom: number) => void;
  setScrollX: (scrollX: number) => void;
  setSelectedClip: (clipId: string | null) => void;
  toggleLooping: () => void;
  updateTrack: (trackId: string, changes: Partial<Track>) => void;
  addTrack: (track: Track) => void;
  removeTrack: (trackId: string) => void;
  syncTracksFromLayers: (layers: any[]) => void;
}

export const useTimelineStore = create<TimelineState & TimelineActions>((set, get) => ({
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

  setPlaying: (isPlaying) => {
    set({ isPlaying });
  },

  setCurrentTime: (time) => {
    const { duration, isLooping } = get();
    let newTime = time;
    
    if (isLooping && time >= duration) {
      newTime = 0;
    } else if (time > duration) {
      newTime = duration;
    } else if (time < 0) {
      newTime = 0;
    }
    
    set({ currentTime: Math.max(0, Math.min(newTime, duration)) });
  },

  setZoom: (zoom) => {
    set({ zoom: Math.max(10, Math.min(500, zoom)) });
  },

  setScrollX: (scrollX) => {
    set({ scrollX: Math.max(0, scrollX) });
  },

  setSelectedClip: (clipId) => {
    set({ selectedClipId: clipId });
  },

  toggleLooping: () => {
    set((state) => ({ isLooping: !state.isLooping }));
  },

  updateTrack: (trackId, changes) => {
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId ? { ...track, ...changes } : track
      ),
    }));
  },

  addTrack: (track) => {
    set((state) => ({
      tracks: [...state.tracks, track],
    }));
  },

  removeTrack: (trackId) => {
    set((state) => ({
      tracks: state.tracks.filter((track) => track.id !== trackId),
    }));
  },

  syncTracksFromLayers: (layers) => {
    set((state) => {
      const existingLayerIds = new Set(state.tracks.map(t => t.layerId));
      const newTracks: Track[] = [...state.tracks];
      
      layers.forEach((layer, index) => {
        if (!existingLayerIds.has(layer.id)) {
          newTracks.push({
            id: `track-${layer.id}`,
            layerId: layer.id,
            name: layer.name,
            visible: layer.visible,
            locked: layer.locked,
            expanded: false,
            height: 40,
            clips: [{
              id: `clip-${layer.id}`,
              startTime: 0,
              endTime: state.duration,
              layerIn: 0,
              layerOut: state.duration,
              color: getClipColor(layer.type),
            }],
          });
        }
      });
      
      // 移除已删除图层对应的轨道
      const currentLayerIds = new Set(layers.map(l => l.id));
      const filteredTracks = newTracks.filter(t => currentLayerIds.has(t.layerId));
      
      return { tracks: filteredTracks };
    });
  },
}));

function getClipColor(layerType: string): string {
  switch (layerType) {
    case 'image':
      return '#4488ff';
    case 'text':
      return '#ffaa00';
    case 'shape-rect':
    case 'shape-circle':
    case 'shape-line':
      return '#00d6b4';
    default:
      return '#666666';
  }
}
