import { createRoot } from 'react-dom/client';
import './index.css';
import { Game } from './game.tsx';

import { initData } from './logic/useData.tsx';
import { initPlayer } from './logic/usePlayer.tsx';
import { initSettings } from './logic/useSettings.tsx';
import { dataLoader } from './logic/dataLoader.tsx';
import { loadGame, loadSettings } from './logic/saveManager.tsx';
import { AppErrorBoundary } from './components/appErrorBoundary';
import React from 'react';

// Global, non-React errors (script errors, unhandled promises, timers, workers)
function broadcastFatal(err: unknown) {
  const detail = err instanceof Error ? err : new Error(String(err));
  window.dispatchEvent(new CustomEvent('app:fatal', { detail }));
}

window.addEventListener('error', (event) => {
  // Some browsers report message only
  broadcastFatal((event as ErrorEvent).error ?? (event as ErrorEvent).message);
});
window.addEventListener('unhandledrejection', (event) => {
  broadcastFatal((event as PromiseRejectionEvent).reason);
});

function Bootstrap() {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const { statData, gameData } = await dataLoader();
        const save = loadGame(gameData);
        const settings = loadSettings();

        initData(statData, gameData);
        initPlayer(save);
        initSettings(settings);

        setReady(true);
      } catch (error) {
        // Route init errors through the boundary too
        broadcastFatal(error);
      }
    })();
  }, []);

  if (!ready) {
    // Optional: a tiny loading skeleton; could also return null
    return <div className="loading">Loading…</div>;
  }
  return <Game />;
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <AppErrorBoundary>
    <Bootstrap />
  </AppErrorBoundary>
);