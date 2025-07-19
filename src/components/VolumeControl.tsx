import * as React from 'react';

interface VolumeControlProps {
  volume: number;
  setVolume: (v: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, setVolume }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(1 - Number(e.target.value));
  };
  return (
    <div style={{
      position: 'fixed',
      right: 36,
      bottom: 36,
      zIndex: 20,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      background: '#fff',
      border: '2px solid var(--accent, #888)',
      borderRadius: 16,
      padding: 16,
      boxShadow: '0 4px 16px var(--accent, #0002)',
      width: 56
    }}>
      <span style={{fontSize: 18, color: '#888'}}>🔊</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={1 - volume}
        onChange={handleChange}
        style={{
          writingMode: 'vertical-lr',
          WebkitAppearance: 'slider-vertical',
          width: 36,
          height: 120,
          margin: '8px 0',
        } as React.CSSProperties}
        aria-label="Громкость"
      />
      <span style={{fontSize: 18, color: '#888'}}>🔈</span>
    </div>
  );
};

export default VolumeControl; 