<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { usePixiRenderer } from '@/composables/usePixiRenderer'
import { useLayerStore } from '@/stores/useLayerStore'
import { useTimelineStore } from '@/stores/useTimelineStore'
import { useAnimationEngine } from '@/composables/useAnimationEngine'

const layerStore = useLayerStore()
const timelineStore = useTimelineStore()

// PixiJS 渲染器
const { canvasRef, app, stage, initialize, renderLayer, updateLayerTransform, destroy: destroyPixi } = usePixiRenderer({
  width: 1920,
  height: 1080,
  backgroundColor: 0x1a1a1a
})

// 动画引擎
const { getLayerStateAtTime, updateCurrentTime } = useAnimationEngine()

// 画布状态
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const panOffset = ref({ x: 0, y: 0 })
const zoom = ref(1)

// 图层容器引用
const layerContainers = new Map<string, any>()

/**
 * 初始化 PixiJS
 */
onMounted(async () => {
  await initialize()
  
  // 初始添加一个测试矩形
  if (layerStore.layers.length === 0) {
    const testLayer = layerStore.createLayer('shape', '测试矩形', {
      shapeType: 'rectangle',
      fillColor: '#FF4444'
    })
    testLayer.transform.x = 860
    testLayer.transform.y = 490
  }
  
  // 渲染所有图层
  renderAllLayers()
  
  // 开始播放循环
  startPlaybackLoop()
})

/**
 * 清理资源
 */
onUnmounted(() => {
  destroyPixi()
  stopPlaybackLoop()
})

/**
 * 渲染所有图层
 */
const renderAllLayers = () => {
  if (!stage.value) return
  
  // 清除现有图层容器（简单实现，实际应该增量更新）
  stage.value.removeChildren()
  layerContainers.clear()
  
  // 绘制网格背景
  drawGrid()
  
  // 渲染每个可见图层
  for (const layer of layerStore.visibleLayers) {
    const container = renderLayer(layer)
    stage.value.addChild(container)
    layerContainers.set(layer.id, container)
  }
}

/**
 * 绘制网格背景
 */
const drawGrid = () => {
  if (!stage.value) return
  
  const { Graphics } = require('pixi.js')
  const grid = new Graphics()
  
  // 绘制网格线
  const gridSize = 50
  const width = 1920
  const height = 1080
  
  grid.strokeStyle = { color: 0x333333, width: 1 }
  
  // 垂直线
  for (let x = 0; x <= width; x += gridSize) {
    grid.moveTo(x, 0)
    grid.lineTo(x, height)
  }
  
  // 水平线
  for (let y = 0; y <= height; y += gridSize) {
    grid.moveTo(0, y)
    grid.lineTo(width, y)
  }
  
  grid.stroke()
  stage.value.addChildAt(grid, 0)
}

/**
 * 更新图层显示
 */
const updateLayers = () => {
  const currentTime = timelineStore.timeline.currentTime
  
  for (const layer of layerStore.layers) {
    const container = layerContainers.get(layer.id)
    if (!container) continue
    
    // 获取当前时间的状态（关键帧插值）
    const state = getLayerStateAtTime(layer, currentTime)
    
    // 应用变换
    updateLayerTransform(container, state)
  }
}

/**
 * 播放循环
 */
let animationFrameId: number | null = null
let lastTime: number = 0

const startPlaybackLoop = () => {
  const animate = (timestamp: number) => {
    if (!timelineStore.timeline.isPlaying) {
      lastTime = timestamp
      animationFrameId = requestAnimationFrame(animate)
      return
    }
    
    const deltaTime = timestamp - lastTime
    lastTime = timestamp
    
    // 更新时间
    timelineStore.setCurrentTime(timelineStore.timeline.currentTime + deltaTime)
    
    // 检查循环
    if (timelineStore.timeline.currentTime >= timelineStore.timeline.duration) {
      timelineStore.goToStart()
    }
    
    // 更新图层显示
    updateLayers()
    
    animationFrameId = requestAnimationFrame(animate)
  }
  
  animationFrameId = requestAnimationFrame(animate)
}

const stopPlaybackLoop = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

/**
 * 监听图层变化
 */
const handleLayerChange = () => {
  renderAllLayers()
}

// 监听图层 store 变化
import { watch } from 'vue'
watch(() => layerStore.layers.length, handleLayerChange)
watch(() => layerStore.selectedLayerIds, () => {
  // 重绘选中框等
}, { deep: true })
</script>

<template>
  <div class="w-full h-full canvas-container flex items-center justify-center overflow-hidden">
    <!-- 画布容器 -->
    <div 
      class="relative bg-black shadow-2xl"
      style="transform-origin: center center;"
    >
      <canvas 
        ref="canvasRef" 
        class="block"
        style="max-width: 100%; max-height: 100%;"
      />
      
      <!-- 空状态提示 -->
      <div 
        v-if="layerStore.layers.length === 0"
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div class="text-center text-white/50">
          <div class="text-2xl mb-2">🎬</div>
          <div class="text-lg">新建项目</div>
          <div class="text-sm mt-1">点击工具栏添加形状或文本</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 画布编辑器样式 */
canvas {
  image-rendering: -webkit-optimize-contrast;
}
</style>
