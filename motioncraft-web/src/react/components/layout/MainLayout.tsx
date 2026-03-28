// 文件路径: src/react/components/layout/MainLayout.tsx

/**
 * 主布局组件
 * 三栏布局：左侧素材库 - 中间画布 - 右侧属性面板
 */

import React, { useState } from 'react';
import Toolbar from './Toolbar';
import LeftPanel from './LeftPanel';
import CanvasContainer from './CanvasContainer';
import BottomPanel from './BottomPanel';
import { ReactVueBridge } from '@bridge/ReactVueBridge';
import { useProjectStore } from '@react/stores/useProjectStore';

export const MainLayout: React.FC = () => {
  const [rightPanelWidth, setRightPanelWidth] = useState(340);
  const selectedLayerId = useProjectStore(state => state.selectedLayerIds[0] || null);

  const handleResize = (delta: number) => {
    setRightPanelWidth(prev => Math.max(280, Math.min(500, prev - delta)));
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 顶部工具栏 */}
      <Toolbar />

      {/* 主体内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧面板 - 素材库 */}
        <LeftPanel />

        {/* 中间 - 画布区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <CanvasContainer />
          
          {/* 底部时间轴 */}
          <BottomPanel />
        </div>

        {/* 分割条 */}
        <div
          className="w-1 bg-[var(--mc-border)] hover:bg-[var(--mc-accent)] cursor-col-resize transition-colors"
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startWidth = rightPanelWidth;

            const handleMouseMove = (moveEvent: MouseEvent) => {
              const delta = startX - moveEvent.clientX;
              setRightPanelWidth(Math.max(280, Math.min(500, startWidth + delta)));
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />

        {/* 右侧面板 - 属性面板 (Vue) */}
        <div
          className="bg-[var(--mc-bg-secondary)] border-l border-[var(--mc-border)] overflow-hidden"
          style={{ width: rightPanelWidth }}
        >
          <div className="h-full overflow-y-auto">
            <ReactVueBridge selectedLayerId={selectedLayerId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
