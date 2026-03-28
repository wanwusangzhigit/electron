// 文件路径: src/react/stores/useLayerStore.ts

/**
 * 图层状态管理 - Zustand
 * 管理图层的 CRUD 操作和选中状态
 */

import { create } from 'zustand';
import type { Layer, LayerType, TransformProperty, Keyframe, ShapeData, TextData, ImageData } from '@types';
import { generateId } from '@core/utils/IdGenerator';

interface LayerState {
  layers: Layer[];
  
  // Actions
  addLayer: (type: LayerType, data?: Partial<Layer>) => Layer;
  updateLayer: (layerId: string, changes: Partial<Layer>) => void;
  deleteLayer: (layerId: string) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  updateLayerProperty: (layerId: string, property: TransformProperty, value: number) => void;
  addKeyframe: (layerId: string, keyframe: Keyframe) => void;
  removeKeyframe: (layerId: string, keyframeId: string) => void;
  getLayerById: (layerId: string) => Layer | undefined;
  getSelectedLayers: () => Layer[];
}

const createDefaultLayer = (type: LayerType, data?: Partial<Layer>): Layer => {
  const id = data?.id || generateId('layer');
  
  let layerData: any = {};
  
  switch (type) {
    case 'shape-rect':
      layerData = {
        shapeType: 'rect' as const,
        fillColor: '#00d6b4',
        strokeColor: '#ffffff',
        strokeWidth: 0,
        width: 200,
        height: 150,
        cornerRadius: 0,
      } as ShapeData;
      break;
    case 'shape-circle':
      layerData = {
        shapeType: 'circle' as const,
        fillColor: '#4488ff',
        strokeColor: '#ffffff',
        strokeWidth: 0,
        width: 150,
        height: 150,
      } as ShapeData;
      break;
    case 'text':
      layerData = {
        text: 'Hello World',
        fontFamily: 'system-ui',
        fontSize: 48,
        fontWeight: 'normal' as const,
        fontStyle: 'normal' as const,
        color: '#ffffff',
        align: 'center' as const,
        letterSpacing: 0,
        lineHeight: 1.2,
      } as TextData;
      break;
    case 'image':
      layerData = {
        assetId: null,
        src: '',
        naturalWidth: 0,
        naturalHeight: 0,
      } as ImageData;
      break;
    default:
      layerData = {};
  }

  return {
    id,
    type,
    name: data?.name || `${type}-${id.substr(-4)}`,
    visible: true,
    locked: false,
    parentId: null,
    children: [],
    zIndex: 0,
    transform: {
      x: data?.transform?.x ?? 0,
      y: data?.transform?.y ?? 0,
      scaleX: data?.transform?.scaleX ?? 1,
      scaleY: data?.transform?.scaleY ?? 1,
      rotation: data?.transform?.rotation ?? 0,
      anchorX: data?.transform?.anchorX ?? 0.5,
      anchorY: data?.transform?.anchorY ?? 0.5,
      opacity: data?.transform?.opacity ?? 1,
    },
    keyframes: [],
    data: layerData,
  };
};

export const useLayerStore = create<LayerState>((set, get) => ({
  layers: [],

  addLayer: (type, data) => {
    const newLayer = createDefaultLayer(type, data);
    
    set((state) => {
      const maxZIndex = state.layers.reduce((max, l) => Math.max(max, l.zIndex), -1);
      newLayer.zIndex = maxZIndex + 1;
      
      return {
        layers: [...state.layers, newLayer],
      };
    });
    
    return newLayer;
  },

  updateLayer: (layerId, changes) => {
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId ? { ...layer, ...changes } : layer
      ),
    }));
  },

  deleteLayer: (layerId) => {
    set((state) => ({
      layers: state.layers.filter((layer) => layer.id !== layerId),
    }));
  },

  reorderLayers: (fromIndex, toIndex) => {
    set((state) => {
      const newLayers = [...state.layers];
      const [removed] = newLayers.splice(fromIndex, 1);
      newLayers.splice(toIndex, 0, removed);
      
      // 重新计算 zIndex
      newLayers.forEach((layer, index) => {
        layer.zIndex = index;
      });
      
      return { layers: newLayers };
    });
  },

  updateLayerProperty: (layerId, property, value) => {
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId
          ? {
              ...layer,
              transform: {
                ...layer.transform,
                [property]: value,
              },
            }
          : layer
      ),
    }));
  },

  addKeyframe: (layerId, keyframe) => {
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id === layerId) {
          const newKeyframes = [...layer.keyframes, keyframe];
          // 按时间排序
          newKeyframes.sort((a, b) => a.time - b.time);
          return { ...layer, keyframes: newKeyframes };
        }
        return layer;
      }),
    }));
  },

  removeKeyframe: (layerId, keyframeId) => {
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId
          ? {
              ...layer,
              keyframes: layer.keyframes.filter((kf) => kf.id !== keyframeId),
            }
          : layer
      ),
    }));
  },

  getLayerById: (layerId) => {
    return get().layers.find((l) => l.id === layerId);
  },

  getSelectedLayers: () => {
    // 这里需要从 project store 获取选中的 ID
    // 简化处理，返回所有图层
    return get().layers;
  },
}));
