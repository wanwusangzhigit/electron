// 文件路径: src/react/hooks/useAnimationFrame.ts

/**
 * 动画帧 Hook
 * 使用 requestAnimationFrame 驱动动画循环
 */

import { useEffect, useRef, useCallback } from 'react';

export type FrameCallback = (deltaTime: number, timestamp: number) => void;

export function useAnimationFrame(
  callback: FrameCallback,
  isRunning: boolean = true
): void {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = useCallback((timestamp: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = timestamp - previousTimeRef.current;
      callback(deltaTime, timestamp);
    }
    previousTimeRef.current = timestamp;
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      previousTimeRef.current = undefined;
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning, animate]);
}

/**
 * 简化的播放控制 Hook
 */
export function usePlaybackAnimation(
  onUpdate: (currentTime: number) => void,
  currentTime: number,
  isPlaying: boolean,
  duration: number,
  fps: number = 30
): void {
  const lastUpdateRef = useRef<number>(0);
  const frameInterval = 1000 / fps;

  useAnimationFrame((deltaTime) => {
    if (!isPlaying) return;

    const now = performance.now();
    
    // 限制更新频率到目标 FPS
    if (now - lastUpdateRef.current >= frameInterval) {
      let newTime = currentTime + deltaTime;
      
      if (newTime >= duration) {
        newTime = duration;
      }
      
      onUpdate(newTime);
      lastUpdateRef.current = now;
    }
  }, isPlaying);
}
