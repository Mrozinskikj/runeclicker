import { create } from 'zustand';
import { useData } from './useData';
import { useStats } from './useStats';
import { usePlayer } from './usePlayer';
import { useItems } from './useItems';
import { useConsole } from './useConsole';
import { CombatStats, DepthEnemies, FixedItem } from '../types/gameTypes';

export interface Enemy {
    id: number;
    health: number;
    strength: number;
    accuracy: number;
    defence: number;
}


interface CombatStore {
    health: number;
    enemy: Enemy | null;
    step: number;
    playerTurn: boolean;
    actions: number;
    escape: boolean;
    unlockedEnemy: number | null;
    playerUpdated: boolean;
    enemyUpdated: boolean;
    zoneBarUpdated: boolean;
    playerDamage: number | null;
    enemyDamage: number | null;
    record: number;
    foodUsed: boolean;
    useFood: (food: FixedItem) => void;
    isRest: (step: number) => boolean;
    calculateXp: (enemyId: number) => number;
    calculateHitChance: (isPlayer: boolean) => number;
    calculateDepth: (step: number) => number;
    startCombat: () => void;
    combatAction: () => void;
}

export const useCombat = create<CombatStore>((set, get) => {
    let isRecord = false;

    const useFood = (food: FixedItem): void => {
        if (!get().isRest(get().step)) return;
        if (get().foodUsed) {
            useConsole.getState().addMessage("You are already full.");
            return;
        };

        const stats = useStats.getState().calculateStats("Combat") as CombatStats;
        const heal = useData.getState().gameData.items[food.id].heal ?? 0;
        const healCapped = Math.min(heal, stats.health - get().health);

        useConsole.getState().addMessage(`You restore ${healCapped} health.`);
        useItems.getState().removeItems([{ id: food.id, quantity: 1 }]);
        set((state) => ({ foodUsed: true, health: state.health + healCapped }));
    }

    const calculateDepth = (step: number) => (step <= 10 ? 0 : step <= 20 ? 1 : step <= 30 ? 2 : 3);
    const isRest = (step: number) => [10, 20, 30].includes(step);

    const calculateXp = (enemyId: number): number => {
        const enemyData = useData.getState().gameData.enemies[enemyId];
        return (Math.max(Math.floor(enemyData.health / 5), 1));
    };

    const calculateHitChance = (isPlayer: boolean) => {
        const stats = useStats.getState().calculateStats("Combat") as CombatStats;
        const enemy = get().enemy!;
        if (enemy == null) return 0;
        return isPlayer
            ? stats.accuracy / (stats.accuracy + enemy.defence)
            : enemy.accuracy / (enemy.accuracy + stats.defence);
    };

    const calculateDamage = (isPlayer: boolean) => {
        const strength = isPlayer
            ? (useStats.getState().calculateStats("Combat") as CombatStats).strength
            : get().enemy!.strength;

        const max = Math.floor(strength);
        const fractional = strength - max;

        // Create weights: 1 for each full number, fractional for the extra point
        const weights = Array(max).fill(1);
        if (fractional > 0) {
            weights.push(fractional); // weight for max + 1
        }

        // Total weight
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        const rand = Math.random() * totalWeight;

        // Select damage based on weights
        let cumulative = 0;
        for (let i = 0; i < weights.length; i++) {
            cumulative += weights[i];
            if (rand < cumulative) {
                return i + 1;
            }
        }
        return max; // fallback
    };

    function weightedSelection(choices: DepthEnemies): number {
        const totalWeight = choices.reduce((sum, choice) => sum + choice.probability, 0);
        const r = Math.random() * totalWeight;
        let cumulative = 0;

        for (const choice of choices) {
            cumulative += choice.probability;
            if (r < cumulative) return choice.id;
        }
        return choices[choices.length - 1].id;
    }

    const selectEnemy = (depth: number): Enemy => {
        const enemyData = useData.getState().gameData.enemies;
        const zone = usePlayer.getState().player.task;
        const depthEnemies = useData.getState().gameData.zones[zone!].enemies[depth];

        const enemyId = weightedSelection(depthEnemies);

        return {
            id: enemyId,
            health: enemyData[enemyId].health,
            strength: enemyData[enemyId].strength,
            accuracy: enemyData[enemyId].accuracy,
            defence: enemyData[enemyId].defence
        };
    }

    const defeatEnemy = (enemy: Enemy): void => {
        const { addMessage } = useConsole.getState();
        const { gameData } = useData.getState();

        // Xp
        const gainXp = useStats.getState().gainXp;
        const xpReward = calculateXp(enemy.id);
        gainXp("Combat", xpReward);

        // Loot
        const { rollItems, addItems } = useItems.getState();
        const enemyData = useData.getState().gameData.enemies[enemy.id];
        const reward = rollItems(enemyData.items);
        addItems(reward);
        // Map reward items to formatted strings
        const formattedRewards = reward.map(({ id, quantity }) => {
            const itemName = gameData.items[id]?.name
            return `+${quantity} ${itemName}`;
        });
        addMessage(`You defeat the ${enemyData.name}. ${formattedRewards.join(", ")}${formattedRewards.length > 0 ? ", " : ""}+${xpReward} xp.`);


        // Unlocks
        set({ enemyUpdated: true });
        setTimeout(() => set({ enemyUpdated: false }), 150);

        usePlayer.setState((state) => {
            const enemies = [...state.player.records.enemies];
            enemies[enemy.id] = enemies[enemy.id] + 1;

            // Check for unlocks (record going from 0 to >0)
            if (enemies[enemy.id] == 1) {
                const name = useData.getState().gameData.enemies[enemy.id].name;
                useConsole.getState().addMessage(`You have unlocked a new enemy: ${name}.`);
                set({ unlockedEnemy: enemy.id });
                setTimeout(() => set({ unlockedEnemy: null }), 150);
            }

            return {
                player: {
                    ...state.player,
                    records: {
                        ...state.player.records,
                        enemies,
                    },
                },
            };
        });
    }

    const startCombat = () => {
        const stats = useStats.getState().calculateStats("Combat") as CombatStats;
        const zone = usePlayer.getState().player.task!;

        const zoneName = useData.getState().gameData.zones[zone].name;
        useConsole.getState().addMessage(`You enter the ${zoneName}.`);

        isRecord = false;

        set({
            health: stats.health,
            enemy: selectEnemy(0),
            step: 1,
            playerTurn: true,
            escape: false,
            record: usePlayer.getState().player.records.zones[zone],
        });
    }

    const handleRest = (step: number, actions: number, zoneName: string) => {
        actions--;
        // New enemy at new depth once rest actions are complete
        if (actions <= 0) {
            useConsole.getState().addMessage(`You advance deeper into the ${zoneName}.`);
            step++;
            const enemy = selectEnemy(calculateDepth(step));
            return { step, enemy };
        }
        return { actions };
    };

    const handleEscape = (actions: number, zoneName: string) => {
        actions--;
        // Reset step, reset health, new enemy once escape actions are complete
        if (actions <= 0) {
            useConsole.getState().addMessage(`You re-enter the ${zoneName}.`);
            const enemy = selectEnemy(0);
            const health = (useStats.getState().calculateStats('Combat') as CombatStats).health;
            set({ playerUpdated: true, zoneBarUpdated: true });
            setTimeout(() => set({ playerUpdated: false, zoneBarUpdated: false }), 150);
            return { actions, escape: false, step: 1, enemy, health };
        }
        return { actions };
    };

    const handleAttack = (
        playerTurn: boolean,
        health: number,
        enemy: Enemy,
        step: number,
        record: number,
        zoneName: string
    ) => {
        const hit = Math.random() < calculateHitChance(playerTurn);

        // No hit- flash 0 damage for player or enemy
        if (!hit) {
            const key = playerTurn ? 'enemyDamage' : 'playerDamage';
            set({ [key]: 0 });
            setTimeout(() => set({ [key]: null }), 150);
            return { health, enemy, step, record, playerTurn: !playerTurn };
        }

        // Hit- calculate and flash damage for player or enemy
        const dmg = calculateDamage(playerTurn);
        const key = playerTurn ? 'enemyDamage' : 'playerDamage';
        set({ [key]: dmg });
        setTimeout(() => set({ [key]: null }), 150);

        if (playerTurn) {
            enemy.health -= dmg;
            // Enemy defeated
            if (enemy.health <= 0) {
                defeatEnemy(enemy);
                step++;

                // New record
                if (step > record) {
                    if (!isRecord) useConsole.getState().addMessage(`You have achieved a new best for the ${zoneName}.`);
                    isRecord = true;
                    record = step;
                    usePlayer.getState().player.records.zones[usePlayer.getState().player.task!] = step;
                }
                // If next step is rest, start rest
                if (isRest(step)) {
                    useConsole.getState().addMessage('You may now rest.');
                    return { step, enemy: null, actions: 8, foodUsed: false, record, playerTurn: !playerTurn };
                }
                // Otherwise, roll the next enemy
                return { step, enemy: selectEnemy(calculateDepth(step)), record, playerTurn: !playerTurn };
            }
        } else {
            health -= dmg;
            // Player defeated- start escape
            if (health <= 0) {
                useConsole.getState().addMessage(`You have been defeated by the ${useData.getState().gameData.enemies[enemy.id].name}. You are forced to retreat.`);
                return { health: 0, enemy: null, escape: true, actions: 8, playerTurn: !playerTurn };
            }
        }

        return { health, enemy, step, record, playerTurn: !playerTurn };
    };

    const combatAction = () => {
        const s = get();
        const zoneName = useData.getState().gameData.zones[usePlayer.getState().player.task!].name;
        let updates: Partial<CombatStore> = {};

        if (isRest(s.step)) {
            updates = handleRest(s.step, s.actions, zoneName);
        } else if (s.escape) {
            updates = handleEscape(s.actions, zoneName);
        } else if (s.enemy) {
            updates = handleAttack(
                s.playerTurn,
                s.health,
                s.enemy,
                s.step,
                s.record,
                zoneName
            );
        }

        set(updates);
    }

    return {
        health: 1,
        enemy: null,
        step: 1,
        playerTurn: true,
        actions: 0,
        escape: false,
        unlockedEnemy: null,
        playerUpdated: false,
        enemyUpdated: false,
        zoneBarUpdated: false,
        playerDamage: null,
        enemyDamage: null,
        record: 0,
        foodUsed: false,
        isRest,
        useFood,
        calculateXp,
        calculateHitChance,
        calculateDepth,
        startCombat,
        combatAction
    };
});