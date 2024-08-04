import React from "react";
import { Typography, Box } from '@mui/material';

import logo from "../images/interface/logonew.png"

const Header = ({version}) => {
    return (
        <Box sx={{ py: 0, textAlign: 'center', mb:-1, ml:2, userSelect: 'none' }}>
            <img src={logo} alt="Logo" style={{ userSelect: 'none', pointerEvents: 'none'}} />
            <Typography variant="caption" sx={{ color: '#ffffff', fontFamily:'monospace' }}> v{version}</Typography>
        </Box>
    );
}

export default Header;