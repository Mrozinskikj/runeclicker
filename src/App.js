import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Cookies from 'js-cookie';
import LZString from 'lz-string';

import Main from './Main.jsx';
import ErrorScreen from './components/ErrorScreen.jsx';

function App() {
  const fast = false;

  const [fetched, setFetched] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const version = "1.2";
  const skills = useMemo(() => ['Woodcutting', 'Mining', 'Processing', 'Merchanting', 'Energy', 'Combat'], []);
  const equipmentSlots = ['pickaxe', 'axe', 'hammer', 'weapon', 'ring', 'head', 'torso', 'legs', 'neck'];
  const inventorySize = 102;

  const [lvlTable, setLvlTable] = useState(null);
  const [speedTable, setSpeedTable] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [items, setItems] = useState(null);
  const [enemies, setEnemies] = useState(null);
  const [energyTable, setEnergyTable] = useState(null);
  const [combatTable, setCombatTable] = useState(null);

  const [xp, setXp] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [unlocked, setUnlocked] = useState(null);
  const [enemiesDiscovered, setEnemiesDiscovered] = useState(null);

  const [lvl, setLvl] = useState(null);
  const [stats, setStats] = useState(null);
  const [maxEnergy, setMaxEnergy] = useState(null);

  const [autoTask, setAutoTask] = useState(null);

  const [timeElapsed, setTimeElapsed] = useState(0);

  const [skillSelected, setSkillSelected] = useState(null);
  const [taskSelected, setTaskSelected] = useState(null);

  const [health, setHealth] = useState(0);
  const [enemy, setEnemy] = useState(null);
  const [kills, setKills] = useState(0);

  const [combatBests, setCombatBests] = useState({});

  const [loadError, setLoadError] = useState(false);

  // SAVE FILE LOGIC
  // Blank new game save file
  const MakeNewSaveFile = () => {
    const xp = {};
    skills.forEach(skill => { xp[skill] = 0 });

    const equipment = {};
    equipmentSlots.forEach(slot => { equipment[slot] = null });

    const save = JSON.stringify({
      time: new Date(),
      skill: skills[0],
      task: null,
      xp: xp,
      health: 0,
      enemy: null,
      kills: 0,
      autoTask: false,
      inventory: Array(inventorySize).fill(null),
      equipment: equipment,
      unlocked: [],
      enemiesDiscovered: [],
      combatBests: {}
    });

    return LZString.compressToBase64(save);
  }
  const newSaveFile = MakeNewSaveFile();

  // Get save file from cookies if exists, otherwise make new save file
  const getSaveFile = () => {
    const save = Cookies.get("runeclicker");
    if (save) {
      return save;
    } else {
      return newSaveFile;
    }
  }

  const [saveFile, setSaveFile] = useState(() => getSaveFile());


  const fetchData = useCallback(async (path) => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}${path}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching:', error);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    const lvlData = await fetchData('/gameData/tables/lvlTable.json');
    const speedData = await fetchData('/gameData/tables/speedTable.json');
    const taskData = await fetchData('/gameData/tables/tasks.json');
    const itemData = await fetchData('/gameData/tables/items.json');
    const enemyData = await fetchData('/gameData/tables/enemies.json');
    const energyData = await fetchData('/gameData/tables/energyTable.json');
    const combatData = await fetchData('/gameData/tables/combatTable.json');

    // Set number of actions for all tasks and recipes to 1 if fast mode enabled
    if (fast) {
      ["Woodcutting", "Mining"].forEach(skill => {
        Object.keys(taskData[skill]).forEach(task => {
          taskData[skill][task].actions = 1;
        });
      });
    }

    // Determine whether each item is a crafting material based on whether it appears in any recipe
    Object.keys(itemData).forEach((item) => {
      itemData[item].crafting = false;
    })
    Object.keys(taskData['Processing']).forEach((recipe) => {
      taskData['Processing'][recipe].itemCost.forEach((ingredient => {
        itemData[ingredient.id].crafting = true;
      }))
    })

    setLvlTable(lvlData);
    setSpeedTable(speedData);
    setTasks(taskData);
    setItems(itemData);
    setEnemies(enemyData);
    setEnergyTable(energyData);
    setCombatTable(combatData);

    setFetched(true);
  }, [fetchData]);

  useEffect(() => {
    fetchAllData();
  }, []);




  // calculate lvl of each skill based on xp thresholds
  const calculateLvl = (xp) => {
    const lvl = {};
    skills.forEach(skill => {
      lvl[skill] = lvlTable.findIndex((xpThreshold, index) =>
        xp[skill] < xpThreshold && xp[skill] >= (lvlTable[index - 1] || 0)
      ) - 1;
    });
    return lvl;
  };

  // calculate speed and click of each skill based on lvl and equipment boosts
  const calculateStats = (lvl, equipment) => {
    const stats = {};
    skills.forEach(skill => {
      stats[skill] = { 'baseSpeed': speedTable[lvl[skill]], 'bonusSpeed': 0, 'baseClick': 1, 'bonusClick': 0, 'bonusSpeedPercent': 0, 'bonusClickPercent': 0 };
    });
    // Merchanting also has a multiplier
    stats['Merchanting'] = {
      'baseSpeed': speedTable[lvl['Merchanting']],
      'bonusSpeed': 0,
      'bonusSpeedPercent': 0,

      'baseClick': 1,
      'bonusClick': 0,
      'bonusClickPercent': 0,

      'baseMultiplier': speedTable[lvl['Merchanting']],
      'bonusMultiplier': 0,
      'bonusMultiplierPercent': 0
    };
    // Combat also health, strength, accuracy, defence
    stats['Combat'] = {
      'baseSpeed': speedTable[lvl['Combat']],
      'bonusSpeed': 0,
      'bonusSpeedPercent': 0,

      'baseClick': 1,
      'bonusClick': 0,
      'bonusClickPercent': 0,

      'baseHealth': combatTable['health'][lvl['Combat']],
      'bonusHealth': 0,
      'bonusHealthPercent': 0,

      'baseStrength': combatTable['strength'][lvl['Combat']],
      'bonusStrength': 0,
      'bonusStrengthPercent': 0,

      'baseAccuracy': combatTable['accuracy'][lvl['Combat']],
      'bonusAccuracy': 0,
      'bonusAccuracyPercent': 0,

      'baseDefence': combatTable['defence'][lvl['Combat']],
      'bonusDefence': 0,
      'bonusDefencePercent': 0,
    };
    return stats;
  };

  const loadSave = () => {
    try {
      console.log(saveFile)
      const decompressed = LZString.decompressFromBase64(saveFile);
      if (!decompressed) throw new Error("Decompression failed");
      const save = JSON.parse(decompressed);
      const calculatedLvl = calculateLvl(save.xp);
      const calculatedStats = calculateStats(calculatedLvl, save.equipment);

      setXp(save.xp);
      setInventory(save.inventory);
      setEquipment(save.equipment);
      setUnlocked(save.unlocked);
      setEnemiesDiscovered(save.enemiesDiscovered);
      setLvl(calculatedLvl);
      setStats(calculatedStats);
      setMaxEnergy(energyTable.time[calculatedLvl["Energy"]]);
      setAutoTask(save.autoTask);
      setSkillSelected(save.skill);
      setTaskSelected(save.task);
      setHealth(save.health);
      setEnemy(save.enemy);
      setKills(save.kills);
      setCombatBests(save.combatBests);

      // Calculate amount of time since the game was last played
      setTimeElapsed(new Date() - new Date(save.time));
      setLoadError(false);
    } catch {
      console.log("failed")
      setLoadError(true);
    }
  }

  useEffect(() => {
    if (fetched) {
      loadSave();
      setLoaded(true);
    }
  }, [fetched]);

  if (loadError) {
    return <ErrorScreen setSaveFile={setSaveFile} saveFile={saveFile} newSaveFile={newSaveFile} loadSave={loadSave} />
  }
  if (!loaded) {
    return <></>
  }
  return (
    <div className="App">
      <Main
        xp={xp}
        setXp={setXp}
        inventory={inventory}
        setInventory={setInventory}
        equipment={equipment}
        setEquipment={setEquipment}
        unlocked={unlocked}
        setUnlocked={setUnlocked}
        enemiesDiscovered={enemiesDiscovered}
        setEnemiesDiscovered={setEnemiesDiscovered}
        lvl={lvl}
        setLvl={setLvl}
        health={health}
        setHealth={setHealth}
        enemy={enemy}
        setEnemy={setEnemy}
        kills={kills}
        setKills={setKills}
        stats={stats}
        maxEnergy={maxEnergy}
        setMaxEnergy={setMaxEnergy}
        autoTask={autoTask}
        setAutoTask={setAutoTask}
        skillSelected={skillSelected}
        setSkillSelected={setSkillSelected}
        taskSelected={taskSelected}
        setTaskSelected={setTaskSelected}
        setStats={setStats}
        timeElapsed={timeElapsed}
        saveFile={saveFile}
        setSaveFile={setSaveFile}
        newSaveFile={newSaveFile}
        loadSave={loadSave}
        lvlTable={lvlTable}
        speedTable={speedTable}
        items={items}
        enemies={enemies}
        tasks={tasks}
        energyTable={energyTable}
        combatTable={combatTable}
        combatBests={combatBests}
        setCombatBests={setCombatBests}
        skills={skills}
        version={version}
      />
    </div>
  );
}

export default App;