import * as React from 'react';

interface Theme {
  accent: string;
  background: string;
}

const defaultTheme: Theme = {
  accent: '#007bff',
  background: '#e6e9f0',
};

const getTheme = (): Theme => {
  try {
    const t = localStorage.getItem('theme');
    if (t) return JSON.parse(t);
  } catch {}
  return defaultTheme;
};

const setThemeLS = (theme: Theme) => {
  localStorage.setItem('theme', JSON.stringify(theme));
};

export const ThemeContext = React.createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({
  theme: defaultTheme,
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [theme, setThemeState] = React.useState<Theme>(getTheme());
  React.useEffect(() => {
    setThemeLS(theme);
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--bg', theme.background);
  }, [theme]);
  return (
    <ThemeContext.Provider value={{theme, setTheme: setThemeState}}>
      {children}
    </ThemeContext.Provider>
  );
};

const SettingsMenu: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [showPalette, setShowPalette] = React.useState(false);
  const { theme, setTheme } = React.useContext(ThemeContext);

  const handleAccent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme({ ...theme, accent: e.target.value });
  };
  const handleBg = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme({ ...theme, background: e.target.value });
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          width: 44,
          height: 44,
          border: '3px solid #888',
          borderRadius: 8,
          background: 'white',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4
        }}
        aria-label="Открыть меню настроек"
      >
        <div style={{ width: 28, height: 4, background: '#888', borderRadius: 2 }} />
        <div style={{ width: 28, height: 4, background: '#888', borderRadius: 2 }} />
        <div style={{ width: 28, height: 4, background: '#888', borderRadius: 2 }} />
      </button>
      {open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 'min(320px, 90vw)',
            height: '100vh',
            background: '#fff',
            borderRight: '3px solid #888',
            borderRadius: '16px 0 0 16px',
            zIndex: 9,
            boxShadow: '4px 0 24px #0002',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '32px 24px 32px 24px',
            boxSizing: 'border-box',
            maxHeight: '100vh',
          }}
        >
          <button
            style={{
              width: '100%',
              padding: '18px 0',
              borderRadius: 24,
              border: '3px solid #888',
              background: 'var(--accent, #f5f5f5)',
              color: '#333',
              fontSize: 18,
              marginBottom: 32,
              fontWeight: 600,
              transition: 'background 0.2s',
              cursor: 'pointer',
            }}
            onClick={() => setShowPalette((v) => !v)}
          >
            🎨 Сменить тему
          </button>
          {showPalette && (
            <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label style={{ fontSize: 16, color: '#444', fontWeight: 500 }}>
                Акцентный цвет:
                <input type="color" value={theme.accent} onChange={handleAccent} style={{ marginLeft: 12, width: 36, height: 36, border: 'none', background: 'none' }} />
              </label>
              <label style={{ fontSize: 16, color: '#444', fontWeight: 500 }}>
                Фон:
                <input type="color" value={theme.background} onChange={handleBg} style={{ marginLeft: 12, width: 36, height: 36, border: 'none', background: 'none' }} />
              </label>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SettingsMenu; 