import React from "react";
import { Typography, Box } from '@mui/material';

const Changelog = ({ }) => {
    return (
        <>
            <>
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold', mr: 2 }}>v1.1</Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>2024-08-22</Typography>
                </Box>

                <Typography variant="body2" sx={{ fontFamily: 'monospace', ml: -2, mt: -2 }}>
                    <ul>
                        <li>Added Merchanting skill. Items may be sold for coins. Item value dependent on Merchanting lvl.</li>
                        <li>Added Energy system and skill. Tasks are automatic until Energy depletes, requiring manual action to recharge. Maximum Energy capacity is levelled with coins.</li>
                        <li>Added Auto Task system. When unlocked, active tasks can be performed offline until Energy depletes.</li>
                        <li>Various interface improvements, and codebase refactoring.</li>
                    </ul>
                </Typography>
            </>

            <>
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold', mr: 2 }}>v1.0</Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>2024-07-25</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', ml: -2, mt: -2 }}>
                    <ul>
                        <li>First official release of the game. Three skills (Woodcutting, Mining, Processing), with content up to lvl 40, and 50 total items.</li>
                    </ul>
                </Typography>
            </>
        </>
    );
}

export default Changelog;