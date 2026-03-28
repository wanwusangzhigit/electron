<script setup lang="ts">
import { ref } from 'vue'
import Toolbar from './Toolbar.vue'
import LeftPanel from './LeftPanel.vue'
import RightPanel from './RightPanel.vue'
import BottomPanel from './BottomPanel.vue'
import CanvasEditor from '../canvas/CanvasEditor.vue'

const timelineHeight = ref<number>(250)
const isResizing = ref<boolean>(false)
const startY = ref<number>(0)
const startHeight = ref<number>(0)

/**
 * 开始调整时间轴高度
 */
const startResize = (e: MouseEvent) => {
  isResizing.value = true
  startY.value = e.clientY
  startHeight.value = timelineHeight.value
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
}

/**
 * 调整时间轴高度
 */
const onResize = (e: MouseEvent) => {
  if (!isResizing.value) return
  const delta = startY.value - e.clientY
  const newHeight = Math.max(200, startHeight.value + delta)
  timelineHeight.value = newHeight
}

/**
 * 停止调整
 */
const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
}
</script>

<template>
  <div class="flex flex-col h-screen w-screen overflow-hidden bg-[var(--bg-primary)]">
    <!-- 顶部工具栏 -->
    <Toolbar />
    
    <!-- 主内容区 -->
    <div class="flex flex-1 overflow-hidden">
      <!-- 左侧面板（素材库） -->
      <LeftPanel class="w-[280px] flex-shrink-0" />
      
      <!-- 中央画布区 -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- 画布编辑器 -->
        <CanvasEditor class="flex-1" />
        
        <!-- 底部时间轴区域 -->
        <div 
          class="relative border-t border-[var(--border)]"
          :style="{ height: `${timelineHeight}px` }"
        >
          <BottomPanel />
          
          <!-- 拖拽手柄 -->
          <div 
            class="absolute top-0 left-0 right-0 h-1 cursor-row-resize hover:bg-[var(--accent)] transition-colors z-50"
            @mousedown="startResize"
          />
        </div>
      </div>
      
      <!-- 右侧属性面板 -->
      <RightPanel class="w-[340px] flex-shrink-0" />
    </div>
  </div>
</template>

<style scoped>
/* 主布局容器 */
</style>
