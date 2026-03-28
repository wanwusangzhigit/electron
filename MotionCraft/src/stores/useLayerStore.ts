// src/stores/useLayerStore.ts
/**
 * 图层状态管理
 */

import { defineStore } from 'pinia'
import type { Layer, LayerType, ShapeLayerData, TransformData } from '@/types/layer'

interface LayerState {
  layers: Layer[]
  selectedLayerIds: string[]
  expandedGroupIds: string[]
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function getDefaultTransform(): TransformData {
  return {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    anchorX: 0.5,
    anchorY: 0.5,
    opacity: 1
  }
}

export const useLayerStore = defineStore('layer', {
  state: (): LayerState => ({
    layers: [],
    selectedLayerIds: [],
    expandedGroupIds: []
  }),

  getters: {
    /**
     * 获取选中的图层
     */
    selectedLayers(state): Layer[] {
      return state.layers.filter(layer => state.selectedLayerIds.includes(layer.id))
    },

    /**
     * 获取单个选中图层
     */
    selectedLayer(state): Layer | null {
      if (state.selectedLayerIds.length !== 1) return null
      return state.layers.find(l => l.id === state.selectedLayerIds[0]) || null
    },

    /**
     * 根据 ID 获取图层
     */
    getLayerById: (state) => (id: string): Layer | undefined => {
      return state.layers.find(layer => layer.id === id)
    },

    /**
     * 获取所有可见图层
     */
    visibleLayers(state): Layer[] {
      return state.layers.filter(layer => layer.visible)
    },

    /**
     * 获取根层级图层（无父节点）
     */
    rootLayers(state): Layer[] {
      return state.layers.filter(layer => !layer.parentId)
    }
  },

  actions: {
    /**
     * 创建新图层
     */
    createLayer(type: LayerType, name?: string, data?: any): Layer {
      const layer: Layer = {
        id: generateId(),
        type,
        name: name || this.generateLayerName(type),
        visible: true,
        locked: false,
        parentId: null,
        children: [],
        transform: getDefaultTransform(),
        keyframes: [],
        data: this.createLayerData(type, data)
      }

      this.layers.unshift(layer)
      this.selectLayer(layer.id)
      
      return layer
    },

    /**
     * 创建图层数据
     */
    private createLayerData(type: LayerType, data?: any): any {
      switch (type) {
        case 'shape':
          return {
            shapeType: data?.shapeType || 'rectangle',
            fillColor: data?.fillColor || '#FF0000',
            strokeColor: data?.strokeColor,
            strokeWidth: data?.strokeWidth,
            cornerRadius: data?.cornerRadius
          } as ShapeLayerData
        case 'text':
          return {
            text: data?.text || 'Text',
            fontFamily: data?.fontFamily || 'Arial',
            fontSize: data?.fontSize || 48,
            fontWeight: data?.fontWeight || 'normal',
            fillColor: data?.fillColor || '#FFFFFF',
            align: data?.align || 'center'
          }
        case 'image':
          return {
            src: data?.src || '',
            width: data?.width || 100,
            height: data?.height || 100,
            assetId: data?.assetId || ''
          }
        case 'group':
          return null
        default:
          return null
      }
    },

    /**
     * 生成图层名称
     */
    private generateLayerName(type: LayerType): string {
      const count = this.layers.filter(l => l.type === type).length + 1
      const names: Record<LayerType, string> = {
        shape: `形状 ${count}`,
        text: `文本 ${count}`,
        image: `图片 ${count}`,
        group: `组 ${count}`
      }
      return names[type]
    },

    /**
     * 删除图层
     */
    deleteLayer(id: string): void {
      const index = this.layers.findIndex(l => l.id === id)
      if (index === -1) return

      // 递归删除子图层
      const layer = this.layers[index]
      if (layer.children.length > 0) {
        layer.children.forEach(childId => this.deleteLayer(childId))
      }

      // 从父图层的 children 中移除
      if (layer.parentId) {
        const parent = this.layers.find(l => l.id === layer.parentId)
        if (parent) {
          parent.children = parent.children.filter(cid => cid !== id)
        }
      }

      this.layers.splice(index, 1)
      this.deselectLayer(id)
    },

    /**
     * 更新图层属性
     */
    updateLayer(id: string, updates: Partial<Layer>): void {
      const layer = this.layers.find(l => l.id === id)
      if (layer) {
        Object.assign(layer, updates)
      }
    },

    /**
     * 更新图层变换
     */
    updateLayerTransform(id: string, transform: Partial<TransformData>): void {
      const layer = this.layers.find(l => l.id === id)
      if (layer) {
        Object.assign(layer.transform, transform)
      }
    },

    /**
     * 选择图层
     */
    selectLayer(id: string, multi: boolean = false): void {
      if (multi) {
        if (!this.selectedLayerIds.includes(id)) {
          this.selectedLayerIds.push(id)
        }
      } else {
        this.selectedLayerIds = [id]
      }
    },

    /**
     * 取消选择图层
     */
    deselectLayer(id: string): void {
      this.selectedLayerIds = this.selectedLayerIds.filter(sid => sid !== id)
    },

    /**
     * 清除选择
     */
    clearSelection(): void {
      this.selectedLayerIds = []
    },

    /**
     * 切换图层可见性
     */
    toggleVisibility(id: string): void {
      const layer = this.layers.find(l => l.id === id)
      if (layer) {
        layer.visible = !layer.visible
      }
    },

    /**
     * 切换图层锁定
     */
    toggleLock(id: string): void {
      const layer = this.layers.find(l => l.id === id)
      if (layer) {
        layer.locked = !layer.locked
      }
    },

    /**
     * 调整图层顺序（上移）
     */
    moveLayerUp(id: string): void {
      const index = this.layers.findIndex(l => l.id === id)
      if (index > 0) {
        [this.layers[index], this.layers[index - 1]] = [this.layers[index - 1], this.layers[index]]
      }
    },

    /**
     * 调整图层顺序（下移）
     */
    moveLayerDown(id: string): void {
      const index = this.layers.findIndex(l => l.id === id)
      if (index < this.layers.length - 1) {
        [this.layers[index], this.layers[index + 1]] = [this.layers[index + 1], this.layers[index]]
      }
    },

    /**
     * 置顶图层
     */
    bringToFront(id: string): void {
      const index = this.layers.findIndex(l => l.id === id)
      if (index > 0) {
        const [layer] = this.layers.splice(index, 1)
        this.layers.unshift(layer)
      }
    },

    /**
     * 置底图层
     */
    sendToBack(id: string): void {
      const index = this.layers.findIndex(l => l.id === id)
      if (index >= 0 && index < this.layers.length - 1) {
        const [layer] = this.layers.splice(index, 1)
        this.layers.push(layer)
      }
    },

    /**
     * 编组选中的图层
     */
    groupSelected(): Layer | null {
      if (this.selectedLayerIds.length < 2) return null

      const groupLayer = this.createLayer('group', '新建组')
      
      // 将选中的图层设为组的子图层
      const childrenIds = [...this.selectedLayerIds]
      childrenIds.forEach(id => {
        const layer = this.layers.find(l => l.id === id)
        if (layer && !layer.parentId) {
          layer.parentId = groupLayer.id
          groupLayer.children.push(id)
        }
      })

      return groupLayer
    },

    /**
     * 解组
     */
    ungroup(id: string): void {
      const layer = this.layers.find(l => l.id === id)
      if (!layer || layer.type !== 'group') return

      // 将子图层的 parentId 设为 null
      layer.children.forEach(childId => {
        const child = this.layers.find(l => l.id === childId)
        if (child) {
          child.parentId = null
        }
      })

      // 清空组的 children
      layer.children = []
      
      // 删除组
      this.deleteLayer(id)
    },

    /**
     * 添加关键帧到图层
     */
    addKeyframe(layerId: string, property: string, time: number, value: number, easing: string = 'linear'): void {
      const layer = this.layers.find(l => l.id === layerId)
      if (!layer) return

      const existingKeyframe = layer.keyframes.find(k => k.property === property && k.time === time)
      if (existingKeyframe) {
        existingKeyframe.value = value
        return
      }

      layer.keyframes.push({
        id: generateId(),
        time,
        property: property as any,
        value,
        easing: easing as any
      })

      // 按时间排序
      layer.keyframes.sort((a, b) => a.time - b.time)
    },

    /**
     * 删除关键帧
     */
    removeKeyframe(layerId: string, keyframeId: string): void {
      const layer = this.layers.find(l => l.id === layerId)
      if (!layer) return

      layer.keyframes = layer.keyframes.filter(k => k.id !== keyframeId)
    },

    /**
     * 清空所有图层
     */
    clearAllLayers(): void {
      this.layers = []
      this.selectedLayerIds = []
      this.expandedGroupIds = []
    },

    /**
     * 从 JSON 加载图层
     */
    loadFromJSON(layers: Layer[]): void {
      this.layers = layers
      this.selectedLayerIds = []
    }
  }
})
