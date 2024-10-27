import React, { useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import background from "../images/interface/background.png";
import Window from './Window';

const ErrorScreen = ({ setSaveFile, saveFile, newSaveFile, loadSave }) => {
    useEffect(() => {
        loadSave();
    }, [saveFile]);

    const content = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Typography 
                variant="body1" 
                sx={{ fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'center', mb: 1 }}
            >
                Your save file is corrupted.
            </Typography>
            <Button 
                variant="contained" 
                disableRipple 
                onClick={() => setSaveFile(newSaveFile)} 
                sx={{
                    height: 28,
                    fontFamily: 'monospace',
                    fontSize: 12,
                    borderRadius: 0,
                    boxShadow: '0px 1px 0 rgba(0,0,0,0.25)',
                    backgroundColor: '#FFA093',
                    color: '#000000',
                    border: 1,
                    transition: 'none',
                    mb:0.5,
                    '&:hover': {
                        backgroundColor: '#DD968B', 
                        boxShadow: '1px 2px 0 rgba(0,0,0,0.25)', 
                    }
                }}
            >
                New Game
            </Button>
        </Box>
    );

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#555555',
                width: '100vw',
                height: '100vh',
                backgroundImage: `url(${background})`,
                backgroundSize: 'auto',
                backgroundRepeat: 'repeat',
                userSelect:'none'
            }}
        >
            <Box sx={{ width: 300, mt:2 }}>
                <Window content={content} />
            </Box>
        </Box>
    );
};

export default ErrorScreen;
