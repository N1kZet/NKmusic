import * as React from 'react';
import Player from './components/Player';
import TrackList from './components/TrackList';
import { ThemeProvider } from './components/SettingsMenu';

function App() {
  return (
    <ThemeProvider>
      <div style={{
        minHeight: '100vh',
        minWidth: '100vw',
        background: 'var(--bg, #262626)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0
      }}>
        <TrackList />
        <Player />
      </div>
    </ThemeProvider>
  );
}

export default App;
