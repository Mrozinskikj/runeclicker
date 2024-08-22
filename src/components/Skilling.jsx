import React, { useState, useEffect } from "react";
import { Typography, Box, LinearProgress, Button, Grid } from '@mui/material';

import Window from "./Window";
import backarrowicon from "../images/interface/backarrow.png";


const Skilling = ({ skillXp, skillLvl, lvlTable, stats, skillSelected, selectSkill, taskSelected, getTaskData, actionsLeft, energy, maxEnergy, actionAllowed, manualAction }) => {

    // convert number into formatted time string
    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return [
            hrs.toString().padStart(2, '0'),
            mins.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    }

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

    const taskData = getTaskData(taskSelected);

    // Calculate speed and click as base + bonus
    const speedNoPercent = stats[skillSelected].baseSpeed + stats[skillSelected].bonusSpeed;
    const speed = (speedNoPercent * ((stats[skillSelected].bonusSpeedPercent / 100) + 1)).toFixed(2);
    const clickNoPercent = stats[skillSelected].baseClick + stats[skillSelected].bonusClick;
    const click = (clickNoPercent * ((stats[skillSelected].bonusClickPercent / 100) + 1)).toFixed(2);

    // Calculate multiplier if merchanting
    let multiplierNoPercent;
    let multiplier;
    if (skillSelected == 'Merchanting') {
        multiplierNoPercent = stats[skillSelected].baseMultiplier + stats[skillSelected].bonusMultiplier;
        multiplier = (multiplierNoPercent * ((stats[skillSelected].bonusMultiplier / 100) + 1)).toFixed(2);
    }

    // flashing progress bars on completion
    const [lvlOverlay, setLvlOverlay] = useState(false);
    const [actionOverlay, setActionOverlay] = useState(false);
    const [energyOverlay, setEnergyOverlay] = useState(false);
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
    useEffect(() => {
        if (energy === maxEnergy) {
            setEnergyOverlay(true);
            setTimeout(() => setEnergyOverlay(false), 150);
        }
    }, [energy]);

    const [buttonHover, setButtonHover] = useState(false);
    const [buttonActive, setButtonActive] = useState(false);
    const buttonShadow = buttonActive ? '0px 0px 0 rgba(0,0,0,0.25)' : (buttonHover ? '1px 4px 0 rgba(0,0,0,0.25)' : '0px 2px 0 rgba(0,0,0,0.25)');
    const buttonText = energy !== 0 ? taskData.actionName : 'Recharge Energy';
    const buttonColour = energy !== 0 ? '#FFFFFF' : '#E8C2C2';

    // Calculate xp progress for current level
    const xpThisLvl = lvlTable[skillLvl[skillSelected]];
    const xpNextLvl = lvlTable[skillLvl[skillSelected] + 1];
    const xpLvlTotal = xpNextLvl - xpThisLvl;
    const xpLvlRemaining = xpNextLvl - skillXp[skillSelected];

    // Calculate data for progress bars (0-100)
    const lvlProgress = ((skillXp[skillSelected] - xpThisLvl) / (xpNextLvl - xpThisLvl)) * 100;
    const actionProgress = (actionsLeft / taskData.actions) * 100
    const energyProgress = (energy / maxEnergy) * 100;

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
                    <Grid item xs={4} sx={{ px: 1 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}> xp: {skillXp[skillSelected].toLocaleString()}</Typography>
                    </Grid>

                    <Grid item xs={4} sx={{ px: 1 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}> next lvl: {xpNextLvl.toLocaleString()}</Typography>
                    </Grid>

                    <Grid item xs={4} sx={{ px: 1 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}> remaining: {xpLvlRemaining.toLocaleString()}/{xpLvlTotal.toLocaleString()}</Typography>
                    </Grid>
                </Grid>
            </Box>


            {/* Perform Action */}
            <Box sx={{ boxShadow: buttonShadow }}>
                <Button
                    variant="contained"
                    disableRipple
                    disabled={!actionAllowed}
                    onClick={() => manualAction(click)}
                    onMouseEnter={() => setButtonHover(true)}
                    onMouseLeave={() => setButtonHover(false)}
                    onMouseDown={() => setButtonActive(true)}
                    onMouseUp={() => setButtonActive(false)}
                    sx={{
                        mt: 4,
                        width: '100%',
                        fontFamily: 'monospace',
                        borderRadius: 0,
                        backgroundColor: buttonColour,
                        color: '#000000',
                        border: 1,
                        transition: 'none',
                        '&:hover': { backgroundColor: '#F4FAFF' },
                        '&:active': { backgroundColor: '#CCDAE2' },
                        '&:disabled': { backgroundColor: '#aaaaaa' }
                    }}>
                    {buttonText}
                </Button>
                <Box sx={{ mt: -0.2 }}>
                    <ProgressBar value={energyProgress} colour={'#82E0AF'} completeOverlay={energyOverlay} />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="body2" sx={{ px: 1, fontFamily: 'monospace', mt: 0.5 }}>
                    {formatTime(energy)}
                </Typography>
                <Typography variant="body2" sx={{ px: 1, fontFamily: 'monospace', mt: 0.5 }}>
                    {formatTime(maxEnergy)}
                </Typography>
            </Box>


            {/* Action tracker */}
            <Box sx={{ mt: 3 }}>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{taskSelected}</Typography>

                <ProgressBar value={actionProgress} colour={'#FFA366'} completeOverlay={actionOverlay} />

                <Grid container sx={{ mt: 0.5 }}>
                    <Grid item xs={4} sx={{ px: 1 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}> speed: {speed}</Typography>
                    </Grid>

                    {/* Show either click bonus or multiplier bonus if merchanting */}
                    {skillSelected !== "Merchanting" ? (
                        <Grid item xs={4} sx={{ px: 1 }}>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}> click: {click}</Typography>
                        </Grid>
                    ) : (
                        <Grid item xs={4} sx={{ px: 1 }}>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}> multiplier: {multiplier}</Typography>
                        </Grid>
                    )}

                    <Grid item xs={4} sx={{ px: 1 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}> remaining: {actionsLeft}/{taskData.actions}</Typography>
                    </Grid>
                </Grid>
            </Box>

            {/* Energy */}
            <Box sx={{ px: 1 }}>
                <Box sx={{ display: 'flex', width: '100%' }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>

                    </Typography>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Window content={content} pad />
    );
}

export default Skilling;