import React, { useMemo } from "react";
import { IMAGE } from "../config";
import { useData } from "../logic/useData";
import { usePlayer } from "../logic/usePlayer";
import { Text } from "./text";
import { Tooltip } from "./tooltip";
import { Quantity } from "./quantity";

interface EnemyProps {
    index: number;
    quantity: number;
    updated?: boolean;
}

/**
 * Enemy Component
 * - Displays an enemy icon with a tooltip, quantity, and lock state.
 */
const EnemyComponent: React.FC<EnemyProps> = ({ index, quantity, updated = false }) => {

    const enemyData = useData((state) => state.gameData.enemies[index]);
    const locked = usePlayer((state) => state.player.records.enemies[index] < 1);

    // Compute image filter based on whether item is locked or updated
    const filter = useMemo(() => {
        if (locked) return "brightness(0%) invert(25%)";
        if (updated) return "brightness(0%) invert(100%)";
        return "brightness(100%)";
    }, [locked, updated]);

    // Mouse-over tooltip
    const tooltipContent = useMemo(() => {
        if (locked) {
            return (<Text text={"???"} type="normal" colour="white" />);
        }

        return (
            <>
                <Text text={enemyData.name} type="bold" colour="white" />
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Text text={"Health: "} type="normal" colour="white" />
                    <Text text={enemyData.health.toLocaleString()} type="bold" colour="white" />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Text text={"Strength: "} type="normal" colour="white" />
                    <Text text={enemyData.strength.toLocaleString()} type="bold" colour="white" />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Text text={"Accuracy: "} type="normal" colour="white" />
                    <Text text={enemyData.accuracy.toLocaleString()} type="bold" colour="white" />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Text text={"Defence: "} type="normal" colour="white" />
                    <Text text={enemyData.defence.toLocaleString()} type="bold" colour="white" />
                </div>
            </>
        );
    }, [locked]);

    return (
        <Tooltip content={tooltipContent}>
            <div
                style={{
                    position: "relative",
                    width: "44px",
                    height: "44px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                {/* Quantity text */}
                <Quantity min={quantity} />

                {/* Enemy icon */}
                <img
                    src={`${IMAGE}enemies/${index}.png`}
                    style={{
                        filter: filter,
                        pointerEvents: "none"
                    }}
                />
            </div>
        </Tooltip>
    );
};

export const Enemy = React.memo(EnemyComponent);