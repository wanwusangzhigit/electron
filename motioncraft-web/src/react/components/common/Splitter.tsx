// 文件路径: src/react/components/common/Splitter.tsx

/**
 * 可拖拽分割条组件
 */

import React, { useState, useCallback, useRef } from 'react';

interface SplitterProps {
  orientation?: 'horizontal' | 'vertical';
  onDrag: (delta: number) => void;
  className?: string;
}

export const Splitter: React.FC<SplitterProps> = ({
  orientation = 'vertical',
  onDrag,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const startPosRef = useRef<number>(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startPosRef.current = orientation === 'vertical' ? e.clientX : e.clientY;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentPos = orientation === 'vertical' ? moveEvent.clientX : moveEvent.clientY;
      const delta = currentPos - startPosRef.current;
      startPosRef.current = currentPos;
      onDrag(delta);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [orientation, onDrag]);

  const baseClasses = isDragging
    ? 'bg-[var(--mc-accent)]'
    : 'bg-[var(--mc-border)] hover:bg-[var(--mc-accent)]';

  const orientationClasses = orientation === 'vertical'
    ? 'w-1 cursor-col-resize'
    : 'h-1 cursor-row-resize';

  return (
    <div
      className={`${baseClasses} ${orientationClasses} transition-colors ${className}`}
      onMouseDown={handleMouseDown}
    />
  );
};

export default Splitter;
