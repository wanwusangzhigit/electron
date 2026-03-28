// 文件路径: src/core/animation/Easing.ts

/**
 * 缓动函数库
 * 实现常用的缓动效果
 */

export type EasingFunction = (t: number) => number;

/**
 * 缓动类型枚举
 */
export type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'elasticOut' | 'bounceOut' | 'backOut';

/**
 * 线性 - 无缓动
 */
export const linear: EasingFunction = (t: number): number => t;

/**
 * 渐入 - 从慢到快
 */
export const easeIn: EasingFunction = (t: number): number => t * t * t;

/**
 * 渐出 - 从快到慢
 */
export const easeOut: EasingFunction = (t: number): number => {
  return 1 - easeIn(1 - t);
};

/**
 * 渐入渐出 - 慢 - 快 - 慢
 */
export const easeInOut: EasingFunction = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/**
 * 弹性缓出 - 像弹簧一样弹跳后稳定
 */
export const elasticOut: EasingFunction = (t: number): number => {
  if (t === 0 || t === 1) return t;
  
  const p = 0.3;
  return Math.pow(2, -10 * t) * Math.sin((t * 360 - 90) * (Math.PI / 180)) + 1;
};

/**
 * 弹跳缓出 - 像球落地弹跳
 */
export const bounceOut: EasingFunction = (t: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;
  
  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
};

/**
 * 回弹缓出 - 先往回拉再弹出
 */
export const backOut: EasingFunction = (t: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/**
 * 获取缓动函数
 */
export function getEasingFunction(type: EasingType): EasingFunction {
  switch (type) {
    case 'linear':
      return linear;
    case 'easeIn':
      return easeIn;
    case 'easeOut':
      return easeOut;
    case 'easeInOut':
      return easeInOut;
    case 'elasticOut':
      return elasticOut;
    case 'bounceOut':
      return bounceOut;
    case 'backOut':
      return backOut;
    default:
      return linear;
  }
}

/**
 * 所有缓动类型列表
 */
export const EASING_TYPES: EasingType[] = [
  'linear',
  'easeIn',
  'easeOut',
  'easeInOut',
  'elasticOut',
  'bounceOut',
  'backOut',
];

/**
 * 缓动类型显示名称
 */
export const EASING_LABELS: Record<EasingType, string> = {
  linear: '线性',
  easeIn: '渐入',
  easeOut: '渐出',
  easeInOut: '渐入渐出',
  elasticOut: '弹性',
  bounceOut: '弹跳',
  backOut: '回弹',
};
