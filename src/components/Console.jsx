import React from "react";
import { Typography, Box } from '@mui/material';

import Window from "./Window";

const Console = ({ messages, messagesEndRef }) => {
    const content = (
        <Box sx={{height:154}}>
            {messages.map((message, index) => (
                <Typography variant="body2" key={index} sx={{ fontFamily: 'monospace', textAlign: 'left', p: 0, lineHeight: 2 }}>
                    {message}
                </Typography>
            ))}
            <div ref={messagesEndRef} />
        </Box>
    );

    return (
        <Window content={content} pad />
    );
}

export default Console;