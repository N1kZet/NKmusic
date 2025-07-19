import * as React from 'react';
import Cover from './Cover';
import SongInfo from './SongInfo';
import Visualizer from './Visualizer';
import ProgressBar from './ProgressBar';
import Controls from './Controls';
import SettingsMenu from './SettingsMenu';
import VolumeControl from './VolumeControl';
import { usePlayerStore } from '../store/playerStore';

const Player: React.FC = () => {
  const { playlist, current, isPlaying, play, pause, next, prev } = usePlayerStore();
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  // Храним уже подключённый audio элемент
  const sourceRef = React.useRef<MediaElementAudioSourceNode | null>(null);
  const connectedAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = React.useState(1);
  const [error, setError] = React.useState<string | null>(null);

  // Создаём AudioContext, Analyser и Source только один раз для одного <audio>
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (!analyserRef.current) {
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
    }
    // Подключаем только если audio ещё не подключён
    if (connectedAudioRef.current !== audio) {
      if (sourceRef.current) {
        try {
          sourceRef.current.disconnect();
        } catch {}
        sourceRef.current = null;
      }
      try {
        sourceRef.current = audioCtxRef.current.createMediaElementSource(audio);
        sourceRef.current.connect(analyserRef.current!);
        analyserRef.current!.connect(audioCtxRef.current.destination);
        connectedAudioRef.current = audio;
      } catch (e) {
        // Если уже подключён — ничего не делаем
      }
    }
  }, [audioRef]);

  // Play/pause effect
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setError(null);
    if (isPlaying) {
      audio.play().catch((e) => {
        setError('Ошибка воспроизведения: ' + (e?.message || e));
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, current]);

  // Обработка ошибок <audio>
  const handleAudioError = () => {
    const audio = audioRef.current;
    if (!audio) return;
    let msg = 'Не удалось воспроизвести трек.';
    if (audio.error) {
      switch (audio.error.code) {
        case 1: msg = 'Прерывание загрузки аудио.'; break;
        case 2: msg = 'Ошибка сети при загрузке аудио.'; break;
        case 3: msg = 'Аудио повреждено или не поддерживается.'; break;
        case 4: msg = 'Формат аудио не поддерживается.'; break;
      }
    }
    setError(msg);
  };

  // Применяем громкость к audioRef
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Next on end
  const handleEnded = () => {
    next();
  };

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      background: 'var(--bg, #e6e9f0)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      transition: 'background 0.5s',
    }}>
      <SettingsMenu />
      <div style={{
        maxWidth: 1100,
        width: '100%',
        minHeight: 600,
        background: '#fff',
        borderRadius: 32,
        boxShadow: '0 8px 48px var(--accent, #b0c4de55), 0 1.5px 8px var(--accent, #b0c4de22)',
        padding: '40px 48px 32px 48px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
        transition: 'box-shadow 0.3s, background 0.3s',
        position: 'relative',
      }}>
        <audio
          ref={audioRef}
          src={playlist[current].src}
          onEnded={handleEnded}
          onError={handleAudioError}
          onPlay={() => setError(null)}
          style={{ display: 'none' }}
        />
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 32, width: '100%', marginTop: 0 }}>
          <Cover track={playlist[current]} />
          <SongInfo track={playlist[current]} />
        </div>
        {error && (
          <div style={{ color: 'red', fontWeight: 600, margin: '16px 0', fontSize: 18, textAlign: 'center' }}>{error}</div>
        )}
        <div style={{ width: '100%', maxWidth: 900 }}>
          <Visualizer analyser={analyserRef.current} />
          <ProgressBar audioRef={audioRef} />
          <Controls
            isPlaying={isPlaying}
            onPlay={play}
            onPause={pause}
            onNext={next}
            onPrev={prev}
          />
          <VolumeControl volume={volume} setVolume={setVolume} />
        </div>
      </div>
    </div>
  );
};

export default Player; 