// electron/services/ProjectService.ts
/**
 * 项目管理服务
 * 处理工程的创建、加载、保存
 */

import { BrowserWindow } from 'electron'
import { FileService } from './FileService'
import type { Project } from '../../src/types/project'

export class ProjectService {
  private fileService: FileService
  private currentProjectPath: string | null = null

  constructor(mainWindow: BrowserWindow) {
    this.fileService = new FileService(mainWindow)
  }

  /**
   * 创建新项目
   */
  createNewProject(options?: Partial<Project>): Project {
    const project: Project = {
      id: this.generateId(),
      name: 'Untitled Project',
      width: options?.width || 1920,
      height: options?.height || 1080,
      fps: options?.fps || 30,
      duration: options?.duration || 30000, // 30 秒
      layers: [],
      timeline: {
        duration: options?.duration || 30000,
        fps: options?.fps || 30,
        currentTime: 0,
        isPlaying: false,
        zoom: 50, // 像素/秒
        tracks: []
      },
      assets: [],
      version: '1.0.0'
    }

    this.currentProjectPath = null
    return project
  }

  /**
   * 保存项目到文件
   */
  async saveProject(project: Project): Promise<boolean> {
    try {
      let filePath = this.currentProjectPath
      
      if (!filePath) {
        filePath = await this.fileService.saveFileDialog(`${project.name}.mcp`)
        if (!filePath) {
          return false
        }
        this.currentProjectPath = filePath
      }

      const content = JSON.stringify(project, null, 2)
      this.fileService.writeFile(filePath, content)
      
      console.log('[ProjectService] Project saved to:', filePath)
      return true
    } catch (error) {
      console.error('[ProjectService] Error saving project:', error)
      return false
    }
  }

  /**
   * 从文件加载项目
   */
  async loadProject(): Promise<Project | null> {
    try {
      const filePath = await this.fileService.openFileDialog()
      if (!filePath) {
        return null
      }

      const content = this.fileService.readFile(filePath)
      const project = JSON.parse(content) as Project
      
      // 验证项目结构
      if (!this.validateProject(project)) {
        throw new Error('Invalid project file format')
      }

      this.currentProjectPath = filePath
      console.log('[ProjectService] Project loaded from:', filePath)
      return project
    } catch (error) {
      console.error('[ProjectService] Error loading project:', error)
      return null
    }
  }

  /**
   * 导出项目为 JSON（用于备份）
   */
  async exportProjectJSON(project: Project): Promise<boolean> {
    try {
      const filePath = await this.fileService.saveFileDialog(`${project.name}_backup.json`)
      if (!filePath) {
        return false
      }

      const content = JSON.stringify(project, null, 2)
      this.fileService.writeFile(filePath, content)
      return true
    } catch (error) {
      console.error('[ProjectService] Error exporting project:', error)
      return false
    }
  }

  /**
   * 验证项目数据结构
   */
  private validateProject(project: any): boolean {
    // 基础验证
    if (!project || typeof project !== 'object') {
      return false
    }

    // 必需字段检查
    const requiredFields = ['id', 'name', 'width', 'height', 'fps', 'duration', 'layers', 'timeline']
    for (const field of requiredFields) {
      if (!(field in project)) {
        return false
      }
    }

    // 类型检查
    if (typeof project.width !== 'number' || typeof project.height !== 'number') {
      return false
    }

    if (!Array.isArray(project.layers)) {
      return false
    }

    return true
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 获取当前项目路径
   */
  getCurrentProjectPath(): string | null {
    return this.currentProjectPath
  }
}
