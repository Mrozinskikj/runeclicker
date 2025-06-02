import { create } from 'zustand';
import { Player } from '../types/gameTypes';
import { saveGame } from '../logic/saveManager';

interface PlayerStore {
  player: Player;
  setPlayer: (update: Partial<Player> | ((prev: Player) => Player)) => void;
}

// Function to create the store once game data is loaded
export const createPlayer = (initialPlayer: Player) =>
  create<PlayerStore>((set, get) => ({
    player: initialPlayer,

    // Update player state (can accept an object or a function for updates)
    setPlayer: (update) =>
      set((state) => {
        const newPlayer = typeof update === 'function' ? update(state.player) : { ...state.player, ...update };
        saveGame(newPlayer); // Save game state whenever player changes
        return { player: newPlayer };
      }),
  }));

// This variable holds the store after initialisation
export let usePlayer: ReturnType<typeof createPlayer>;

// Function to initialise the store with the loaded player data
export const initPlayer = (initialPlayer: Player) => {
  usePlayer = createPlayer({...initialPlayer, task: null});
};