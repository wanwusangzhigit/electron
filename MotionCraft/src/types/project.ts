// src/types/project.ts
/**
 * 项目工程类型定义
 */

import type { Layer } from './layer'
import type { TimelineState } from './timeline'

/**
 * 素材资源类型
 */
export type AssetType = 'image' | 'video' | 'audio' | 'font'

/**
 * 素材资源数据结构
 */
export interface Asset {
  id: string
  name: string
  type: AssetType
  path: string // 文件路径或 URL
  thumbnail?: string // 缩略图
  duration?: number // 媒体时长（毫秒）
  width?: number // 图片/视频宽度
  height?: number // 图片/视频高度
  fileSize?: number // 文件大小（字节）
  createdAt: number // 创建时间戳
}

/**
 * 项目工程数据结构
 */
export interface Project {
  id: string
  name: string
  width: number // 默认 1920
  height: number // 默认 1080
  fps: number
  duration: number
  layers: Layer[]
  timeline: TimelineState
  assets: Asset[]
  version: string // 工程文件版本
  metadata?: {
    author?: string
    description?: string
    tags?: string[]
    createdAt?: number
    updatedAt?: number
  }
}

/**
 * 项目导出选项
 */
export interface ExportOptions {
  format: 'mp4' | 'webm' | 'gif'
  quality: 'low' | 'medium' | 'high'
  resolution: '720p' | '1080p' | '4k' | 'custom'
  customWidth?: number
  customHeight?: number
  fps?: number
  outputPath: string
}

/**
 * 项目模板
 */
export interface ProjectTemplate {
  id: string
  name: string
  thumbnail?: string
  width: number
  height: number
  fps: number
  duration: number
  presetLayers?: any[] // 预设图层配置
}

/**
 * 常用预设分辨率
 */
export const PRESET_RESOLUTIONS: Record<string, { width: number; height: number }> = {
  '720p': { width: 1280, height: 720 },
  '1080p': { width: 1920, height: 1080 },
  '4k': { width: 3840, height: 2160 },
  'square': { width: 1080, height: 1080 },
  'portrait': { width: 1080, height: 1920 },
  'story': { width: 1080, height: 1350 }
}

/**
 * 默认项目配置
 */
export const DEFAULT_PROJECT_CONFIG: Omit<Project, 'id' | 'layers' | 'timeline' | 'assets'> = {
  name: 'Untitled Project',
  width: 1920,
  height: 1080,
  fps: 30,
  duration: 30000, // 30 秒
  version: '1.0.0'
}
