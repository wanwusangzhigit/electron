// 文件路径: src/react/components/layout/CanvasContainer.tsx

/**
 * 画布容器组件 - PixiJS 渲染区域
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Application, Container, Graphics, Sprite, Rectangle } from 'pixi.js';
import { useProjectStore } from '@react/stores/useProjectStore';
import { useLayerStore } from '@react/stores/useLayerStore';
import { useTimelineStore } from '@react/stores/useTimelineStore';
import { EventBus } from '@bridge/event-bus';

export const CanvasContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const layersContainerRef = useRef<Container | null>(null);
  const gridRef = useRef<Graphics | null>(null);
  
  const project = useProjectStore(state => state.project);
  const layers = useLayerStore(state => state.layers);
  const currentTime = useTimelineStore(state => state.currentTime);
  const [isReady, setIsReady] = useState(false);

  // 初始化 PixiJS
  useEffect(() => {
    if (!containerRef.current) return;

    const initPixi = async () => {
      const app = new Application();
      
      await app.init({
        width: project?.width || 1920,
        height: project?.height || 1080,
        backgroundColor: parseInt((project?.backgroundColor || '#1a1a1a').slice(1), 16),
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      containerRef.current!.appendChild(app.canvas as HTMLCanvasElement);
      appRef.current = app;

      // 创建层级结构
      const worldContainer = new Container();
      layersContainerRef.current = new Container();
      
      // 创建网格背景
      const grid = createGrid(project?.width || 1920, project?.height || 1080);
      gridRef.current = grid;
      
      worldContainer.addChild(grid);
      worldContainer.addChild(layersContainerRef.current);
      app.stage.addChild(worldContainer);

      setIsReady(true);
    };

    initPixi();

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
      setIsReady(false);
    };
  }, []);

  // 渲染图层
  useEffect(() => {
    if (!isReady || !layersContainerRef.current) return;

    const container = layersContainerRef.current;
    container.removeChildren();

    // 按 zIndex 排序后渲染
    const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

    sortedLayers.forEach((layer) => {
      if (!layer.visible) return;

      const displayObject = createDisplayObject(layer);
      if (displayObject) {
        // 应用变换
        displayObject.x = layer.transform.x + (project?.width || 1920) / 2;
        displayObject.y = layer.transform.y + (project?.height || 1080) / 2;
        displayObject.scale.set(layer.transform.scaleX, layer.transform.scaleY);
        displayObject.rotation = layer.transform.rotation;
        displayObject.alpha = layer.transform.opacity;
        displayObject.anchor?.set(layer.transform.anchorX, layer.transform.anchorY);

        container.addChild(displayObject);
      }
    });
  }, [layers, isReady, project]);

  // 创建显示对象
  const createDisplayObject = (layer: typeof layers[0]): Container | null => {
    switch (layer.type) {
      case 'shape-rect': {
        const data = layer.data as any;
        const graphics = new Graphics();
        graphics.rect(
          -(data.width || 100) / 2,
          -(data.height || 100) / 2,
          data.width || 100,
          data.height || 100
        );
        graphics.fill({ color: parseInt(data.fillColor.slice(1), 16) });
        if (data.strokeWidth > 0) {
          graphics.setStrokeStyle({ width: data.strokeWidth, color: parseInt(data.strokeColor.slice(1), 16) });
          graphics.stroke();
        }
        return graphics as unknown as Container;
      }
      case 'shape-circle': {
        const data = layer.data as any;
        const graphics = new Graphics();
        graphics.circle(0, 0, (data.width || 100) / 2);
        graphics.fill({ color: parseInt(data.fillColor.slice(1), 16) });
        if (data.strokeWidth > 0) {
          graphics.setStrokeStyle({ width: data.strokeWidth, color: parseInt(data.strokeColor.slice(1), 16) });
          graphics.stroke();
        }
        return graphics as unknown as Container;
      }
      case 'text': {
        // PixiJS v7/v8 文本创建方式不同，这里简化处理
        const data = layer.data as any;
        const graphics = new Graphics();
        graphics.fillStyle(parseInt(data.color.slice(1), 16));
        graphics.fillText(data.text || 'Text', {
          fontSize: data.fontSize || 24,
        });
        return graphics as unknown as Container;
      }
      default:
        return null;
    }
  };

  // 创建网格
  const createGrid = (width: number, height: number): Graphics => {
    const graphics = new Graphics();
    const gridSize = 50;
    
    graphics.setStrokeStyle({ width: 1, color: 0x333333, alpha: 0.5 });
    
    for (let x = 0; x <= width; x += gridSize) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, height);
    }
    
    for (let y = 0; y <= height; y += gridSize) {
      graphics.moveTo(0, y);
      graphics.lineTo(width, y);
    }
    
    return graphics;
  };

  return (
    <div className="flex-1 bg-[var(--mc-bg-primary)] overflow-hidden relative">
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center"
      />
      
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center text-[var(--mc-text-tertiary)]">
          <div className="text-sm">加载画布中...</div>
        </div>
      )}
    </div>
  );
};

export default CanvasContainer;
