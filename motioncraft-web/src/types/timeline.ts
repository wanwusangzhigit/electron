// 文件路径: src/types/timeline.ts
import type { Keyframe, TransformProperty } from './layer';

export interface TimelineState {
  duration: number; // 总时长 ms，默认 30000
  fps: number; // 默认 30
  currentTime: number; // 当前播放头位置 ms
  isPlaying: boolean;
  isLooping: boolean; // 是否循环播放
  zoom: number; // 像素/秒，默认 50，范围 10-500
  scrollX: number; // 水平滚动偏移
  selectedClipId: string | null;
  selectedKeyframeIds: string[];
  tracks: Track[];
}

export interface Track {
  id: string;
  layerId: string;
  name: string; // 与 layer.name 同步
  visible: boolean; // 轨道可见（非图层可见）
  locked: boolean; // 轨道锁定
  expanded: boolean; // 是否展开显示属性关键帧
  height: number; // 轨道高度 px，默认 40
  clips: Clip[];
  propertyTracks?: PropertyTrack[];
}

export interface Clip {
  id: string;
  startTime: number; // 在时间轴上的绝对开始时间
  endTime: number; // 绝对结束时间
  layerIn: number; // 素材入点（预留，当前 0）
  layerOut: number; // 素材出点（预留，等于时长）
  color: string; // 轨道条颜色（区分图层类型）
}

export interface PropertyTrack {
  property: TransformProperty;
  keyframes: Keyframe[]; // 该属性的关键帧（冗余存储，方便渲染）
}
