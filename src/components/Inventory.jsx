import React, { useState } from "react";
import { memo } from "react";
import { Grid, Box } from '@mui/material';

import Window from "./Window";
import Item from "./Item";
import EquipmentSlot from "./EquipmentSlot";

import inventoryslot from "../images/interface/inventoryslot.png";
import inventoryplaceholder from "../images/interface/inventoryplaceholder.png";
import axeslot from "../images/interface/axeslot.png";
import pickaxeslot from "../images/interface/pickaxeslot.png";
import hammerslot from "../images/interface/hammerslot.png";
import ringslot from "../images/interface/ringslot.png";
import weaponslot from "../images/interface/weaponslot.png";
import headslot from "../images/interface/headslot.png";
import torsoslot from "../images/interface/torsoslot.png";
import legsslot from "../images/interface/legsslot.png";
import neckslot from "../images/interface/neckslot.png";

const Inventory = ({ items, inventory, setInventory, equipment, setEquipment, stats, setNeedToSave, updatedItemIndices, updatedItemOverlay, removeItems, addItems, sourceIndex, setSourceIndex }) => {

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
            maxWidth: 300,
            display: 'flex',
            flexWrap: 'wrap',
            userSelect: 'none',
            maxHeight: 352,
            overflowY: 'auto',
            scrollbarGutter: 'stable',
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
            width: 264,
            height: 164,
            display: 'flex',
            flexWrap: 'wrap',
            userSelect: 'none',
            position: 'relative'
        }}>

            <EquipmentSlot x={0} y={0} slot={"axe"} icon={axeslot} equipment={equipment} items={items} inventory={inventory} stats={stats} sourceIndex={sourceIndex} grabItem={grabItem} placeItem={placeItem} />
            <EquipmentSlot x={0} y={1} slot={"pickaxe"} icon={pickaxeslot} equipment={equipment} items={items} inventory={inventory} stats={stats} sourceIndex={sourceIndex} grabItem={grabItem} placeItem={placeItem} />
            {/* <EquipmentSlot x={0} y={2} slot={"hammer"} icon={hammerslot} equipment={equipment} items={items} inventory={inventory} stats={stats} sourceIndex={sourceIndex} grabItem={grabItem} placeItem={placeItem} /> */}
            <EquipmentSlot x={2} y={1} slot={"weapon"} icon={weaponslot} equipment={equipment} items={items} inventory={inventory} stats={stats} sourceIndex={sourceIndex} grabItem={grabItem} placeItem={placeItem} />
            <EquipmentSlot x={3} y={0} slot={"head"} icon={headslot} equipment={equipment} items={items} inventory={inventory} stats={stats} sourceIndex={sourceIndex} grabItem={grabItem} placeItem={placeItem} />
            <EquipmentSlot x={3} y={1} slot={"torso"} icon={torsoslot} equipment={equipment} items={items} inventory={inventory} stats={stats} sourceIndex={sourceIndex} grabItem={grabItem} placeItem={placeItem} />
            <EquipmentSlot x={3} y={2} slot={"legs"} icon={legsslot} equipment={equipment} items={items} inventory={inventory} stats={stats} sourceIndex={sourceIndex} grabItem={grabItem} placeItem={placeItem} />
            <EquipmentSlot x={4} y={2} slot={"ring"} icon={ringslot} equipment={equipment} items={items} inventory={inventory} stats={stats} sourceIndex={sourceIndex} grabItem={grabItem} placeItem={placeItem} />
            <EquipmentSlot x={4} y={1} slot={"neck"} icon={neckslot} equipment={equipment} items={items} inventory={inventory} stats={stats} sourceIndex={sourceIndex} grabItem={grabItem} placeItem={placeItem} />
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