import React from "react";
import { Typography, ListItem, ListItemButton, Box, Stack } from '@mui/material';

import Item from "./Item";

const TaskItem = ({ unlocked, icon, title, subtitle, action, rightText, items, taskName, taskData, inventoryItems, checkSufficientIngredients }) => {

    let sufficient = true;
    if (checkSufficientIngredients) {
        sufficient = checkSufficientIngredients(taskData)>0;
    }

    return (
        <ListItem
            disablePadding
            sx={{ backgroundColor: unlocked ? '' : 'rgba(188,167,149,0.25)', overflow:'hidden' }}
        >
            <ListItemButton
                onClick={() => sufficient && action(taskName)}
                disabled={!unlocked}
                sx={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 0,
                    width: '100%',
                    height: 43,
                    transition: 'none',
                    cursor: sufficient ? 'pointer' : 'default'
                }}
                disableRipple
            >
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', pr: 1 }}>
                    {/* Icon */}
                    {icon && (
                        <Box sx={{ pl: 0.5, mt: 0.5 }}>
                            <Item itemData={icon.itemData} itemName={icon.itemName} stats={icon.stats} quantity={icon.quantity} locked={icon.locked} />
                        </Box>
                    )}

                    {/* Title */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pl: 1 }}>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace', textAlign: 'left', fontWeight: 'bold' }}>
                            {unlocked ? (
                                title
                            ) : (
                                "???"
                            )}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, pr: 1, mt: -0.1 }}>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'left' }}>
                                {subtitle}
                            </Typography>
                        </Box>
                    </Box>
                </Box>


                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', pr: 1 }}>
                    {unlocked ? (
                        <>
                            {/* Items */}
                            {items && items.map((item, index) => {
                                // quantity is the proportion of owned items to needed items if proportion mode
                                let quantity = item.quantity;
                                if (item.proportion) {
                                    quantity = [(inventoryItems.find(inventoryItem => inventoryItem?.id === item.itemName)?.quantity ?? 0), item.quantity];
                                }

                                return (
                                    <Box key={index} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', pl: 3 }}>
                                        {/* Item Icon */}
                                        <Item
                                            itemData={item.itemData}
                                            itemName={item.itemName}
                                            quantity={quantity}
                                            proportion={item.proportion}
                                            locked={item.locked}
                                            stats={item.stats}
                                        />

                                        {/* Item probability */}
                                        {item.probability && (
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
                                        )}
                                    </Box>
                                )
                            })}

                            {/* Right text */}
                            {rightText && (
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'left', pl: 3 }}>
                                    {rightText}
                                </Typography>
                            )}
                        </>
                    ) : (
                        <></>
                    )}
                </Box>
            </ListItemButton>
        </ListItem >
    )
}

export default TaskItem;