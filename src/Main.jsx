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
import SkillList from "./components/SkillList.jsx";
import Inventory from './components/Inventory.jsx';
import Settings from './components/Settings.jsx';



const Main = ({
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
    saveFile,
    setSaveFile,
    newSaveFile,
    loadSave,
    lvlTable,
    speedTable,
    items,
    tasks,
    recipes,
    skills,
    version,
}) => {

    const [needToSave, setNeedToSave] = useState(false);
    const messagesEndRef = useRef(null);

    const [viewSettings, setViewSettings] = useState(false);
    const onSettingsClick = (state) => {
        setTaskSelected({});
        setViewSettings(state);
    }

    const [skillSelected, setSkillSelected] = useState(skills[0]);
    const [taskSelected, setTaskSelected] = useState({});
    const [actionAllowed, setActionAllowed] = useState(false);

    const [updatedItemOverlay, setUpdatedItemOverlay] = useState(false);
    const [updatedItemIndices, setUpdatedItemIndices] = useState([]);

    const [actionsLeft, setActionsLeft] = useState(1); // actions needed to finish task

    // Convert game data into save file string
    const saveGame = useCallback(() => {
        const save = JSON.stringify({
            xp: xp,
            inventory: inventory,
            equipment: equipment,
            unlocked: unlocked
        });
        // save game to cookies
        Cookies.set("runeclicker", save, {expires: 1000});
        setSaveFile(save);
    }, [xp, inventory, equipment, unlocked]);

    useEffect(() => {
        if (needToSave) {
            saveGame();
            setNeedToSave(false);
        }
    }, [needToSave, saveGame]);

    const lvlUp = (newLvl) => {

        let tasksList;
        if (skillSelected === "Processing") {
            tasksList = Object.values(recipes);
        } else {
            tasksList = Object.values(tasks[skillSelected]);
        }

        addMessage(`You have reached ${skillSelected} lvl ${newLvl}. You gain ${(speedTable[newLvl] - speedTable[newLvl - 1]).toFixed(2)} speed.`);
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
            return { ...prevSkills, [skillSelected]: newSkill };
        });
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

    const selectTask = useCallback((taskName, taskData) => {
        setTaskSelected(taskName);
        setActionsLeft(taskData.actions);
    }, []);

    const selectSkill = useCallback((skill) => {
        setSkillSelected(skill);
        setTaskSelected({});
        setViewSettings(false);
    }, []);

    const completeTask = () => {
        let rewardMessage;
        let task;

        if (skillSelected === "Processing") {
            task = recipes[taskSelected];
            removeItems(task.ingredients);
            addItems([{ id: taskSelected, quantity: [1, 1], probability: 1 }]);
            rewardMessage = `You create ${task.quantity} ${taskSelected}. You gain ${task.xpReward} xp.`;

        } else {
            task = tasks[skillSelected][taskSelected];
            const itemMessage = addItems(task.items);

            if (itemMessage.length > 0) {
                rewardMessage = `${task.message} You gain ${itemMessage} and ${task.xpReward} xp.`;
            } else {
                rewardMessage = `${task.message} You gain ${task.xpReward} xp.`;
            }
        }

        addMessage(rewardMessage);
        gainXp(skillSelected, task.xpReward);
        setActionsLeft(task.actions);
        setNeedToSave(true);
    }

    useEffect(() => {
        if (actionsLeft <= 0) {
            completeTask();
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

    const removeItems = useCallback((recipeItems) => {
        setInventory(prevItems => {
            const newItems = [...prevItems];
            recipeItems.forEach(({ id, quantity }) => {
                // Find item in inventory
                const index = newItems.findIndex(item => item?.id === id);
                if (index !== -1) {
                    // Remove item from inventory if 0, otherwise subtract quantity
                    if (newItems[index].quantity - quantity <= 0) {
                        newItems[index] = null;
                    } else {
                        newItems[index] = { ...newItems[index], quantity: newItems[index].quantity - quantity };
                    }
                }
            });
            return newItems;
        });
    }, []);

    const addItems = useCallback((taskItems) => {
        let itemMessage = "";
        let indices = [];

        // Roll for each item based on probabilities and possible quantities
        let receivedItems = [];
        taskItems.forEach(({ id, quantity, probability, index }) => {
            // Roll for if item will be received
            const rollItem = Math.random() < 1 / probability
            if (rollItem) {
                // Roll for the quantity of the item
                const rollQuantity = Math.floor(Math.random() * (quantity[1] - quantity[0] + 1)) + quantity[0];

                receivedItems.push({ 'id': id, 'quantity': rollQuantity, 'selectedIndex': index });
                itemMessage = itemMessage.concat(`${rollQuantity} ${id}, `);

                // Unlock item if first time receiving it
                setUnlocked(prevItems => {
                    if (!prevItems.includes(id)) {
                        addMessage(`You have unlocked a new item: ${id}.`);
                        return [...prevItems, id];
                    }
                    return prevItems;
                });
            }
        });

        // Update inventory items with the rolled items
        setInventory(prevItems => {
            const newItems = [...prevItems];
            receivedItems.forEach(({ id, quantity, selectedIndex }) => {

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

        // Indicate that the items at updated indices  should flash
        setUpdatedItemIndices(indices);
        setUpdatedItemOverlay(true);
        setTimeout(() => setUpdatedItemOverlay(false), 150);

        return itemMessage;
    }, []);

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


    const checkSufficientIngredients = (recipe) => {
        let sufficient = true;
        recipe.ingredients.forEach(ingredient => {
            if ((inventory.find(item => item?.id === ingredient.id)?.quantity ?? 0) < ingredient.quantity) {
                sufficient = false;
            }
        });
        return sufficient;
    }
    useEffect(() => {
        const checkActionAllowed = () => {
            let allowed = true;

            // not allowed if no task is selected
            if (Object.keys(taskSelected).length === 0) {
                allowed = false;
            }

            // Not allowed if insufficientingredients
            if (skillSelected === "Processing" && Object.keys(taskSelected).length !== 0) {
                if (!checkSufficientIngredients(recipes[taskSelected])) {
                    allowed = false;
                }
            }

            setActionAllowed(allowed);
        }

        checkActionAllowed();
    }, [inventory, taskSelected]);

    // Automatically perform actions if allowed
    useEffect(() => {
        const speedNoPercent = stats[skillSelected].baseSpeed + stats[skillSelected].bonusSpeed;
        const speed = speedNoPercent*((stats[skillSelected].bonusSpeedPercent/100)+1);
        const intervalSize = speed!=0 ? 1000/speed : 1e10;

        const interval = setInterval(() => {
            performAction(1);
        }, intervalSize);
        return () => clearInterval(interval);
    }, [performAction, stats, taskSelected]);

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
                        setNeedToSave={setNeedToSave}
                        updatedItemIndices={updatedItemIndices}
                        updatedItemOverlay={updatedItemOverlay}
                        removeItems={removeItems}
                        addItems={addItems}
                    />
                </Grid>

                <Grid item xs={6.96} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 0.6 }}>
                        {/* If no selected task, show task list */}
                        {viewSettings ?
                            (
                                <Settings version={version} saveFile={saveFile} setSaveFile={setSaveFile} newSaveFile={newSaveFile} loadSave={loadSave} addMessage={addMessage} />
                            ) : (
                                Object.keys(taskSelected).length === 0 ?
                                    (skillSelected === "Processing" ? (
                                        <RecipeList
                                            skillLvl={lvl}
                                            recipes={recipes}
                                            items={items}
                                            inventoryItems={inventory}
                                            unlockedItems={unlocked}
                                            selectTask={selectTask}
                                            checkSufficientIngredients={checkSufficientIngredients}
                                        />
                                    ) : (
                                        <TaskList
                                            skillLvl={lvl}
                                            tasks={tasks}
                                            items={items}
                                            unlockedItems={unlocked}
                                            skillSelected={skillSelected}
                                            selectTask={selectTask}
                                        />
                                    )) : (
                                        <Skilling
                                            skillXp={xp}
                                            skillLvl={lvl}
                                            lvlTable={lvlTable}
                                            stats={stats}
                                            skillSelected={skillSelected}
                                            selectSkill={selectSkill}
                                            taskSelected={taskSelected}
                                            tasks={tasks}
                                            recipes={recipes}
                                            actionsLeft={actionsLeft}
                                            actionAllowed={actionAllowed}
                                            performAction={performAction}
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

export default Main;