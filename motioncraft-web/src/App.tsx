// 文件路径: src/App.tsx
import React, { useEffect } from 'react';
import { MainLayout } from './react/components/layout/MainLayout';
import { useProjectStore } from './react/stores/useProjectStore';
import { usePlaybackStore } from './react/stores/usePlaybackStore';
import { useTimelineStore } from './react/stores/useTimelineStore';
import { useLayerStore } from './react/stores/useLayerStore';
import { EventBus } from './bridge/event-bus';

/**
 * MotionCraft Web - 根组件
 * 初始化全局状态并渲染主布局
 */
const App: React.FC = () => {
  const { resetProject } = useProjectStore();
  const { initStores } = usePlaybackStore();

  useEffect(() => {
    // 初始化默认项目
    resetProject();
    initStores();

    // 设置全局事件监听
    const handlePropertyChange = (e: CustomEvent) => {
      console.log('Property changed:', e.detail);
      // 处理来自 Vue 面板的属性变更
    };

    window.addEventListener('mc:property-change', handlePropertyChange as EventListener);

    return () => {
      window.removeEventListener('mc:property-change', handlePropertyChange as EventListener);
    };
  }, [resetProject, initStores]);

  return (
    <div className="app-container">
      <MainLayout />
    </div>
  );
};

export default App;
