// 文件路径: src/react/components/layout/BottomPanel.tsx

/**
 * 底部面板组件 - 时间轴区域
 */

import React from 'react';
import Timeline from '../timeline/Timeline';
import PlaybackControls from '../timeline/PlaybackControls';

export const BottomPanel: React.FC = () => {
  return (
    <div className="h-[var(--mc-timeline-height)] bg-[var(--mc-bg-secondary)] border-t border-[var(--mc-border)] flex flex-col">
      {/* 播放控制条 */}
      <div className="h-10 border-b border-[var(--mc-border)] flex items-center px-3 gap-2">
        <PlaybackControls />
      </div>
      
      {/* 时间轴 */}
      <div className="flex-1 overflow-hidden">
        <Timeline />
      </div>
    </div>
  );
};

export default BottomPanel;
