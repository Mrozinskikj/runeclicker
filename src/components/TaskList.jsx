import React from "react";
import { List, Divider } from '@mui/material';

import Window from "./Window";
import TaskItem from "./TaskItem";

const TaskList = ({ skillLvl, tasks, items, unlockedItems, skillSelected, stats, selectTask }) => {

    const content = (
        <List sx={{ m: 0, p: 0, maxHeight: 352 }}>
            {Object.keys(tasks[skillSelected]).map((taskName, index) => {
                const taskData = tasks[skillSelected][taskName];

                const taskItems = taskData.itemReward.map(item => ({
                    "itemData": items[item.id],
                    "itemName": item.id,
                    "quantity": item.quantity,
                    "proportion": false,
                    "probability": item.probability,
                    "locked": !unlockedItems.includes(item.id),
                    "stats": stats
                }));

                return (
                    <>
                        <TaskItem
                            unlocked={skillLvl[skillSelected] >= taskData.lvl}
                            title={taskName}
                            subtitle={`lvl ${taskData.lvl}`}
                            rightText={`${taskData.xpReward} xp`}
                            items={taskItems}
                            action={selectTask}
                            taskName={taskName}
                            taskData={taskData}
                        />
                        <Divider />
                    </>
                );
            })}

        </List>
    );

    return (
        <Window content={content} />
    );
}

export default TaskList;