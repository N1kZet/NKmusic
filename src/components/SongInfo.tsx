import * as React from 'react';

interface SongInfoProps {
  track: {
    src: string;
    title: string;
    artist: string;
    cover?: string;
    lyrics?: string;
  };
}

const SongInfo: React.FC<SongInfoProps> = ({ track }) => (
  <div style={{
    flex: 1,
    minHeight: 100,
    border: '3px solid var(--accent, #888)',
    borderRadius: 40,
    background: '#f5f5f5',
    margin: '0 0 0 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '24px 32px',
    fontSize: 28,
    fontWeight: 700,
    color: 'var(--accent, #222)',
    overflow: 'hidden'
  }}>
    <div style={{fontSize: 32, fontWeight: 700, marginBottom: 8, color: '#222', wordBreak: 'break-word'}}>{track.title}</div>
    <div style={{fontSize: 22, fontWeight: 400, color: '#888', wordBreak: 'break-word'}}>{track.artist}</div>
  </div>
);

export default SongInfo; 