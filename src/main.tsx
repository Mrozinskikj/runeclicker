import { createRoot } from 'react-dom/client';
import './index.css';
import 'simplebar-react/dist/simplebar.min.css';
import { Game } from './game.tsx';

import { initData } from './logic/useData.tsx';
import { initPlayer } from './logic/usePlayer.tsx';
import { initSettings } from './logic/useSettings.tsx';
import { dataLoader } from './logic/dataLoader.tsx';
import { loadGame, loadSettings } from './logic/saveManager.tsx';
import { renderError } from './components/errorScreen.tsx';

// uncaught exceptions
window.addEventListener('error', (event) => {
  renderError(event.error || event.message);
});

(async function initialiseApp() {
  const container = document.getElementById('root')!;
  const root = createRoot(container);

  try {
    // Load game data before rendering game
    const { statData, gameData } = await dataLoader();
    const save = loadGame(gameData);
    const settings = loadSettings();

    // Initialise store before rendering the app
    initData(statData, gameData);
    initPlayer(save);
    initSettings(settings);

    root.render(<Game />);
  } catch (error) {
    root.render(renderError(error));
  }
})();