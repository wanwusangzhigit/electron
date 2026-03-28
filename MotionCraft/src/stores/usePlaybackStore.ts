// src/stores/usePlaybackStore.ts
/**
 * 播放控制状态管理
 */

import { defineStore } from 'pinia'

interface PlaybackState {
  isPlaying: boolean
  currentTime: number
  duration: number
  fps: number
  loop: boolean
  playbackRate: number
}

export const usePlaybackStore = defineStore('playback', {
  state: (): PlaybackState => ({
    isPlaying: false,
    currentTime: 0,
    duration: 30000, // 30 秒
    fps: 30,
    loop: true,
    playbackRate: 1
  }),

  getters: {
    /**
     * 当前帧数
     */
    currentFrame(state): number {
      return Math.floor((state.currentTime / 1000) * state.fps)
    },

    /**
     * 总帧数
     */
    totalFrames(state): number {
      return Math.floor((state.duration / 1000) * state.fps)
    },

    /**
     * 每帧毫秒数
     */
    frameDuration(state): number {
      return 1000 / state.fps
    },

    /**
     * 播放进度 (0-1)
     */
    progress(state): number {
      return state.duration > 0 ? state.currentTime / state.duration : 0
    },

    /**
     * 剩余时间（毫秒）
     */
    remainingTime(state): number {
      return state.duration - state.currentTime
    },

    /**
     * 格式化当前时间
     */
    formattedCurrentTime(state): string {
      const totalSeconds = Math.floor(state.currentTime / 1000)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },

    /**
     * 格式化总时长
     */
    formattedDuration(state): string {
      const totalSeconds = Math.floor(state.duration / 1000)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
  },

  actions: {
    /**
     * 开始播放
     */
    play(): void {
      this.isPlaying = true
    },

    /**
     * 暂停播放
     */
    pause(): void {
      this.isPlaying = false
    },

    /**
     * 切换播放/暂停
     */
    togglePlay(): void {
      this.isPlaying = !this.isPlaying
    },

    /**
     * 停止播放（回到开始）
     */
    stop(): void {
      this.isPlaying = false
      this.currentTime = 0
    },

    /**
     * 设置当前时间
     */
    setCurrentTime(time: number): void {
      this.currentTime = Math.max(0, Math.min(time, this.duration))
    },

    /**
     * 设置时长
     */
    setDuration(duration: number): void {
      this.duration = Math.max(1000, duration)
    },

    /**
     * 设置帧率
     */
    setFps(fps: number): void {
      this.fps = Math.max(1, Math.min(60, fps))
    },

    /**
     * 跳转到指定帧
     */
    goToFrame(frame: number): void {
      this.setCurrentTime((frame / this.fps) * 1000)
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
     * 跳转到开始
     */
    goToStart(): void {
      this.setCurrentTime(0)
    },

    /**
     * 跳转到结束
     */
    goToEnd(): void {
      this.setCurrentTime(this.duration)
    },

    /**
     * 设置循环
     */
    setLoop(loop: boolean): void {
      this.loop = loop
    },

    /**
     * 设置播放速度
     */
    setPlaybackRate(rate: number): void {
      this.playbackRate = Math.max(0.25, Math.min(4, rate))
    },

    /**
     * 更新播放时间（由 animation frame 调用）
     */
    update(deltaTime: number): void {
      if (!this.isPlaying) return

      const adjustedDelta = deltaTime * this.playbackRate
      this.currentTime += adjustedDelta

      // 检查是否到达结尾
      if (this.currentTime >= this.duration) {
        if (this.loop) {
          this.currentTime = 0
        } else {
          this.currentTime = this.duration
          this.isPlaying = false
        }
      }
    },

    /**
     * 重置播放状态
     */
    reset(): void {
      this.isPlaying = false
      this.currentTime = 0
      this.duration = 30000
      this.fps = 30
      this.loop = true
      this.playbackRate = 1
    }
  }
})
