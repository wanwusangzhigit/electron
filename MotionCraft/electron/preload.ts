// electron/preload.ts
/**
 * Electron 预加载脚本
 * 安全地暴露 API 给渲染进程使用
 */

import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from './utils/ipcChannels'

// 定义暴露给渲染进程的 API 类型
export interface IElectronAPI {
  // 应用控制
  getAppVersion: () => Promise<string>
  quitApp: () => void
  
  // 项目操作
  createNewProject: () => Promise<any>
  loadProject: () => Promise<any>
  saveProject: (project: any) => Promise<boolean>
  
  // 导出
  startExport: (options: any) => Promise<boolean>
  cancelExport: () => void
  exportVideoDialog: (format: string) => Promise<string | null>
  
  // 事件监听
  onExportProgress: (callback: (data: any) => void) => void
  onExportComplete: (callback: (data: any) => void) => void
  onExportError: (callback: (data: any) => void) => void
}

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 应用控制
  getAppVersion: () => ipcRenderer.invoke(IPC_CHANNELS.APP_VERSION),
  quitApp: () => ipcRenderer.send(IPC_CHANNELS.APP_QUIT),
  
  // 项目操作
  createNewProject: () => ipcRenderer.invoke(IPC_CHANNELS.PROJECT_NEW),
  loadProject: () => ipcRenderer.invoke(IPC_CHANNELS.PROJECT_LOAD),
  saveProject: (project: any) => ipcRenderer.invoke(IPC_CHANNELS.PROJECT_SAVE, project),
  
  // 导出
  startExport: (options: any) => ipcRenderer.invoke(IPC_CHANNELS.FFMPEG_EXPORT_START, options),
  cancelExport: () => ipcRenderer.send(IPC_CHANNELS.FFMPEG_EXPORT_CANCEL),
  exportVideoDialog: (format: string) => ipcRenderer.invoke(IPC_CHANNELS.FILE_EXPORT, format),
  
  // 事件监听
  onExportProgress: (callback: (data: any) => void) => {
    ipcRenderer.on(IPC_CHANNELS.FFMPEG_EXPORT_PROGRESS, (_, data) => callback(data))
  },
  onExportComplete: (callback: (data: any) => void) => {
    ipcRenderer.on(IPC_CHANNELS.FFMPEG_EXPORT_COMPLETE, (_, data) => callback(data))
  },
  onExportError: (callback: (data: any) => void) => {
    ipcRenderer.on(IPC_CHANNELS.FFMPEG_EXPORT_ERROR, (_, data) => callback(data))
  }
})

// TypeScript 声明扩展
declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
