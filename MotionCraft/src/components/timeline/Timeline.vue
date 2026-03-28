<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLayerStore } from '@/stores/useLayerStore'
import { useTimelineStore } from '@/stores/useTimelineStore'
import TrackList from './TrackList.vue'
import TimelineRuler from './TimelineRuler.vue'

const layerStore = useLayerStore()
const timelineStore = useTimelineStore()

const timelineContainerRef = ref<HTMLElement | null>(null)
const isDraggingPlayhead = ref(false)

/**
 * 时间轴总宽度（像素）
 */
const timelineWidth = computed(() => {
  return (timelineStore.timeline.duration / 1000) * timelineStore.timeline.zoom
})

/**
 * 播放头位置（像素）
 */
const playheadPosition = computed(() => {
  return (timelineStore.timeline.currentTime / 1000) * timelineStore.timeline.zoom
})

/**
 * 开始拖拽播放头
 */
const startDragPlayhead = (e: MouseEvent) => {
  isDraggingPlayhead.value = true
  document.addEventListener('mousemove', onDragPlayhead)
  document.addEventListener('mouseup', stopDragPlayhead)
}

/**
 * 拖拽播放头
 */
const onDragPlayhead = (e: MouseEvent) => {
  if (!isDraggingPlayhead.value || !timelineContainerRef.value) return
  
  const rect = timelineContainerRef.value.getBoundingClientRect()
  const scrollLeft = timelineContainerRef.value.scrollLeft
  const x = e.clientX - rect.left + scrollLeft - 200 // 减去轨道头部宽度
  
  const timeMs = (x / timelineStore.timeline.zoom) * 1000
  timelineStore.setCurrentTime(Math.max(0, Math.min(timeMs, timelineStore.timeline.duration)))
}

/**
 * 停止拖拽播放头
 */
const stopDragPlayhead = () => {
  isDraggingPlayhead.value = false
  document.removeEventListener('mousemove', onDragPlayhead)
  document.removeEventListener('mouseup', stopDragPlayhead)
}

/**
 * 滚轮缩放时间轴
 */
const handleWheel = (e: WheelEvent) => {
  if (e.ctrlKey) {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    timelineStore.setZoom(timelineStore.timeline.zoom * delta)
  }
}
</script>

<template>
  <div 
    ref="timelineContainerRef"
    class="w-full h-full overflow-auto relative"
    @wheel="handleWheel"
  >
    <div 
      class="relative min-h-full"
      :style="{ width: `${timelineWidth + 200}px` }"
    >
      <!-- 时间标尺 -->
      <TimelineRuler 
        class="sticky top-0 z-20"
        :width="timelineWidth"
      />
      
      <!-- 轨道列表 -->
      <TrackList class="mt-[30px]" />
      
      <!-- 播放头 -->
      <div 
        class="playhead"
        :style="{ left: `${playheadPosition + 200}px` }"
        @mousedown="startDragPlayhead"
      >
        <div class="playhead-head" />
      </div>
    </div>
    
    <!-- 空状态提示 -->
    <div 
      v-if="layerStore.layers.length === 0"
      class="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div class="text-center text-[var(--text-secondary)] text-sm">
        <div>暂无轨道</div>
        <div class="text-xs mt-1">添加图层后自动创建轨道</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 时间轴主容器样式 */
</style>
