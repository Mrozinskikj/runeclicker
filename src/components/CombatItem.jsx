import React, { useState } from "react";
import { Typography, ListItem, ListItemButton, Box, Stack, Button, Divider, Grid } from '@mui/material';

import Item from "./Item";
import DepthBar from "./DepthBar";

import downarrowicon from "../images/interface/downarrow.png";
import uparrowicon from "../images/interface/uparrow.png";

const CombatItem = ({ unlocked, icon, title, subtitle, action, rightText, items, taskName, taskData, inventoryItems, checkSufficientIngredients, enemies, stats, unlockedItems, enemiesDiscovered, best }) => {

    // Depths Component
    const Depths = ({ depths, depthColours, depthTotals, border }) => {
        return (
            <Box sx={{ display: 'flex', width: '100%', border: 1 }}>
                {depths.map((probability, sectionIndex) => (
                    <Box
                        key={sectionIndex}
                        sx={{
                            flex: 1,
                            height: 36,
                            backgroundColor: depthColours[sectionIndex],
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {probability !== 0 && (
                            <Typography
                                variant="body2"
                                sx={{ fontFamily: 'monospace', textAlign: 'center', color: '#FFFFFF', textShadow: border }}
                            >
                                {probability}/{depthTotals[sectionIndex]}
                            </Typography>
                        )}

                        {/* Disabled Overlay */}
                        {probability === 0 && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: '#444444',
                                    opacity: 0.6,
                                }}
                            />
                        )}
                    </Box>
                ))}
            </Box>
        );
    };

    // ItemRewards Component
    const ItemRewards = ({ itemsData, items, unlockedItems, stats }) => {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', pr: 1 }}>
                {itemsData.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', pl: 3 }}>
                        {/* Item Icon */}
                        <Item
                            itemData={items[item.id]}
                            itemName={item.id}
                            quantity={item.quantity}
                            proportion={item.proportion}
                            locked={!unlockedItems.includes(item.id)}
                            stats={stats}
                        />

                        {/* Item probability */}
                        <Stack sx={{ pl: 0.5 }}>
                            <Typography variant="caption" sx={{ fontFamily: 'monospace', textAlign: 'center', mb: -0.25 }}>
                                1
                            </Typography>
                            <Box sx={{ width: '100%', height: '1px', backgroundColor: 'currentColor' }} />
                            <Typography variant="caption" sx={{ fontFamily: 'monospace', textAlign: 'center', mt: -0.25 }}>
                                {item.probability}
                            </Typography>
                        </Stack>
                    </Box>
                ))}
            </Box>
        );
    };

    const Info = ({ }) => {
        return (
            <Grid container direction="column" spacing={0} sx={{ py: 1 }}>
                {Object.keys(enemyDepths)?.map((enemy, index) => (
                    <Grid container item key={index} alignItems="center" spacing={1} sx={{ minHeight: 44, maxHeight: 44, userSelect: 'none' }}>
                        {enemiesDiscovered.includes(enemy) ? (
                            <>
                                {/* Enemy Name */}
                                <Grid item xs={2.8}>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontFamily: 'monospace', textAlign: 'left', pl: 1, flex: 1 }}
                                    >
                                        {enemy}
                                    </Typography>
                                </Grid>

                                {/* Depths */}
                                <Grid item xs={4.6}>
                                    <Depths depths={enemyDepths[enemy]} depthColours={depthColours} depthTotals={depthTotals} border={border} />
                                </Grid>

                                {/* Item Rewards */}
                                <Grid item xs={4.6}>
                                    <ItemRewards itemsData={enemies[enemy].itemReward} items={items} unlockedItems={unlockedItems} stats={stats} />
                                </Grid>
                            </>
                        ) : (
                            <>
                                {/* Enemy Name */}
                                <Grid item xs={2.8}>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontFamily: 'monospace', textAlign: 'left', pl: 1, flex: 1 }}
                                    >
                                        ???
                                    </Typography>
                                </Grid>
                            </>
                        )}


                    </Grid>
                ))}
            </Grid>
        );
    }


    const [showInfo, setShowInfo] = useState(false);

    let sufficient = true;
    if (checkSufficientIngredients) {
        sufficient = checkSufficientIngredients(taskData) > 0;
    }
    let textColour = '#000000';
    if (!sufficient && unlocked) {
        textColour = '#C14C55';
    }

    // Create a list of all enemies and their depths
    const enemyDepths = {};
    taskData.enemies?.forEach((depth, index) => {
        depth.forEach(enemy => {
            if (!enemyDepths[enemy.id]) {
                enemyDepths[enemy.id] = [0, 0, 0, 0];
            }
            enemyDepths[enemy.id][index] = enemy.probability;
        });
    });

    const border = '0 0 1px #000000, '.repeat(10).slice(0, -2);

    const depthTotals = taskData.enemies?.map(depth =>
        depth.reduce((sum, enemy) => sum + enemy.probability, 0)
    );

    const depthColours = ["#7DDB60", "#FFF160", "#FF9347", "#EA4444"];

    return (
        <Box>
            <ListItem
                disablePadding
                sx={{ backgroundColor: unlocked && sufficient ? '' : 'rgba(188,167,149,0.25)', overflow: 'hidden', userSelect: 'none' }}
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
                        cursor: sufficient ? 'pointer' : 'default',
                        backgroundColor: 'transparent',
                        '&:hover': {
                            backgroundColor: !sufficient && 'transparent'
                        },
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
                            <Typography variant="body1" sx={{ fontFamily: 'monospace', textAlign: 'left', fontWeight: 'bold', color: textColour }}>
                                {unlocked ? (
                                    title
                                ) : (
                                    "???"
                                )}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, pr: 1, mt: -0.1 }}>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'left', whiteSpace: 'nowrap' }}>
                                    {subtitle}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {unlocked && (
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                            <DepthBar value={best} depthSize={taskData.depthSize} />
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'right', whiteSpace: 'nowrap', px: 1 }}>
                                best: {best}
                            </Typography>
                        </Box>
                    )}
                </ListItemButton>
            </ListItem>

            <Divider />
            {showInfo && <Info />}

            {unlocked && (
                <Box sx={{ overflowX: 'clip' }}>
                    <Button
                        variant="contained"
                        disableRipple
                        onClick={() => setShowInfo(!showInfo)}
                        sx={{
                            height: 16,
                            mx: '-1px',
                            mt: '-6px',
                            width: 'calc(100% + 2px)',
                            fontFamily: 'monospace',
                            borderRadius: 0,
                            color: '#000000',
                            border: 1,
                            borderTop: 0,
                            transition: 'none',
                            backgroundColor: '#BCA795',
                            '&:hover': { backgroundColor: '#AD9A8A' },
                            '&:active': { backgroundColor: '#968578' },
                        }}>
                        {/* Arrow icon */}
                        <Box
                            component="img"
                            src={showInfo ? uparrowicon : downarrowicon}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translateX(-50%) translateY(-50%)',
                                width: 'auto',
                                height: 'auto',
                                zIndex: 1,
                            }}
                        />
                    </Button>
                </Box>
            )}
        </Box>
    )
}

export default CombatItem;