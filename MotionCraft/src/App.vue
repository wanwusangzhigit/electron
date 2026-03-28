<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import { useLayerStore } from '@/stores/useLayerStore'
import { useTimelineStore } from '@/stores/useTimelineStore'

const layerStore = useLayerStore()
const timelineStore = useTimelineStore()

/**
 * 处理键盘快捷键
 */
const handleKeyDown = (e: KeyboardEvent) => {
  // Ctrl+Z - 撤销（预留）
  if (e.ctrlKey && e.key === 'z') {
    e.preventDefault()
    console.log('[Shortcut] Undo')
  }
  
  // Ctrl+Y - 重做（预留）
  if (e.ctrlKey && e.key === 'y') {
    e.preventDefault()
    console.log('[Shortcut] Redo')
  }
  
  // Ctrl+C - 复制（预留）
  if (e.ctrlKey && e.key === 'c') {
    e.preventDefault()
    console.log('[Shortcut] Copy')
  }
  
  // Ctrl+V - 粘贴（预留）
  if (e.ctrlKey && e.key === 'v') {
    e.preventDefault()
    console.log('[Shortcut] Paste')
  }
  
  // Delete - 删除选中
  if (e.key === 'Delete' || e.key === 'Backspace') {
    e.preventDefault()
    layerStore.selectedLayerIds.forEach(id => {
      layerStore.deleteLayer(id)
    })
  }
  
  // Ctrl+G - 编组
  if (e.ctrlKey && e.key === 'g') {
    e.preventDefault()
    const group = layerStore.groupSelected()
    if (group) {
      console.log('[Shortcut] Group created:', group.id)
    }
  }
  
  // Ctrl+Shift+G - 解组
  if (e.ctrlKey && e.shiftKey && e.key === 'G') {
    e.preventDefault()
    layerStore.selectedLayerIds.forEach(id => {
      const layer = layerStore.getLayerById(id)
      if (layer?.type === 'group') {
        layerStore.ungroup(id)
      }
    })
  }
  
  // 空格 - 播放/暂停
  if (e.key === ' ' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
    e.preventDefault()
    timelineStore.togglePlaying()
  }
  
  // 1/2/3/4 - 切换工具
  if (e.key === '1') {
    console.log('[Shortcut] Select tool')
  }
  if (e.key === '2') {
    console.log('[Shortcut] Text tool')
    layerStore.createLayer('text')
  }
  if (e.key === '3') {
    console.log('[Shortcut] Rectangle tool')
    layerStore.createLayer('shape', undefined, { shapeType: 'rectangle' })
  }
  if (e.key === '4') {
    console.log('[Shortcut] Circle tool')
    layerStore.createLayer('shape', undefined, { shapeType: 'circle' })
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <MainLayout />
</template>

<style scoped>
/* App 根组件不需要额外样式 */
</style>
