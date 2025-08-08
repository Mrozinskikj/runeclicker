import React, { useState, useEffect } from "react";
import { useTask } from "../../logic/useTask";
import { usePlayer } from "../../logic/usePlayer";
import { useData } from "../../logic/useData";
import { Text } from "../text";
import { TaskIcon } from "./taskIcon";
import { IMAGE } from "../../config";
import { useFarming } from "../../logic/useFarming";
import { FarmingBar } from "./farmingBar";
import { FractionItem } from "../fractionItem";
import { Item } from "../item";
import { useItems } from "../../logic/useItems";
import { useStats } from "../../logic/useStats";

/**
 * FarmingItem Task Item Component
 * - Takes plot index to derive the data and render a farming item.
 */
export const FarmingItem: React.FC<{
    plot: number;
    active?: boolean;
}> = ({ plot, active = false }) => {
    const selectTask = useTask((s) => s.selectTask);
    const plotLvls = useData((s) => s.gameData.farming.plotLvls);
    const plotState = useFarming((s) => s.getPlotState)(plot);
    const plotData = usePlayer((s) => s.player.plots[plot]);
    void useFarming((s) => s.plotTimes[plot]);
    const expandPlots = useFarming((s) => s.expandPlots);
    const plotsLen = usePlayer((s) => s.player.plots.length);
    const updatedItems = useItems((state) => state.updatedItems);
    const getItemProbability = useItems((state) => state.getItemProbability);
    const cropData = useData((s) => s.gameData.farming.cropData);
    const calculateXp = useFarming((s) => s.calculateXp)

    const unlockedTasks = useStats((state) => state.unlockedTasks);
    const unlockedTask = unlockedTasks.some(unlock => unlock.skill === "Farming" && unlock.task === plot);
    const removeUnlockedTask = useStats((state) => state.removeUnlockedTask);

    const [hover, setHover] = useState(false);

    useEffect(() => {
        if (plot >= plotsLen) {
            expandPlots(plot);
        }
    }, [plot, plotsLen, expandPlots]);
    if (!plotData) {
        return null;
    }

    const cropName = plotData.seed != null ? cropData[plotData.seed].name : "";
    const xpReward = plotData.seed && calculateXp(plot);
    const output = plotData.seed && cropData[plotData.seed].output;

    const titleText = plotState == "empty" ? "Empty Plot" : cropName;
    const icon = plotState == "empty" ? "empty" : plotState == "growing" ? `${plotData.seed}growing` : plotData.seed;

    const bgNormal = `url(${IMAGE}backgrounds/interface.png)`;
    const bgHighlighted = `url(${IMAGE}backgrounds/interfacehighlighted.png)`;
    const bgLocked = `url(${IMAGE}backgrounds/interfacelocked.png)`;

    const rightIcons = (
        <div style={{ display: "flex", gap: "8px" }}>
            {output && output?.map((item, index) => (
                <FractionItem
                    key={index}
                    item={
                        <Item
                            index={item.id}
                            quantity={item.quantity.min}
                            updated={updatedItems.includes(item.id)}
                        />
                    }
                    value={getItemProbability(item)}
                />
            ))}
        </div>
    );
    return (
        <div onMouseEnter={() => unlockedTask && removeUnlockedTask("Farming", plot)}>
            <div
                onMouseEnter={() => !active && plotState !== "growing" && setHover(true)}
                onMouseLeave={() => !active && plotState !== "growing" && setHover(false)}
                onClick={() => !active && plotState !== "growing" && selectTask(plot)}
                style={{
                    backgroundImage: plotState !== "growing" ? (hover ? bgHighlighted : bgNormal) : bgLocked,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    height: "48px",
                    paddingLeft: !active ? "2px" : 0,
                    cursor: (!active && plotState !== "growing") ? "pointer" : "default",
                    borderBottom: "1px solid #e0cfbf"
                }}>
                {/* Icon */}
                <TaskIcon unlockedTask={unlockedTask} icon={
                    <img
                        src={`${IMAGE}${`tasks/Farming/${icon}.png`}`}
                        style={{
                            pointerEvents: "none",
                            objectFit: "contain",
                            display: "block",
                        }}
                    />
                } />

                {/* Title + Subtitle */}
                <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: "2px" }}>
                    <Text text={titleText} type="bold" maxWidth={100} colour="black" />
                    <Text text={`lvl ${plotLvls[plot]}`} type="normal" />
                </div>


                {/* Right Side Content */}
                {plotState == "growing" && (
                    <div style={{ display: "flex", alignItems: "center", marginRight: "2px", flexGrow: 1 }}>
                        <div style={{ width: "100%" }}>
                            <FarmingBar plot={plot} />
                        </div>
                    </div>
                )}
                {plotState == "grown" && (
                    < div style={{ display: "flex", alignItems: "center", marginRight: "2px" }}>
                        {/* Item Placeholder */}
                        {rightIcons}

                        {/* Right Text */}
                        <div style={{ minWidth: "65px", display: "flex", justifyContent: "flex-end" }}>
                            <Text text={`${xpReward} xp`} type="normal" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}