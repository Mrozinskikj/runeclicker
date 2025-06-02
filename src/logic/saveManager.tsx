import { GameData, Player, Settings } from "../types/gameTypes";
import LZString from "lz-string";
import { SAVE_KEY } from "../config";
import { SETTINGS_KEY } from "../config";


export function createInitialSave(gameData: GameData): Player {
    return {
        created: new Date().toISOString(),
        skill: 'Woodcutting',
        task: null,
        xp: { Woodcutting: 0, Mining: 0, Processing: 0, Merchanting: 0, Stamina: 0, Combat: 0 },
        inventory: {
            items: Array(10).fill(null),
            equipment: {
                hand: null,
                head: null,
                torso: null,
                legs: null,
                neck: null,
                finger: null,
                back: null
            },
        },
        records: {
            items: Array(gameData.items.length).fill(0),
            enemies: Array(gameData.enemies.length).fill(0),
            zones: Array(gameData.zones.length).fill(1),
        },
    };
}

export function createInitialSettings(): Settings {
    return {
        resolution: 0,
        smooth: true,
    };
}


// Load save from localStorage or initialise new save
export function loadGame(gameData: GameData): Player {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
        const saveData = LZString.decompressFromBase64(raw);
        return JSON.parse(saveData) as Player;
    }
    return createInitialSave(gameData);
}

// Load settings from localStorage or initialise new save
export function loadSettings(): Settings {
    const settingsData = localStorage.getItem(SETTINGS_KEY);
    if (settingsData) {
        return JSON.parse(settingsData) as Settings;
    }
    return createInitialSettings();
}

// Save game to localStorage
export function saveGame(save: Player): void {
    const compressed = LZString.compressToBase64(JSON.stringify(save));
    localStorage.setItem(SAVE_KEY, compressed);
}

// Save settings to localStorage
export function saveSettings(settings: Settings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}