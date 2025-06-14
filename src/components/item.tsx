import React, { useMemo } from "react";
import { IMAGE } from "../config";
import { useData } from "../logic/useData";
import { usePlayer } from "../logic/usePlayer";
import { Text } from "./text";
import { Tooltip } from "./tooltip";
import { Quantity } from "./quantity";
import { useItems } from "../logic/useItems";

/**
 * Item Component
 * - Displays an item with a tooltip, quantity, and lock state.
 */
const ItemComponent: React.FC<{
    index: number;
    quantity: number;
    quantityMax?: number;
    cost?: number;
    updated?: boolean;
    overrideShowTooltip?: boolean;
}> = ({ index, quantity, quantityMax, cost, updated = false, overrideShowTooltip = false }) => {

    const itemData = useData((state) => state.gameData.items[index]);
    const locked = usePlayer((state) => state.player.records.items[index] < 1);

    // Compute image filter based on whether item is locked or updated
    const filter = useMemo(() => {
        if (locked) return "brightness(0%) invert(25%)";
        if (updated) return "brightness(0%) invert(100%)";
        return "brightness(100%)";
    }, [locked, updated]);

    // Mouse-over tooltip
    const tooltipContent = useMemo(() => {
        if (locked && !overrideShowTooltip) {
            return (<Text text={"???"} type="normal" colour="white" />);
        }

        return (
            <>
                {/* Item Name */}
                <Text text={itemData.name} type="bold" colour="white" />

                {/* Item Quantity */}
                {!cost ? (
                    quantity > 1 && (
                        <Text
                            text={`x${quantity.toLocaleString()}`}
                            type="small"
                            colour={quantity >= 10_000_000 ? "green2" : quantity >= 100_000 ? "green" : "white"}
                        />
                    )
                ) : (
                    <Text
                        text={`x${quantity.toLocaleString()}/${cost.toLocaleString()}`}
                        type="small"
                        colour={quantity < cost ? "red" : (quantity >= 10_000_000 ? "green2" : quantity >= 100_000 ? "green" : "white")}
                    />
                )}

                {/* Description */}
                {itemData.description && (
                    <Text text={itemData.description} type="normal" colour="white" />
                )}

                {/* Crafting Ingredient Indicator */}
                {itemData.crafting && (
                    <Text text={"Ingredient"} type="normal" colour="white" />
                )}

                {/* Item Value */}
                {itemData.value !== 0 && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Text text={"Value: "} type="normal" colour="white" />
                        <Text text={useItems.getState().calculateValue(index).toLocaleString()} type="bold" colour="yellow" />
                    </div>
                )}

                {/* Storage space */}
                {itemData.space && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Text text={"Space: "} type="normal" colour="white" />
                        <Text text={`+${itemData.space}`} type="bold" colour="green2" />
                    </div>
                )}

                {/* Heal */}
                {itemData.heal && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Text text={"Heal: "} type="normal" colour="white" />
                        <Text text={`+${itemData.heal}`} type="bold" colour="green2" />
                    </div>
                )}

                {/* Item Bonuses */}
                {itemData.bonus && (
                    Object.entries(itemData.bonus).map(([skill, bonuses]) => (
                        <div key={skill} style={{ marginTop: "6px" }}>
                            {/* Skill Name */}
                            <Text text={skill} type="bold" colour="white" />

                            {/* Bonus Details */}
                            {Object.entries(bonuses).map(([stat, bonus]) => (
                                <div key={stat} style={{ display: "flex" }}>
                                    {/* Bonus Type (Stat) */}
                                    <Text text={`• ${stat}: `} type="normal" colour="white" />

                                    {/* Bonus Value */}
                                    <Text
                                        text={`${bonus.absolute ? `${bonus.absolute > 0 ? `+${bonus.absolute}` : bonus.absolute}` : ""
                                            }${bonus.percent ? `${bonus.percent > 0 ? `+${bonus.percent}%` : bonus.percent + "%"}` : ""
                                            }`}
                                        type="bold"
                                        colour={bonus.absolute && bonus.absolute < 0 || bonus.percent && bonus.percent < 0 ? "red" : "green2"}
                                    />
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </>
        );
    }, [locked, itemData, quantity]);

    return (
        <Tooltip content={tooltipContent}>
            <div
                style={{
                    position: "relative",
                    width: "44px",
                    height: "44px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {/* Quantity text */}
                <Quantity min={quantity} max={quantityMax} cost={cost} />

                {/* Item icon */}
                <img
                    src={`${IMAGE}items/${index}.png`}
                    style={{
                        filter: filter,
                        pointerEvents: "none"
                    }}
                />
            </div>
        </Tooltip>
    );
};

export const Item = React.memo(ItemComponent);