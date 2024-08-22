import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Cookies from 'js-cookie';

import Main from './Main.jsx';

function App() {
  const fast = false;

  const [fetched, setFetched] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const version = "1.1";
  const skills = useMemo(() => ['Woodcutting', 'Mining', 'Processing', 'Merchanting', 'Energy'], []);
  const equipmentSlots = ['pickaxe', 'axe', 'ring'];
  const inventorySize = 36;

  const [lvlTable, setLvlTable] = useState(null);
  const [speedTable, setSpeedTable] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [items, setItems] = useState(null);
  const [energyTable, setEnergyTable] = useState(null);

  const [xp, setXp] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [unlocked, setUnlocked] = useState(null);

  const [lvl, setLvl] = useState(null);
  const [stats, setStats] = useState(null);
  const [maxEnergy, setMaxEnergy] = useState(null);

  const [autoTask, setAutoTask] = useState(null);

  const [timeElapsed, setTimeElapsed] = useState(0);

  const [skillSelected, setSkillSelected] = useState(null);
  const [taskSelected, setTaskSelected] = useState(null);

  // SAVE FILE LOGIC
  // Blank new game save file
  const MakeNewSaveFile = () => {
    const xp = {};
    skills.forEach(skill => { xp[skill] = 0 });

    const equipment = {};
    equipmentSlots.forEach(slot => { equipment[slot] = null });

    return JSON.stringify({
      time: new Date(),
      skill: skills[0],
      task: null,
      xp: xp,
      autoTask: false,
      inventory: Array(inventorySize).fill(null),
      equipment: equipment,
      unlocked: []
    });
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

  const [saveFile, setSaveFile] = useState(getSaveFile());




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
    const energyData = await fetchData('/gameData/tables/energyTable.json');

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
    setEnergyTable(energyData);

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
    stats['Merchanting'] = { 'baseSpeed': speedTable[lvl['Merchanting']], 'bonusSpeed': 0, 'baseClick': 1, 'bonusClick': 0, 'bonusSpeedPercent': 0, 'bonusClickPercent': 0, 'baseMultiplier': speedTable[lvl['Merchanting']], 'bonusMultiplier': 0, 'bonusMultiplierPercent': 0 };
    return stats;
  };

  const loadSave = () => {
    const save = JSON.parse(saveFile);
    const calculatedLvl = calculateLvl(save.xp);
    const calculatedStats = calculateStats(calculatedLvl, save.equipment);

    setXp(save.xp);
    setInventory(save.inventory);
    setEquipment(save.equipment);
    setUnlocked(save.unlocked);
    setLvl(calculatedLvl);
    setStats(calculatedStats);
    setMaxEnergy(energyTable.time[calculatedLvl["Energy"]]);
    setAutoTask(save.autoTask);
    setSkillSelected(save.skill);
    setTaskSelected(save.task);

    // Calculate amount of time since the game was last played
    setTimeElapsed(new Date() - new Date(save.time));

    // save game to cookies
    Cookies.set("runeclicker", saveFile, {expires: 1000});
  }

  useEffect(() => {
    if (fetched) {
      loadSave();
      setLoaded(true);
    }
  }, [fetched]);



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
        lvl={lvl}
        setLvl={setLvl}
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
        tasks={tasks}
        energyTable={energyTable}
        skills={skills}
        version={version}
      />
    </div>
  );
}

export default App;