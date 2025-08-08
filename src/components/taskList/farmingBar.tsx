import React from "react";
import { IMAGE } from "../../config";
import { Text } from "../text";
import { Tooltip } from "../tooltip";
import { useFarming } from "../../logic/useFarming";
import { formatSeconds } from "../../logic/utils";

/**
 * Farming Bar Component
 * - Displays progress of crop growth.
 */
const FarmingBarComponent: React.FC<{ plot: number }> = ({ plot }) => {
    const plotTime = useFarming((s) => s.plotTimes[plot]);
    const time = plotTime?.time ?? 0;
    const maxTime = plotTime?.maxTime ?? 0;
    const boost = plotTime?.boost ?? 0;

    const boostValue = (boost && maxTime) ? (boost / maxTime) * 100 : 0;
    const value = (time && maxTime) ? (time / maxTime) * 100 : 0

    const text = `${formatSeconds(time ? time : 0)} / ${formatSeconds(maxTime ? maxTime : 0)}`;

    const depleteChance = useFarming((state) => state.depleteChance)();

    const tooltipContent = (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text text="Fertiliser boost: " type="normal" colour="white" />
                <Text text={`${formatSeconds(boost)}`} type="bold" colour="white" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text text="Average harvests: " type="normal" colour="white" />
                <Text text={`${Math.round((1 / depleteChance) * 10) / 10}`} type="bold" colour="white" />
            </div>
        </div>
    );

    return (
        <Tooltip content={tooltipContent}>
            {/* Bar Background */}
            <div style={{
                position: "relative",
                height: "10px",
                backgroundImage: `url(${IMAGE}progress/empty.png)`,
                border: "1px solid #000",
            }}>
                {/* Boost (anchored to right) */}
                <div
                    style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: `${boostValue}%`,
                        backgroundImage: `url(${IMAGE}progress/farmingboost.png)`,
                    }}
                />
                {/* Main bar (anchored to left) */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${value}%`,
                        backgroundImage: `url(${IMAGE}progress/farming.png)`,
                    }}
                />

                {/* Progress Text */}
                <div
                    style={{
                        position: "absolute",
                        top: "1px",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Text text={text} type="shadow" colour="white" />
                </div>
            </div>
        </Tooltip>
    );
};

export const FarmingBar = React.memo(FarmingBarComponent);