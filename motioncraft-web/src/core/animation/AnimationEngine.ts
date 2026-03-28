// 文件路径: src/core/animation/AnimationEngine.ts

/**
 * 动画引擎
 * 负责驱动动画播放和属性计算
 */

import type { Layer, TransformProperty } from '@types';
import { interpolate } from './Interpolator';
import { getEasingFunction } from './Easing';

/**
 * 计算图层在指定时间的变换属性
 */
export function computeLayerTransform(
  layer: Layer,
  time: number
): {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  anchorX: number;
  anchorY: number;
  opacity: number;
} {
  const base = layer.transform;
  
  // 如果有多个关键帧，使用插值
  if (layer.keyframes.length > 0) {
    return {
      x: interpolateForKeyframe(layer.keyframes, 'x', time, base.x),
      y: interpolateForKeyframe(layer.keyframes, 'y', time, base.y),
      scaleX: interpolateForKeyframe(layer.keyframes, 'scaleX', time, base.scaleX),
      scaleY: interpolateForKeyframe(layer.keyframes, 'scaleY', time, base.scaleY),
      rotation: interpolateForKeyframe(layer.keyframes, 'rotation', time, base.rotation),
      anchorX: interpolateForKeyframe(layer.keyframes, 'anchorX', time, base.anchorX),
      anchorY: interpolateForKeyframe(layer.keyframes, 'anchorY', time, base.anchorY),
      opacity: interpolateForKeyframe(layer.keyframes, 'opacity', time, base.opacity),
    };
  }
  
  return base;
}

/**
 * 对特定属性进行关键帧插值
 */
function interpolateForKeyframe(
  keyframes: any[],
  property: string,
  time: number,
  defaultValue: number
): number {
  const propertyKeyframes = keyframes.filter((kf: any) => kf.property === property);
  
  if (propertyKeyframes.length === 0) {
    return defaultValue;
  }
  
  const result = interpolate(propertyKeyframes, time);
  return result.value;
}

/**
 * 获取所有有动画的图层
 */
export function getAnimatedLayers(layers: Layer[]): Layer[] {
  return layers.filter(layer => layer.keyframes.length > 0);
}

/**
 * 检查图层在指定时间是否有活跃的关键帧
 */
export function isLayerActiveAtTime(
  layer: Layer,
  time: number,
  tolerance: number = 100
): boolean {
  if (layer.keyframes.length === 0) {
    return true; // 没有关键帧，始终活跃
  }
  
  const times = layer.keyframes.map(kf => kf.time);
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  
  return time >= minTime - tolerance && time <= maxTime + tolerance;
}

/**
 * 获取图层动画的时间范围
 */
export function getLayerAnimationRange(layer: Layer): { start: number; end: number } | null {
  if (layer.keyframes.length === 0) {
    return null;
  }
  
  const times = layer.keyframes.map(kf => kf.time);
  return {
    start: Math.min(...times),
    end: Math.max(...times),
  };
}

/**
 * 应用变换到显示对象（PixiJS）
 */
export function applyTransformToDisplayObject(
  displayObject: any,
  transform: {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    anchorX: number;
    anchorY: number;
    opacity: number;
  }
): void {
  if (!displayObject) return;
  
  displayObject.x = transform.x;
  displayObject.y = transform.y;
  displayObject.scale.x = transform.scaleX;
  displayObject.scale.y = transform.scaleY;
  displayObject.rotation = transform.rotation;
  displayObject.alpha = transform.opacity;
  
  // 锚点需要在创建时设置，这里只更新值
  if (displayObject.anchor) {
    displayObject.anchor.x = transform.anchorX;
    displayObject.anchor.y = transform.anchorY;
  }
}

/**
 * 将变换从显示对象同步回图层
 */
export function syncTransformFromDisplayObject(
  displayObject: any,
  layer: Layer
): Partial<Layer['transform']> {
  if (!displayObject || !layer) {
    return {};
  }
  
  const changes: Partial<Layer['transform']> = {};
  
  if (displayObject.x !== undefined) {
    changes.x = displayObject.x;
  }
  if (displayObject.y !== undefined) {
    changes.y = displayObject.y;
  }
  if (displayObject.scale?.x !== undefined) {
    changes.scaleX = displayObject.scale.x;
  }
  if (displayObject.scale?.y !== undefined) {
    changes.scaleY = displayObject.scale.y;
  }
  if (displayObject.rotation !== undefined) {
    changes.rotation = displayObject.rotation;
  }
  if (displayObject.alpha !== undefined) {
    changes.opacity = displayObject.alpha;
  }
  
  return changes;
}
