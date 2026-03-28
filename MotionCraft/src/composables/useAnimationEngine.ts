// src/composables/useAnimationEngine.ts
/**
 * 动画引擎组合式函数
 * 负责关键帧插值和实时播放
 */

import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { Layer, Keyframe, TransformProperty } from '@/types/layer'
import { getEasingFunction } from '@/utils/easing'

export interface UseAnimationEngineReturn {
  currentTime: Ref<number>
  isPlaying: Ref<boolean>
  startPlayback: (duration: number, fps: number) => void
  stopPlayback: () => void
  updateCurrentTime: (time: number) => void
  getLayerStateAtTime: (layer: Layer, time: number) => LayerTransformState
}

export interface LayerTransformState {
  x: number
  y: number
  scaleX: number
  scaleY: number
  rotation: number
  opacity: number
  anchorX: number
  anchorY: number
}

/**
 * 动画引擎组合式函数
 */
export function useAnimationEngine(): UseAnimationEngineReturn {
  const currentTime = ref<number>(0)
  const isPlaying = ref<boolean>(false)
  
  let animationFrameId: number | null = null
  let lastTime: number = 0
  let projectDuration: number = 30000
  let projectFps: number = 30

  /**
   * 开始播放
   */
  const startPlayback = (duration: number, fps: number): void => {
    projectDuration = duration
    projectFps = fps
    isPlaying.value = true
    lastTime = performance.now()
    
    const animate = (timestamp: number) => {
      if (!isPlaying.value) return
      
      const deltaTime = timestamp - lastTime
      lastTime = timestamp
      
      // 更新当前时间
      currentTime.value += deltaTime
      
      // 检查是否到达结尾
      if (currentTime.value >= projectDuration) {
        // 循环播放
        currentTime.value = 0
      }
      
      animationFrameId = requestAnimationFrame(animate)
    }
    
    animationFrameId = requestAnimationFrame(animate)
  }

  /**
   * 停止播放
   */
  const stopPlayback = (): void => {
    isPlaying.value = false
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }

  /**
   * 更新当前时间
   */
  const updateCurrentTime = (time: number): void => {
    currentTime.value = Math.max(0, Math.min(time, projectDuration))
  }

  /**
   * 获取图层在指定时间的状态（关键帧插值）
   */
  const getLayerStateAtTime = (layer: Layer, time: number): LayerTransformState => {
    const baseTransform = layer.transform
    
    // 如果没有关键帧，返回基础变换
    if (!layer.keyframes || layer.keyframes.length === 0) {
      return { ...baseTransform }
    }

    const state: LayerTransformState = {
      x: baseTransform.x,
      y: baseTransform.y,
      scaleX: baseTransform.scaleX,
      scaleY: baseTransform.scaleY,
      rotation: baseTransform.rotation,
      opacity: baseTransform.opacity,
      anchorX: baseTransform.anchorX,
      anchorY: baseTransform.anchorY
    }

    // 对每个属性进行插值计算
    const properties: TransformProperty[] = ['x', 'y', 'scaleX', 'scaleY', 'rotation', 'opacity', 'anchorX', 'anchorY']
    
    for (const property of properties) {
      const keyframes = layer.keyframes.filter(k => k.property === property)
      
      if (keyframes.length === 0) continue
      
      // 按时间排序
      keyframes.sort((a, b) => a.time - b.time)
      
      // 找到当前时间前后的关键帧
      let prevKeyframe: Keyframe | null = null
      let nextKeyframe: Keyframe | null = null
      
      for (let i = 0; i < keyframes.length; i++) {
        if (keyframes[i].time <= time) {
          prevKeyframe = keyframes[i]
        }
        if (keyframes[i].time >= time && !nextKeyframe) {
          nextKeyframe = keyframes[i]
          break
        }
      }
      
      // 如果只有一个关键帧或超出范围
      if (!prevKeyframe && nextKeyframe) {
        // 时间在第一个关键帧之前
        ;(state[property] as number) = nextKeyframe.value
      } else if (prevKeyframe && !nextKeyframe) {
        // 时间在最后一个关键帧之后
        ;(state[property] as number) = prevKeyframe.value
      } else if (prevKeyframe && nextKeyframe) {
        if (prevKeyframe.time === nextKeyframe.time) {
          ;(state[property] as number) = prevKeyframe.value
        } else {
          // 在两个关键帧之间，进行插值
          const t = (time - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time)
          const easedT = getEasingFunction(prevKeyframe.easing)(t)
          ;(state[property] as number) = prevKeyframe.value + (nextKeyframe.value - prevKeyframe.value) * easedT
        }
      }
    }

    return state
  }

  /**
   * 获取属性的关键帧
   */
  const getKeyframesForProperty = (layer: Layer, property: TransformProperty): Keyframe[] => {
    return layer.keyframes
      .filter(k => k.property === property)
      .sort((a, b) => a.time - b.time)
  }

  /**
   * 添加关键帧
   */
  const addKeyframe = (layer: Layer, property: TransformProperty, time: number, value: number, easing: string = 'linear'): Keyframe => {
    const newKeyframe: Keyframe = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      time,
      property,
      value,
      easing: easing as any
    }
    
    // 检查是否已存在相同时间的关键帧
    const existingIndex = layer.keyframes.findIndex(k => k.property === property && k.time === time)
    
    if (existingIndex !== -1) {
      layer.keyframes[existingIndex] = newKeyframe
    } else {
      layer.keyframes.push(newKeyframe)
      layer.keyframes.sort((a, b) => a.time - b.time)
    }
    
    return newKeyframe
  }

  /**
   * 删除关键帧
   */
  const removeKeyframe = (layer: Layer, keyframeId: string): void => {
    const index = layer.keyframes.findIndex(k => k.id === keyframeId)
    if (index !== -1) {
      layer.keyframes.splice(index, 1)
    }
  }

  return {
    currentTime,
    isPlaying,
    startPlayback,
    stopPlayback,
    updateCurrentTime,
    getLayerStateAtTime
  }
}
