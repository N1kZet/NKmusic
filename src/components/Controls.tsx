import * as React from 'react';

interface ControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Controls: React.FC<ControlsProps> = ({ isPlaying, onPlay, onPause, onNext, onPrev }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '24px 0',
    gap: 32
  }}>
    <button
      onClick={onPrev}
      style={{
        width: 70,
        height: 70,
        border: '3px solid var(--accent, #888)',
        borderRadius: 16,
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0
      }}
      aria-label="Предыдущий трек"
    >
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="24,8 12,18 24,28" fill="var(--accent, #888)" />
      </svg>
    </button>
    <button
      onClick={isPlaying ? onPause : onPlay}
      style={{
        width: 70,
        height: 70,
        border: '3px solid var(--accent, #888)',
        borderRadius: '50%',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0
      }}
      aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
    >
      {isPlaying ? (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="9" y="8" width="6" height="20" rx="2" fill="var(--accent, #888)" />
          <rect x="21" y="8" width="6" height="20" rx="2" fill="var(--accent, #888)" />
        </svg>
      ) : (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="12,8 28,18 12,28" fill="var(--accent, #888)" />
        </svg>
      )}
    </button>
    <button
      onClick={onNext}
      style={{
        width: 70,
        height: 70,
        border: '3px solid var(--accent, #888)',
        borderRadius: 16,
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0
      }}
      aria-label="Следующий трек"
    >
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="12,8 28,18 12,28" fill="var(--accent, #888)" />
        </svg>
    </button>
  </div>
);

export default Controls; 