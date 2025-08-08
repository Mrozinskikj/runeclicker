import React from "react";
import { FixedItem } from "../../types/gameTypes";
import { IMAGE } from "../../config";
import { Item } from "../item";
import { useItems } from "../../logic/useItems";

// ---------------------
// Item Slot Component
// ---------------------
export const ItemSlot: React.FC<{
    item: FixedItem | null;
    index: number;
    isSelected: boolean;
    isUpdated: boolean;
    grabItem: (index: number | string, event: React.MouseEvent) => void;
    itemMouseEnter: (index: number | string) => void;
    itemMouseLeave: () => void;
}> = React.memo(
    ({ item, index, isSelected, isUpdated, grabItem, itemMouseEnter, itemMouseLeave }) => {
        const placeItem = useItems((state) => state.placeItem);

        return (
            <div
                style={{
                    backgroundImage: `url(${IMAGE}slots/background.png)`,
                    width: "44px",
                    height: "44px",
                }}
                onMouseDown={(e) => grabItem(index, e)}
                onMouseUp={() => placeItem(index)}
                onMouseEnter={() => itemMouseEnter(index)}
                onMouseLeave={() => itemMouseLeave()}
            >
                {item !== null && !isSelected && (
                    <Item index={item.id} quantity={item.quantity} updated={isUpdated} />
                )}
            </div >
        );
    }
);