import React from "react";
import { Typography, Box } from '@mui/material';

const Changelog = ({ }) => {
    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold', mr: 2 }}>v1.0</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>2024-07-25</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', ml: 1 }}>
                First official release of the game. Three skills (Woodcutting, Mining, Processing), with content up to lvl 40, and 50 total items.
            </Typography>
        </>
    );
}

export default Changelog;