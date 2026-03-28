// 文件路径: src/react/components/timeline/TrackList.tsx

/**
 * 轨道列表组件
 */

import React from 'react';
import { useTimelineStore } from '@react/stores/useTimelineStore';
import { useLayerStore } from '@react/stores/useLayerStore';
import ClipBar from './ClipBar';

interface TrackListProps {
  showClips?: boolean;
}

export const TrackList: React.FC<TrackListProps> = ({ showClips = true }) => {
  const tracks = useTimelineStore(state => state.tracks);
  const updateTrack = useTimelineStore(state => state.updateTrack);
  const layers = useLayerStore(state => state.layers);

  const toggleVisible = (trackId: string, current: boolean) => {
    updateTrack(trackId, { visible: !current });
  };

  const toggleExpanded = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      updateTrack(trackId, { expanded: !track.expanded });
    }
  };

  return (
    <div className="w-full">
      {tracks.map((track, index) => {
        const layer = layers.find(l => l.id === track.layerId);
        
        return (
          <div
            key={track.id}
            className={`flex items-center border-b border-[var(--mc-border)] ${
              index % 2 === 0 ? 'bg-[var(--mc-track-bg)]' : 'bg-[var(--mc-track-alt-bg)]'
            }`}
            style={{ height: track.height }}
          >
            {/* 轨道名称和控制按钮 */}
            <div className="flex items-center gap-1 px-2 flex-shrink-0 w-[150px]">
              <button
                onClick={() => toggleExpanded(track.id)}
                className="w-4 h-4 flex items-center justify-center text-[var(--mc-text-tertiary)] hover:text-[var(--mc-text-primary)]"
              >
                {track.expanded ? '▼' : '▶'}
              </button>
              
              <button
                onClick={() => toggleVisible(track.id, track.visible)}
                className={`w-4 h-4 text-xs ${
                  track.visible ? 'text-[var(--mc-text-primary)]' : 'text-[var(--mc-text-disabled)]'
                }`}
                title={track.visible ? '隐藏轨道' : '显示轨道'}
              >
                👁
              </button>
              
              <span className="text-xs text-[var(--mc-text-secondary)] truncate flex-1">
                {layer?.name || track.name}
              </span>
            </div>

            {/* 片段条 */}
            {showClips && (
              <div className="flex-1 relative">
                {track.clips.map(clip => (
                  <ClipBar key={clip.id} clip={clip} color={clip.color} />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {tracks.length === 0 && (
        <div className="p-8 text-center text-[var(--mc-text-tertiary)] text-sm">
          暂无轨道，请在画布中添加图层
        </div>
      )}
    </div>
  );
};

export default TrackList;
