<script setup lang="ts">
import { computed } from 'vue'
import { useLayerStore } from '@/stores/useLayerStore'

const layerStore = useLayerStore()

/**
 * 图层类型图标映射
 */
const typeIcons: Record<string, string> = {
  shape: '◼',
  text: 'T',
  image: '🖼',
  group: '📁'
}

/**
 * 选择图层
 */
const selectLayer = (id: string, event: MouseEvent) => {
  layerStore.selectLayer(id, event.ctrlKey || event.metaKey)
}

/**
 * 切换可见性
 */
const toggleVisibility = (id: string, event: MouseEvent) => {
  event.stopPropagation()
  layerStore.toggleVisibility(id)
}

/**
 * 切换锁定
 */
const toggleLock = (id: string, event: MouseEvent) => {
  event.stopPropagation()
  layerStore.toggleLock(id)
}

/**
 * 删除图层
 */
const deleteLayer = (id: string, event: MouseEvent) => {
  event.stopPropagation()
  layerStore.deleteLayer(id)
}
</script>

<template>
  <div class="h-full bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col">
    <!-- 面板头部 -->
    <div class="panel-header">
      <span>图层</span>
      <span class="text-xs text-[var(--text-secondary)]">{{ layerStore.layers.length }} 个图层</span>
    </div>
    
    <!-- 图层列表 -->
    <div class="flex-1 overflow-y-auto">
      <div 
        v-if="layerStore.layers.length === 0"
        class="p-8 text-center text-[var(--text-secondary)] text-sm"
      >
        <div class="mb-2">暂无图层</div>
        <div class="text-xs">点击工具栏的 + 按钮添加形状或文本</div>
      </div>
      
      <div
        v-for="layer in layerStore.layers"
        :key="layer.id"
        class="layer-item"
        :class="{ selected: layerStore.selectedLayerIds.includes(layer.id) }"
        @click="selectLayer(layer.id, $event)"
      >
        <!-- 类型图标 -->
        <div class="layer-icon">
          {{ typeIcons[layer.type] || '◻' }}
        </div>
        
        <!-- 图层名称 -->
        <div class="layer-name" :title="layer.name">
          {{ layer.name }}
        </div>
        
        <!-- 操作按钮 -->
        <div class="layer-actions">
          <button
            class="w-5 h-5 flex items-center justify-center hover:bg-[var(--bg-tertiary)] rounded text-xs"
            :title="layer.visible ? '隐藏' : '显示'"
            @click.stop="toggleVisibility(layer.id, $event)"
          >
            {{ layer.visible ? '👁' : '○' }}
          </button>
          <button
            class="w-5 h-5 flex items-center justify-center hover:bg-[var(--bg-tertiary)] rounded text-xs"
            :title="layer.locked ? '解锁' : '锁定'"
            @click.stop="toggleLock(layer.id, $event)"
          >
            {{ layer.locked ? '🔒' : '🔓' }}
          </button>
          <button
            class="w-5 h-5 flex items-center justify-center hover:bg-[var(--danger)] rounded text-xs"
            title="删除"
            @click.stop="deleteLayer(layer.id, $event)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
    
    <!-- 底部操作 -->
    <div class="p-2 border-t border-[var(--border)] flex gap-1">
      <button
        class="btn btn-secondary flex-1 text-xs"
        @click="layerStore.createLayer('shape')"
        title="添加形状"
      >
        + 形状
      </button>
      <button
        class="btn btn-secondary flex-1 text-xs"
        @click="layerStore.createLayer('text')"
        title="添加文本"
      >
        + 文本
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 左侧面板样式 */
</style>
