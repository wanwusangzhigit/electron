// src/stores/useTimelineStore.ts
/**
 * 时间轴状态管理
 */

import { defineStore } from 'pinia'
import type { TimelineState, Track, Clip } from '@/types/timeline'
import type { Layer } from '@/types/layer'

interface TimelineStoreState {
  timeline: TimelineState
  selectedTrackIds: string[]
  selectedClipIds: string[]
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const useTimelineStore = defineStore('timeline', {
  state: (): TimelineStoreState => ({
    timeline: {
      duration: 30000, // 30 秒
      fps: 30,
      currentTime: 0,
      isPlaying: false,
      zoom: 50, // 像素/秒
      tracks: []
    },
    selectedTrackIds: [],
    selectedClipIds: []
  }),

  getters: {
    /**
     * 获取当前帧数
     */
    currentFrame(state): number {
      return Math.floor((state.timeline.currentTime / 1000) * state.timeline.fps)
    },

    /**
     * 获取总帧数
     */
    totalFrames(state): number {
      return Math.floor((state.timeline.duration / 1000) * state.timeline.fps)
    },

    /**
     * 根据图层 ID 获取轨道
     */
    getTrackByLayerId: (state) => (layerId: string): Track | undefined => {
      return state.timeline.tracks.find(track => track.layerId === layerId)
    },

    /**
     * 根据 ID 获取轨道
     */
    getTrackById: (state) => (trackId: string): Track | undefined => {
      return state.timeline.tracks.find(track => track.id === trackId)
    },

    /**
     * 获取选中的轨道
     */
    selectedTracks(state): Track[] {
      return state.timeline.tracks.filter(track => state.selectedTrackIds.includes(track.id))
    },

    /**
     * 获取每帧的毫秒数
     */
    frameDuration(state): number {
      return 1000 / state.timeline.fps
    },

    /**
     * 获取缩放级别下的像素/毫秒
     */
    pixelsPerMs(state): number {
      return state.timeline.zoom / 1000
    }
  },

  actions: {
    /**
     * 初始化时间轴（与图层同步）
     */
    initializeFromLayers(layers: Layer[]): void {
      // 为每个图层创建轨道
      const newTracks: Track[] = layers.map(layer => ({
        id: generateId(),
        layerId: layer.id,
        expanded: false,
        clips: [{
          id: generateId(),
          startTime: 0,
          endTime: this.timeline.duration,
          layerIn: 0,
          layerOut: this.timeline.duration
        }]
      }))

      this.timeline.tracks = newTracks
    },

    /**
     * 添加轨道
     */
    addTrack(layerId: string): Track {
      const track: Track = {
        id: generateId(),
        layerId,
        expanded: false,
        clips: [{
          id: generateId(),
          startTime: 0,
          endTime: this.timeline.duration,
          layerIn: 0,
          layerOut: this.timeline.duration
        }]
      }

      this.timeline.tracks.push(track)
      return track
    },

    /**
     * 删除轨道
     */
    removeTrack(trackId: string): void {
      const index = this.timeline.tracks.findIndex(t => t.id === trackId)
      if (index !== -1) {
        this.timeline.tracks.splice(index, 1)
        this.deselectTrack(trackId)
      }
    },

    /**
     * 选择轨道
     */
    selectTrack(trackId: string, multi: boolean = false): void {
      if (multi) {
        if (!this.selectedTrackIds.includes(trackId)) {
          this.selectedTrackIds.push(trackId)
        }
      } else {
        this.selectedTrackIds = [trackId]
      }
    },

    /**
     * 取消选择轨道
     */
    deselectTrack(trackId: string): void {
      this.selectedTrackIds = this.selectedTrackIds.filter(id => id !== trackId)
    },

    /**
     * 清除轨道选择
     */
    clearTrackSelection(): void {
      this.selectedTrackIds = []
    },

    /**
     * 选择片段
     */
    selectClip(clipId: string, multi: boolean = false): void {
      if (multi) {
        if (!this.selectedClipIds.includes(clipId)) {
          this.selectedClipIds.push(clipId)
        }
      } else {
        this.selectedClipIds = [clipId]
      }
    },

    /**
     * 清除片段选择
     */
    clearClipSelection(): void {
      this.selectedClipIds = []
    },

    /**
     * 设置当前时间
     */
    setCurrentTime(time: number): void {
      this.timeline.currentTime = Math.max(0, Math.min(time, this.timeline.duration))
    },

    /**
     * 设置播放状态
     */
    setPlaying(playing: boolean): void {
      this.timeline.isPlaying = playing
    },

    /**
     * 切换播放状态
     */
    togglePlaying(): void {
      this.timeline.isPlaying = !this.timeline.isPlaying
    },

    /**
     * 跳转到开始
     */
    goToStart(): void {
      this.timeline.currentTime = 0
    },

    /**
     * 跳转到结束
     */
    goToEnd(): void {
      this.timeline.currentTime = this.timeline.duration
    },

    /**
     * 跳转指定帧
     */
    goToFrame(frame: number): void {
      this.setCurrentTime((frame / this.timeline.fps) * 1000)
    },

    /**
     * 前进一帧
     */
    nextFrame(): void {
      this.goToFrame(this.currentFrame + 1)
    },

    /**
     * 后退一帧
     */
    prevFrame(): void {
      this.goToFrame(this.currentFrame - 1)
    },

    /**
     * 设置缩放级别
     */
    setZoom(zoom: number): void {
      this.timeline.zoom = Math.max(10, Math.min(200, zoom))
    },

    /**
     * 缩放时间轴（相对当前值）
     */
    zoomIn(): void {
      this.setZoom(this.timeline.zoom * 1.2)
    },

    /**
     * 缩小时间轴
     */
    zoomOut(): void {
      this.setZoom(this.timeline.zoom / 1.2)
    },

    /**
     * 展开/折叠轨道
     */
    toggleTrackExpanded(trackId: string): void {
      const track = this.timeline.tracks.find(t => t.id === trackId)
      if (track) {
        track.expanded = !track.expanded
      }
    },

    /**
     * 更新片段
     */
    updateClip(clipId: string, updates: Partial<Clip>): void {
      for (const track of this.timeline.tracks) {
        const clip = track.clips.find(c => c.id === clipId)
        if (clip) {
          Object.assign(clip, updates)
          break
        }
      }
    },

    /**
     * 移动片段
     */
    moveClip(clipId: string, deltaTime: number): void {
      for (const track of this.timeline.tracks) {
        const clip = track.clips.find(c => c.id === clipId)
        if (clip) {
          const newStartTime = Math.max(0, clip.startTime + deltaTime)
          const duration = clip.endTime - clip.startTime
          clip.startTime = newStartTime
          clip.endTime = newStartTime + duration
          break
        }
      }
    },

    /**
     * 修剪片段开始时间
     */
    trimClipStart(clipId: string, newStartTime: number): void {
      for (const track of this.timeline.tracks) {
        const clip = track.clips.find(c => c.id === clipId)
        if (clip && newStartTime < clip.endTime) {
          clip.startTime = newStartTime
          break
        }
      }
    },

    /**
     * 修剪片段结束时间
     */
    trimClipEnd(clipId: string, newEndTime: number): void {
      for (const track of this.timeline.tracks) {
        const clip = track.clips.find(c => c.id === clipId)
        if (clip && newEndTime > clip.startTime) {
          clip.endTime = newEndTime
          break
        }
      }
    },

    /**
     * 设置项目时长
     */
    setDuration(duration: number): void {
      this.timeline.duration = Math.max(1000, duration)
    },

    /**
     * 设置帧率
     */
    setFps(fps: number): void {
      this.timeline.fps = Math.max(1, Math.min(60, fps))
    },

    /**
     * 重置时间轴
     */
    reset(): void {
      this.timeline = {
        duration: 30000,
        fps: 30,
        currentTime: 0,
        isPlaying: false,
        zoom: 50,
        tracks: []
      }
      this.selectedTrackIds = []
      this.selectedClipIds = []
    },

    /**
     * 从 JSON 加载时间轴
     */
    loadFromJSON(timeline: TimelineState): void {
      this.timeline = { ...timeline }
      this.selectedTrackIds = []
      this.selectedClipIds = []
    }
  }
})
