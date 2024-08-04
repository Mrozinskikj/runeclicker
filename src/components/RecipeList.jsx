import React from "react";
import { Typography, List, ListItem, ListItemButton, Divider, Box } from '@mui/material';

import Window from "./Window";
import Item from "./Item";

const RecipeList = ({ skillLvl, recipes, items, inventoryItems, unlockedItems, selectTask, checkSufficientIngredients }) => {

    const TaskButton = ({ recipeName, recipeData, index }) => {

        const unlocked = skillLvl["Processing"] >= recipeData.lvl;
        const hideIcon = !unlockedItems.includes(recipeName);

        // Button only enabled if every ingredient sufficient
        const sufficient = checkSufficientIngredients(recipeData);

        return (
            <>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => sufficient && selectTask(recipeName, recipeData)}
                        disabled={!unlocked}
                        disableRipple
                        sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', p: 0, width: '100%', cursor: sufficient ? 'pointer' : 'default', transition: 'none' }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', pl: 0.5, pr: 1 }}>
                            {/* Icon */}
                            <Item itemData={items[recipeName]} itemName={recipeName} locked={!unlocked} hideIcon={hideIcon} />

                            {/* Title */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pl: 1 }}>
                                <Typography variant="body1" sx={{ fontFamily: 'monospace', textAlign: 'left', fontWeight: 'bold', color: sufficient || !unlocked ? '#000000' : '#C13E3E' }}>
                                    {unlocked ? (
                                        recipeName
                                    ) : (
                                        "???"
                                    )}
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, pr: 1, mt:-0.1 }}>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'left' }}>
                                        lvl {recipeData.lvl}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Ingredients */}
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', pr: 1 }}>
                            {unlocked ? (
                                <>
                                    {recipeData.ingredients.map((ingredient, index) => (
                                        <Box key={index} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', pr: 3 }}>
                                            {/* Item Icon */}
                                            <Item
                                                itemData={items[ingredient.id]}
                                                itemName={ingredient.id}
                                                quantity={`${inventoryItems.find(item => item?.id === ingredient.id)?.quantity ?? 0}/${ingredient.quantity}`}
                                                insufficient={(inventoryItems.find(item => item?.id === ingredient.id)?.quantity ?? 0) < ingredient.quantity}
                                                locked={!unlockedItems.includes(ingredient.id)}
                                            />
                                        </Box>
                                    ))}

                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', textAlign: 'left' }}>
                                        {recipeData.xpReward} xp
                                    </Typography>
                                </>
                            ) : (
                                <></>
                            )}
                        </Box>
                    </ListItemButton>
                </ListItem>

                {index !== recipes.length - 1 && (
                    <Divider />
                )}
            </>
        );
    };

    const content = (
        <List sx={{ m: 0, p: 0, maxHeight:352 }}>
            {Object.keys(recipes).map((recipeName, index) => (
                <TaskButton key={index} recipeName={recipeName} recipeData={recipes[recipeName]} index={index} />
            ))}
        </List>
    );

    return (
        <Window content={content} />
    );
}

export default RecipeList;