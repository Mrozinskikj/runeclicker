import React from "react";
import { List, Divider } from '@mui/material';

import Window from "./Window";
import TaskItem from "./TaskItem";
import SkillBanner from "./SkillBanner";

const TaskList = ({ skillLvl, tasks, items, unlockedItems, skillSelected, stats, xp, lvlTable, selectTask, selectSkill, getItemProbability }) => {

    const content = (
        <>
            <SkillBanner lvl={skillLvl} skill={skillSelected} xp={xp} lvlTable={lvlTable} selectSkill={selectSkill} />

            <List sx={{
                m: 0,
                p: 0,
                maxHeight: 352,
                overflowY: 'auto',
            }}>
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
                                getItemProbability={getItemProbability}
                            />
                            <Divider />
                        </>
                    );
                })}
            </List>
        </>
    );

    return (
        <Window content={content} />
    );
}

export default TaskList;