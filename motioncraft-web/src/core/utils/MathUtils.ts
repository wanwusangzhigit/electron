// 文件路径: src/core/utils/MathUtils.ts

/**
 * 数学工具函数
 */

/**
 * 限制数值在指定范围内
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * 线性插值
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * 角度转弧度
 */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 弧度转角度
 */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * 规范化角度到 -PI ~ PI 范围
 */
export function normalizeAngle(angle: number): number {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
}

/**
 * 计算两点之间的距离
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 计算两点之间的角度（弧度）
 */
export function angleBetween(x1: number, y1: number, x2: number, y2: number): number {
  return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * 吸附到网格
 */
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * 吸附到指定精度
 */
export function snapToPrecision(value: number, precision: number): number {
  return Math.round(value / precision) * precision;
}

/**
 * 判断两个矩形是否相交
 */
export function rectanglesIntersect(
  r1: { x: number; y: number; width: number; height: number },
  r2: { x: number; y: number; width: number; height: number }
): boolean {
  return !(
    r1.x + r1.width < r2.x ||
    r2.x + r2.width < r1.x ||
    r1.y + r1.height < r2.y ||
    r2.y + r2.height < r1.y
  );
}

/**
 * 判断点是否在矩形内
 */
export function pointInRect(
  point: { x: number; y: number },
  rect: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

/**
 * 格式化时间为 mm:ss.ms 格式
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

/**
 * 根据 FPS 将时间转换为帧数
 */
export function timeToFrame(timeMs: number, fps: number): number {
  return Math.round((timeMs / 1000) * fps);
}

/**
 * 根据帧数转换为时间
 */
export function frameToTime(frame: number, fps: number): number {
  return (frame / fps) * 1000;
}
