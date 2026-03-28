<script setup lang="ts">
import { computed } from 'vue'
import { useTimelineStore } from '@/stores/useTimelineStore'

const timelineStore = useTimelineStore()

/**
 * 播放/暂停
 */
const togglePlay = () => {
  timelineStore.togglePlaying()
}

/**
 * 跳转到开始
 */
const goToStart = () => {
  timelineStore.goToStart()
}

/**
 * 跳转到结束
 */
const goToEnd = () => {
  timelineStore.goToEnd()
}

/**
 * 后退一帧
 */
const prevFrame = () => {
  timelineStore.prevFrame()
}

/**
 * 前进一帧
 */
const nextFrame = () => {
  timelineStore.nextFrame()
}

/**
 * 设置循环
 */
const toggleLoop = () => {
  // 预留循环功能
}
</script>

<template>
  <div class="flex items-center gap-1">
    <!-- 跳转到开始 -->
    <button
      class="btn btn-icon btn-secondary"
      @click="goToStart"
      title="跳转到开始 (Home)"
    >
      ⏮
    </button>
    
    <!-- 后退一帧 -->
    <button
      class="btn btn-icon btn-secondary"
      @click="prevFrame"
      title="后退一帧 (←)"
    >
      ◀
    </button>
    
    <!-- 播放/暂停 -->
    <button
      class="btn btn-primary px-4"
      :class="{ 'bg-red-500 hover:bg-red-600': timelineStore.timeline.isPlaying }"
      @click="togglePlay"
      :title="timelineStore.timeline.isPlaying ? '暂停 (空格)' : '播放 (空格)'"
    >
      {{ timelineStore.timeline.isPlaying ? '⏸ 暂停' : '▶ 播放' }}
    </button>
    
    <!-- 前进一帧 -->
    <button
      class="btn btn-icon btn-secondary"
      @click="nextFrame"
      title="前进一帧 (→)"
    >
      ▶
    </button>
    
    <!-- 跳转到结束 -->
    <button
      class="btn btn-icon btn-secondary"
      @click="goToEnd"
      title="跳转到结束 (End)"
    >
      ⏭
    </button>
    
    <div class="w-px h-5 bg-[var(--border)] mx-2" />
    
    <!-- 循环按钮（预留） -->
    <button
      class="btn btn-icon btn-secondary"
      @click="toggleLoop"
      title="循环播放"
    >
      🔁
    </button>
  </div>
</template>

<style scoped>
/* 播放控制样式 */
</style>
