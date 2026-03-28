// 文件路径: src/core/utils/IdGenerator.ts

/**
 * ID 生成器工具
 * 生成唯一标识符用于图层、关键帧、片段等
 */

let counters: Record<string, number> = {};

/**
 * 生成唯一 ID
 * @param prefix 前缀，如 'layer', 'keyframe' 等
 * @returns 格式为 `{prefix}-{timestamp}-{random}` 的唯一 ID
 */
export function generateId(prefix: string = 'id'): string {
  if (!counters[prefix]) {
    counters[prefix] = 0;
  }
  counters[prefix]++;
  
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  const counter = counters[prefix].toString(36);
  
  return `${prefix}-${timestamp}-${counter}-${random}`;
}

/**
 * 重置计数器（主要用于测试）
 */
export function resetCounters(): void {
  counters = {};
}

/**
 * 从 ID 中提取前缀
 */
export function getPrefixFromId(id: string): string | null {
  const parts = id.split('-');
  if (parts.length >= 1) {
    return parts[0];
  }
  return null;
}

/**
 * 验证 ID 格式
 */
export function isValidId(id: string, expectedPrefix?: string): boolean {
  if (!id || typeof id !== 'string') return false;
  
  const parts = id.split('-');
  if (parts.length < 4) return false;
  
  if (expectedPrefix && parts[0] !== expectedPrefix) {
    return false;
  }
  
  return true;
}
