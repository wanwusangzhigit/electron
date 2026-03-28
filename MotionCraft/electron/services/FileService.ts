// electron/services/FileService.ts
/**
 * 文件 IO 服务
 * 处理文件的读取和保存
 */

import { dialog, BrowserWindow } from 'electron'
import * as fs from 'fs'
import { IPC_CHANNELS } from '../utils/ipcChannels'

export class FileService {
  private mainWindow: BrowserWindow

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
  }

  /**
   * 打开文件对话框选择文件
   */
  async openFileDialog(filters?: Electron.FileFilter[]): Promise<string | null> {
    const result = await dialog.showOpenDialog(this.mainWindow, {
      properties: ['openFile'],
      filters: filters || [
        { name: 'MotionCraft Project', extensions: ['mcp'] },
        { name: 'JSON', extensions: ['json'] }
      ]
    })

    if (result.canceled || result.filePaths.length === 0) {
      return null
    }

    return result.filePaths[0]
  }

  /**
   * 保存文件对话框
   */
  async saveFileDialog(defaultPath?: string): Promise<string | null> {
    const result = await dialog.showSaveDialog(this.mainWindow, {
      defaultPath,
      filters: [
        { name: 'MotionCraft Project', extensions: ['mcp'] },
        { name: 'JSON', extensions: ['json'] }
      ]
    })

    if (result.canceled) {
      return null
    }

    return result.filePath
  }

  /**
   * 读取文件内容
   */
  readFile(filePath: string): string {
    try {
      return fs.readFileSync(filePath, 'utf-8')
    } catch (error) {
      console.error('[FileService] Error reading file:', error)
      throw error
    }
  }

  /**
   * 写入文件内容
   */
  writeFile(filePath: string, content: string): void {
    try {
      fs.writeFileSync(filePath, content, 'utf-8')
    } catch (error) {
      console.error('[FileService] Error writing file:', error)
      throw error
    }
  }

  /**
   * 导出视频文件对话框
   */
  async exportVideoDialog(format: 'mp4' | 'webm' | 'gif'): Promise<string | null> {
    const filters: Record<string, Electron.FileFilter[]> = {
      mp4: [{ name: 'MP4 Video', extensions: ['mp4'] }],
      webm: [{ name: 'WebM Video', extensions: ['webm'] }],
      gif: [{ name: 'GIF Animation', extensions: ['gif'] }]
    }

    const result = await dialog.showSaveDialog(this.mainWindow, {
      filters: filters[format] || filters.mp4
    })

    if (result.canceled) {
      return null
    }

    return result.filePath
  }
}
