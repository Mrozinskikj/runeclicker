import React from "react";
import { Box, LinearProgress } from '@mui/material';

import tickicon from "../images/interface/tick.png";

const DepthBar = ({ value, depthSize }) => {

    // Define the sections with their start and end values and colors
    const sections = [
        { start: 0, end: depthSize - 1, color: '#7DDB60' }, // Green
        { start: depthSize - 1, end: depthSize, color: '#444444' },
        { start: depthSize, end: (depthSize * 2) - 1, color: '#FFF160' }, // Yellow
        { start: (depthSize * 2) - 1, end: depthSize * 2, color: '#444444' },
        { start: depthSize * 2, end: (depthSize * 3) - 1, color: '#FF9347' }, // Orange
        { start: (depthSize * 3) - 1, end: depthSize * 3, color: '#444444' },
        { start: depthSize * 3, end: depthSize * 4, color: '#EA4444' }, // Red
    ];

    // If the value is higher than the maximum, scale the gradient accordingly
    const scaledValue = Math.max(value, sections[sections.length - 1].end);

    // Function to generate gradient background
    const generateGradient = (sections, scaledValue) => {
        const gradientColors = [];
        sections.forEach((section) => {
            const startPercent = (section.start / scaledValue) * 100;
            const endPercent = (section.end / scaledValue) * 100;
            gradientColors.push(`${section.color} ${startPercent}%`);
            gradientColors.push(`${section.color} ${endPercent}%`);
        });
        // Extend the last color to 100% if necessary
        const lastSectionEnd = (sections[sections.length - 1].end / scaledValue) * 100;
        if (lastSectionEnd < 100) {
            gradientColors.push(`${sections[sections.length - 1].color} 100%`);
        }
        return `linear-gradient(to right, ${gradientColors.join(', ')})`;
    };

    // Generate the gradient background
    const gradientBackground = generateGradient(sections, scaledValue);

    // Calculate the percentage for the tick position based on the value
    const tickPosition = `${(value / scaledValue) * 100}%`;

    // Generate tick marks for every whole number
    const tickMarks = Array.from({ length: Math.ceil(scaledValue) }, (_, index) => {
        const tickMarkPosition = (index / scaledValue) * 100;
        return (
            <Box
                key={index}
                sx={{
                    position: 'absolute',
                    left: `${tickMarkPosition}%`,
                    top: '0',
                    bottom: '0',
                    width: '1px',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    zIndex: 0,
                }}
            />
        );
    });

    // Styles for the progress bar and overlays
    const progressBarStyles = {
        boxShadow: '0px 1px 0 rgba(0,0,0,0.25)',
        border: 1,
        height: 12,
        background: gradientBackground,
        position: 'relative',
    };

    const overlayStyles = {
        position: 'absolute',
        top: 0,
        left: tickPosition,
        right: 0,
        bottom: 0,
        backgroundColor: '#444444',
        opacity: 0.6,
    };

    const tickStyles = {
        position: 'absolute',
        top: '50%',
        left: tickPosition,
        transform: 'translateX(-50%) translateY(-50%)',
        width: 'auto',
        height: 'auto',
        zIndex: 1,
    };

    return (
        <Box sx={{ position: 'relative', height: 'auto', width:'100%' }}>
            <LinearProgress
                variant="determinate"
                value={0}
                sx={progressBarStyles}
            />

            {tickMarks}

            {/* Incomplete overlay */}
            <Box sx={overlayStyles} />

            {/* Tick to represent the current value */}
            <Box component="img" src={tickicon} sx={tickStyles} />
        </Box>
    );
};

export default DepthBar;