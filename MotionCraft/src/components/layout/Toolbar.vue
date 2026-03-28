<script setup lang="ts">
import { useLayerStore } from '@/stores/useLayerStore'

const layerStore = useLayerStore()

/**
 * 创建测试矩形
 */
const addTestRectangle = () => {
  const layer = layerStore.createLayer('shape', undefined, {
    shapeType: 'rectangle',
    fillColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
  })
  console.log('[Toolbar] Added test rectangle:', layer.id)
}

/**
 * 导出视频（占位）
 */
const handleExport = () => {
  alert('导出功能开发中...\n支持格式：MP4, WebM, GIF')
}

/**
 * 保存项目（占位）
 */
const handleSave = () => {
  console.log('[Toolbar] Save project')
  alert('保存功能开发中...')
}

/**
 * 新建项目
 */
const handleNewProject = () => {
  if (confirm('确定要新建项目吗？未保存的更改将丢失。')) {
    layerStore.clearAllLayers()
    console.log('[Toolbar] New project created')
  }
}
</script>

<template>
  <div class="h-[48px] bg-[var(--bg-secondary)] border-b border-[var(--border)] flex items-center px-4 gap-4">
    <!-- Logo -->
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center">
        <span class="text-black font-bold text-lg">M</span>
      </div>
      <span class="font-semibold text-white">MotionCraft</span>
    </div>
    
    <div class="w-px h-6 bg-[var(--border)]" />
    
    <!-- 文件菜单 -->
    <div class="flex items-center gap-2">
      <button 
        class="btn btn-secondary"
        @click="handleNewProject"
        title="新建项目"
      >
        新建
      </button>
      <button 
        class="btn btn-secondary"
        @click="handleSave"
        title="保存项目"
      >
        保存
      </button>
    </div>
    
    <div class="w-px h-6 bg-[var(--border)]" />
    
    <!-- 添加工具 -->
    <div class="flex items-center gap-2">
      <button 
        class="btn btn-primary"
        @click="addTestRectangle"
        title="添加矩形 (快捷键：3)"
      >
        + 矩形
      </button>
      <button 
        class="btn btn-primary"
        @click="layerStore.createLayer('shape', undefined, { shapeType: 'circle' })"
        title="添加圆形 (快捷键：4)"
      >
        + 圆形
      </button>
      <button 
        class="btn btn-primary"
        @click="layerStore.createLayer('text')"
        title="添加文本 (快捷键：2)"
      >
        + 文本
      </button>
    </div>
    
    <div class="flex-1" />
    
    <!-- 导出按钮 -->
    <button 
      class="btn btn-primary"
      @click="handleExport"
    >
      导出视频
    </button>
  </div>
</template>

<style scoped>
/* 工具栏样式 */
</style>
