import React from "react";
import { List, Divider } from '@mui/material';

import Window from "./Window";
import TaskItem from "./TaskItem";
import SkillBanner from "./SkillBanner";

const Energy = ({ energyTable, inventory, items, unlockedItems, lvl, stats, autoTask, skillSelected, xp, lvlTable, selectSkill, selectTask, getTaskData, checkSufficientIngredients }) => {

    // convert number into formatted time string
    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return [
            hrs.toString().padStart(2, '0'),
            mins.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    }

    const cost = energyTable.cost[lvl['Energy']];
    const next = energyTable.time[lvl['Energy'] + 1];
    const bonus = next - energyTable.time[lvl['Energy']];

    const content = (
        <>
            <SkillBanner lvl={lvl} skill={skillSelected} xp={xp} lvlTable={lvlTable} selectSkill={selectSkill} />

            <List sx={{ m: 0, p: 0, maxHeight: 352 }}>
                {/* Energy Fortification */}
                <TaskItem
                    unlocked={true}
                    title={"Energy Fortification"}
                    subtitle={`+${bonus} seconds of energy (${formatTime(next)})`}
                    items={[{
                        "itemData": items["Coins"],
                        "itemName": "Coins",
                        "quantity": cost,
                        "proportion": true,
                        "locked": !unlockedItems.includes("Coins"),
                        "stats": stats
                    }]}
                    action={selectTask}
                    taskName={"Energy Fortification"}
                    taskData={getTaskData("Energy Fortification")}
                    inventoryItems={inventory}
                    checkSufficientIngredients={checkSufficientIngredients}
                />
                <Divider />

                {/* Auto Task */}
                {!autoTask && (
                    <>
                        <TaskItem
                            unlocked={true}
                            title={"Auto Task"}
                            subtitle={"Tasks continue offline"}
                            items={[{
                                "itemData": items["Coins"],
                                "itemName": "Coins",
                                "quantity": getTaskData("Auto Task").itemCost[0].quantity,
                                "proportion": true,
                                "locked": !unlockedItems.includes("Coins"),
                                "stats": stats
                            }]}
                            action={selectTask}
                            taskName={"Auto Task"}
                            taskData={getTaskData("Auto Task")}
                            inventoryItems={inventory}
                            checkSufficientIngredients={checkSufficientIngredients}
                        />
                        <Divider />
                    </>
                )}
            </List>
        </>
    );

    return (
        <Window content={content} />
    );
}

export default Energy;