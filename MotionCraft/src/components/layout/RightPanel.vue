<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLayerStore } from '@/stores/useLayerStore'

const layerStore = useLayerStore()

// 本地编辑状态
const localTransform = ref({
  x: 0,
  y: 0,
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  opacity: 1,
  anchorX: 0.5,
  anchorY: 0.5
})

/**
 * 选中的图层
 */
const selectedLayer = computed(() => layerStore.selectedLayer)

/**
 * 监听选中图层变化，同步本地状态
 */
watch(
  () => selectedLayer.value?.transform,
  (transform) => {
    if (transform) {
      localTransform.value = { ...transform }
    }
  },
  { immediate: true, deep: true }
)

/**
 * 更新属性（带防抖）
 */
const updateProperty = (property: string, value: number) => {
  if (!selectedLayer.value) return
  
  layerStore.updateLayerTransform(selectedLayer.value.id, {
    [property]: value
  })
}

/**
 * 旋转角度转弧度
 */
const degToRad = (deg: number): number => (deg * Math.PI) / 180

/**
 * 弧度转角度
 */
const radToDeg = (rad: number): number => (rad * 180) / Math.PI

/**
 * 更新旋转（角度输入）
 */
const updateRotationDeg = (deg: number) => {
  updateProperty('rotation', degToRad(deg))
}

/**
 * 获取旋转角度显示值
 */
const getRotationDeg = (): number => Math.round(radToDeg(localTransform.value.rotation))
</script>

<template>
  <div class="h-full bg-[var(--bg-secondary)] border-l border-[var(--border)] flex flex-col">
    <!-- 面板头部 -->
    <div class="panel-header">
      <span>属性</span>
    </div>
    
    <!-- 属性内容 -->
    <div class="flex-1 overflow-y-auto p-3">
      <div v-if="!selectedLayer" class="text-center text-[var(--text-secondary)] text-sm py-8">
        <div class="mb-2">未选择图层</div>
        <div class="text-xs">点击左侧图层列表选择一个图层</div>
      </div>
      
      <div v-else>
        <!-- 变换属性 -->
        <div class="mb-4">
          <div class="text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
            变换
          </div>
          
          <!-- X 位置 -->
          <div class="property-row">
            <label class="property-label">X</label>
            <div class="property-input">
              <input
                type="number"
                :value="Math.round(localTransform.x)"
                @input="(e) => updateProperty('x', Number((e.target as HTMLInputElement).value))"
              />
              <span class="property-unit">px</span>
            </div>
          </div>
          
          <!-- Y 位置 -->
          <div class="property-row">
            <label class="property-label">Y</label>
            <div class="property-input">
              <input
                type="number"
                :value="Math.round(localTransform.y)"
                @input="(e) => updateProperty('y', Number((e.target as HTMLInputElement).value))"
              />
              <span class="property-unit">px</span>
            </div>
          </div>
          
          <!-- 缩放 X -->
          <div class="property-row">
            <label class="property-label">缩放 X</label>
            <div class="property-input">
              <input
                type="number"
                step="0.1"
                :value="localTransform.scaleX.toFixed(2)"
                @input="(e) => updateProperty('scaleX', Number((e.target as HTMLInputElement).value))"
              />
            </div>
          </div>
          
          <!-- 缩放 Y -->
          <div class="property-row">
            <label class="property-label">缩放 Y</label>
            <div class="property-input">
              <input
                type="number"
                step="0.1"
                :value="localTransform.scaleY.toFixed(2)"
                @input="(e) => updateProperty('scaleY', Number((e.target as HTMLInputElement).value))"
              />
            </div>
          </div>
          
          <!-- 旋转 -->
          <div class="property-row">
            <label class="property-label">旋转</label>
            <div class="property-input">
              <input
                type="number"
                :value="getRotationDeg()"
                @input="(e) => updateRotationDeg(Number((e.target as HTMLInputElement).value))"
              />
              <span class="property-unit">°</span>
            </div>
          </div>
          
          <!-- 透明度 -->
          <div class="property-row">
            <label class="property-label">透明度</label>
            <div class="property-input">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                :value="localTransform.opacity"
                @input="(e) => updateProperty('opacity', Number((e.target as HTMLInputElement).value))"
                class="flex-1"
              />
              <span class="property-unit w-10">{{ Math.round(localTransform.opacity * 100) }}%</span>
            </div>
          </div>
        </div>
        
        <div class="divider" />
        
        <!-- 锚点设置 -->
        <div class="mb-4">
          <div class="text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
            锚点
          </div>
          
          <div class="property-row">
            <label class="property-label">X</label>
            <div class="property-input">
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                :value="localTransform.anchorX.toFixed(1)"
                @input="(e) => updateProperty('anchorX', Number((e.target as HTMLInputElement).value))"
              />
            </div>
          </div>
          
          <div class="property-row">
            <label class="property-label">Y</label>
            <div class="property-input">
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                :value="localTransform.anchorY.toFixed(1)"
                @input="(e) => updateProperty('anchorY', Number((e.target as HTMLInputElement).value))"
              />
            </div>
          </div>
        </div>
        
        <div class="divider" />
        
        <!-- 图层信息 -->
        <div class="mt-4">
          <div class="text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
            图层信息
          </div>
          
          <div class="text-xs text-[var(--text-secondary)] space-y-1">
            <div>ID: {{ selectedLayer.id.slice(-8) }}</div>
            <div>类型：{{ selectedLayer.type }}</div>
            <div>关键帧：{{ selectedLayer.keyframes.length }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 右侧属性面板样式 */
input[type="range"] {
  -webkit-appearance: none;
  background: var(--bg-tertiary);
  height: 4px;
  border-radius: 2px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: var(--accent);
  border-radius: 50%;
  cursor: pointer;
}
</style>
