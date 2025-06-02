import React, { useState } from "react";
import { usePlayer } from "../logic/usePlayer";
import { useStats } from "../logic/useStats";
import { useTask } from "../logic/useTask";
import { IMAGE } from "../config";
import { ProgressBar } from "./progressBar";
import { Text } from "./text";
import { Window } from "./window";

interface SkillListProps {
    view: "skill" | "stats" | "info" | "settings";
    handleViewSelect: (selection: "skill" | "stats" | "info" | "settings") => void;
}

/**
 * Skill List Component
 * - Displays buttons to select every skill.
 */
const SkillListComponent: React.FC<SkillListProps> = ({ view, handleViewSelect }) => {

    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

    const clickSkill = (skill: string) => {
        selectSkill(skill);
        handleViewSelect("skill");
    };

    const playerXp = usePlayer((state) => state.player.xp);
    const playerSkill = usePlayer((state) => state.player.skill);
    const calculateLvlProperties = useStats((state) => state.calculateLvlProperties);
    const selectSkill = useTask((state) => state.selectSkill);

    const bgNormal = `url(${IMAGE}backgrounds/interface.png)`;
    const bgHighlighted = `url(${IMAGE}backgrounds/interfacehighlighted.png)`;
    const bgSelect = `url(${IMAGE}backgrounds/interfacedark.png)`;

    const content = (
        <>
            {Object.entries(playerXp).map(([skill, _], idx) => {
                const isSelected = skill === playerSkill && view === "skill";
                const isHovered = hoveredSkill === skill;
                const backgroundImage = isSelected ? bgSelect : isHovered ? bgHighlighted : bgNormal;

                const last = idx == Object.entries(playerXp).length - 1;

                return (
                    <div
                        key={skill}
                        onClick={() => clickSkill(skill)}
                        onMouseEnter={() => setHoveredSkill(skill)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        style={{
                            cursor: "pointer",
                            backgroundImage,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            height: "49px",
                        }}
                    >
                        {/* Skill Icon & Info Section */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            flex: 1
                        }}>
                            {/* Icon Placeholder */}
                            <img src={`${IMAGE}skills/${skill}.png`} style={{ marginLeft: "4px", marginRight: "4px", pointerEvents: "none" }} />

                            {/* Skill Info: Name & Level */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <Text text={skill} type="bold" />
                                <Text text={`lvl ${calculateLvlProperties(playerXp[skill]).lvl}`} type="normal" />
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <ProgressBar value={calculateLvlProperties(playerXp[skill]).progressPercent} image="xp" bottomBorder={!last} />
                    </div>
                );
            })}
        </>
    );

    return <Window content={content} mb={5} />;
};

export const SkillList = React.memo(SkillListComponent);