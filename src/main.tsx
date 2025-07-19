import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Динамическая смена темы (цветовое колесо)
function animateTheme() {
  let t = 0;
  function step() {
    // Цвета по кругу HSL
    const accent = `hsl(${(t * 40) % 360}, 90%, 55%)`;
    const bg = `linear-gradient(135deg, hsl(${(t * 40 + 120) % 360}, 80%, 90%) 0%, hsl(${(t * 40 + 240) % 360}, 80%, 95%) 100%)`;
    document.documentElement.style.setProperty('--accent', accent);
    document.documentElement.style.setProperty('--bg', bg);
    t += 0.01;
    requestAnimationFrame(step);
  }
  step();
}
animateTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
