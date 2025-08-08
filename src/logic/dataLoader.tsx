import { GameData, StatData } from '../types/gameTypes';
import { PUBLIC } from '../config';

async function fetchData<T>(path: string): Promise<T> {
    const response = await fetch(`${PUBLIC}${path}`);
    if (!response.ok) throw new Error(`Failed to fetch data from ${path}`);
    return response.json();
}


export async function dataLoader(): Promise<{ statData: StatData; gameData: GameData }> {
    const [
        xp,
        speed,
        farmingStats,
        merchanting,
        stamina,
        combat,
        items,
        tasks,
        recipes,
        enemies,
        zones,
        farming,
        effects
    ] = await Promise.all([
        fetchData<StatData['xp']>('tables/stats/xp.json'),
        fetchData<StatData['speed']>('tables/stats/speed.json'),
        fetchData<StatData['farming']>('tables/stats/farming.json'),
        fetchData<StatData['merchanting']>('tables/stats/merchanting.json'),
        fetchData<StatData['stamina']>('tables/stats/stamina.json'),
        fetchData<StatData['combat']>('tables/stats/combat.json'),
        fetchData<GameData['items']>('tables/data/items.json'),
        fetchData<GameData['tasks']>('tables/data/tasks.json'),
        fetchData<GameData['recipes']>('tables/data/recipes.json'),
        fetchData<GameData['enemies']>('tables/data/enemies.json'),
        fetchData<GameData['zones']>('tables/data/zones.json'),
        fetchData<GameData['farming']>('tables/data/farming.json'),
        fetchData<GameData['effects']>('tables/data/effects.json'),
    ]);

    // Populate crafting flags for items
    recipes.forEach(recipe => {
        recipe.input?.forEach(ingredient => {
            if (items[ingredient.id]) {
                items[ingredient.id].crafting = true;
            }
        });
    });

    recipes.sort((a, b) => a.lvl - b.lvl);

    const unlockLvls: Record<string, number[][]> = {};
    ["Woodcutting", "Mining", "Stamina"].forEach(skill => {
        const skillTasks = tasks[skill];
        if (skillTasks) {
            const lvlMap: number[][] = [];
            skillTasks.forEach((task, id) => {
                const lvl = task.lvl;
                if (!lvlMap[lvl]) lvlMap[lvl] = [];
                lvlMap[lvl].push(id);
            });
            unlockLvls[skill] = lvlMap;
        }
    });
    unlockLvls["Farming"] = [];
    farming.plotLvls.forEach((lvl, id) => {
        if (!unlockLvls["Farming"][lvl]) unlockLvls["Farming"][lvl] = [];
        unlockLvls["Farming"][lvl].push(id);
    });
    unlockLvls["Merchanting"] = [];
    unlockLvls["Combat"] = [];
    zones.forEach((zone, id) => {
        const lvl = zone.lvl;
        if (!unlockLvls["Combat"][lvl]) unlockLvls["Combat"][lvl] = [];
        unlockLvls["Combat"][lvl].push(id);
    });
    unlockLvls["Processing"] = [];
    recipes.forEach((recipe, id) => {
        const lvl = recipe.lvl;
        if (!unlockLvls["Processing"][lvl]) unlockLvls["Processing"][lvl] = [];
        unlockLvls["Processing"][lvl].push(id);
    });

    return {
        statData: { xp, speed, farming: farmingStats, merchanting, stamina, combat },
        gameData: { items, tasks, recipes, enemies, zones, farming, effects, unlockLvls },
    };
}