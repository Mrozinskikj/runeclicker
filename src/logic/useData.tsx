import { create } from 'zustand';
import { StatData, GameData } from '../types/gameTypes';

// This function creates the store after game data is available
export const createData = (statData: StatData, gameData: GameData) =>
  create(() => ({
    statData,
    gameData,
  }));

// This function is used to retrieve data from the store
export let useData: ReturnType<typeof createData>;

export const initData = (statData: StatData, gameData: GameData) => {
  useData = createData(statData, gameData);
};