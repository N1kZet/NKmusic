import { create } from 'zustand';

interface Track {
  src: string;
  title: string;
  artist: string;
  cover?: string;
  lyrics?: string;
  isDemo?: boolean;
}

const PLAYLIST_KEY = 'audioplayer_playlist_v1';

function savePlaylist(playlist: Track[]) {
  const toSave = playlist.filter(t => !t.src.startsWith('blob:')).map(({isDemo, ...t}) => t);
  localStorage.setItem(PLAYLIST_KEY, JSON.stringify(toSave));
}

function loadPlaylist(): Track[] | null {
  try {
    const raw = localStorage.getItem(PLAYLIST_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('Плейлист повреждён');
    // Проверяем, что каждый элемент похож на трек
    for (const t of parsed) {
      if (typeof t !== 'object' || !t.src || !t.title) throw new Error('Плейлист повреждён');
    }
    return parsed;
  } catch (e) {
    console.error('Ошибка чтения плейлиста из localStorage:', e);
    localStorage.removeItem(PLAYLIST_KEY);
    return null;
  }
}

interface PlayerState {
  playlist: Track[];
  current: number;
  isPlaying: boolean;
  setTrack: (idx: number) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  addTracks: (tracks: Track[]) => void;
  removeTrack: (idx: number) => void;
  reorderTracks: (from: number, to: number) => void;
  playlistError?: string | null;
}

const demoTracks: Track[] = [
  {
    src: '/audio/demo1.mp3',
    title: 'Demo Track 1',
    artist: 'SoundHelix',
    isDemo: true,
  },
  {
    src: '/audio/demo2.mp3',
    title: 'Demo Track 2',
    artist: 'SoundHelix',
    isDemo: true,
  },
];

export const usePlayerStore = create<PlayerState>((set, get) => {
  let loaded: Track[] | null = null;
  let playlistError: string | null = null;
  try {
    loaded = loadPlaylist();
  } catch (e) {
    playlistError = 'Ошибка чтения плейлиста. Используется стандартный.';
  }
  return {
    playlist: loaded && loaded.length > 0 ? [...demoTracks, ...loaded] : [...demoTracks],
    current: 0,
    isPlaying: false,
    playlistError,
    setTrack: (idx) => set({ current: idx, isPlaying: true }),
    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),
    next: () => {
      const { playlist, current } = get();
      set({ current: (current + 1) % playlist.length, isPlaying: true });
    },
    prev: () => {
      const { playlist, current } = get();
      set({ current: (current - 1 + playlist.length) % playlist.length, isPlaying: true });
    },
    addTracks: (tracks) => set((state) => {
      const newList = [...state.playlist, ...tracks];
      savePlaylist(newList);
      return { playlist: newList };
    }),
    removeTrack: (idx) => set((state) => {
      const newList = state.playlist.filter((_, i) => i !== idx);
      savePlaylist(newList);
      let newCurrent = state.current;
      if (idx < state.current) newCurrent--;
      if (newCurrent >= newList.length) newCurrent = newList.length - 1;
      return { playlist: newList, current: Math.max(0, newCurrent) };
    }),
    reorderTracks: (from, to) => set((state) => {
      const arr = [...state.playlist];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      savePlaylist(arr);
      let newCurrent = state.current;
      if (from === state.current) newCurrent = to;
      else if (from < state.current && to >= state.current) newCurrent--;
      else if (from > state.current && to <= state.current) newCurrent++;
      return { playlist: arr, current: newCurrent };
    }),
  };
}); 