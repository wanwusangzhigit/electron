// 文件路径: src/react/components/timeline/PlaybackControls.tsx

/**
 * 播放控制组件
 */

import React from 'react';
import { IconButton } from '../common/IconButton';
import { useTimelineStore } from '@react/stores/useTimelineStore';
import { usePlaybackStore } from '@react/stores/usePlaybackStore';
import { formatTime } from '@core/utils/MathUtils';

export const PlaybackControls: React.FC = () => {
  const isPlaying = useTimelineStore(state => state.isPlaying);
  const currentTime = useTimelineStore(state => state.currentTime);
  const duration = useTimelineStore(state => state.duration);
  const fps = useTimelineStore(state => state.fps);
  
  const setPlaying = useTimelineStore(state => state.setPlaying);
  const setCurrentTime = useTimelineStore(state => state.setCurrentTime);
  const toggleLooping = useTimelineStore(state => state.toggleLooping);
  const isLooping = useTimelineStore(state => state.isLooping);

  const handlePlayPause = () => {
    setPlaying(!isPlaying);
  };

  const handleStop = () => {
    setPlaying(false);
    setCurrentTime(0);
  };

  const handleRewind = () => {
    setCurrentTime(Math.max(0, currentTime - 1000));
  };

  const handleForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 1000));
  };

  return (
    <div className="flex items-center gap-2">
      {/* 时间显示 */}
      <div className="px-3 py-1 bg-[var(--mc-bg-tertiary)] rounded text-xs font-mono text-[var(--mc-text-primary)] min-w-[100px] text-center">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* 播放控制按钮 */}
      <div className="flex items-center gap-1">
        <IconButton
          icon={<RewindIcon />}
          onClick={handleRewind}
          size="sm"
          title="后退 1 秒"
        />
        
        <IconButton
          icon={isPlaying ? <PauseIcon /> : <PlayIcon />}
          onClick={handlePlayPause}
          variant="primary"
          size="sm"
          title={isPlaying ? '暂停 (Space)' : '播放 (Space)'}
        />
        
        <IconButton
          icon={<StopIcon />}
          onClick={handleStop}
          size="sm"
          title="停止"
        />
        
        <IconButton
          icon={<ForwardIcon />}
          onClick={handleForward}
          size="sm"
          title="前进 1 秒"
        />
      </div>

      {/* 循环开关 */}
      <button
        className={`px-2 py-1 text-xs rounded transition-colors ${
          isLooping
            ? 'bg-[var(--mc-accent)] text-black'
            : 'bg-[var(--mc-bg-tertiary)] text-[var(--mc-text-secondary)] hover:bg-[var(--mc-bg-hover)]'
        }`}
        onClick={toggleLooping}
        title="循环播放"
      >
        🔁
      </button>

      {/* FPS 显示 */}
      <div className="text-xs text-[var(--mc-text-tertiary)] ml-2">
        {fps} FPS
      </div>
    </div>
  );
};

// 图标组件
const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
    <path d="M3 2l9 5-9 5V2z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
    <rect x="2" y="2" width="4" height="10" />
    <rect x="8" y="2" width="4" height="10" />
  </svg>
);

const StopIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
    <rect x="2" y="2" width="10" height="10" />
  </svg>
);

const RewindIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
    <path d="M11 3L3 7l8 4V3zM13 3v8" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

const ForwardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
    <path d="M3 3l8 4-8 4V3zM1 3v8" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

export default PlaybackControls;
