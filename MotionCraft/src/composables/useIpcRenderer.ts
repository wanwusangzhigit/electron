// src/composables/useIpcRenderer.ts
/**
 * IPC 通信组合式函数
 * 处理 Electron 主进程和渲染进程之间的通信
 */

import { onMounted, onUnmounted } from 'vue'

export interface IpcEventHandler {
  onExportProgress: (callback: (data: any) => void) => void
  onExportComplete: (callback: (data: any) => void) => void
  onExportError: (callback: (data: any) => void) => void
}

export interface UseIpcRendererReturn {
  isElectron: boolean
  electronAPI: typeof window.electronAPI | null
  setupListeners: (handlers: Partial<IpcEventHandler>) => void
  cleanupListeners: () => void
}

/**
 * IPC 通信组合式函数
 */
export function useIpcRenderer(): UseIpcRendererReturn {
  const isElectron = typeof window !== 'undefined' && !!window.electronAPI
  const electronAPI = isElectron ? window.electronAPI : null
  
  const cleanupFns: Array<() => void> = []

  /**
   * 设置 IPC 监听器
   */
  const setupListeners = (handlers: Partial<IpcEventHandler>): void => {
    if (!electronAPI) return

    if (handlers.onExportProgress) {
      electronAPI.onExportProgress(handlers.onExportProgress)
      cleanupFns.push(() => {
        // 清理逻辑（如果需要）
      })
    }

    if (handlers.onExportComplete) {
      electronAPI.onExportComplete(handlers.onExportComplete)
      cleanupFns.push(() => {
        // 清理逻辑
      })
    }

    if (handlers.onExportError) {
      electronAPI.onExportError(handlers.onExportError)
      cleanupFns.push(() => {
        // 清理逻辑
      })
    }
  }

  /**
   * 清理监听器
   */
  const cleanupListeners = (): void => {
    cleanupFns.forEach(fn => fn())
    cleanupFns.length = 0
  }

  return {
    isElectron,
    electronAPI,
    setupListeners,
    cleanupListeners
  }
}
