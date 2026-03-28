// src/utils/easing.ts
/**
 * 缓动函数库
 * 实现各种动画缓动效果
 */

/**
 * 线性缓动（无缓动）
 */
export function linear(t: number): number {
  return t
}

/**
 * 二次方缓入
 * @param t - 时间进度 (0-1)
 */
export function easeIn(t: number): number {
  return t * t
}

/**
 * 二次方缓出
 * @param t - 时间进度 (0-1)
 */
export function easeOut(t: number): number {
  return t * (2 - t)
}

/**
 * 二次方缓入缓出
 * @param t - 时间进度 (0-1)
 */
export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

/**
 * 弹性缓出（类似弹簧效果）
 * @param t - 时间进度 (0-1)
 */
export function elasticOut(t: number): number {
  const p = 0.3 // 周期
  
  if (t === 0 || t === 1) return t
  
  const s = p / 4
  return Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1
}

/**
 * 弹跳缓出（类似球落地反弹）
 * @param t - 时间进度 (0-1)
 */
export function bounceOut(t: number): number {
  const n1 = 7.5625
  const d1 = 2.75
  
  if (t < 1 / d1) {
    return n1 * t * t
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375
  }
}

/**
 * 三次方缓入
 */
export function cubicEaseIn(t: number): number {
  return t * t * t
}

/**
 * 三次方缓出
 */
export function cubicEaseOut(t: number): number {
  const t2 = t - 1
  return t2 * t2 * t2 + 1
}

/**
 * 四次方缓入
 */
export function quartEaseIn(t: number): number {
  return t * t * t * t
}

/**
 * 四次方缓出
 */
export function quartEaseOut(t: number): number {
  const t2 = t - 1
  return 1 - t2 * t2 * t2 * t2
}

/**
 * 正弦缓入
 */
export function sineEaseIn(t: number): number {
  return 1 - Math.cos((t * Math.PI) / 2)
}

/**
 * 正弦缓出
 */
export function sineEaseOut(t: number): number {
  return Math.sin((t * Math.PI) / 2)
}

/**
 * 缓动函数映射表
 */
export const EASING_FUNCTIONS: Record<string, (t: number) => number> = {
  linear,
  easeIn,
  easeOut,
  easeInOut,
  elasticOut,
  bounceOut
}

/**
 * 获取缓动函数
 * @param name - 缓动函数名称
 */
export function getEasingFunction(name: string): (t: number) => number {
  return EASING_FUNCTIONS[name] || linear
}

/**
 * 应用缓动到值插值
 * @param start - 起始值
 * @param end - 结束值
 * @param t - 时间进度 (0-1)
 * @param easing - 缓动函数名称
 */
export function applyEasing(start: number, end: number, t: number, easing: string): number {
  const easeFn = getEasingFunction(easing)
  const easedT = easeFn(t)
  return start + (end - start) * easedT
}
