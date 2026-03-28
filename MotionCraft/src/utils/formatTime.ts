// src/utils/formatTime.ts
/**
 * 时间格式化工具
 */

/**
 * 将毫秒转换为 MM:SS 格式
 * @param ms - 毫秒数
 */
export function formatTimeMMSS(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * 将毫秒转换为 HH:MM:SS 格式
 * @param ms - 毫秒数
 */
export function formatTimeHHMMSS(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * 将毫秒转换为帧数
 * @param ms - 毫秒数
 * @param fps - 帧率
 */
export function msToFrames(ms: number, fps: number): number {
  return Math.round((ms / 1000) * fps)
}

/**
 * 将帧数转换为毫秒
 * @param frames - 帧数
 * @param fps - 帧率
 */
export function framesToMs(frames: number, fps: number): number {
  return (frames / fps) * 1000
}

/**
 * 格式化时间为帧显示（如 "0012" 表示第 12 帧）
 * @param ms - 毫秒数
 * @param fps - 帧率
 */
export function formatTimeAsFrames(ms: number, fps: number): string {
  const frames = msToFrames(ms, fps)
  return frames.toString().padStart(4, '0')
}

/**
 * 格式化时间为秒.百分之一秒
 * @param ms - 毫秒数
 */
export function formatTimeDecimal(ms: number): string {
  const seconds = ms / 1000
  return seconds.toFixed(2)
}

/**
 * 解析时间字符串为毫秒（支持多种格式）
 * @param timeStr - 时间字符串（如 "01:30", "90", "1:30:45"）
 * @param fps - 帧率（用于帧格式）
 */
export function parseTimeString(timeStr: string, fps: number = 30): number {
  // 纯数字，视为帧数
  if (/^\d+$/.test(timeStr)) {
    return framesToMs(parseInt(timeStr, 10), fps)
  }
  
  // MM:SS 或 HH:MM:SS 格式
  const parts = timeStr.split(':').map(p => parseInt(p, 10))
  
  if (parts.length === 2) {
    // MM:SS
    const [minutes, seconds] = parts
    return (minutes * 60 + seconds) * 1000
  } else if (parts.length === 3) {
    // HH:MM:SS
    const [hours, minutes, seconds] = parts
    return (hours * 3600 + minutes * 60 + seconds) * 1000
  }
  
  // 小数格式，视为秒
  const seconds = parseFloat(timeStr)
  if (!isNaN(seconds)) {
    return seconds * 1000
  }
  
  return 0
}
