// 文件路径: src/react/hooks/useFFmpeg.ts

/**
 * FFmpeg.wasm Hook
 * 管理 FFmpeg 的加载和视频导出
 */

import { useState, useCallback, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

interface UseFFmpegReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
  exportVideo: (options: ExportOptions) => Promise<Blob | null>;
}

export interface ExportOptions {
  width: number;
  height: number;
  fps: number;
  duration: number;
  frames: ImageData[];
  format?: 'mp4' | 'webm' | 'gif';
  quality?: number;
  onProgress?: (progress: number) => void;
}

let ffmpegInstance: FFmpeg | null = null;

export function useFFmpeg(): UseFFmpegReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadPromiseRef = useRef<Promise<void> | null>(null);

  const load = useCallback(async () => {
    if (isLoaded) return;
    if (loadPromiseRef.current) return loadPromiseRef.current;

    setIsLoading(true);
    setError(null);

    loadPromiseRef.current = (async () => {
      try {
        ffmpegInstance = new FFmpeg();
        
        ffmpegInstance.on('log', ({ message }) => {
          console.log('[FFmpeg]', message);
        });

        ffmpegInstance.on('progress', ({ progress }) => {
          console.log('[FFmpeg] Progress:', progress);
        });

        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
        
        await ffmpegInstance.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });

        setIsLoaded(true);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load FFmpeg';
        setError(errorMsg);
        console.error('FFmpeg load error:', err);
      } finally {
        setIsLoading(false);
        loadPromiseRef.current = null;
      }
    })();

    return loadPromiseRef.current;
  }, [isLoaded]);

  const exportVideo = useCallback(async (options: ExportOptions): Promise<Blob | null> => {
    if (!ffmpegInstance || !isLoaded) {
      console.error('FFmpeg not loaded');
      return null;
    }

    try {
      const { width, height, fps, duration, frames, format = 'mp4', onProgress } = options;

      // 写入帧到内存文件系统
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.putImageData(frame, 0, 0);
          const data = await canvas.toBlob(blob => blob);
          if (data) {
            await ffmpegInstance.writeFile(`frame${i.toString().padStart(6, '0')}.png`, await fetchFile(data));
          }
        }
        
        if (onProgress) {
          onProgress(i / frames.length);
        }
      }

      // 执行 FFmpeg 命令进行编码
      const outputFile = `output.${format === 'webm' ? 'webm' : format === 'gif' ? 'gif' : 'mp4'}`;
      
      await ffmpegInstance.exec([
        '-framerate', String(fps),
        '-i', 'frame%06d.png',
        '-c:v', format === 'webm' ? 'libvpx-vp9' : format === 'gif' ? 'gif' : 'libx264',
        '-pix_fmt', format === 'gif' ? 'rgb8' : 'yuv420p',
        '-preset', 'ultrafast',
        outputFile,
      ]);

      // 读取输出文件
      const data = await ffmpegInstance.readFile(outputFile);
      
      // 清理临时文件
      for (let i = 0; i < frames.length; i++) {
        await ffmpegInstance.deleteFile(`frame${i.toString().padStart(6, '0')}.png`);
      }
      await ffmpegInstance.deleteFile(outputFile);

      // 创建 Blob
      const mimeType = format === 'webm' ? 'video/webm' : format === 'gif' ? 'image/gif' : 'video/mp4';
      const blob = new Blob([data], { type: mimeType });
      
      return blob;
    } catch (err) {
      console.error('FFmpeg export error:', err);
      setError(err instanceof Error ? err.message : 'Export failed');
      return null;
    }
  }, [isLoaded]);

  return {
    isLoaded,
    isLoading,
    error,
    load,
    exportVideo,
  };
}
