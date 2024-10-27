import React from "react";
import { List, Divider } from '@mui/material';

import Window from "./Window";
import CombatItem from "./CombatItem";
import SkillBanner from "./SkillBanner";

const CombatList = ({ skillLvl, tasks, skillSelected, xp, lvlTable, selectSkill, selectTask, enemies, items, stats, unlockedItems, enemiesDiscovered, combatBests }) => {
    
    const content = (
        <>
            <SkillBanner lvl={skillLvl} skill={skillSelected} xp={xp} lvlTable={lvlTable} selectSkill={selectSkill} />

            <List sx={{ m: 0, p: 0, maxHeight: 352, overflowY: 'auto' }}>
                {Object.keys(tasks[skillSelected]).map((taskName, index) => {
                    const taskData = tasks[skillSelected][taskName];

                    return (
                        <>
                            <CombatItem
                                unlocked={skillLvl[skillSelected] >= taskData.lvl}
                                title={taskName}
                                subtitle={`lvl ${taskData.lvl}`}
                                rightText={null}
                                items={items}
                                action={selectTask}
                                taskName={taskName}
                                taskData={taskData}
                                enemies={enemies}
                                stats={stats}
                                unlockedItems={unlockedItems}
                                enemiesDiscovered={enemiesDiscovered}
                                best={combatBests[taskName] ?? 0}
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

export default CombatList;