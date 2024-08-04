import React from "react";
import { Box } from '@mui/material';

import background from "../images/interface/interface.png"

const Window = ({ content, pad }) => {
    return (
        <Box sx={{
            width: '100%',  // Set a fixed width
            overflowY: 'auto', // Enable vertical scrolling
            border: '1px solid #000000',  // Black border
            boxShadow: '0 0 0 1px #ffffff, 3px 4px 0 rgba(0,0,0,0.5)',  // White border outside and box shadow
            display: 'inline-block',
            padding: pad ? (1) : (0),
            backgroundColor: '#cccccc',
            boxSizing: 'border-box',
            mb: 0,
            backgroundImage: `url(${background})`,
            backgroundSize: 'auto',
            backgroundRepeat: 'repeat'
        }}>
            {content}
        </Box>
    );
}

export default Window;