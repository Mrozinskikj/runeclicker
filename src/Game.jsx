import React, { useState, useEffect, useRef, useCallback } from 'react';
import Cookies from 'js-cookie';

import { Box, Grid, Button } from '@mui/material';

import background from "./images/interface/background.png";
import settingsicon from "./images/interface/settings.png";

import Header from "./components/Header.jsx";
import Console from "./components/Console.jsx";
import Skilling from "./components/Skilling.jsx";
import TaskList from "./components/TaskList.jsx";
import RecipeList from "./components/RecipeList.jsx";
import Merchanting from './components/Merchanting.jsx';
import Energy from './components/Energy.jsx';
import SkillList from "./components/SkillList.jsx";
import Inventory from './components/Inventory.jsx';
import Settings from './components/Settings.jsx';



const Game = ({
    xp,
    setXp,
    inventory,
    setInventory,
    equipment,
    setEquipment,
    unlocked,
    setUnlocked,
    lvl,
    setLvl,
    stats,
    setStats,
    maxEnergy,
    setMaxEnergy,
    autoTask,
    setAutoTask,
    skillSelected,
    setSkillSelected,
    taskSelected,
    setTaskSelected,
    timeElapsed,
    saveFile,
    setSaveFile,
    newSaveFile,
    loadSave,
    lvlTable,
    speedTable,
    energyTable,
    items,
    tasks,
    skills,
    version,
}) => {

    // Get task data by task name. For certain skills, task data must be generated dynamically
    const getTaskData = (taskName) => {
        // Merchanting skill calculates xp and coin reward dynamically 
        if (skillSelected === "Merchanting") {
            const multiplierNoPercent = stats['Merchanting'].baseMultiplier + stats['Merchanting'].bonusMultiplier;
            const multiplier = (multiplierNoPercent * ((stats['Merchanting'].bonusMultiplier / 100) + 1)).toFixed(2);
            const value = Math.floor(items[taskName]?.value * multiplier);
            return {
                'lvl': 0,
                'actionName': 'Sell',
                'message': 'You sell the item.',
                'actions': 4,
                'xpReward': items[taskName]?.value,
                'itemCost': [{ 'id': taskName, 'quantity': 1 }],
                'itemReward': [{ 'id': 'Coins', 'quantity': [value, value], 'probability': 1 }],
            }
        }
        // xp reward for energy skill is exact amount needed for lvl up. cost is looked up from table
        else if (skillSelected === "Energy") {
            if (taskName === "Energy Fortification") {
                return {
                    'lvl': 0,
                    'actionName': 'Fortify',
                    'message': 'You fortify your energy.',
                    'actions': 4,
                    'xpReward': lvlTable[lvl['Energy'] + 1] - lvlTable[lvl['Energy']],
                    'itemCost': [{ 'id': 'Coins', 'quantity': energyTable.cost[lvl['Energy']] }]
                }
            } else {
                return {
                    'lvl': 0,
                    'actionName': 'Unlock',
                    'message': 'You have unlocked Auto Task. From now on, closing the game will continue your active task until your energy runs out.',
                    'actions': 1024,
                    'xpReward': 0,
                    'itemCost': [{ 'id': 'Coins', 'quantity': 100000 }]
                }
            }
        }
        // All other tasks are looked up from table
        else {
            return tasks[skillSelected][taskName];
        }
    }

    const [needToSave, setNeedToSave] = useState(false);
    const messagesEndRef = useRef(null);

    const [viewSettings, setViewSettings] = useState(false);
    const onSettingsClick = (state) => {
        setTaskSelected(null);
        setViewSettings(state);
    }

    const [actionAllowed, setActionAllowed] = useState(false);

    const [updatedItemOverlay, setUpdatedItemOverlay] = useState(false);
    const [updatedItemIndices, setUpdatedItemIndices] = useState([]);

    const [actionsLeft, setActionsLeft] = useState(getTaskData(taskSelected)?.actions); // actions needed to finish task
    const [energy, setEnergy] = useState(maxEnergy); // number of seconds of afk time
    const energyRef = useRef(energy);
    useEffect(() => {
        energyRef.current = energy;
    }, [energy]);
    const energyIntervalRef = useRef(null);

    // Convert game data into save file string
    const saveGame = useCallback(() => {
        const save = JSON.stringify({
            time: new Date(),
            skill: skillSelected,
            task: taskSelected,
            xp: xp,
            autoTask: autoTask,
            inventory: inventory,
            equipment: equipment,
            unlocked: unlocked
        });
        // save game to cookies
        Cookies.set("runeclicker", save, { expires: 1000 });
        setSaveFile(save);
    }, [xp, inventory, equipment, unlocked, skillSelected, taskSelected]);

    useEffect(() => {
        if (needToSave) {
            saveGame();
            setNeedToSave(false);
        }
    }, [needToSave, saveGame]);
    // Save file updated every time a new skill or task selected
    useEffect(() => {
        setNeedToSave(true);
    }, [skillSelected, taskSelected]);

    const lvlUp = (newLvl) => {

        const tasksList = Object.values(tasks[skillSelected]);

        if (skillSelected === "Merchanting") {
            addMessage(`You have reached ${skillSelected} lvl ${newLvl}. You gain ${(speedTable[newLvl] - speedTable[newLvl - 1]).toFixed(2)} speed, and ${(speedTable[newLvl] - speedTable[newLvl - 1]).toFixed(2)} multiplier.`);
        } else if (skillSelected === "Energy") {
            addMessage(`You have reached ${skillSelected} lvl ${newLvl}. You gain ${energyTable.time[lvl['Energy'] + 1] - energyTable.time[lvl['Energy']]} seconds of energy.`);
        } else {
            addMessage(`You have reached ${skillSelected} lvl ${newLvl}. You gain ${(speedTable[newLvl] - speedTable[newLvl - 1]).toFixed(2)} speed.`);
        }

        // Check whether there are any new task unlocks at new lvl
        let unlocks = false;
        for (const task of tasksList) {
            if (task.lvl === newLvl) {
                unlocks = true;
            }
        }
        if (unlocks) {
            addMessage("You have new skill unlocks.");
        }

        // update the lvl of the skill
        setLvl(prevSkills => ({
            ...prevSkills,
            [skillSelected]: newLvl
        }));

        // update the base speed of the skill
        setStats(prevSkills => {
            const newSkill = { ...prevSkills[skillSelected] };
            newSkill.baseSpeed = speedTable[newLvl];
            // update the base multiplier of the merchanting skill
            if (skillSelected == 'Merchanting') {
                newSkill.baseMultiplier = speedTable[newLvl];
            }
            return { ...prevSkills, [skillSelected]: newSkill };
        });

        if (skillSelected === "Energy") {
            setMaxEnergy(energyTable.time[newLvl]);
            setEnergy(energyTable.time[newLvl]);
        }
    };

    // gain xp and recalculate derivative xp data
    const gainXp = (skill, value) => {

        const newXp = xp[skill] + value;

        setXp((prevXp) => ({
            ...prevXp,
            [skill]: newXp
        }));


        // Run lvl up updates if xp exceeds lvl threshold
        const calculatedLvl = lvlTable.findIndex((xpThreshold, index) =>
            newXp < xpThreshold && newXp >= (lvlTable[index - 1] || 0)
        ) - 1;

        if (lvl[skillSelected] !== calculatedLvl) {
            lvlUp(calculatedLvl);
        }
    };

    const selectTask = useCallback((taskName) => {
        const taskData = getTaskData(taskName);
        setTaskSelected(taskName);
        setActionsLeft(taskData.actions);
    }, [skillSelected]);

    const selectSkill = useCallback((skill) => {
        setSkillSelected(skill);
        setTaskSelected(null);
        setViewSettings(false);
        setEnergy(maxEnergy);
    }, [maxEnergy]);

    const completeTask = (iterations, muteMessage) => {
        const taskData = getTaskData(taskSelected);
        const xpReward = taskData.xpReward * iterations;

        const itemMessage = addItems(taskData.itemReward, iterations);
        removeItems(taskData.itemCost, iterations);

        if (muteMessage) {
            addMessage(`You gain ${itemMessage}${xpReward} xp.`);
        } else {
            addMessage(`${taskData.message} You gain ${itemMessage}${xpReward} xp.`);
        }

        gainXp(skillSelected, xpReward);
        setActionsLeft(taskData.actions);

        if (taskSelected === "Auto Task") {
            setAutoTask(true);
        }

        setNeedToSave(true);
    }

    useEffect(() => {
        if (actionsLeft <= 0) {
            completeTask(1);
        }
    }, [actionsLeft]);

    const performAction = useCallback((value) => {
        if (actionAllowed) {
            setActionsLeft(prevActionsLeft => {
                const newActionsLeft = prevActionsLeft - value;
                return newActionsLeft;
            });
        }
    }, [actionAllowed]);
    // if action button click, perform action and recharge energy
    const manualAction = useCallback((value) => {
        performAction(value);
        setEnergy(maxEnergy);

        // Clear and reset the interval
        clearInterval(energyIntervalRef.current);
        energyIntervalRef.current = setInterval(() => {
            depleteEnergy(1);
        }, 1000);
    }, [performAction, maxEnergy]);

    const removeItems = useCallback((taskItems, iterations) => {
        setInventory(prevItems => {
            const newItems = [...prevItems];
            taskItems?.forEach(({ id, quantity }) => {
                // Find item in inventory
                const index = newItems.findIndex(item => item?.id === id);
                if (index !== -1) {
                    // Remove item from inventory if 0, otherwise subtract quantity
                    if (newItems[index].quantity - quantity <= 0) {
                        newItems[index] = null;
                    } else {
                        newItems[index] = { ...newItems[index], quantity: newItems[index].quantity - (quantity * iterations) };
                    }
                }
            });
            return newItems;
        });
    }, []);

    const addItems = useCallback((taskItems, iterations) => {
        let indices = [];

        // Roll for each item based on probabilities and possible quantities
        let receivedItems = {};
        if (taskItems) {
            // perform number of rolls for number of iterations
            for (let i = 0; i < iterations; i++) {
                taskItems.forEach(({ id, quantity, probability, index }) => {
                    // Roll for if item will be received
                    const rollItem = Math.random() < 1 / probability;
                    if (rollItem) {
                        // Roll for the quantity of the item
                        const rollQuantity = Math.floor(Math.random() * (quantity[1] - quantity[0] + 1)) + quantity[0];

                        // If the item has already been rolled prior, add to quantity. if not, make a new entry. this is only relevant when multiple iterations
                        if (receivedItems[id]) {
                            receivedItems[id].quantity += rollQuantity;
                        } else {
                            receivedItems[id] = { 'quantity': rollQuantity, 'selectedIndex': index };
                        }
                    }
                });
            }
        }

        // Update inventory items with the rolled items
        setInventory(prevItems => {
            const newItems = [...prevItems];
            Object.entries(receivedItems).forEach(([id, { quantity, selectedIndex }]) => {
                // If item exists in inventory, add quantity
                const existingIndex = newItems.findIndex(item => item?.id === id);
                if (existingIndex !== -1) {
                    newItems[existingIndex] = { ...newItems[existingIndex], quantity: newItems[existingIndex].quantity + quantity };
                    indices.push(existingIndex);
                }
                // If item does not exist in inventory, add item
                else {
                    // If no index selected or selected index is filled, find first empty slot
                    if (!selectedIndex || newItems[selectedIndex] !== null) {
                        selectedIndex = newItems.findIndex(item => item == null);
                    }

                    newItems[selectedIndex] = { id, quantity };
                    indices.push(selectedIndex);
                }
            });
            return newItems;
        });

        // Create item message from quantities and names of all received items
        let itemMessage = "";
        Object.entries(receivedItems).forEach(([id, { quantity, selectedIndex }]) => {
            itemMessage = `${itemMessage}${quantity} ${id}, `;

            // Unlock item if first time receiving it
            setUnlocked(prevItems => {
                if (!prevItems.includes(id)) {
                    return [...prevItems, id];
                }
                return prevItems;
            });
            if (!unlocked.includes(id)) {
                addMessage(`You have unlocked a new item: ${id}.`);
            }
        });

        // Indicate that the items at updated indices  should flash
        setUpdatedItemIndices(indices);
        setUpdatedItemOverlay(true);
        setTimeout(() => setUpdatedItemOverlay(false), 150);

        if (itemMessage.length > 0) {
            itemMessage = `${itemMessage}and `
        }
        return itemMessage;
    }, [unlocked]);

    const calculateStats = () => {
        // Initialise skillBonus object storing the total click and speed bonus for all skills from all equipment
        const skillBonus = {}
        skills.forEach(skill => {
            skillBonus[skill] = { 'speed': 0, 'click': 0, 'speedPercent': 0, 'clickPercent': 0 };
        })

        // Add click and speed bonus to each skill from all equipment
        Object.keys(equipment).forEach(item => {
            const itemBonus = items[equipment[item]]?.bonus
            if (itemBonus) {
                Object.keys(itemBonus).forEach(skill => {
                    skillBonus[skill].speed += itemBonus[skill].speed ?? 0;
                    skillBonus[skill].click += itemBonus[skill].click ?? 0;
                    skillBonus[skill].speedPercent += itemBonus[skill].speedPercent ?? 0;
                    skillBonus[skill].clickPercent += itemBonus[skill].clickPercent ?? 0;
                });
            }
        });

        setStats(prevStats => {
            const updatedStats = {};

            Object.keys(prevStats).forEach(skill => {
                updatedStats[skill] = {
                    ...prevStats[skill],
                    bonusSpeed: skillBonus[skill].speed,
                    bonusClick: skillBonus[skill].click,
                    bonusSpeedPercent: skillBonus[skill].speedPercent,
                    bonusClickPercent: skillBonus[skill].clickPercent
                };
            });

            return updatedStats;
        });
    }
    // Update the bonus speed and click of all skills whenever equipment is changed
    useEffect(() => {
        calculateStats();
    }, [equipment, lvl]);

    // Check the number of items that can be made given ingredients in inventory
    const checkSufficientIngredients = (task) => {
        // Initialise storing the number of items each ingredient could create
        let itemsPerIngredient = {};
        task.itemCost?.forEach(item => {
            itemsPerIngredient[item.id] = 0;
        });

        // Find number of items each ingredient could create
        task.itemCost?.forEach(ingredient => {
            const inventoryQuantity = inventory.find(item => item?.id === ingredient.id)?.quantity ?? 0;
            itemsPerIngredient[ingredient.id] = Math.floor(inventoryQuantity / ingredient.quantity);
        })

        // Number of items that can be created is the minimum of all ingredients
        return Math.min(...Object.values(itemsPerIngredient));
    }


    useEffect(() => {
        // Check if the task is allowed (sufficient ingredients or not yet unlocked) whenever task or inventory change
        const checkActionAllowed = () => {
            let allowed = true;
            const taskData = getTaskData(taskSelected);

            // not allowed if no task is selected
            if (taskSelected === null || !checkSufficientIngredients(taskData)) {
                allowed = false;
                //addMessage(`You have ran out of the required items.`);
            }

            if (taskSelected == "Auto Task" && autoTask) {
                allowed = false;
            }
            setActionAllowed(allowed);
        }

        checkActionAllowed();
    }, [taskSelected, inventory]);

    // Automatically perform actions if allowed
    useEffect(() => {
        const speedNoPercent = stats[skillSelected].baseSpeed + stats[skillSelected].bonusSpeed;
        const speed = speedNoPercent * ((stats[skillSelected].bonusSpeedPercent / 100) + 1);
        const intervalSize = speed != 0 ? 1000 / speed : 1e10;

        const interval = setInterval(() => {
            if (energyRef.current !== 0) {
                performAction(1);
            }
        }, intervalSize);
        return () => clearInterval(interval);
    }, [performAction, stats, taskSelected]);


    const depleteEnergy = useCallback((value) => {
        // deplete energy by 1 if non-zero
        if (energyRef.current > 0 && actionAllowed) {
            setEnergy(prevEnergy => {
                return prevEnergy - value;
            });
        }
    }, [actionAllowed]);
    // Automatically deplete energy
    useEffect(() => {
        energyIntervalRef.current = setInterval(() => {
            depleteEnergy(1);
        }, 1000);
        return () => clearInterval(energyIntervalRef.current);
    }, [depleteEnergy]);
    // Send message if energy fully depeleted
    useEffect(() => {
        if (energy == 0) {
            addMessage("You have ran out of energy.");
        }
    }, [energy]);

    const [messages, setMessages] = useState([]);

    const addMessage = (newMessage) => {
        // add time string to beginning of message
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `[${hours}:${minutes}:${seconds}] `;

        const message = timeString.concat(newMessage);

        // update messages and keep only latest 100
        setMessages(prevMessages => {
            const updatedMessages = [...prevMessages, message];
            if (updatedMessages.length > 100) {
                return updatedMessages.slice(-100);
            }
            return updatedMessages;
        });
    };
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        addMessage("Welcome to Runeclicker.");
    }, []);

    // convert number into formatted time string
    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.round(seconds % 60);

        return [
            hrs.toString().padStart(2, '0'),
            mins.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    }
    // auto perform tasks when game starts and unlocked
    useEffect(() => {
        if (autoTask && taskSelected !== null && skillSelected !== "Energy") {
            const taskData = getTaskData(taskSelected);

            // Calculate speed and click as base + bonus
            const speedNoPercent = stats[skillSelected].baseSpeed + stats[skillSelected].bonusSpeed;
            const speed = (speedNoPercent * ((stats[skillSelected].bonusSpeedPercent / 100) + 1)).toFixed(2);

            // Calculate seconds spent working, limited by max energy
            const secondsElapsed = timeElapsed / 1000;
            const secondsWorking = secondsElapsed > maxEnergy ? maxEnergy : secondsElapsed;

            // Calculate number of tasks performed
            const taskActions = taskData.actions;
            let tasksPerformed = Math.floor((secondsWorking * speed) / taskActions);

            // tasks performed is bound by number of ingredients in inventory if task has an item cost
            if (taskData.itemCost) {
                tasksPerformed = Math.min(tasksPerformed, checkSufficientIngredients(taskData));
            }

            // message detailing time spent
            const formattedTimeElapsed = formatTime(secondsElapsed);
            const formattedTimeWorking = formatTime(secondsWorking);
            addMessage(`You have been away for ${formattedTimeElapsed}, and have spent ${formattedTimeWorking} on your task. You have completed ${tasksPerformed} tasks.`);

            // complete the number of tasks performed
            if (tasksPerformed > 0) {
                completeTask(tasksPerformed, true);
            }
        }
    }, [timeElapsed]);



    // Render different task list components depening on selected skill
    const renderTaskList = () => {
        switch (skillSelected) {
            case "Processing":
                return (
                    <RecipeList
                        skillLvl={lvl}
                        items={items}
                        recipes={tasks['Processing']}
                        inventoryItems={inventory}
                        unlockedItems={unlocked}
                        stats={stats}
                        selectTask={selectTask}
                        checkSufficientIngredients={checkSufficientIngredients}
                    />
                );
            case "Merchanting":
                return (
                    <Merchanting
                        inventory={inventory}
                        items={items}
                        stats={stats}
                        selectTask={selectTask}
                    />
                );
            case "Energy":
                return (
                    <Energy
                        energyTable={energyTable}
                        inventory={inventory}
                        items={items}
                        unlockedItems={unlocked}
                        lvl={lvl}
                        stats={stats}
                        autoTask={autoTask}
                        selectTask={selectTask}
                        getTaskData={getTaskData}
                        checkSufficientIngredients={checkSufficientIngredients}
                    />
                );
            default:
                return (
                    <TaskList
                        skillLvl={lvl}
                        tasks={tasks}
                        items={items}
                        unlockedItems={unlocked}
                        stats={stats}
                        skillSelected={skillSelected}
                        selectTask={selectTask}
                    />
                );
        }
    }

    return (
        <Box sx={{
            backgroundColor: '#555555',
            width: '100vw',
            height: '100vh',
            backgroundImage: `url(${background})`,
            backgroundSize: 'auto',
            backgroundRepeat: 'repeat'
        }}>

            <Grid container spacing={1} sx={{ maxWidth: 1000, margin: 'auto' }}>
                {/* Logo */}
                <Grid item xs={12}>
                    <Header version={version} />
                </Grid>


                <Grid item xs={3.29}>
                    <Inventory
                        items={items}
                        inventory={inventory}
                        setInventory={setInventory}
                        equipment={equipment}
                        setEquipment={setEquipment}
                        stats={stats}
                        setNeedToSave={setNeedToSave}
                        updatedItemIndices={updatedItemIndices}
                        updatedItemOverlay={updatedItemOverlay}
                        removeItems={removeItems}
                        addItems={addItems}
                    />
                </Grid>

                <Grid item xs={6.96} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 0.6 }}>

                        {viewSettings ? (
                            <Settings
                                version={version}
                                saveFile={saveFile}
                                setSaveFile={setSaveFile}
                                newSaveFile={newSaveFile}
                                loadSave={loadSave}
                                addMessage={addMessage}
                            />
                        ) : (
                            // render appropriate tasklist component if no task selected
                            taskSelected === null ? (
                                <>
                                    {renderTaskList()}
                                </>
                            ) : (
                                // Render skilling window if task selected
                                <Skilling
                                    skillXp={xp}
                                    skillLvl={lvl}
                                    lvlTable={lvlTable}
                                    stats={stats}
                                    skillSelected={skillSelected}
                                    selectSkill={selectSkill}
                                    taskSelected={taskSelected}
                                    getTaskData={getTaskData}
                                    actionsLeft={actionsLeft}
                                    energy={energy}
                                    maxEnergy={maxEnergy}
                                    actionAllowed={actionAllowed}
                                    manualAction={manualAction}
                                />
                            ))}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Console messages={messages} messagesEndRef={messagesEndRef} />
                    </Box>
                </Grid>


                <Grid item xs={1.75}>
                    <SkillList
                        skills={skills}
                        xp={xp}
                        lvl={lvl}
                        lvlTable={lvlTable}
                        items={items}
                        unlocked={unlocked}
                        skillSelected={skillSelected}
                        selectSkill={selectSkill}
                    />

                    <Button variant="contained" disableRipple onClick={() => onSettingsClick(!viewSettings)} sx={{
                        mt: 0.5,
                        p: 0,
                        minWidth: 'unset',
                        width: "24px",
                        height: "24px",
                        border: '1px solid #000000',  // Black border
                        boxShadow: '0 0 0 1px #ffffff, 3px 4px 0 rgba(0,0,0,0.5)',  // White border outside and box shadow
                        borderRadius: 0,
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        transition: 'none',
                        '&:hover': {
                            backgroundColor: '#F4FAFF', // Change the background color when hovered
                            boxShadow: '0 0 0 1px #ffffff, 3px 4px 0 rgba(0,0,0,0.5)',  // White border outside and box shadow
                        }
                    }}>
                        <img src={settingsicon} alt="Settings" />
                    </Button>
                </Grid>

            </Grid>
        </Box>
    );
}

export default Game;