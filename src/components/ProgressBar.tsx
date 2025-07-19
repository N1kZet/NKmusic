import * as React from 'react';

interface ProgressBarProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ audioRef }) => {
  const [progress, setProgress] = React.useState(0);
  const [seeking, setSeeking] = React.useState(false);
  const [duration, setDuration] = React.useState(0);

  // Обновление прогресса
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    audio.addEventListener('timeupdate', update);
    audio.addEventListener('durationchange', update);
    return () => {
      audio.removeEventListener('timeupdate', update);
      audio.removeEventListener('durationchange', update);
    };
  }, [audioRef]);

  // Перемотка
  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    if (audioRef.current) {
      audioRef.current.currentTime = percent * duration;
    }
  };

  // Drag
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setSeeking(true);
    handleSeek(e);
  };
  React.useEffect(() => {
    if (!seeking) return;
    const handleMove = (e: MouseEvent) => {
      const bar = document.getElementById('progress-bar');
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = Math.max(0, Math.min(1, x / rect.width));
      if (audioRef.current) {
        audioRef.current.currentTime = percent * duration;
      }
    };
    const handleUp = () => setSeeking(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [seeking, audioRef, duration]);

  // Формат времени
  const format = (s: number) => {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div style={{ width: '100%', maxWidth: 700, margin: '24px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--accent, #888)', marginBottom: 4 }}>
        <span>{format(progress)}</span>
        <span>{format(duration)}</span>
      </div>
      <div
        id="progress-bar"
        style={{
          height: 16,
          width: '100%',
          background: 'var(--bg, #fafafa)',
          border: '3px solid var(--accent, #888)',
          borderRadius: 12,
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={handleSeek}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            height: '100%',
            width: duration ? `${(progress / duration) * 100}%` : '0%',
            background: 'var(--accent, #b0c4de)',
            borderRadius: 12,
            transition: seeking ? 'none' : 'width 0.2s',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar; 