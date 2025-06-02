// Stat Tables
export interface XpData extends Array<number> { }

export interface SpeedData extends Array<number> { }

export interface MerchantingData extends Array<number> { }

export interface StaminaData extends Array<number> { }

export interface CombatData {
  health: number[];
  strength: number[];
  accuracy: number[];
  defence: number[];
}


// Items
interface ItemBonusDetail {
  absolute?: number;
  percent?: number;
}

interface ItemBonus {
  [skill: string]: {
    [stat: string]: ItemBonusDetail;
  };
}

interface Item {
  name: string;
  value: number;
  slot?: string;
  description?: string;
  bonus?: ItemBonus;
  heal?: number;
  space?: number;
  crafting?: boolean;
}

export type ItemData = Item[];


// Helper
export interface VariableQuantity {
  min: number;
  max: number;
}

export interface VariableItem {
  id: number;
  quantity: VariableQuantity;
  probability: number;
}

export interface FixedItem {
  id: number;
  quantity: number;
}


// Tasks
export interface Task {
  name: string;
  lvl: number;
  action: string;
  message: string;
  actions: number;
  xp: number;
  input?: FixedItem[];
  output?: VariableItem[];
}

export interface TaskData {
  [skill: string]: Task[];
}


// Recipes
export interface Recipe {
  output: VariableItem[];
  input: FixedItem[];
  lvl: number;
  actions: number;
  xp: number;
}

export type RecipeData = Recipe[];


// Enemies
interface Enemy {
  name: string;
  health: number;
  strength: number;
  accuracy: number;
  defence: number;
  items: VariableItem[];
}

export type EnemyData = Enemy[];


// Zones
interface ZoneEnemy {
  id: number;
  probability: number;
}

export type DepthEnemies = ZoneEnemy[];

interface Zone {
  name: string;
  lvl: number;
  size: number;
  enemies: DepthEnemies[]
}

export type ZoneData = Zone[];


// All game data
export interface StatData {
  xp: XpData;
  speed: SpeedData;
  merchanting: MerchantingData;
  stamina: StaminaData;
  combat: CombatData;
}

export interface GameData {
  items: ItemData;
  tasks: TaskData;
  recipes: RecipeData;
  enemies: EnemyData;
  zones: ZoneData;
}


// Player data

interface Records {
  items: number[];
  enemies: number[];
  zones: number[];
}

export interface PlayerInventory {
  items: (FixedItem | null)[];
  equipment: Record<string, FixedItem | null>;
}

export interface Player {
  created: string,
  inventory: PlayerInventory;
  skill: string;
  task: number | null;
  xp: Record<string, number>;
  records: Records;
}


// Stats
export interface GenericStats {
  speed: number;
  click: number;
}

export interface MerchantingStats {
  speed: number;
  multiplier: number;
}

export interface StaminaStats {
  speed: number;
  energy: number;
}

export interface CombatStats {
  speed: number;
  health: number;
  strength: number;
  accuracy: number;
  defence: number;
}

export type SkillStats = GenericStats | MerchantingStats | StaminaStats | CombatStats


// Settings
export interface Settings {
  resolution: number,
  smooth: boolean;
}