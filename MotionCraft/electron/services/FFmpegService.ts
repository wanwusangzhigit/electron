// electron/services/FFmpegService.ts
/**
 * FFmpeg 视频导出服务
 * 负责调用系统 FFmpeg 进行视频渲染和导出
 */

import { spawn, ChildProcess } from 'child_process'
import { IPC_CHANNELS } from '../utils/ipcChannels'
import type { BrowserWindow } from 'electron'

export interface ExportOptions {
  outputPath: string
  width: number
  height: number
  fps: number
  duration: number
  format: 'mp4' | 'webm' | 'gif'
  quality?: 'low' | 'medium' | 'high'
}

export class FFmpegService {
  private currentProcess: ChildProcess | null = null
  private isCancelled: boolean = false
  private mainWindow: BrowserWindow

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
  }

  /**
   * 开始导出视频
   * @param options 导出选项
   */
  async startExport(options: ExportOptions): Promise<void> {
    this.isCancelled = false
    
    // FFmpeg 路径 - 生产环境需要内置或指定绝对路径
    const ffmpegPath = 'ffmpeg'
    
    // 构建 FFmpeg 命令参数
    const args = this.buildFFmpegArgs(options)
    
    console.log('[FFmpeg] Starting export with args:', args)
    
    this.currentProcess = spawn(ffmpegPath, args)
    
    this.currentProcess.stdout?.on('data', (data) => {
      this.parseProgress(data.toString())
    })
    
    this.currentProcess.stderr?.on('data', (data) => {
      this.parseProgress(data.toString())
    })
    
    this.currentProcess.on('close', (code) => {
      if (this.isCancelled) {
        this.mainWindow.webContents.send(IPC_CHANNELS.FFMPEG_EXPORT_COMPLETE, {
          success: false,
          message: 'Export cancelled by user'
        })
      } else if (code === 0) {
        this.mainWindow.webContents.send(IPC_CHANNELS.FFMPEG_EXPORT_COMPLETE, {
          success: true,
          outputPath: options.outputPath
        })
      } else {
        this.mainWindow.webContents.send(IPC_CHANNELS.FFMPEG_EXPORT_ERROR, {
          code,
          message: `FFmpeg exited with code ${code}`
        })
      }
      this.currentProcess = null
    })
    
    this.currentProcess.on('error', (err) => {
      this.mainWindow.webContents.send(IPC_CHANNELS.FFMPEG_EXPORT_ERROR, {
        message: `Failed to start FFmpeg: ${err.message}. Please ensure FFmpeg is installed.`
      })
      this.currentProcess = null
    })
  }

  /**
   * 取消当前导出
   */
  cancelExport(): void {
    this.isCancelled = true
    if (this.currentProcess) {
      this.currentProcess.kill('SIGTERM')
      this.currentProcess = null
    }
  }

  /**
   * 构建 FFmpeg 命令行参数
   */
  private buildFFmpegArgs(options: ExportOptions): string[] {
    const { width, height, fps, format, outputPath, quality = 'high' } = options
    
    // 根据格式选择编码器
    let codec: string
    let pixelFormat: string
    
    switch (format) {
      case 'webm':
        codec = 'libvpx-vp9'
        pixelFormat = 'yuva420p' // 支持透明通道
        break
      case 'gif':
        codec = 'gif'
        pixelFormat = 'palettegen'
        break
      case 'mp4':
      default:
        codec = 'libx264'
        pixelFormat = 'yuv420p'
        break
    }
    
    // 质量预设
    const crfMap: Record<string, string> = {
      low: '28',
      medium: '23',
      high: '18'
    }
    
    const args: string[] = [
      '-f', 'image2pipe',           // 从管道读取图像序列
      '-r', fps.toString(),         // 输入帧率
      '-vcodec', 'png',             // 输入编码
      '-i', '-',                    // 从 stdin 读取
      '-c:v', codec,                // 视频编码器
      '-pix_fmt', pixelFormat,      // 像素格式
      '-s', `${width}x${height}`,   // 分辨率
      '-r', fps.toString()          // 输出帧率
    ]
    
    // 添加质量参数（H.264/VP9）
    if (format !== 'gif') {
      args.push('-crf', crfMap[quality])
    }
    
    // GIF 需要特殊处理
    if (format === 'gif') {
      args.push(
        '-vf', 'split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse',
        '-loop', '0' // 无限循环
      )
    }
    
    args.push(outputPath)
    
    return args
  }

  /**
   * 解析 FFmpeg 输出进度
   */
  private parseProgress(output: string): void {
    // 匹配时间戳：frame=  123 fps= 30.0 q=...
    const frameMatch = output.match(/frame=\s*(\d+)/)
    const timeMatch = output.match(/time=(\d{2}):(\d{2}):(\d{2})\.(\d{2})/)
    
    if (frameMatch) {
      const frame = parseInt(frameMatch[1], 10)
      this.mainWindow.webContents.send(IPC_CHANNELS.FFMPEG_EXPORT_PROGRESS, {
        frame,
        percent: Math.min((frame / (this.mainWindow as any).expectedFrames) * 100, 100)
      })
    }
    
    if (timeMatch) {
      const hours = parseInt(timeMatch[1], 10)
      const minutes = parseInt(timeMatch[2], 10)
      const seconds = parseInt(timeMatch[3], 10)
      const centiseconds = parseInt(timeMatch[4], 10)
      const currentTime = ((hours * 3600 + minutes * 60 + seconds) + centiseconds / 100) * 1000
      
      // 计算 ETA（预估剩余时间）
      // 这里简化处理，实际需要更多信息
    }
  }
}
