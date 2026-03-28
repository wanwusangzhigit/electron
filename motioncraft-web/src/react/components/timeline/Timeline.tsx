// 文件路径: src/react/components/timeline/Timeline.tsx

/**
 * 时间轴主组件
 */

import React, { useRef, useEffect } from 'react';
import TrackList from './TrackList';
import TimelineRuler from './TimelineRuler';
import Playhead from './Playhead';
import { useTimelineStore } from '@react/stores/useTimelineStore';
import { useLayerStore } from '@react/stores/useLayerStore';

export const Timeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const zoom = useTimelineStore(state => state.zoom);
  const scrollX = useTimelineStore(state => state.scrollX);
  const duration = useTimelineStore(state => state.duration);
  const currentTime = useTimelineStore(state => state.currentTime);
  const isPlaying = useTimelineStore(state => state.isPlaying);
  const setScrollX = useTimelineStore(state => state.setScrollX);
  const setCurrentTime = useTimelineStore(state => state.setCurrentTime);
  const setZoom = useTimelineStore(state => state.setZoom);
  
  const layers = useLayerStore(state => state.layers);
  const syncTracksFromLayers = useTimelineStore(state => state.syncTracksFromLayers);

  // 同步轨道和图层
  useEffect(() => {
    syncTracksFromLayers(layers);
  }, [layers, syncTracksFromLayers]);

  // 播放时滚动
  useEffect(() => {
    if (!isPlaying || !containerRef.current) return;

    const pixelsPerMs = zoom / 1000;
    const currentPixel = currentTime * pixelsPerMs;
    const container = containerRef.current;
    const viewportWidth = container.clientWidth;

    if (currentPixel > scrollX + viewportWidth - 100) {
      setScrollX(currentPixel - viewportWidth + 100);
    } else if (currentPixel < scrollX) {
      setScrollX(Math.max(0, currentPixel - 100));
    }
  }, [currentTime, isPlaying, zoom, scrollX, setScrollX]);

  // 滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -10 : 10;
      setZoom(zoom + delta);
    } else if (e.shiftKey) {
      e.preventDefault();
      setScrollX(scrollX + e.deltaY);
    } else {
      setScrollX(scrollX + e.deltaX);
    }
  };

  // 点击时间轴跳转
  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 150 + scrollX; // 减去轨道列表宽度
    const pixelsPerMs = zoom / 1000;
    const time = x / pixelsPerMs;
    
    setCurrentTime(Math.max(0, Math.min(time, duration)));
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden relative bg-[var(--mc-track-bg)]"
      onWheel={handleWheel}
      onClick={handleClick}
    >
      {/* 时间标尺 */}
      <div className="absolute top-0 left-[150px] right-0 h-8 border-b border-[var(--mc-border)] z-10">
        <TimelineRuler />
      </div>

      {/* 播放头 */}
      <Playhead />

      {/* 轨道列表区域 */}
      <div className="flex h-full pt-8">
        {/* 左侧轨道名称 */}
        <div className="w-[150px] flex-shrink-0 bg-[var(--mc-bg-secondary)] border-r border-[var(--mc-border)] overflow-y-hidden">
          <TrackList showClips={false} />
        </div>

        {/* 右侧时间轴内容 */}
        <div
          className="flex-1 overflow-x-hidden relative"
          style={{ transform: `translateX(-${scrollX}px)` }}
        >
          <div style={{ width: (duration / 1000) * zoom }}>
            <TrackList showClips={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
