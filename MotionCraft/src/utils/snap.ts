// src/utils/snap.ts
/**
 * 吸附计算工具
 * 用于画布和时间轴的吸附功能
 */

/**
 * 吸附阈值（像素）
 */
export const SNAP_THRESHOLD = 5

/**
 * 网格大小（像素）
 */
export const GRID_SIZE = 10

/**
 * 检查两个值是否应该吸附
 * @param value - 当前值
 * @param target - 目标值
 * @param threshold - 吸附阈值
 */
export function shouldSnap(value: number, target: number, threshold: number = SNAP_THRESHOLD): boolean {
  return Math.abs(value - target) <= threshold
}

/**
 * 计算吸附后的值
 * @param value - 当前值
 * @param targets - 可能的吸附目标数组
 * @param threshold - 吸附阈值
 */
export function snapToTargets(value: number, targets: number[], threshold: number = SNAP_THRESHOLD): { snapped: boolean; snappedValue: number; target?: number } {
  for (const target of targets) {
    if (shouldSnap(value, target, threshold)) {
      return {
        snapped: true,
        snappedValue: target,
        target
      }
    }
  }
  
  return {
    snapped: false,
    snappedValue: value
  }
}

/**
 * 吸附到网格
 * @param value - 当前值
 * @param gridSize - 网格大小
 */
export function snapToGrid(value: number, gridSize: number = GRID_SIZE): number {
  return Math.round(value / gridSize) * gridSize
}

/**
 * 吸附到帧
 * @param timeMs - 时间（毫秒）
 * @param fps - 帧率
 */
export function snapToFrame(timeMs: number, fps: number): number {
  const frameDuration = 1000 / fps
  return Math.round(timeMs / frameDuration) * frameDuration
}

/**
 * 获取所有可能的吸附目标（时间轴）
 * @param currentTime - 当前时间
 * @param tracks - 轨道数据
 * @param fps - 帧率
 */
export function getTimelineSnapTargets(
  currentTime: number,
  tracks: Array<{ clips: Array<{ startTime: number; endTime: number }> }>,
  fps: number
): number[] {
  const targets: number[] = []
  
  // 添加帧边界
  const frameDuration = 1000 / fps
  targets.push(Math.floor(currentTime / frameDuration) * frameDuration)
  targets.push(Math.ceil(currentTime / frameDuration) * frameDuration)
  
  // 添加所有片段的开始和结束时间
  for (const track of tracks) {
    for (const clip of track.clips) {
      targets.push(clip.startTime)
      targets.push(clip.endTime)
    }
  }
  
  return targets
}

/**
 * 获取画布吸附目标
 * @param layerBounds - 图层边界
 * @param canvasBounds - 画布边界
 * @param otherLayers - 其他图层边界
 */
export function getCanvasSnapTargets(
  layerBounds: { x: number; y: number; width: number; height: number },
  canvasBounds: { width: number; height: number },
  otherLayers: Array<{ x: number; y: number; width: number; height: number }> = []
): { xTargets: number[]; yTargets: number[] } {
  const xTargets: number[] = [
    0, // 左边界
    canvasBounds.width / 2, // 中心
    canvasBounds.width, // 右边界
    layerBounds.x, // 当前位置
    layerBounds.x + layerBounds.width / 2,
    layerBounds.x + layerBounds.width
  ]
  
  const yTargets: number[] = [
    0, // 上边界
    canvasBounds.height / 2, // 中心
    canvasBounds.height, // 下边界
    layerBounds.y, // 当前位置
    layerBounds.y + layerBounds.height / 2,
    layerBounds.y + layerBounds.height
  ]
  
  // 添加其他图层的边界
  for (const other of otherLayers) {
    xTargets.push(other.x, other.x + other.width / 2, other.x + other.width)
    yTargets.push(other.y, other.y + other.height / 2, other.y + other.height)
  }
  
  return { xTargets, yTargets }
}

/**
 * 智能吸附（考虑多个方向）
 * @param position - 当前位置 {x, y}
 * @param size - 对象尺寸 {width, height}
 * @param canvasSize - 画布尺寸 {width, height}
 * @param otherObjects - 其他对象数组
 */
export function smartSnap(
  position: { x: number; y: number },
  size: { width: number; height: number },
  canvasSize: { width: number; height: number },
  otherObjects: Array<{ x: number; y: number; width: number; height: number }> = []
): { x: number; y: number; snappedX: boolean; snappedY: boolean } {
  const bounds = {
    x: position.x,
    y: position.y,
    width: size.width,
    height: size.height
  }
  
  const { xTargets, yTargets } = getCanvasSnapTargets(bounds, canvasSize, otherObjects)
  
  const xResult = snapToTargets(position.x, xTargets)
  const yResult = snapToTargets(position.y, yTargets)
  
  return {
    x: xResult.snappedValue,
    y: yResult.snappedValue,
    snappedX: xResult.snapped,
    snappedY: yResult.snapped
  }
}
