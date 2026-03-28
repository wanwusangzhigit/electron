// 文件路径: src/types/project.ts
import type { Layer } from './layer';
import type { TimelineState } from './timeline';

export interface Asset {
  id: string;
  type: 'image' | 'font';
  name: string;
  src: string; // DataURL 或 ObjectURL
  thumbnail?: string; // 缩略图 DataURL
  width?: number;
  height?: number;
}

export interface Project {
  id: string;
  name: string;
  width: number; // 画布宽度，默认 1920
  height: number; // 画布高度，默认 1080
  fps: number;
  duration: number; // 总时长 ms
  backgroundColor: string; // 背景色，默认#000000
  layers: Layer[]; // 图层数组，按 zIndex 排序
  timeline: TimelineState;
  assets: Asset[];
  version: string; // 工程版本，当前"1.0.0"
  createdAt: number;
  modifiedAt: number;
}

export interface ProjectState {
  project: Project | null;
  selectedLayerIds: string[];
  isDirty: boolean;
}
