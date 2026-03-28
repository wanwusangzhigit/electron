// 文件路径: src/react/components/layout/Toolbar.tsx

/**
 * 顶部工具栏组件
 */

import React from 'react';
import { IconButton } from '../common/IconButton';
import { useLayerStore } from '@react/stores/useLayerStore';
import { useProjectStore } from '@react/stores/useProjectStore';
import { EventBus } from '@bridge/event-bus';

export const Toolbar: React.FC = () => {
  const addLayer = useLayerStore(state => state.addLayer);
  const project = useProjectStore(state => state.project);

  const handleAddRect = () => {
    const layer = addLayer('shape-rect', {
      name: 'Rectangle',
      transform: { x: 100, y: 100 },
    });
    EventBus.emit('layer:selected', { layerId: layer.id });
  };

  const handleAddCircle = () => {
    const layer = addLayer('shape-circle', {
      name: 'Circle',
      transform: { x: 200, y: 150 },
    });
    EventBus.emit('layer:selected', { layerId: layer.id });
  };

  const handleAddText = () => {
    const layer = addLayer('text', {
      name: 'Text',
      transform: { x: 300, y: 200 },
    });
    EventBus.emit('layer:selected', { layerId: layer.id });
  };

  const handleExport = () => {
    alert('导出功能：FFmpeg.wasm 加载中...\n（完整实现需要配置 SharedArrayBuffer）');
  };

  const handleSave = () => {
    if (!project) return;
    
    const dataStr = JSON.stringify(project, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name || 'project'}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-[var(--mc-toolbar-height)] bg-[var(--mc-bg-secondary)] border-b border-[var(--mc-border)] flex items-center px-3 gap-2">
      <div className="flex items-center gap-1 pr-3 border-r border-[var(--mc-border)]">
        <span className="text-sm font-medium text-[var(--mc-text-primary)]">MotionCraft</span>
        <span className="text-xs text-[var(--mc-text-tertiary)]">Web</span>
      </div>

      <div className="flex items-center gap-1 pl-3">
        <IconButton
          icon={<RectIcon />}
          label="矩形"
          onClick={handleAddRect}
          title="添加矩形 (3)"
        />
        <IconButton
          icon={<CircleIcon />}
          label="圆形"
          onClick={handleAddCircle}
          title="添加圆形 (4)"
        />
        <IconButton
          icon={<TextIcon />}
          label="文字"
          onClick={handleAddText}
          title="添加文字 (2)"
        />
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <IconButton
          icon={<SaveIcon />}
          label="保存"
          onClick={handleSave}
          title="保存项目 (Ctrl+S)"
        />
        <IconButton
          icon={<ExportIcon />}
          label="导出"
          onClick={handleExport}
          variant="primary"
          title="导出视频"
        />
      </div>
    </div>
  );
};

// 图标组件
const RectIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

const CircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

const TextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <text x="3" y="12" fontSize="10" fontWeight="bold">T</text>
  </svg>
);

const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3 2h7l3 3v9H3V2z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M5 2v4h6V2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const ExportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 2v8m0-8l-2 2m2-2l2 2M3 12v2h10v-2" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

export default Toolbar;
