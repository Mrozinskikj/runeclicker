import React, { useState, useEffect } from "react";
import { Typography, Box, LinearProgress, Button, Grid } from '@mui/material';

import Window from "./Window";
import backarrowicon from "../images/interface/backarrow.png";

const Skilling = ({ skillXp, skillLvl, lvlTable, stats, skillSelected, selectSkill, taskSelected, tasks, recipes, actionsLeft, actionAllowed, performAction }) => {

    const ProgressBar = ({ value, colour, completeOverlay }) => {
        return (
            <Box sx={{ position: 'relative', height: 'auto' }}>
                <LinearProgress
                    variant="determinate"
                    value={value}
                    classes={{ bar: 'bar' }}
                    sx={{
                        boxShadow: '0px 1px 0 rgba(0,0,0,0.25)',
                        border: 1,
                        height: 10,
                        backgroundColor: '#444444', // Background color of the progress bar
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: colour // Color of the progress bar itself
                        }
                    }}
                />
                {/* Task Complete Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#FFFFFF',
                        opacity: completeOverlay ? 1 : 0,
                    }}
                />
            </Box>
        );
    };

    let task;
    if (skillSelected === "Processing") {
        task = recipes[taskSelected];
    } else {
        task = tasks[skillSelected][taskSelected];
    }

    // Calculate speed and click as base + bonus
    const speedNoPercent = stats[skillSelected].baseSpeed + stats[skillSelected].bonusSpeed;
    const speed = (speedNoPercent * ((stats[skillSelected].bonusSpeedPercent / 100) + 1)).toFixed(2);
    const clickNoPercent = stats[skillSelected].baseClick + stats[skillSelected].bonusClick;
    const click = (clickNoPercent * ((stats[skillSelected].bonusClickPercent / 100) + 1)).toFixed(2);


    // flashing progress bars on completion
    const [lvlOverlay, setLvlOverlay] = useState(false);
    const [actionOverlay, setActionOverlay] = useState(false);
    useEffect(() => {
        setLvlOverlay(true);
        setTimeout(() => setLvlOverlay(false), 150);
    }, [skillLvl[skillSelected]]);
    useEffect(() => {
        if (actionsLeft <= 0) {
            setActionOverlay(true);
            setTimeout(() => setActionOverlay(false), 150);
        }
    }, [actionsLeft]);

    // Calculate xp progress for current level
    const xpThisLvl = lvlTable[skillLvl[skillSelected]];
    const xpNextLvl = lvlTable[skillLvl[skillSelected] + 1];
    const xpLvlTotal = xpNextLvl - xpThisLvl;
    const xpLvlRemaining = xpNextLvl - skillXp[skillSelected];

    // Calculate data for progress bars (0-100)
    const lvlProgress = ((skillXp[skillSelected] - xpThisLvl) / (xpNextLvl - xpThisLvl)) * 100;
    const actionProgress = (actionsLeft / task.actions) * 100

    let actionName = task.actionName;
    if (skillSelected === "Processing") {
        actionName = "Make";
    }


    const content = (
        <Box sx={{ overflowY: 'hidden', userSelect: 'none' }}>
            {/* XP tracker */}
            <Box>
                {/* Skill */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Button variant="contained" disableRipple onClick={() => selectSkill(skillSelected)} sx={{
                            p: 0,
                            mr: 0.5,
                            minWidth: 'unset',
                            width: "24px",
                            height: "24px",
                            boxShadow: 0,
                            borderRadius: 0,
                            backgroundColor: 'rgba(0,0,0,0)',
                            transition: 'none',
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0)',
                                boxShadow: 0,
                            }
                        }}>
                            <img src={backarrowicon} alt="Settings" />
                        </Button>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                            {skillSelected}
                        </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                        lvl {skillLvl[skillSelected]}
                    </Typography>
                </Box>

                <ProgressBar value={lvlProgress} colour={'#6ACAD8'} completeOverlay={lvlOverlay} />

                <Grid container sx={{ mt: 0.5 }}>
                    <Grid item xs={4}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}> xp: {skillXp[skillSelected]}</Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}> next lvl at: {xpNextLvl}</Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}> remaining: {xpLvlRemaining}/{xpLvlTotal}</Typography>
                    </Grid>
                </Grid>
            </Box>

            {/* Perform Action */}
            <Button variant="contained" disableRipple disabled={!actionAllowed} onClick={() => performAction(click)} sx={{
                my: 4,
                width: '100%',
                fontFamily: 'monospace',
                borderRadius: 0,
                boxShadow: '0px 1px 0 rgba(0,0,0,0.25)',
                backgroundColor: '#ffffff',
                color: '#000000',
                border: 1,
                transition: 'none',
                '&:hover': {
                    backgroundColor: '#F4FAFF', // Change the background color when hovered
                    boxShadow: '1px 2px 0 rgba(0,0,0,0.25)', // Add a subtle shadow when hovered
                },
                '&:active': {
                    backgroundColor: '#CCDAE2',
                    boxShadow: '0px 0px 0 rgba(0,0,0,0.25)'
                },
                '&:disabled': {
                    backgroundColor: '#aaaaaa',
                }
            }}>{actionName}</Button>

            {/* Action tracker */}
            <Box>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{taskSelected}</Typography>

                <ProgressBar value={actionProgress} colour={'#FFA366'} completeOverlay={actionOverlay} />

                <Grid container sx={{ mt: 0.5 }}>
                    <Grid item xs={4}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}> speed: {speed}</Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}> click: {click}</Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}> remaining: {actionsLeft}/{task.actions}</Typography>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );

    return (
        <Window content={content} pad />
    );
}

export default Skilling;