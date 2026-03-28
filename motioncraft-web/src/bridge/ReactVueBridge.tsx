// 文件路径: src/bridge/ReactVueBridge.tsx

/**
 * React-Vue 桥接组件
 * 在 React 中嵌入 Vue Web Component，并处理双向通信
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { useProjectStore } from '@react/stores/useProjectStore';
import { useLayerStore } from '@react/stores/useLayerStore';
import { EventBus } from './event-bus';

interface ReactVueBridgeProps {
  selectedLayerId: string | null;
}

export const ReactVueBridge: React.FC<ReactVueBridgeProps> = ({ selectedLayerId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const updateLayerProperty = useLayerStore(state => state.updateLayerProperty);
  const addKeyframe = useLayerStore(state => state.addKeyframe);

  // 处理属性变更事件
  const handlePropertyChange = useCallback((e: CustomEvent) => {
    const { layerId, property, value } = e.detail;
    if (layerId && property !== undefined) {
      updateLayerProperty(layerId, property as any, value);
      EventBus.emit('project:modified', {});
    }
  }, [updateLayerProperty]);

  // 处理添加关键帧事件
  const handleAddKeyframe = useCallback((e: CustomEvent) => {
    const { layerId, property, time, value, easing } = e.detail;
    if (layerId && property) {
      addKeyframe(layerId, {
        id: `kf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        time,
        property: property as any,
        value,
        easing: (easing || 'linear') as any,
      });
      EventBus.emit('project:modified', {});
    }
  }, [addKeyframe]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const vueEl = container.querySelector('motioncraft-properties-panel');
    if (vueEl) {
      // 传递选中图层 ID 给 Vue 组件
      (vueEl as any).layerId = selectedLayerId;

      // 监听 Vue 组件事件
      vueEl.addEventListener('property-change', handlePropertyChange as EventListener);
      vueEl.addEventListener('add-keyframe', handleAddKeyframe as EventListener);

      // 清理
      return () => {
        vueEl.removeEventListener('property-change', handlePropertyChange as EventListener);
        vueEl.removeEventListener('add-keyframe', handleAddKeyframe as EventListener);
      };
    }
  }, [selectedLayerId, handlePropertyChange, handleAddKeyframe]);

  // 当项目状态变化时，同步给 Vue
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const vueEl = container.querySelector('motioncraft-properties-panel');
    if (vueEl) {
      (vueEl as any).selectedLayerId = selectedLayerId;
    }
  }, [selectedLayerId]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <motioncraft-properties-panel />
    </div>
  );
};

export default ReactVueBridge;
