import * as React from 'react';
import Player from './components/Player';
import TrackList from './components/TrackList';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      minWidth: '100vw',
      background: 'var(--bg, #262626)',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      padding: 0,
      gap: 8,
      fontFamily: 'Arial, sans-serif',
      color: 'var(--text, #fff)',
      fontSize: 16,
      lineHeight: 1.5,
      textAlign: 'center',
      textShadow: '0 1px 2px #0002',
      boxSizing: 'border-box',
    }}>
      <TrackList />
      <Player />
    </div>
  );
}

export default App;
