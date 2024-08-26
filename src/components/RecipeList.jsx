import React, { Fragment } from "react";
import { List, Divider } from '@mui/material';

import Window from "./Window";
import TaskItem from "./TaskItem";

const RecipeList = ({ skillLvl, recipes, items, inventoryItems, unlockedItems, stats, selectTask, checkSufficientIngredients }) => {

    const content = (
        <List sx={{ m: 0, p: 0, maxHeight: 352 }}>
            {Object.keys(recipes).map((taskName, index) => {
                const taskData = recipes[taskName];

                const taskItems = taskData.itemCost.map(item => ({
                    "itemData": items[item.id],
                    "itemName": item.id,
                    "quantity": item.quantity,
                    "proportion": true,
                    "probability": null,
                    "locked": !unlockedItems.includes(item.id),
                    "stats": stats
                }));

                const icon = {
                    "itemData": items[taskName],
                    "itemName": taskName,
                    "stats": stats,
                    "locked": !unlockedItems.includes(taskName),
                }

                return (
                    <Fragment key={index}>
                        <TaskItem
                            unlocked={skillLvl["Processing"] >= taskData.lvl}
                            icon={icon}
                            title={taskName}
                            subtitle={`lvl ${taskData.lvl}`}
                            rightText={`${taskData.xpReward} xp`}
                            items={taskItems}
                            action={selectTask}
                            taskName={taskName}
                            taskData={taskData}
                            inventoryItems={inventoryItems}
                            checkSufficientIngredients={checkSufficientIngredients}
                        />
                        <Divider />
                    </Fragment>

                );
            })}

        </List>
    );

    return (
        <Window content={content} />
    );
}

export default RecipeList;