import React from "react";
import { Typography, Tooltip, Box } from '@mui/material';
import Fade from '@mui/material/Fade';

const Item = ({ itemData, itemName, quantity, insufficient, updated, locked, hideIcon }) => {

    let textColour = '#ffffff';
    if (insufficient) {
        textColour = '#FF7E70'
    }

    let filter = 'brightness(100%)';
    if (updated) {
        filter = 'brightness(0%) invert(100%)';
    }

    const border = '0 0 1px #000000, '.repeat(10).slice(0, -2);

    // Format the item quantity
    let quantityFormatted = String(quantity ?? "");
    if (quantity >= 100000) {
        quantityFormatted = quantityFormatted.slice(0, -3) + "k"
    }

    return (
        <Tooltip
            title={
                <Box sx={{ border: '1px solid #ffffff', boxShadow: '1px 2px 0 rgba(0,0,0,0.5)', backgroundColor: '#000000', px: 0.5, mt: 2, ml: 1 }}>
                    {locked ? (
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            ???
                        </Typography>
                    ) : (
                        <>
                            {/* name */}
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                                {itemName}
                            </Typography>

                            {/* crafting material */}
                            {itemData.crafting && (
                                <Box sx={{}}>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontStyle: 'italic' }}>
                                        ingredient
                                    </Typography>
                                </Box>
                            )}

                            {/* bonus */}
                            {itemData?.bonus && (
                                Object.entries(itemData.bonus).map(([skill, bonus]) => (
                                    <React.Fragment key={skill}>
                                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                            {skill}
                                        </Typography>

                                        {Object.entries(bonus).map(([property, value]) => (
                                            <Box key={property} sx={{ mt: -0.5 }}>
                                                <Typography variant="caption" sx={{ fontFamily: 'monospace', pl: 2 }}>
                                                    {(property === "speed" || property === "speedPercent") ? "speed" : "click"}:
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontFamily: 'monospace', pl: 1, fontWeight: 'bold', color: value >= 0 ? '#3BCC4C' : '#C13E3E' }}>
                                                    {value >= 0 && "+"}{value}{(property === "speedPercent" || property === "clickPercent") && "%"}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </React.Fragment>
                                )
                                )
                            )}
                        </>
                    )}
                </Box >
            }
            placement="bottom-start"
            followCursor
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 0 }}
            componentsProps={{
                tooltip: {
                    sx: {
                        backgroundColor: 'transparent', // Make background transparent
                        boxShadow: 'none', // Remove shadow
                        padding: 0, // Remove padding around the box
                        '& .MuiTooltip-arrow': {
                            color: 'transparent', // Hide the arrow or make it transparent
                        }
                    }
                }
            }}
        >
            <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>

                {/* Item Icon */}
                <img src={`./gameData/images/items/${itemData?.image}`} alt="" style={{ userSelect: 'none', pointerEvents: 'none', filter: (locked || hideIcon) ? 'brightness(0%) invert(25%)' : filter }} />

                {/* Item Quantity */}
                {quantity !== 1 && (
                    <Typography variant="caption" sx={{
                        position: 'absolute',
                        display: 'flex',
                        top: -8,
                        left: -3,
                        fontFamily: 'monospace',
                        userSelect: 'none',
                        color: textColour,
                        textShadow: border
                    }}>
                        {quantityFormatted}
                    </Typography>
                )}
            </Box>
        </Tooltip >
    );
}

export default Item;