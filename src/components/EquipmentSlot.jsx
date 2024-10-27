import React from "react";
import { Box } from '@mui/material';
import Item from "./Item";

import inventoryslot from "../images/interface/inventoryslot.png";
import inventoryplaceholder from "../images/interface/inventoryplaceholder.png";
import deactivatedslot from "../images/interface/deactivatedslot.png";

const EquipmentSlot = ({ x, y, active=true, slot, icon, equipment, items, inventory, stats, sourceIndex, grabItem, placeItem }) => {
    const item = equipment ? equipment[slot] : null;

    let border = '';

    // Check if selected item belongs to equipment slot
    const selectedItem = items[inventory[sourceIndex]?.id];
    if (active && selectedItem?.slot === slot) {
        border = '0 0 0 1px #ffffff, 0 0 0 2px #000000';
    }

    return (
        <Box
            sx={{
                backgroundImage: active ? (item == null ? `url(${icon})` : `url(${inventoryslot})`) : `url(${deactivatedslot})`,
                position: 'absolute',
                top: (y*50)+10,
                left: (x*50)+10,
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
            onMouseDown={active && item != null && (() => grabItem(slot))}
            onMouseUp={active && (() => placeItem(slot))}
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

export default EquipmentSlot;