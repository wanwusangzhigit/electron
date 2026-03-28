// 文件路径: src/types/layer.ts
export type LayerType = 'image' | 'text' | 'shape-rect' | 'shape-circle' | 'shape-line' | 'group';

export type TransformProperty = 'x' | 'y' | 'scaleX' | 'scaleY' | 'rotation' | 'anchorX' | 'anchorY' | 'opacity';
export type AppearanceProperty = 'tint' | 'blur' | 'brightness' | 'contrast';
export type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'elasticOut' | 'bounceOut' | 'backOut';

export interface Keyframe {
  id: string;
  time: number; // 毫秒，相对于图层开始（>=0）
  property: TransformProperty | AppearanceProperty;
  value: number;
  easing: EasingType;
}

export interface ImageData {
  assetId: string | null;
  src: string;
  naturalWidth: number;
  naturalHeight: number;
}

export interface TextData {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  color: string;
  align: 'left' | 'center' | 'right';
  letterSpacing: number;
  lineHeight: number;
}

export interface ShapeData {
  shapeType: 'rect' | 'circle' | 'line' | 'arrow';
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  width?: number;
  height?: number;
  cornerRadius?: number;
  x2?: number;
  y2?: number;
  arrowHead?: boolean;
}

export interface GroupData {
  // 编组无特殊数据，子图层在 layer.children 中
}

export type LayerData = ImageData | TextData | ShapeData | GroupData;

export interface Layer {
  id: string;
  type: LayerType;
  name: string;
  visible: boolean;
  locked: boolean;
  parentId: string | null;
  children: string[];
  zIndex: number;
  transform: {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    anchorX: number;
    anchorY: number;
    opacity: number;
  };
  keyframes: Keyframe[];
  data: LayerData;
}
