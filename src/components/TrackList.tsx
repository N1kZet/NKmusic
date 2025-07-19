import * as React from 'react';
import { usePlayerStore } from '../store/playerStore';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

function SortableTrack({track, idx, active, onRemove, onClick}: any) {
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id: idx});
  return (
    <div
      ref={setNodeRef}
      style={{
        padding: 0,
        margin: 0,
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 2 : 1,
        display: 'flex',
        alignItems: 'center',
        background: active ? 'var(--bg, #e6f0ff)' : '#fff',
        border: active ? '3px solid var(--accent, #007bff)' : '2px solid #bbb',
        borderRadius: 12,
        marginBottom: 8,
        boxShadow: isDragging ? '0 4px 16px #0002' : undefined,
      }}
      {...attributes}
      {...listeners}
    >
      <button
        onClick={onClick}
        style={{
          flex: 1,
          padding: '16px 20px',
          background: 'none',
          border: 'none',
          color: '#222',
          fontWeight: active ? 700 : 400,
          fontSize: 18,
          textAlign: 'left',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        {track.title} <span style={{fontSize:14, color:'#888'}}>— {track.artist}</span>
      </button>
      <button
        onClick={onRemove}
        style={{
          marginRight: 12,
          background: 'none',
          border: 'none',
          color: '#e74c3c',
          fontSize: 22,
          cursor: 'pointer',
          padding: 0,
        }}
        title="Удалить трек"
      >
        ×
      </button>
      <span style={{cursor: 'grab', fontSize: 20, color: '#bbb', marginRight: 8}} title="Перетащить">☰</span>
    </div>
  );
}

const TrackList: React.FC = () => {
  const { playlist, current, setTrack, playlistError } = usePlayerStore();
  const removeTrack = usePlayerStore((s: any) => s.removeTrack);
  const reorderTracks = usePlayerStore((s: any) => s.reorderTracks);

  // Drag&Drop sensors
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const {active, over} = event;
    if (active && over && active.id !== over.id) {
      reorderTracks(Number(active.id), Number(over.id));
    }
  };

  // Кнопка добавления треков
  const addButton = (
    <label style={{
      display: 'block',
      marginBottom: 16,
      cursor: 'pointer',
      color: 'var(--accent, #007bff)',
      fontWeight: 600,
      fontSize: 18,
      textAlign: 'center',
      border: '2px dashed var(--accent, #b0c4de)',
      borderRadius: 10,
      padding: '12px 0',
      background: 'var(--bg, #e6f0ff)',
      transition: 'background 0.2s',
      minWidth: 160,
      marginRight: 0,
    }}>
      + Добавить треки
      <input
        type="file"
        accept="audio/*"
        multiple
        style={{ display: 'none' }}
        onChange={e => {
          const files = e.target.files;
          if (!files) return;
          const addTracks = usePlayerStore.getState().addTracks;
          const tracks = Array.from(files).map((file) => ({
            src: URL.createObjectURL(file),
            title: file.name.replace(/\.[^/.]+$/, ''),
            artist: 'Local',
          }));
          addTracks(tracks);
          e.target.value = '';
        }}
      />
    </label>
  );

  if (playlist.length === 0) {
    return (
      <div style={{
        width: '100%',
        maxWidth: 400,
        margin: '32px auto',
        background: '#f5f5f5',
        border: '3px solid var(--accent, #888)',
        borderRadius: 16,
        padding: 16,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0
      }}>
        {addButton}
        <div style={{ color: '#888', fontSize: 18, marginTop: 12 }}>
          Плейлист пуст.<br/>Добавьте треки!
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: 400,
      margin: '32px auto',
      background: '#f5f5f5',
      border: '3px solid var(--accent, #888)',
      borderRadius: 16,
      padding: 16,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 0
    }}>
      {addButton}
      {playlistError && (
        <div style={{ color: 'red', fontWeight: 600, marginBottom: 12, textAlign: 'center' }}>{playlistError}</div>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={playlist.map((_, i) => i)} strategy={verticalListSortingStrategy}>
          {playlist.map((track, idx) => (
            <SortableTrack
              key={track.src + '-' + idx}
              track={track}
              idx={idx}
              active={idx === current}
              onRemove={() => removeTrack(idx)}
              onClick={() => setTrack(idx)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TrackList; 