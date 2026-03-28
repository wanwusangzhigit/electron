// 文件路径: src/react/hooks/usePixi.ts

/**
 * PixiJS 初始化 Hook
 * 管理 PixiJS Application 的生命周期
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Application, Container, Graphics, Renderer } from 'pixi.js';

interface UsePixiOptions {
  width: number;
  height: number;
  backgroundColor?: number;
  antialias?: boolean;
  resolution?: number;
}

export function usePixi(
  containerRef: React.RefObject<HTMLDivElement>,
  options: UsePixiOptions
) {
  const appRef = useRef<Application | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const app = new Application();
    
    app.init({
      width: options.width,
      height: options.height,
      backgroundColor: options.backgroundColor ?? 0x1a1a1a,
      antialias: options.antialias ?? true,
      resolution: options.resolution ?? window.devicePixelRatio || 1,
      autoDensity: true,
      resizeTo: container,
    }).then(() => {
      container.appendChild(app.canvas as HTMLCanvasElement);
      appRef.current = app;
      setIsReady(true);
    });

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
      setIsReady(false);
    };
  }, [options.width, options.height]);

  const getStage = useCallback(() => {
    return appRef.current?.stage;
  }, []);

  const getRenderer = useCallback(() => {
    return appRef.current?.renderer;
  }, []);

  const resize = useCallback((width: number, height: number) => {
    if (appRef.current) {
      appRef.current.renderer.resize(width, height);
    }
  }, []);

  return {
    app: appRef.current,
    isReady,
    getStage,
    getRenderer,
    resize,
  };
}

/**
 * 创建网格背景
 */
export function createGridBackground(
  width: number,
  height: number,
  gridSize: number = 20,
  color: number = 0x333333
): Graphics {
  const graphics = new Graphics();
  
  graphics.setStrokeStyle({ width: 1, color, alpha: 0.5 });
  
  // 绘制垂直线
  for (let x = 0; x <= width; x += gridSize) {
    graphics.moveTo(x, 0);
    graphics.lineTo(x, height);
  }
  
  // 绘制水平线
  for (let y = 0; y <= height; y += gridSize) {
    graphics.moveTo(0, y);
    graphics.lineTo(width, y);
  }
  
  return graphics;
}
