import { create } from 'zustand';
import { Settings } from '../types/gameTypes';
import { saveSettings } from '../logic/saveManager';

interface SettingsStore {
  settings: Settings;
  setSettings: (update: Partial<Settings> | ((prev: Settings) => Settings)) => void;
}

// Function to create the store once game data is loaded
export const createSettings = (initialSettings: Settings) =>
  create<SettingsStore>((set) => ({
    settings: initialSettings,
    
    // Update settings state (can accept an object or a function for updates)
    setSettings: (update) =>
      set((state) => {
        const newSettings = typeof update === 'function' ? update(state.settings) : { ...state.settings, ...update };
        saveSettings(newSettings); // Save state whenever settings change
        return { settings: newSettings };
      }),
  }));

// This variable holds the store after initialisation
export let useSettings: ReturnType<typeof createSettings>;

// Function to initialise the store with the loaded settings data
export const initSettings = (initialSettings: Settings) => {
  useSettings = createSettings(initialSettings);
};