import React from "react";
import { memo } from "react";
import { Typography, List, ListItem, ListItemButton, LinearProgress, Divider, Box } from '@mui/material';

import Window from "./Window";


const SkillButton = ({ index, skills, skill, xp, lvl, lvlTable, skillSelected, selectSkill }) => {

    const lvlProgress = ((xp[skill] - lvlTable[lvl[skill]]) / (lvlTable[lvl[skill] + 1] - lvlTable[lvl[skill]])) * 100;

    return (
        <>
            <ListItem disablePadding sx={{ backgroundColor: skillSelected === skill ? '#BCA795' : 'transparent' }}>
                <ListItemButton onClick={() => selectSkill(skill)} disableRipple sx={{ flexDirection: 'column', alignItems: 'flex-start', p: 0 }}>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', textAlign: 'left', fontWeight: 'bold', pl: 1 }}>
                        {skill}
                    </Typography>

                    <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'left', pl: 1 }}>
                        lvl {lvl[skill]}
                    </Typography>

                    <LinearProgress
                        variant="determinate"
                        value={lvlProgress}
                        classes={{ bar: 'bar' }}
                        sx={{
                            boxShadow: '0px 1px 0 rgba(0,0,0,1), 0px -1px 0 rgba(0,0,0,1)',
                            height: 6,
                            width: '100%',
                            backgroundColor: '#444444', // Background color of the progress bar
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#6ACAD8' // Color of the progress bar itself
                            }
                        }}
                    />
                </ListItemButton>
            </ListItem>
            {index !== skills.length-1 && <Divider />}
        </>
    );
};

const Totals = ({ xp, lvl, items, unlocked }) => {
    let totalLvl = 0;
    Object.keys(lvl).forEach(skill => {
        totalLvl += lvl[skill];
    });
    let totalXp = 0;
    Object.keys(xp).forEach(skill => {
        totalXp += xp[skill];
    });
    const unlocks = unlocked.length;
    const totalUnlocks = Object.keys(items).length;


    return (
        <Box sx={{ userSelect: 'none' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'left' }}>lvls:</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'right' }}>{totalLvl}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'left' }}>xp:</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'right' }}>{totalXp}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'left' }}>unlocks:</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'right' }}>{unlocks}/{totalUnlocks}</Typography>
            </Box>
        </Box>
    );
}

const SkillList = ({ skills, xp, lvl, lvlTable, items, unlocked, skillSelected, selectSkill }) => {

    const skillList = (
        <List sx={{ m: 0, p: 0 }}>
            {skills.map((skill, index) => (
                <SkillButton key={index} index={index} skills={skills} skill={skill} xp={xp} lvl={lvl} lvlTable={lvlTable} skillSelected={skillSelected} selectSkill={selectSkill} />
            ))}
        </List>
    );

    const totals = (
        <Totals xp={xp} lvl={lvl} items={items} unlocked={unlocked} />
    )

    return (
        <>
            <Box sx={{ mb: 0.60 }}>
                <Window content={skillList} />
            </Box>
            <Window content={totals} pad />
        </>
    );
}

export default memo(SkillList);