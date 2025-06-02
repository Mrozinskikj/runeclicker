import React, { useState, useEffect } from 'react';
import { usePlayer } from './logic/usePlayer';
import { useTask } from './logic/useTask';
import { useSettings } from './logic/useSettings';
import { saveGame } from './logic/saveManager';
import { Header } from './components/header';
import { IMAGE } from './config';
import { Inventory } from './components/inventory/inventory';
import { MainScreen } from './components/mainScreen';
import { SkillList } from './components/skillList';
import { MenuButtons } from './components/menuButtons';
import { Console } from './components/console';
import { ScaleContext } from './logic/useScale';
import { Toolbar } from './components/toolbar';

const BASE_WIDTH = 900;
const BASE_HEIGHT = 560;

export const Game: React.FC = () => {
  const player = usePlayer((state) => state.player);
  const settings = useSettings((state) => state.settings);
  const selectTask = useTask((state) => state.selectTask);

  // automatically save game whenever player object changes
  useEffect(() => {
    saveGame(player);
  }, [player]);

  const [view, setView] = useState<"skill" | "stats" | "info" | "settings">("skill");

  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);

  const handleViewSelect = (selection: "skill" | "stats" | "info" | "settings") => {
    setView(selection);
    selectTask(null);
  }

  const handleResize = () => {
    let newScale = 1;
    if (settings.resolution === 0) {
      const scaleX = window.innerWidth / BASE_WIDTH;
      const scaleY = window.innerHeight / BASE_HEIGHT;
      newScale = Math.min(scaleX, scaleY);
    } else {
      newScale = settings.resolution;
    }
    setScale(newScale);
    setOffsetX((window.innerWidth - BASE_WIDTH * newScale) / 2);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [settings.resolution, settings.rendering]);

  useEffect(() => {
    // Dynamically inject scrollbar styles into the document head
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
            *:not(.root)::-webkit-scrollbar {
                width: 10px;
                height: 10px;
            }

            *:not(.root)::-webkit-scrollbar-track {
                background: url('${IMAGE}scrollbar/back.png') repeat-y;
            }

            *:not(.root)::-webkit-scrollbar-thumb {
                border-width: 2px 5px;
                border-style: solid;
                border-color: transparent;
                -webkit-border-image: url('${IMAGE}scrollbar/thumb.png') 2 5 2 5 stretch;
                border-image: url('${IMAGE}scrollbar/thumb.png') 2 5 2 5 stretch;
            }

            *:not(.root)::-webkit-scrollbar-thumb:hover {
                -webkit-border-image: url('${IMAGE}scrollbar/thumbhover.png') 2 5 2 5 stretch;
                border-image: url('${IMAGE}scrollbar/thumbhover.png') 2 5 2 5 stretch;
            }
        `;
    document.head.appendChild(styleElement);

    return () => {
      // Cleanup when the component unmounts
      document.head.removeChild(styleElement);
    };
  }, []);


  return (
    <ScaleContext.Provider value={{ scale, offsetX }}>
      <div
        className="root"
        style={{
          width: '100vw',
          height: '100vh',
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          backgroundImage: `url(${IMAGE}backgrounds/background.png)`,
          backgroundSize: `${64 * scale}px ${64 * scale}px`,
          imageRendering: settings.rendering ? "auto" : "pixelated",
        }}
      >
        <div
          style={{
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'top center', // Anchor scaling to the top
          }}
        >
          {/* Existing Game UI */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
            <Header />

            <div
              style={{
                display: 'flex',
                width: 'auto',
                margin: 'auto',
                height: '100%',
              }}
            >
              <Inventory />

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '500px',
                  paddingLeft: '5px',
                  paddingRight: '5px',
                }}
              >
                <MainScreen view={view} />
                <Console />
              </div>

              <div
                style={{
                  width: '128px',
                  paddingLeft: '5px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <SkillList view={view} handleViewSelect={handleViewSelect} />
                <MenuButtons view={view} handleViewSelect={handleViewSelect} />
              </div>
            </div>
          </div>
        </div>
        <Toolbar />
      </div>
    </ScaleContext.Provider>
  );
};