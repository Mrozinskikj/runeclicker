import { create } from 'zustand';
import { Settings } from '../types/gameTypes';
import { saveSettings } from './saveManager';

interface SettingsStore {
  settings: Settings;
  setSettings: (update: Partial<Settings> | ((prev: Settings) => Settings)) => void;
  fast: boolean;
  setFast: (val: boolean) => void;
}

// Function to create the store once game data is loaded
export const createSettings = (initialSettings: Settings) =>
  create<SettingsStore>((set) => ({
    settings: initialSettings,
    setSettings: (update) =>
      set((state) => {
        const newSettings =
          typeof update === "function" ? update(state.settings) : { ...state.settings, ...update };
        saveSettings(newSettings);
        return { settings: newSettings };
      }),
    fast: false,
    setFast: (val) => set({ fast: val }),
  }));

// This variable holds the store after initialisation
export let useSettings: ReturnType<typeof createSettings>;

// Function to initialise the store with the loaded settings data
export const initSettings = (initialSettings: Settings) => {
  useSettings = createSettings(initialSettings);
};