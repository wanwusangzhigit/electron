// src/composables/usePixiRenderer.ts
/**
 * PixiJS 渲染器组合式函数
 */

import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { Ref } from 'vue'
import { Application, Container, Graphics, Sprite, Text } from 'pixi.js'
import type { Layer, TransformData } from '@/types/layer'

export interface UsePixiRendererOptions {
  width: number
  height: number
  backgroundColor?: number
  transparent?: boolean
  antialias?: boolean
  resolution?: number
}

export interface UsePixiRendererReturn {
  canvasRef: Ref<HTMLCanvasElement | null>
  app: Ref<Application | null>
  stage: Ref<Container | null>
  initialize: () => Promise<void>
  resize: (width: number, height: number) => void
  renderLayer: (layer: Layer) => Container
  updateLayerTransform: (container: Container, transform: TransformData) => void
  destroy: () => void
}

/**
 * PixiJS 渲染器组合式函数
 */
export function usePixiRenderer(options: UsePixiRendererOptions): UsePixiRendererReturn {
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const app = ref<Application | null>(null)
  const stage = ref<Container | null>(null)
  
  const layerContainers = new Map<string, Container>()

  /**
   * 初始化 PixiJS 应用
   */
  const initialize = async (): Promise<void> => {
    if (!canvasRef.value) return

    // 创建 PixiJS 应用
    const pixiApp = new Application()
    
    await pixiApp.init({
      canvas: canvasRef.value,
      width: options.width,
      height: options.height,
      backgroundColor: options.backgroundColor ?? 0x1a1a1a,
      transparent: options.transparent ?? false,
      antialias: options.antialias ?? true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    })

    app.value = pixiApp
    stage.value = pixiApp.stage

    // 启用交互
    pixiApp.stage.eventMode = 'static'
    pixiApp.stage.hitArea = pixiApp.screen
  }

  /**
   * 调整画布大小
   */
  const resize = (width: number, height: number): void => {
    if (!app.value) return
    
    app.value.renderer.resize(width, height)
  }

  /**
   * 渲染图层到容器
   */
  const renderLayer = (layer: Layer): Container => {
    const container = new Container()
    container.label = `layer-${layer.id}`
    
    // 根据图层类型创建不同的内容
    switch (layer.type) {
      case 'shape':
        renderShape(container, layer)
        break
      case 'text':
        renderText(container, layer)
        break
      case 'image':
        renderImage(container, layer)
        break
      case 'group':
        // 组类型，添加子容器
        break
    }

    // 应用变换
    if (layer.transform) {
      updateLayerTransform(container, layer.transform)
    }

    layerContainers.set(layer.id, container)
    return container
  }

  /**
   * 渲染形状
   */
  const renderShape = (container: Container, layer: Layer): void => {
    const graphics = new Graphics()
    const data = layer.data as any

    if (!data) return

    const { shapeType, fillColor, strokeColor, strokeWidth, cornerRadius = 0 } = data

    graphics.fillStyle(fillColor || '#FF0000')

    switch (shapeType) {
      case 'rectangle':
        if (cornerRadius > 0) {
          graphics.roundRect(0, 0, 100, 100, cornerRadius)
        } else {
          graphics.rect(0, 0, 100, 100)
        }
        break
      case 'circle':
        graphics.circle(50, 50, 50)
        break
      case 'triangle':
        graphics.poly([50, 0, 100, 100, 0, 100])
        break
    }

    if (strokeColor && strokeWidth) {
      graphics.strokeStyle = { color: strokeColor, width: strokeWidth }
    }

    graphics.fill()
    container.addChild(graphics)
  }

  /**
   * 渲染文本
   */
  const renderText = (container: Container, layer: Layer): void => {
    const data = layer.data as any
    if (!data) return

    const text = new Text({
      text: data.text || 'Text',
      style: {
        fontSize: data.fontSize || 48,
        fontFamily: data.fontFamily || 'Arial',
        fill: data.fillColor || '#FFFFFF',
        fontWeight: data.fontWeight?.toString() || 'normal'
      }
    })

    container.addChild(text)
  }

  /**
   * 渲染图片（占位）
   */
  const renderImage = (container: Container, layer: Layer): void => {
    const graphics = new Graphics()
    graphics.fillStyle('#00FF00')
    graphics.rect(0, 0, 100, 100)
    graphics.fill()
    container.addChild(graphics)
  }

  /**
   * 更新图层变换
   */
  const updateLayerTransform = (container: Container, transform: TransformData): void => {
    container.x = transform.x
    container.y = transform.y
    container.scale.x = transform.scaleX
    container.scale.y = transform.scaleY
    container.rotation = transform.rotation
    container.alpha = transform.opacity
    
    // 设置锚点（需要调整 pivot）
    const bounds = container.getBounds()
    if (bounds) {
      container.pivot.x = bounds.width * transform.anchorX
      container.pivot.y = bounds.height * transform.anchorY
    }
  }

  /**
   * 获取图层容器
   */
  const getLayerContainer = (layerId: string): Container | undefined => {
    return layerContainers.get(layerId)
  }

  /**
   * 移除图层容器
   */
  const removeLayerContainer = (layerId: string): void => {
    const container = layerContainers.get(layerId)
    if (container) {
      container.destroy({ children: true })
      layerContainers.delete(layerId)
    }
  }

  /**
   * 销毁渲染器
   */
  const destroy = (): void => {
    if (app.value) {
      app.value.destroy(true)
      app.value = null
      stage.value = null
    }
    layerContainers.clear()
  }

  return {
    canvasRef,
    app,
    stage,
    initialize,
    resize,
    renderLayer,
    updateLayerTransform,
    destroy
  }
}
