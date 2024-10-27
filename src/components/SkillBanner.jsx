import React, { useState, useEffect } from "react";
import { Typography, Box, Grid, LinearProgress, ListItemButton } from '@mui/material';

const SkillBanner = ({ lvl, skill, xp, lvlTable, selectSkill }) => {

    // flashing progress bars on completion
    const [lvlOverlay, setLvlOverlay] = useState(false);
    useEffect(() => {
        setLvlOverlay(true);
        setTimeout(() => setLvlOverlay(false), 150);
    }, [lvl[skill]]);

    const lvlProgress = ((xp[skill] - lvlTable[lvl[skill]]) / (lvlTable[lvl[skill] + 1] - lvlTable[lvl[skill]])) * 100;

    // Calculate xp progress for current level
    const xpThisLvl = lvlTable[lvl[skill]];
    const xpNextLvl = lvlTable[lvl[skill] + 1];
    const xpLvlTotal = xpNextLvl - xpThisLvl;
    const xpLvlRemaining = xpNextLvl - xp[skill];

    return (
        <Box sx={{ backgroundColor: '#BCA795' }}>
            <ListItemButton onClick={() => selectSkill(skill)} disableRipple sx={{ overflow: 'hidden', flexDirection: 'column', alignItems: 'flex-start', p: 0, userSelect: 'none', mb: '1px' }}>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', pl: 0.25, pr: 1 }}>
                    <img src={`${process.env.PUBLIC_URL}/gameData/images/interface/${skill.toLowerCase()}.png`} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} />

                    <Box sx={{ width: '100%' }}>
                        <Grid container>
                            {/* Skill and XP Row */}
                            <Grid item xs={8}>
                                <Typography variant="body1" sx={{ fontFamily: 'monospace', textAlign: 'left', fontWeight: 'bold', pl: 0.5 }}>
                                    {skill}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'right', pr:1, mt:0.25 }}>
                                    xp: {xp[skill].toLocaleString()}
                                </Typography>
                            </Grid>

                            {/* Lvl and Remaining Row */}
                            <Grid item xs={4}>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 0.5 }}>
                                    lvl {lvl[skill]}
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'right', pr:1 }}>
                                    remaining: {xpLvlRemaining.toLocaleString()}/{xpLvlTotal.toLocaleString()}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                <Box sx={{ position: 'relative', height: 'auto', width: '100%' }}>
                    <LinearProgress
                        variant="determinate"
                        value={lvlProgress}
                        classes={{ bar: 'bar' }}
                        sx={{
                            border: 1,
                            mx: '-1px',
                            height: 6,
                            width: '100%',
                            backgroundColor: '#444444', // Background color of the progress bar
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#6ACAD8' // Color of the progress bar itself
                            }
                        }}
                    />
                    {/* Completion Overlay */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: '#FFFFFF',
                            opacity: lvlOverlay ? 1 : 0,
                        }}
                    />
                </Box>
            </ListItemButton>
        </Box>
    );
}

export default SkillBanner;