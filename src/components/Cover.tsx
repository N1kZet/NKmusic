import * as React from 'react';

interface CoverProps {
  track: {
    src: string;
    title: string;
    artist: string;
    cover?: string;
    lyrics?: string;
  };
}

const Cover: React.FC<CoverProps> = ({ track }) => {
  // Заглушка: инициалы исполнителя
  const initials = track.artist
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return (
    <div style={{
      width: 150,
      height: 150,
      border: '3px solid var(--accent, #888)',
      borderRadius: 10,
      background: '#fafafa',
      margin: '0 24px 0 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 48,
      color: 'var(--accent, #b0c4de)',
      fontWeight: 700,
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0
    }}>
      {track.cover ? (
        <img src={track.cover} alt={track.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default Cover; 