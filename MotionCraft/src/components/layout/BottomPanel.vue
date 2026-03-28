<script setup lang="ts">
import { computed } from 'vue'
import { useTimelineStore } from '@/stores/useTimelineStore'
import { usePlaybackStore } from '@/stores/usePlaybackStore'
import Timeline from '../timeline/Timeline.vue'
import PlaybackControls from '../timeline/PlaybackControls.vue'

const timelineStore = useTimelineStore()
const playbackStore = usePlaybackStore()

/**
 * 格式化当前时间显示
 */
const currentTimeDisplay = computed(() => {
  const totalSeconds = Math.floor(timelineStore.timeline.currentTime / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const frames = Math.floor((timelineStore.timeline.currentTime % 1000) / (1000 / timelineStore.timeline.fps))
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`
})

/**
 * 格式化总时长显示
 */
const durationDisplay = computed(() => {
  const totalSeconds = Math.floor(timelineStore.timeline.duration / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})
</script>

<template>
  <div class="h-full bg-[var(--bg-secondary)] flex flex-col">
    <!-- 播放控制栏 -->
    <div class="h-10 border-b border-[var(--border)] flex items-center px-3 gap-3">
      <!-- 时间显示 -->
      <div class="flex items-center gap-2 font-mono text-sm bg-[var(--bg-tertiary)] px-2 py-1 rounded">
        <span class="text-[var(--accent)]">{{ currentTimeDisplay }}</span>
        <span class="text-[var(--text-secondary)]">/</span>
        <span class="text-[var(--text-secondary)]">{{ durationDisplay }}</span>
      </div>
      
      <div class="w-px h-5 bg-[var(--border)]" />
      
      <!-- 播放控制组件 -->
      <PlaybackControls />
      
      <div class="flex-1" />
      
      <!-- 帧率显示 -->
      <div class="text-xs text-[var(--text-secondary)]">
        {{ timelineStore.timeline.fps }} fps
      </div>
    </div>
    
    <!-- 时间轴组件 -->
    <Timeline class="flex-1 overflow-hidden" />
  </div>
</template>

<style scoped>
/* 底部面板样式 */
</style>
