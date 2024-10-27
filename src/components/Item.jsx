import React from "react";
import { Typography, Tooltip, Box } from '@mui/material';
import Fade from '@mui/material/Fade';

const Item = ({ itemData, itemName, quantity, proportion, stats, updated, locked, hideIcon }) => {

    const formatNumber = (number) => {
        let textColour = '#ffffff';
        let formatted = String(number);

        // Format the item quantities
        if (number >= 10000000) {
            formatted = formatted.slice(0, -6) + "m"
            textColour = '#51F07C';
        } else if (number >= 100000) {
            formatted = formatted.slice(0, -3) + "k"
            textColour = '#B5FFCA';
        }

        return (
            { formatted: formatted, textColour: textColour }
        );
    }

    // calculate item value based on merchanting lvl
    const multiplierNoPercent = stats['Merchanting'].baseMultiplier + stats['Merchanting'].bonusMultiplier;
    const multiplier = (multiplierNoPercent * ((stats['Merchanting'].bonusMultiplier / 100) + 1)).toFixed(2);
    const value = Math.floor(itemData.value * multiplier);

    let textColour = '#ffffff';
    let quantityFormatted;

    // Show both quantities if they are a range or proportion
    if (Array.isArray(quantity)) {
        const { formatted: lowerQuantityFormatted, textColour: lowerTextColour } = formatNumber(quantity[0]);
        const { formatted: upperQuantityFormatted, textColour: upperTextColour } = formatNumber(quantity[1]);

        // Display range, or single value if no range
        if (proportion) {
            quantityFormatted = `${lowerQuantityFormatted}/${upperQuantityFormatted}`;

            // if the quantities are a proportion, text colour changes if insufficient items
            const insufficient = quantity[1] > quantity[0];
            if (insufficient) {
                textColour = '#FF7E70';
            }
        } else {
            quantityFormatted = `${lowerQuantityFormatted}-${upperQuantityFormatted}`;
            if (lowerQuantityFormatted === upperQuantityFormatted) {
                quantityFormatted = lowerQuantityFormatted;
            }
        }
    }
    // Show a single quantity if not a range or proportion 
    else {
        const { formatted: singleQuantityFormatted, textColour: singleTextColour } = formatNumber(quantity);
        quantityFormatted = singleQuantityFormatted;
        textColour = singleTextColour;
    }

    // Hide quantity if only 1 or no quantity specified
    if (quantityFormatted === "1" || !quantity) {
        quantityFormatted = "";
    }

    // Item flashes white if it is tagged as updated
    let filter = 'brightness(100%)';
    if (updated) {
        filter = 'brightness(0%) invert(100%)';
    }

    const border = '0 0 1px #000000, '.repeat(10).slice(0, -2);

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
                            {itemData.description && (
                                <Box sx={{}}>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontStyle: 'italic' }}>
                                        {itemData.description}
                                    </Typography>
                                </Box>
                            )}

                            {/* crafting material */}
                            {itemData.crafting && (
                                <Box sx={{}}>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontStyle: 'italic' }}>
                                        ingredient
                                    </Typography>
                                </Box>
                            )}

                            {/* value */}
                            {itemData?.value && (
                                <Box sx={{}}>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                        value:
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', pl: 1, fontWeight: 'bold', color: '#F2E259' }}>
                                        {value.toLocaleString()}
                                    </Typography>
                                </Box>
                            )}

                            {/* heal */}
                            {itemData?.heal && (
                                <Box sx={{}}>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                        heal:
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', pl: 1, fontWeight: 'bold', color: '#3BCC4C' }}>
                                        +{itemData.heal.toLocaleString()}
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
                                                    {property.endsWith("Percent") ? property.slice(0, -7) : property}:
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontFamily: 'monospace', pl: 1, fontWeight: 'bold', color: value >= 0 ? '#3BCC4C' : '#C13E3E' }}>
                                                    {value >= 0 && "+"}{value}{property.endsWith("Percent") && "%"}
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
                <img src={`${process.env.PUBLIC_URL}/gameData/images/items/${itemData?.image}`} alt="" style={{ userSelect: 'none', pointerEvents: 'none', filter: (locked || hideIcon) ? 'brightness(0%) invert(25%)' : filter }} />

                {/* Item Quantity */}
                {quantity !== 1 && (
                    quantityFormatted.length < 8 ? (
                        <Typography variant="caption" sx={{
                            position: 'absolute',
                            display: 'flex',
                            top: -7,
                            left: -3,
                            fontFamily: 'monospace',
                            userSelect: 'none',
                            color: textColour,
                            textShadow: border
                        }}>
                            {quantityFormatted}
                        </Typography>
                    ) : (
                        // If too long, split over 2 lines
                        <>
                            <Typography variant="caption" sx={{
                                position: 'absolute',
                                display: 'flex',
                                top: -7,
                                left: -3,
                                fontFamily: 'monospace',
                                userSelect: 'none',
                                color: textColour,
                                textShadow: border
                            }}>
                                {formatNumber(quantity[0]).formatted}
                            </Typography>
                            <Typography variant="caption" sx={{
                                position: 'absolute',
                                display: 'flex',
                                top: 2,
                                left: -3,
                                fontFamily: 'monospace',
                                userSelect: 'none',
                                color: textColour,
                                textShadow: border
                            }}>
                                /{formatNumber(quantity[1]).formatted}
                            </Typography>
                        </>
                    ))}
            </Box>
        </Tooltip >
    );
}

export default Item;