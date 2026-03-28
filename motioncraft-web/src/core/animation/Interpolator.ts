// 文件路径: src/core/animation/Interpolator.ts

/**
 * 插值器
 * 在关键帧之间进行插值计算
 */

import type { Keyframe, TransformProperty, EasingType } from '@types';
import { getEasingFunction, type EasingFunction } from './Easing';

/**
 * 在两个关键帧之间插值
 * @param keyframes 排序后的关键帧数组
 * @param time 当前时间（毫秒）
 * @returns 插值结果
 */
export function interpolate(
  keyframes: Keyframe[],
  time: number
): { value: number; keyframe?: Keyframe } {
  if (keyframes.length === 0) {
    return { value: 0 };
  }

  // 如果只有一个关键帧，直接返回其值
  if (keyframes.length === 1) {
    return { value: keyframes[0].value, keyframe: keyframes[0] };
  }

  // 找到当前时间所在的关键帧区间
  let prevKeyframe: Keyframe | null = null;
  let nextKeyframe: Keyframe | null = null;

  for (let i = 0; i < keyframes.length; i++) {
    const kf = keyframes[i];
    
    if (kf.time <= time) {
      prevKeyframe = kf;
    }
    
    if (kf.time >= time && !nextKeyframe) {
      nextKeyframe = kf;
      break;
    }
  }

  // 时间在第一个关键帧之前
  if (!prevKeyframe) {
    return { value: keyframes[0].value, keyframe: keyframes[0] };
  }

  // 时间在最后一个关键帧之后
  if (!nextKeyframe || prevKeyframe === nextKeyframe) {
    return { value: prevKeyframe.value, keyframe: prevKeyframe };
  }

  // 在两个关键帧之间插值
  const duration = nextKeyframe.time - prevKeyframe.time;
  const elapsed = time - prevKeyframe.time;
  const t = duration > 0 ? elapsed / duration : 0;

  const easingFn = getEasingFunction(prevKeyframe.easing);
  const easedT = easingFn(clamp01(t));

  const value = lerp(prevKeyframe.value, nextKeyframe.value, easedT);

  return { value, keyframe: prevKeyframe };
}

/**
 * 获取指定属性的插值结果
 */
export function interpolateProperty(
  keyframes: Keyframe[],
  property: TransformProperty,
  time: number
): number {
  const filteredKeyframes = keyframes.filter(kf => kf.property === property);
  const result = interpolate(filteredKeyframes, time);
  return result.value;
}

/**
 * 查找最近的关键帧
 */
export function findNearestKeyframe(
  keyframes: Keyframe[],
  time: number,
  threshold: number = 100
): Keyframe | null {
  let nearest: Keyframe | null = null;
  let minDistance = Infinity;

  for (const kf of keyframes) {
    const distance = Math.abs(kf.time - time);
    if (distance < minDistance && distance <= threshold) {
      minDistance = distance;
      nearest = kf;
    }
  }

  return nearest;
}

/**
 * 二分查找定位关键帧区间
 */
export function binarySearchKeyframe(keyframes: Keyframe[], time: number): number {
  let left = 0;
  let right = keyframes.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (keyframes[mid].time === time) {
      return mid;
    } else if (keyframes[mid].time < time) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return left;
}

// 辅助函数
function clamp01(t: number): number {
  return Math.max(0, Math.min(1, t));
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}
