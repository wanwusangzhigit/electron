// electron/utils/ipcChannels.ts
/**
 * IPC 通道定义
 * 用于主进程和渲染进程之间的通信
 */

export const IPC_CHANNELS = {
  // 文件操作
  FILE_OPEN: 'file:open',
  FILE_SAVE: 'file:save',
  FILE_EXPORT: 'file:export',
  
  // FFmpeg 导出
  FFMPEG_EXPORT_START: 'ffmpeg:export:start',
  FFMPEG_EXPORT_PROGRESS: 'ffmpeg:export:progress',
  FFMPEG_EXPORT_COMPLETE: 'ffmpeg:export:complete',
  FFMPEG_EXPORT_ERROR: 'ffmpeg:export:error',
  FFMPEG_EXPORT_CANCEL: 'ffmpeg:export:cancel',
  
  // 项目操作
  PROJECT_NEW: 'project:new',
  PROJECT_LOAD: 'project:load',
  PROJECT_SAVE: 'project:save',
  
  // 系统
  APP_QUIT: 'app:quit',
  APP_VERSION: 'app:version'
} as const;

export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];
