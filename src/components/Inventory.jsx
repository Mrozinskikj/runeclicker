import React, { useState } from "react";
import { memo } from "react";
import { Grid, Box } from '@mui/material';

import Window from "./Window";
import Item from "./Item";

import inventoryslot from "../images/interface/inventoryslot.png";
import inventoryplaceholder from "../images/interface/inventoryplaceholder.png";
import axeslot from "../images/interface/axeslot.png";
import pickaxeslot from "../images/interface/pickaxeslot.png";
import ringslot from "../images/interface/ringslot.png";

const EquipmentSlot = ({ top, left, slot, icon, equipment, items, inventory, stats, sourceIndex, grabItem, placeItem }) => {
    const item = equipment[slot];

    let border = '';

    // Check if selected item belongs to equipment slot
    const selectedItem = items[inventory[sourceIndex]?.id];
    if (selectedItem?.slot === slot) {
        border = '0 0 0 1px #ffffff, 0 0 0 2px #000000';
    }

    return (
        <Box
            sx={{
                backgroundImage: item == null ? `url(${icon})` : `url(${inventoryslot})`,
                position: 'absolute',
                top: top,
                left: left,
                backgroundRepeat: 'no-repeat',
                width: 44,
                height: 44,
                boxSizing: 'border-box',
                margin: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: '0 1 auto',
                cursor: sourceIndex != null ? 'grab' : 'default',
                boxShadow: border
            }}
            onMouseDown={item != null ? () => grabItem(slot) : undefined}
            onMouseUp={() => placeItem(slot)}
        >
            {/* Only display item if there is an item in given slot */}
            {item != null ? (
                // Display item if not currently being dragged
                sourceIndex !== slot ? (
                    <Item itemData={items[item]} itemName={item} quantity={1} stats={stats} updated={false} />
                ) : (
                    // Display placeholder if currently being dragged
                    <img src={inventoryplaceholder} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} />
                )
            ) : null}
        </Box>
    );
}

const Inventory = ({ items, inventory, setInventory, equipment, setEquipment, stats, setNeedToSave, updatedItemIndices, updatedItemOverlay, removeItems, addItems }) => {

    const [sourceIndex, setSourceIndex] = useState(null);

    const grabItem = (index) => {
        setSourceIndex(index);
    };

    const placeItem = (destinationIndex) => {

        if (sourceIndex == null) {
            return;
        }

        // Placing into inventory
        if (typeof destinationIndex == "number") {
            // from inventory to inventory - swap items
            if (typeof sourceIndex == "number") {
                const newItems = Array.from(inventory);
                let temp = newItems[sourceIndex];
                newItems[sourceIndex] = newItems[destinationIndex];
                newItems[destinationIndex] = temp;
                setInventory(newItems);
            }
            // from equipment to inventory - remove from equipment, add to inventory
            else {
                addItems([{ id: equipment[sourceIndex], quantity: [1, 1], probability: 1, index: destinationIndex }], 1);
                setEquipment((prevItems) => ({
                    ...prevItems,
                    [sourceIndex]: null
                }));
            }
        }

        // Placing into equipment
        else {
            // Check if selected item belongs to equipment slot
            const selectedItem = inventory[sourceIndex]?.id;
            if (items[selectedItem]?.slot === destinationIndex) {
                // Replace item if equipment slot filled
                if (equipment[destinationIndex] !== null) {
                    addItems([{ id: equipment[destinationIndex], quantity: [1, 1], probability: 1 }], 1);
                }

                // Place item into equipment slot
                setEquipment((prevItems) => ({
                    ...prevItems,
                    [destinationIndex]: selectedItem
                }));
                removeItems([{ id: selectedItem, quantity: 1 }], 1);
            }
        }

        setSourceIndex(null);
        // save game
        setNeedToSave(true);
    };

    const inventoryGrid = (
        <Grid container spacing={0} sx={{
            width: 'auto',
            maxWidth: 264,
            display: 'flex',
            flexWrap: 'wrap',
            userSelect: 'none'
        }}>
            {inventory.map((item, index) => (
                <Grid
                    key={index}
                    item
                    sx={{
                        backgroundImage: `url(${inventoryslot})`,
                        backgroundRepeat: 'no-repeat',
                        width: 44,
                        height: 44,
                        boxSizing: 'border-box',
                        margin: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: '0 1 auto',
                        position: 'relative',
                        cursor: sourceIndex != null ? 'grab' : 'default'
                    }}
                    onMouseDown={item != null ? () => grabItem(index) : undefined}
                    onMouseUp={() => placeItem(index)}
                >
                    {/* Only display item if there is an item in given slot */}
                    {item != null ? (
                        // Display item if not currently being dragged
                        sourceIndex !== index ? (
                            <Item itemData={items[item.id]} itemName={item.id} quantity={item.quantity} stats={stats} updated={updatedItemIndices.includes(index) && updatedItemOverlay} />
                        ) : (
                            // Display placeholder if currently being dragged
                            <img src={inventoryplaceholder} alt="" style={{ userSelect: 'none', pointerEvents: 'none' }} />
                        )
                    ) : null}
                </Grid>
            ))}
        </Grid>
    );

    const equipmentGrid = (
        <Box sx={{
            width: 'auto',
            maxWidth: 264,
            height: 56,
            display: 'flex',
            flexWrap: 'wrap',
            userSelect: 'none',
            position: 'relative'
        }}>

            <EquipmentSlot top={6} left={34} slot={"axe"} icon={axeslot} equipment={equipment} items={items} inventory={inventory} stats={stats} sourceIndex={sourceIndex} grabItem={grabItem} placeItem={placeItem} />
            <EquipmentSlot top={6} left={110} slot={"pickaxe"} icon={pickaxeslot} equipment={equipment} items={items} inventory={inventory} stats={stats} sourceIndex={sourceIndex} grabItem={grabItem} placeItem={placeItem} />
            <EquipmentSlot top={6} left={186} slot={"ring"} icon={ringslot} equipment={equipment} items={items} inventory={inventory} stats={stats} sourceIndex={sourceIndex} grabItem={grabItem} placeItem={placeItem} />

        </Box>
    );

    return (
        <>
            <Box sx={{ mb: 0.60 }}>
                <Window content={inventoryGrid} />
            </Box>
            <Window content={equipmentGrid} />
        </>
    );
}

export default memo(Inventory);