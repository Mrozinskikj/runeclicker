import React from "react";
import { Typography, TextField, Button, Box } from '@mui/material';

import Window from "./Window";
import Changelog from "./Changelog";

const Settings = ({ version, saveFile, setSaveFile, newSaveFile, loadSave, addMessage }) => {

    const handleSaveFileChange = (event) => {
        const newValue = event.target.value;
        setSaveFile(newValue);
    }

    const handleLoadSave = () => {
        try {
            loadSave();
            addMessage("Save file loaded.");
        } catch {
            addMessage("Save file invalid.");
        }
    }

    const content = (
        <>
            <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}> runeclicker v{version} </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}> code and graphics by <a href="http://www.kmroz.com">krzysztof mrozinski</a>.</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}> source code available <a href="https://github.com/Mrozinskikj/runeclicker">here</a>.</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}> changelog </Typography>
                <Box sx={{ maxHeight: 160, border: 1, p: 0.5, overflowY:'auto' }}>
                    <Changelog />
                </Box>
            </Box>

            <Box>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}> save file </Typography>
                <TextField
                    multiline
                    maxRows={6}
                    fullWidth
                    value={saveFile}
                    onChange={handleSaveFileChange}
                    sx={{
                        backgroundColor: '#ffffff',
                        p: 0,
                        m: 0,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                        },
                        '& .MuiInputBase-root': {
                            p: 0,
                        },
                        '& .MuiInputBase-input': {
                            color: '#000000',
                            fontSize: '14px',
                            lineHeight: 1.5,
                            m: 0,
                            p: 1,
                            fontFamily: 'monospace',
                        }
                    }}
                />
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="contained" disableRipple onClick={() => handleLoadSave()} sx={{
                        height: 28,
                        fontFamily: 'monospace',
                        fontSize: 12,
                        borderRadius: 0,
                        boxShadow: '0px 1px 0 rgba(0,0,0,0.25)',
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        border: 1,
                        transition: 'none',
                        '&:hover': {
                            backgroundColor: '#F4FAFF', // Change the background color when hovered
                            boxShadow: '1px 2px 0 rgba(0,0,0,0.25)', // Add a subtle shadow when hovered
                        }
                    }}>Apply</Button>
                    <Button variant="contained" disableRipple onClick={() => setSaveFile(newSaveFile)} sx={{
                        height: 28,
                        fontFamily: 'monospace',
                        fontSize: 12,
                        borderRadius: 0,
                        boxShadow: '0px 1px 0 rgba(0,0,0,0.25)',
                        backgroundColor: '#FFA093',
                        color: '#000000',
                        border: 1,
                        transition: 'none',
                        '&:hover': {
                            backgroundColor: '#DD968B', // Change the background color when hovered
                            boxShadow: '1px 2px 0 rgba(0,0,0,0.25)', // Add a subtle shadow when hovered
                        }
                    }}>New Game</Button>
                </Box>
            </Box>
        </>
    );

    return (
        <Window content={content} pad />
    );
}

export default Settings;