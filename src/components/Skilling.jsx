import React, { useState, useEffect } from "react";
import { Typography, Box, LinearProgress, Button, Grid } from '@mui/material';

import Window from "./Window";
import SkillBanner from "./SkillBanner";


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

    const ProgressBar = ({ value, colour, completeOverlay, thick }) => {
        return (
            <Box sx={{ position: 'relative', height: 'auto' }}>
                <LinearProgress
                    variant="determinate"
                    value={value}
                    classes={{ bar: 'bar' }}
                    sx={{
                        border: thick ? 1 : 0,
                        height: thick ? 12 : 6,
                        boxShadow: thick ? '0px 1px 0 rgba(0,0,0,0.25)' : '0px 1px 0 rgba(0,0,0,1), 0px -1px 0 rgba(0,0,0,1)',
                        backgroundColor: '#444444', // Background color of the progress bar
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: colour // Color of the progress bar itself
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
    const [actionOverlay, setActionOverlay] = useState(false);
    const [energyOverlay, setEnergyOverlay] = useState(false);
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

    // Calculate data for progress bars (0-100)
    const actionProgress = (actionsLeft / taskData.actions) * 100
    const energyProgress = (energy / maxEnergy) * 100;

    const content = (
        <Box sx={{ overflowY: 'hidden', userSelect: 'none' }}>

            <SkillBanner lvl={skillLvl} skill={skillSelected} xp={skillXp} lvlTable={lvlTable} selectSkill={selectSkill} />

            {/* Action tracker */}
            <Box sx={{ mt: 4, mb: 2, px: 1 }}>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{taskSelected}</Typography>

                <ProgressBar value={actionProgress} colour={'#FFA366'} completeOverlay={actionOverlay} thick />

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

            {/* Perform Action */}
            <Box sx={{ boxShadow: buttonShadow, overflowX: 'clip', }}>
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
                        height: 47,
                        mt: 2,
                        mx: '-1px',
                        width: 'calc(100% + 2px)',
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
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            px: 0.5,
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {formatTime(energy)}
                        </Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {formatTime(maxEnergy)}
                        </Typography>
                    </Box>
                </Button>
                <Box sx={{ mt: -0.2 }}>
                    <ProgressBar value={energyProgress} colour={'#82E0AF'} completeOverlay={energyOverlay} />
                </Box>
            </Box>
        </Box>
    );

    return (
        <Window content={content} />
    );
}

export default Skilling;