// 文件路径: src/bridge/event-bus.ts

/**
 * 全局事件总线 - 用于 React 和 Vue 之间的通信
 * 使用 CustomEvent 通过 window 对象进行跨框架通信
 */

export interface EventMap {
  // 图层相关
  'layer:selected': { layerId: string | null };
  'layer:updated': { layerId: string; changes: Partial<any> };
  'layer:deleted': { layerId: string };
  
  // 属性变更
  'property-change': { 
    layerId: string; 
    property: string; 
    value: any;
    isKeyframeable?: boolean;
  };
  
  // 关键帧相关
  'add-keyframe': { 
    layerId: string; 
    property: string; 
    time: number; 
    value: number;
    easing?: string;
  };
  'remove-keyframe': { layerId: string; keyframeId: string };
  'update-keyframe': { layerId: string; keyframeId: string; changes: Partial<any> };
  
  // 播放控制
  'playback:play': { currentTime?: number };
  'playback:pause': Record<string, never>;
  'playback:seek': { time: number };
  'playback:update': { currentTime: number };
  
  // 项目相关
  'project:loaded': { project: any };
  'project:saved': { project: any };
  'project:modified': Record<string, never>;
  
  // 画布相关
  'canvas:selection-changed': { selectedIds: string[] };
  'canvas:transform-started': { layerId: string };
  'canvas:transform-updated': { layerId: string; transform: any };
  'canvas:transform-ended': { layerId: string };
}

export type EventType = keyof EventMap;

class EventBusClass {
  private listeners: Map<EventType, Set<(e: CustomEvent) => void>> = new Map();

  emit<T extends EventType>(event: T, data: EventMap[T]): void {
    const detail = data as EventMap[T];
    window.dispatchEvent(new CustomEvent(`mc:${event}`, { detail }));
  }

  on<T extends EventType>(event: T, handler: (e: CustomEvent<EventMap[T]>) => void): () => void {
    const wrappedHandler = handler as (e: CustomEvent) => void;
    
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(wrappedHandler);
    
    window.addEventListener(`mc:${event}`, wrappedHandler as EventListener);
    
    // 返回清理函数
    return () => this.off(event, handler);
  }

  off<T extends EventType>(event: T, handler: (e: CustomEvent<EventMap[T]>) => void): void {
    const wrappedHandler = handler as (e: CustomEvent) => void;
    window.removeEventListener(`mc:${event}`, wrappedHandler as EventListener);
    
    const set = this.listeners.get(event);
    if (set) {
      set.delete(wrappedHandler);
    }
  }

  clear(): void {
    this.listeners.forEach((handlers, event) => {
      handlers.forEach(handler => {
        window.removeEventListener(`mc:${event}`, handler as EventListener);
      });
    });
    this.listeners.clear();
  }
}

export const EventBus = new EventBusClass();
