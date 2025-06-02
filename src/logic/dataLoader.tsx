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
        merchanting,
        stamina,
        combat,
        items,
        tasks,
        recipes,
        enemies,
        zones
    ] = await Promise.all([
        fetchData<StatData['xp']>('tables/stats/xp.json'),
        fetchData<StatData['speed']>('tables/stats/speed.json'),
        fetchData<StatData['merchanting']>('tables/stats/merchanting.json'),
        fetchData<StatData['stamina']>('tables/stats/stamina.json'),
        fetchData<StatData['combat']>('tables/stats/combat.json'),
        fetchData<GameData['items']>('tables/data/items.json'),
        fetchData<GameData['tasks']>('tables/data/tasks.json'),
        fetchData<GameData['recipes']>('tables/data/recipes.json'),
        fetchData<GameData['enemies']>('tables/data/enemies.json'),
        fetchData<GameData['zones']>('tables/data/zones.json'),
    ]);

    // Populate crafting flags for items
    recipes.forEach(recipe => {
        recipe.input?.forEach(ingredient => {
            if (items[ingredient.id]) {
                items[ingredient.id].crafting = true;
            }
        });
    });

    return {
        statData: { xp, speed, merchanting, stamina, combat },
        gameData: { items, tasks, recipes, enemies, zones },
    };
}