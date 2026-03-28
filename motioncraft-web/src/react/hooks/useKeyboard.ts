// 文件路径: src/react/hooks/useKeyboard.ts

/**
 * 键盘快捷键 Hook
 * 管理全局键盘事件
 */

import { useEffect, useCallback } from 'react';

export interface ShortcutHandler {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: (e: KeyboardEvent) => void;
}

export function useKeyboard(shortcuts: ShortcutHandler[]): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      for (const shortcut of shortcuts) {
        const matches =
          key === shortcut.key.toLowerCase() &&
          (!!shortcut.ctrl === e.ctrlKey || !shortcut.ctrl) &&
          (!!shortcut.shift === e.shiftKey || !shortcut.shift) &&
          (!!shortcut.alt === e.altKey || !shortcut.alt);
        
        if (matches) {
          e.preventDefault();
          shortcut.handler(e);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}

/**
 * 常用快捷键配置
 */
export const createShortcuts = (actions: {
  onSelectTool?: () => void;
  onTextTool?: () => void;
  onRectTool?: () => void;
  onCircleTool?: () => void;
  onPlayPause?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}): ShortcutHandler[] => {
  return [
    { key: '1', handler: () => actions.onSelectTool?.() },
    { key: '2', handler: () => actions.onTextTool?.() },
    { key: '3', handler: () => actions.onRectTool?.() },
    { key: '4', handler: () => actions.onCircleTool?.() },
    { key: ' ', handler: () => actions.onPlayPause?.() },
    { key: 'delete', handler: () => actions.onDelete?.() },
    { key: 'backspace', handler: () => actions.onDelete?.() },
    { key: 's', ctrl: true, handler: () => actions.onSave?.() },
    { key: 'z', ctrl: true, handler: () => actions.onUndo?.() },
    { key: 'z', ctrl: true, shift: true, handler: () => actions.onRedo?.() },
  ];
};
