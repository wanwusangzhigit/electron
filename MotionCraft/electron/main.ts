// electron/main.ts
/**
 * Electron 主进程入口
 * 负责创建窗口、IPC 通信、生命周期管理
 */

import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { IPC_CHANNELS } from './utils/ipcChannels'
import { FFmpegService } from './services/FFmpegService'
import { ProjectService } from './services/ProjectService'

let mainWindow: BrowserWindow | null = null
let ffmpegService: FFmpegService | null = null
let projectService: ProjectService | null = null

/**
 * 创建主窗口
 */
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    titleBarStyle: 'hidden', // 隐藏标题栏，使用自定义标题栏
    trafficLightPosition: { x: 10, y: 10 }, // macOS 红绿灯位置
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#1A1A1A',
    show: false, // 先不显示，加载完成后再显示
    frame: true, // 保留系统边框
    title: 'MotionCraft - MG 动画编辑器'
  })

  // 初始化服务
  ffmpegService = new FFmpegService(mainWindow)
  projectService = new ProjectService(mainWindow)

  // 加载页面
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    mainWindow?.focus()
  })

  // 开发工具（仅开发环境）
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  // 窗口关闭
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

/**
 * 设置 IPC 监听器
 */
function setupIpcListeners(): void {
  // 应用版本
  ipcMain.handle(IPC_CHANNELS.APP_VERSION, () => {
    return app.getVersion()
  })

  // 退出应用
  ipcMain.on(IPC_CHANNELS.APP_QUIT, () => {
    app.quit()
  })

  // 新建项目
  ipcMain.handle(IPC_CHANNELS.PROJECT_NEW, () => {
    if (projectService) {
      return projectService.createNewProject()
    }
    return null
  })

  // 加载项目
  ipcMain.handle(IPC_CHANNELS.PROJECT_LOAD, async () => {
    if (projectService) {
      return await projectService.loadProject()
    }
    return null
  })

  // 保存项目
  ipcMain.handle(IPC_CHANNELS.PROJECT_SAVE, async (_, project) => {
    if (projectService) {
      return await projectService.saveProject(project)
    }
    return false
  })

  // 开始导出
  ipcMain.handle(IPC_CHANNELS.FFMPEG_EXPORT_START, async (_, options) => {
    if (ffmpegService) {
      await ffmpegService.startExport(options)
      return true
    }
    return false
  })

  // 取消导出
  ipcMain.on(IPC_CHANNELS.FFMPEG_EXPORT_CANCEL, () => {
    if (ffmpegService) {
      ffmpegService.cancelExport()
    }
  })

  // 文件导出对话框
  ipcMain.handle(IPC_CHANNELS.FILE_EXPORT, async (_, format) => {
    if (projectService) {
      const fileService = (projectService as any).fileService
      return await fileService.exportVideoDialog(format)
    }
    return null
  })
}

/**
 * 应用就绪时创建窗口
 */
app.whenReady().then(() => {
  createWindow()
  setupIpcListeners()
})

/**
 * 所有窗口关闭时退出应用（macOS 除外）
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * macOS 激活应用时重新创建窗口
 */
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

/**
 * 安全退出
 */
app.on('will-quit', () => {
  // 清理资源
  if (ffmpegService) {
    ffmpegService.cancelExport()
  }
})
