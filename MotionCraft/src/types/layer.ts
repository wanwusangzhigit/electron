// src/types/layer.ts
/**
 * 图层系统类型定义
 */

/**
 * 缓动函数类型
 */
export type EasingType = 
  | 'linear' 
  | 'easeIn' 
  | 'easeOut' 
  | 'easeInOut' 
  | 'elasticOut' 
  | 'bounceOut'

/**
 * 关键帧数据结构
 */
export interface Keyframe {
  id: string
  time: number // 毫秒，相对于图层开始时间
  property: TransformProperty
  value: number
  easing: EasingType
}

/**
 * 可动画的变换属性
 */
export type TransformProperty = 
  | 'x' 
  | 'y' 
  | 'scaleX' 
  | 'scaleY' 
  | 'rotation' 
  | 'opacity' 
  | 'anchorX' 
  | 'anchorY'

/**
 * 图层类型
 */
export type LayerType = 'image' | 'text' | 'shape' | 'group'

/**
 * 形状图层数据
 */
export interface ShapeLayerData {
  shapeType: 'rectangle' | 'circle' | 'triangle' | 'polygon'
  fillColor: string
  strokeColor?: string
  strokeWidth?: number
  points?: number // 多边形边数
  cornerRadius?: number // 圆角半径
}

/**
 * 文本图层数据
 */
export interface TextLayerData {
  text: string
  fontFamily: string
  fontSize: number
  fontWeight: string | number
  fillColor: string
  align: 'left' | 'center' | 'right'
  lineHeight?: number
}

/**
 * 图片图层数据
 */
export interface ImageLayerData {
  src: string
  width: number
  height: number
  assetId: string
}

/**
 * 图层变换属性
 */
export interface TransformData {
  x: number
  y: number
  scaleX: number
  scaleY: number
  rotation: number // 弧度
  anchorX: number // 0-1
  anchorY: number // 0-1
  opacity: number // 0-1
}

/**
 * 图层基础接口
 */
export interface Layer {
  id: string
  type: LayerType
  name: string
  visible: boolean
  locked: boolean
  parentId: string | null
  children: string[] // 仅 group 类型有效
  transform: TransformData
  keyframes: Keyframe[]
  data: ImageLayerData | TextLayerData | ShapeLayerData | null
  startTime?: number // 在时间轴上的开始时间（可选，用于复杂时间轴）
  duration?: number // 图层持续时间（可选）
}

/**
 * 混合模式类型
 */
export type BlendMode = 'normal' | 'add' | 'multiply' | 'screen' | 'overlay'

/**
 * 图层效果（预留接口）
 */
export interface LayerEffect {
  id: string
  type: 'brightness' | 'contrast' | 'blur' | 'shadow' | 'glow'
  enabled: boolean
  parameters: Record<string, any>
}
