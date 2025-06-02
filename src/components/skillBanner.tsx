import React, { useState, useEffect } from "react";
import { usePlayer } from "../logic/usePlayer";
import { Text } from "./text";
import { useStats } from "../logic/useStats";
import { useTask } from "../logic/useTask";
import { IMAGE } from "../config";
import { ProgressBar } from "./progressBar";
import { formatSeconds } from "../logic/utils";

interface SkillBannerProps {
    skill: string;
}

/**
 * Skill Banner Component
 * - Top banner giving selected skill details, xp progress, and stats.
 */
const SkillBannerComponent: React.FC<SkillBannerProps> = ({ skill }) => {

    const updatedXpBar = useStats((state) => state.updatedXpBar);
    const calculateStats = useStats((state) => state.calculateStats);
    const calculateLvlProperties = useStats((state) => state.calculateLvlProperties);

    const selectSkill = useTask((state) => state.selectSkill);
    const xp = usePlayer((state) => state.player.xp[skill]);

    const lvlProperties = calculateLvlProperties(xp);
    const progressText = `${lvlProperties.gainedXpThisLevel.toLocaleString()} / ${lvlProperties.requiredXpThisLevel.toLocaleString()}`;

    const [stats, setStats] = useState(() => calculateStats(skill));
    const equipment = usePlayer((state) => state.player.inventory.equipment);
    useEffect(() => {
        setStats(calculateStats(skill));
    }, [equipment, lvlProperties.lvl]); // re-calculate stats whenever equipment changes

    // Progress bar tooltip
    const tooltipContent = (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text text="Total xp: " type="normal" colour="white" />
                <Text text={xp.toLocaleString()} type="bold" colour="white" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text text="Next lvl: " type="normal" colour="white" />
                <Text text={lvlProperties.xpForNextLvl.toLocaleString()} type="bold" colour="white" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text text="Remaining: " type="normal" colour="white" />
                <Text text={lvlProperties.remainingXp.toLocaleString()} type="bold" colour="white" />
            </div>
        </div>
    );

    return (
        <div
            onClick={() => selectSkill(skill)}
            style={{
                cursor: "pointer",
                backgroundImage: `url(${IMAGE}backgrounds/interfacedark.png)`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "49px",
            }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between", // This ensures left and right alignment
                flex: 1
            }}>
                {/* Skill Icon & Info Section */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1
                }}>

                    {/* Icon Placeholder */}
                    <img src={`${IMAGE}skills/${skill}.png`} style={{ marginLeft: "11px", marginRight: "14px", pointerEvents: "none" }} />

                    {/* Skill Info: Name & Level */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <Text text={skill} type="bold" />
                        <Text text={`lvl ${lvlProperties.lvl}`} type="normal" />
                    </div>
                </div>

                {/* Right: Stats */}
                <div style={{ display: "flex", gap: "16px", marginRight: "6px" }}>
                    {/* Split stats into pairs of two */}
                    {Object.entries(stats).reduce((acc, [statName, value], index) => {
                        if (index % 2 === 0) acc.push([]);
                        acc[acc.length - 1].push([statName, value]);
                        return acc;
                    }, [] as [string, number][][]).map((column, columnIndex) => (
                        <div key={columnIndex} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            {column.map(([statName, value]) => (
                                <div key={statName} style={{ display: "flex" }}>
                                    <Text text={`${statName}: `} type="normal" />
                                    <Text text={statName == "energy" ? formatSeconds(value) : value.toLocaleString()} type="bold" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Progress Bar */}
            <ProgressBar value={lvlProperties.progressPercent} text={progressText} image="xp" tooltipContent={tooltipContent} updated={updatedXpBar} />
        </div>
    );
};

export const SkillBanner = React.memo(SkillBannerComponent);