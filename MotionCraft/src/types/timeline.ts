// src/types/timeline.ts
/**
 * 时间轴系统类型定义
 */

import type { Layer } from './layer'

/**
 * 轨道数据结构
 */
export interface Track {
  id: string
  layerId: string
  expanded: boolean // 是否展开显示属性轨道
  clips: Clip[]
}

/**
 * 片段数据结构（时间轴上的可视块）
 */
export interface Clip {
  id: string
  startTime: number // 在时间轴上的开始时间（毫秒）
  endTime: number // 在时间轴上的结束时间（毫秒）
  layerIn: number // 素材入点（预留，当前始终 0）
  layerOut: number // 素材出点（预留，当前等于时长）
}

/**
 * 时间轴状态
 */
export interface TimelineState {
  duration: number // 总时长 ms，默认 30000(30 秒)
  fps: number // 默认 30
  currentTime: number // 当前播放位置 ms
  isPlaying: boolean
  zoom: number // 像素/秒，默认 50
  tracks: Track[] // 轨道数组，与图层一一对应
}

/**
 * 播放控制选项
 */
export interface PlaybackOptions {
  loop?: boolean
  fromStart?: boolean
}

/**
 * 时间标尺刻度
 */
export interface TimeRulerTick {
  time: number // 毫秒
  label: string
  isMajor: boolean // 是否为主要刻度
}

/**
 * 关键帧标记位置
 */
export interface KeyframeMarker {
  trackId: string
  property: string
  time: number
  value: number
}

/**
 * 吸附目标
 */
export interface SnapTarget {
  type: 'playhead' | 'keyframe' | 'clip_start' | 'clip_end' | 'frame'
  time: number
  label?: string
}

/**
 * 时间轴选择状态
 */
export interface TimelineSelection {
  selectedClipIds: string[]
  selectedKeyframeIds: string[]
  selectionStartTime: number | null // 框选开始时间
  selectionEndTime: number | null // 框选结束时间
}

/**
 * 时间轴视图配置
 */
export interface TimelineViewConfig {
  minZoom: number // 最小缩放（像素/秒）
  maxZoom: number // 最大缩放（像素/秒）
  trackHeight: number // 轨道高度
  trackHeaderWidth: number // 轨道头部宽度
  rulerHeight: number // 标尺高度
  frameWidth: number // 每帧的最小宽度
}

/**
 * 默认时间轴配置
 */
export const DEFAULT_TIMELINE_CONFIG: TimelineViewConfig = {
  minZoom: 10,
  maxZoom: 200,
  trackHeight: 40,
  trackHeaderWidth: 200,
  rulerHeight: 30,
  frameWidth: 2
}
