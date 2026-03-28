// 文件路径: src/react/components/layout/LeftPanel.tsx

/**
 * 左侧面板组件 - 素材库
 */

import React, { useState, useCallback } from 'react';
import { useProjectStore } from '@react/stores/useProjectStore';

export const LeftPanel: React.FC = () => {
  const project = useProjectStore(state => state.project);
  const addAsset = useProjectStore(state => state.addAsset);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result as string;
      
      // 创建图片获取尺寸
      const img = new Image();
      img.onload = () => {
        addAsset({
          id: `asset-${Date.now()}`,
          type: 'image',
          name: file.name,
          src: result,
          width: img.width,
          height: img.height,
        });
      };
      img.src = result;
    };

    reader.readAsDataURL(file);
  }, [addAsset]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        addAsset({
          id: `asset-${Date.now()}`,
          type: 'image',
          name: file.name,
          src: result,
          width: img.width,
          height: img.height,
        });
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  }, [addAsset]);

  return (
    <div className="w-[var(--mc-left-panel-width)] bg-[var(--mc-bg-secondary)] border-r border-[var(--mc-border)] flex flex-col h-full">
      <div className="p-3 border-b border-[var(--mc-border)]">
        <h2 className="text-sm font-medium text-[var(--mc-text-primary)]">素材库</h2>
      </div>

      <div
        className={`flex-1 p-3 overflow-y-auto ${isDragging ? 'bg-[var(--mc-accent-alpha)]' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {project?.assets && project.assets.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {project.assets.map((asset) => (
              <div
                key={asset.id}
                className="aspect-square bg-[var(--mc-bg-tertiary)] rounded border border-[var(--mc-border)] overflow-hidden cursor-pointer hover:border-[var(--mc-accent)] transition-colors"
              >
                {asset.thumbnail || asset.src ? (
                  <img
                    src={asset.thumbnail || asset.src}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--mc-text-tertiary)] text-xs">
                    {asset.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-[var(--mc-text-tertiary)]">
            <div className="text-4xl mb-2 opacity-50">📁</div>
            <p className="text-xs text-center mb-2">暂无素材</p>
            <label className="btn btn-primary text-xs cursor-pointer">
              上传素材
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="text-xs mt-4 opacity-50">或拖拽图片到此处</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;
