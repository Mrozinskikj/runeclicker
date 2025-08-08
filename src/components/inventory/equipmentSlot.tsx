import React from "react";
import { FixedItem } from "../../types/gameTypes";
import { IMAGE } from "../../config";
import { Item } from "../item";
import { useItems } from "../../logic/useItems";
import { Tooltip } from "../tooltip";

// ---------------------
// Equipment Slot Component
// ---------------------
export const EquipmentSlot: React.FC<{
    x: number;
    y: number;
    item: FixedItem | null;
    slot: string;
    isSelected: boolean;
    highlighted: boolean;
    active?: boolean;
    tooltip?: React.ReactNode;
    grabItem?: (index: number | string, event: React.MouseEvent) => void;
    itemMouseEnter?: (index: number | string) => void;
    itemMouseLeave?: () => void;
}> = React.memo(
    ({
        x,
        y,
        item,
        slot,
        isSelected,
        highlighted,
        active = true,
        tooltip = null,
        grabItem = () => { },
        itemMouseEnter = () => { },
        itemMouseLeave = () => { }
    }) => {
        const placeItem = useItems((state) => state.placeItem);

        return (
            <div
                style={{
                    position: "absolute",
                    top: y,
                    left: x,
                    backgroundImage: `url(${IMAGE}slots/background.png)`,
                    width: "44px",
                    height: "44px",
                    boxShadow: active && highlighted ? "0 0 0 1px #ffffff, 0 0 0 2px #000000" : "none"
                }}
                onMouseDown={(e) => grabItem(slot, e)}
                onMouseUp={() => placeItem(slot)}
                onMouseEnter={() => itemMouseEnter(slot)}
                onMouseLeave={() => itemMouseLeave()}
            >
                <Tooltip content={tooltip}>
                    {item !== null && !isSelected ? (
                        <Item index={item.id} quantity={item.quantity} updated={false} />
                    ) : (
                        <img
                            src={active ? `${IMAGE}slots/${slot}.png` : `${IMAGE}slots/inactive.png`}
                            style={{ pointerEvents: "none" }}
                        />
                    )}
                </Tooltip>
            </div>
        );
    }
);