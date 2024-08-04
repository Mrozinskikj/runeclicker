import React from "react";
import { Typography, List, ListItem, ListItemButton, Divider, Box, Stack } from '@mui/material';

import Window from "./Window";
import Item from "./Item";

const TaskList = ({ skillLvl, tasks, items, unlockedItems, skillSelected, selectTask }) => {

    const TaskButton = ({ taskName, taskData, index }) => {
        const unlocked = skillLvl[skillSelected] >= taskData.lvl;

        return (
            <>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => selectTask(taskName, taskData)} disabled={!unlocked} disableRipple sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', p: 0, width: '100%', transition: 'none' }}>
                        {/* Title */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pl: 1 }}>
                            <Typography variant="body1" sx={{ fontFamily: 'monospace', textAlign: 'left', fontWeight: 'bold' }}>
                                {unlocked ? (
                                    taskName
                                ) : (
                                    "???"
                                )}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, pr: 1, mt:-0.1 }}>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'left' }}>
                                    lvl {taskData.lvl}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Rewards */}
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', pr: 1 }}>
                            {unlocked ? (
                                <>
                                    {taskData.items.map((item, index) => (
                                        <Box key={index} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', pr:3 }}>
                                            {/* Item Icon */}
                                            <Item itemData={items[item.id]} itemName={item.id} quantity={item.quantity[0] === item.quantity[1] ? item.quantity[0] : `${item.quantity[0]}-${item.quantity[1]}`} locked={!unlockedItems.includes(item.id)} />
                                            <Stack sx={{ pl: 0.5 }}>
                                                <Typography variant="caption" sx={{ fontFamily: 'monospace', textAlign: 'center', mb: -0.25 }}>
                                                    1
                                                </Typography>
                                                <Box
                                                    sx={{ width: '100%', height: '1px', backgroundColor: 'currentColor' }}
                                                />
                                                <Typography variant="caption" sx={{ fontFamily: 'monospace', textAlign: 'center', mt: -0.25 }}>
                                                    {item.probability}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    ))}

                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'left' }}>
                                        {taskData.xpReward} xp
                                    </Typography>
                                </>
                            ) : (
                                <></>
                            )}
                        </Box>
                    </ListItemButton>
                </ListItem>

                {index !== tasks[skillSelected].length - 1 && (
                    <Divider />
                )}
            </>
        );
    };

    const content = (
        <List sx={{ m: 0, p: 0, maxHeight:352 }}>
            {Object.keys(tasks[skillSelected]).map((taskName, index) => (
                <TaskButton key={index} taskName={taskName} taskData={tasks[skillSelected][taskName]} index={index} />
            ))}
        </List>
    );

    return (
        <Window content={content} />
    );
}

export default TaskList;