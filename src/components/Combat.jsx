import React, { useState, useEffect } from "react";
import { Typography, Box, LinearProgress, Button, Grid } from '@mui/material';

import EquipmentSlot from "./EquipmentSlot";
import DepthBar from "./DepthBar";

import Window from "./Window";
import SkillBanner from "./SkillBanner";
import skullicon from "../images/interface/skull.png";
import foodslot from "../images/interface/foodslot.png";
import redo from "../images/interface/redo.png";


const Combat = ({ rest, consumeFood, sourceIndex, setSourceIndex, inventory, items, kills, depth, attackTurn, health, enemy, skillXp, skillLvl, lvlTable, stats, skillSelected, selectSkill, tasks, selectTask, taskSelected, getTaskData, actionsLeft, energy, maxEnergy, actionAllowed, manualAction, enemyDamage, playerDamage }) => {

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

    const ProgressBar = ({ value, colour, completeOverlay, blockOverlay, thick, invert, width = '100%' }) => {
        return (
            <Box sx={{ position: 'relative', height: thick ? 14 : 6 }}>
                <LinearProgress
                    variant="determinate"
                    value={invert ? 100 - value : value}
                    classes={{ bar: 'bar' }}
                    sx={{
                        width: width,
                        float: invert ? 'right' : 'left',
                        border: thick ? 1 : 0,
                        height: thick ? 12 : 6,
                        boxShadow: thick ? '0px 1px 0 rgba(0,0,0,0.25)' : '0px 1px 0 rgba(0,0,0,1), 0px -1px 0 rgba(0,0,0,1)',
                        backgroundColor: invert ? (completeOverlay ? '#FFFFFF' : (blockOverlay ? '#527FEA' : colour)) : '#444444', // Background color of the progress bar
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: invert ? '#444444' : (completeOverlay ? '#FFFFFF' : (blockOverlay ? '#527FEA' : colour)), // Color of the progress bar itself
                        }
                    }}
                />
            </Box>
        );
    };

    // Calculate speed and other stats as base + bonus
    const speedNoPercent = stats[skillSelected].baseSpeed + stats[skillSelected].bonusSpeed;
    const speed = (speedNoPercent * ((stats[skillSelected].bonusSpeedPercent / 100) + 1)).toFixed(2);
    const healthNoPercent = stats[skillSelected].baseHealth + stats[skillSelected].bonusHealth;
    const maxHealth = Math.round(healthNoPercent * ((stats[skillSelected].bonusHealthPercent / 100) + 1));
    const strengthNoPercent = stats[skillSelected].baseStrength + stats[skillSelected].bonusStrength;
    const strength = (strengthNoPercent * ((stats[skillSelected].bonusStrengthPercent / 100) + 1)).toFixed(1);
    const accuracyNoPercent = stats[skillSelected].baseAccuracy + stats[skillSelected].bonusAccuracy;
    const accuracy = (accuracyNoPercent * ((stats[skillSelected].bonusAccuracyPercent / 100) + 1)).toFixed(1);
    const defenceNoPercent = stats[skillSelected].baseDefence + stats[skillSelected].bonusDefence;
    const defence = (defenceNoPercent * ((stats[skillSelected].bonusDefencePercent / 100) + 1)).toFixed(1);

    // flashing progress bars on completion
    const [energyOverlay, setEnergyOverlay] = useState(false);
    const [defeatedOverlay, setDefeatedOverlay] = useState(false);
    const [playerDead, setPlayerDead] = useState(false);
    useEffect(() => {
        if (energy === maxEnergy) {
            setEnergyOverlay(true);
            setTimeout(() => setEnergyOverlay(false), 150);
        }
    }, [energy]);
    useEffect(() => {
        if (enemy.health <= 0) {
            setDefeatedOverlay(true);
            setTimeout(() => setDefeatedOverlay(false), 250);
        }
    }, [enemy]);
    useEffect(() => {
        if (health <= 0) {
            setPlayerDead(true);
            setTimeout(() => setPlayerDead(false), 250);
        }
    }, [health]);

    const [buttonHover, setButtonHover] = useState(false);
    const [buttonActive, setButtonActive] = useState(false);
    const buttonShadow = buttonActive ? '0px 0px 0 rgba(0,0,0,0.25)' : (buttonHover ? '1px 4px 0 rgba(0,0,0,0.25)' : '0px 2px 0 rgba(0,0,0,0.25)');
    const buttonText = energy !== 0 ? (rest ? "Rest" : (attackTurn ? "Attack" : "Block")) : 'Recharge Energy';
    const buttonColour = energy !== 0 ? '#FFFFFF' : '#E8C2C2';

    // Calculate data for progress bars (0-100)
    const energyProgress = (energy / maxEnergy) * 100;
    const healthProgress = (health / maxHealth) * 100;
    const enemyHealthProgress = (enemy?.health / enemy?.maxhealth) * 100;
    const actionsProgress = (actionsLeft / 8) * 100;

    const [foodActive, setFoodActive] = useState(true);
    useEffect(() => { // Food may be used again at every rest
        setFoodActive(true);
    }, [rest]);

    const placeFood = () => {
        if (typeof sourceIndex == "number") { // item coming from inventory
            const selectedItem = inventory[sourceIndex]?.id;
            if (items[selectedItem]?.slot === "food") {
                consumeFood(selectedItem);
                setFoodActive(false);
            }
        }
        setSourceIndex(null);
    };


    const content = (
        <Box sx={{ overflowY: 'hidden', userSelect: 'none' }}>

            <SkillBanner lvl={skillLvl} skill={skillSelected} xp={skillXp} lvlTable={lvlTable} selectSkill={selectSkill} />

            {/* Action tracker */}
            <Box sx={{ mt: 4, mb: 2, px: 1 }}>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{taskSelected}</Typography>

                <DepthBar value={kills} depthSize={tasks[skillSelected][taskSelected].depthSize} />

                <Grid container sx={{ mt: 0.5 }}>
                    <Grid item xs={4} sx={{ px: 1 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}> speed: {rest ? 1 : speed}</Typography>
                    </Grid>

                    <Grid item xs={4} sx={{ px: 1 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}> depth: {depth}</Typography>
                    </Grid>

                    <Grid item xs={4} sx={{ px: 1 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}> steps: {kills}</Typography>
                    </Grid>
                </Grid>
            </Box>



            <Grid container sx={{ mt: 2, px: 1 }}>
                {/* You vs Enemy Labels */}
                <Grid container item>
                    <Grid item xs={5}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'right', fontWeight: 'bold' }}>You</Typography>
                    </Grid>
                    <Grid item xs={2} />
                    <Grid item xs={5}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'left', fontWeight: 'bold' }}>{rest ? "Rest" : enemy?.id}</Typography>
                    </Grid>
                </Grid>

                {/* Health Bars*/}
                <Grid container item>
                    <Grid item xs={5}>
                        <ProgressBar value={healthProgress} colour={'#FF566A'} completeOverlay={false} blockOverlay={enemyDamage == 0} invert thick />
                    </Grid>
                    <Grid item xs={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'left', pl: 1, minHeight: '1.4em', mt: -0.25 }} >
                            {playerDead ?
                                <Box component="img" src={skullicon} sx={{ maxHeight: '100%', objectFit: 'contain' }} />
                                :
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{enemyDamage}</Typography>
                            }
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'right', pr: 1, minHeight: '1.4em', mt: -0.25 }} >
                            {defeatedOverlay ?
                                <Box component="img" src={skullicon} sx={{ maxHeight: '100%', objectFit: 'contain' }} />
                                :
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{playerDamage}</Typography>
                            }
                        </Box>
                    </Grid>
                    <Grid item xs={5}>
                        {rest ?
                            <ProgressBar value={actionsProgress} colour={'#FFA366'} thick />
                            :
                            <ProgressBar value={enemyHealthProgress} colour={'#FF566A'} completeOverlay={defeatedOverlay} blockOverlay={playerDamage == 0} thick />
                        }
                    </Grid>
                </Grid>

                {/* Health Values */}
                <Grid container item>
                    <Grid item xs={5}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'right' }}>{health}/{maxHealth}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'center' }}>health</Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'left' }}>{rest ? (`${actionsLeft}/${8}`) : (`${enemy?.health}/${enemy?.maxhealth}`)}</Typography>
                    </Grid>
                </Grid>

                {/* Strength */}
                <Grid container item>
                    <Grid item xs={5}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'right' }}>{strength}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'center' }}>strength</Typography>
                    </Grid>
                    <Grid item xs={5}>
                        {!rest ? (
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'left' }}>{enemy?.strength}</Typography>
                        ) : (
                            <Box sx={{
                                width: 0,
                                height: 0,
                                display: 'flex',
                                flexWrap: 'wrap',
                                userSelect: 'none',
                                position: 'relative'
                            }}>
                                <EquipmentSlot x={-0.18} y={-0.05} active={foodActive} slot={"food"} icon={foodslot} equipment={null} items={items} inventory={inventory} stats={stats} sourceIndex={sourceIndex} grabItem={null} placeItem={placeFood} />
                            </Box>
                        )}
                    </Grid>
                </Grid>

                {/* Accuracy */}
                <Grid container item>
                    <Grid item xs={5}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'right' }}>{accuracy}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'center' }}>accuracy</Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'left' }}>{!rest && enemy?.accuracy}</Typography>
                    </Grid>
                </Grid>

                {/* Defence */}
                <Grid container item>
                    <Grid item xs={5}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'right' }}>{defence}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'center' }}>defence</Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'left' }}>{!rest && enemy?.defence}</Typography>
                    </Grid>
                </Grid>
            </Grid>

            {/* Perform Action */}
            <Box sx={{ boxShadow: buttonShadow, overflowX: 'clip' }}>
                <Box sx={{ boxShadow: buttonShadow, overflowX: 'clip', display: 'flex' }}>
                    <Button
                        variant="contained"
                        disableRipple
                        disabled={!actionAllowed}
                        onClick={() => manualAction(1)}
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

                    {!actionAllowed && (
                        <Button
                            variant="contained"
                            disableRipple
                            disabled={actionAllowed}
                            onClick={() => selectTask(taskSelected)}
                            sx={{
                                height: 47, // Square button, same height and width
                                maxWidth: 47,
                                minWidth: 47,
                                mx: '-1px',
                                mt: 2,
                                fontFamily: 'monospace',
                                borderRadius: 0,
                                color: '#000000',
                                backgroundColor: '#FFFFFF',
                                border: 1,
                                transition: 'none',
                                '&:hover': { backgroundColor: '#F4FAFF' },
                                '&:active': { backgroundColor: '#CCDAE2' },
                                '&:disabled': { backgroundColor: '#aaaaaa' }
                            }}
                        >
                            <Box component="img" src={redo} sx={{ maxHeight: '100%', objectFit: 'contain' }} />
                        </Button>
                    )}
                </Box>

                <Box sx={{ mt: -0.2 }}>
                    <ProgressBar value={energyProgress} colour={'#82E0AF'} completeOverlay={energyOverlay} />
                </Box>
            </Box>
        </Box >
    );

    return (
        <Window content={content} />
    );
}

export default Combat;