import React from "react";
import { List, Divider, Typography, Box } from '@mui/material';

import Window from "./Window";
import TaskItem from "./TaskItem";
import SkillBanner from "./SkillBanner";

const Merchanting = ({ inventory, items, stats, lvl, xp, skillSelected, lvlTable, selectSkill, selectTask }) => {

    // sellable items in inventory are all which are non-null and have a value
    const sellableItems = inventory.filter(item => item !== null && items[item.id].value);

    const multiplierNoPercent = stats['Merchanting'].baseMultiplier + stats['Merchanting'].bonusMultiplier;
    const multiplier = (multiplierNoPercent * ((stats['Merchanting'].bonusMultiplier / 100) + 1)).toFixed(2);

    const content = (
        <>
            <SkillBanner lvl={lvl} skill={skillSelected} xp={xp} lvlTable={lvlTable} selectSkill={selectSkill} />

            <List sx={{ m: 0, p: 0, maxHeight: 352, overflowY: 'auto' }}>
                {sellableItems.length > 0 ? (
                    sellableItems.map((item, index) => {

                        const icon = {
                            "itemData": items[item.id],
                            "itemName": item.id,
                            "quantity": item.quantity,
                            "stats": stats,
                            "locked": false,
                        }

                        const value = Math.floor(items[item.id].value * multiplier);

                        return (
                            <>
                                <TaskItem
                                    unlocked={true}
                                    icon={icon}
                                    title={item.id}
                                    subtitle={`value: ${value} (base: ${items[item.id].value}, multiplier: ${multiplier})`}
                                    rightText={`${items[item.id].value} xp`}
                                    items={null}
                                    action={selectTask}
                                    taskName={item.id}
                                    taskData={{ 'actions': 4 }}
                                    inventoryItems={inventory}
                                />
                                <Divider />
                            </>
                        );
                    })
                ) : (
                    <Box sx={{ display: 'flex' }}>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace', ml: 1, alignContent: 'center', height: 44 }}>
                            No items to sell.
                        </Typography>
                    </Box>
                )}
            </List>
        </>
    );

    return (
        <Window content={content} />
    );
}

export default Merchanting;