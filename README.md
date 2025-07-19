# AudioPlayer

Гибкий аудиоплеер на React + TypeScript

## Технологии
- React + Vite + TypeScript
- Zustand (глобальное состояние)
- styled-components (темизация)

## Структура
```
/audio-player
│
├── /public                # Статические файлы (favicon, аудио-файлы для демо)
│
├── /src
│   ├── /assets            # Шрифты, иконки (SVG), изображения
│   ├── /components        # Переиспользуемые UI-компоненты
│   ├── /hooks             # Кастомные хуки (например, useAudio)
│   ├── /pages             # Страницы (если будет SPA)
│   ├── /store             # Zustand store
│   ├── /styles            # Глобальные стили, темы
│   ├── /utils             # Вспомогательные функции
│   ├── App.tsx            # Корневой компонент
│   └── main.tsx           # Входная точка
│
├── package.json
└── ...
```

## Запуск
```bash
npm install
npm run dev
```
