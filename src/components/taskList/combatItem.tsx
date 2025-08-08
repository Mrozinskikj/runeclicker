import React, { useState } from "react";
import { Text } from "../text";
import { useTask } from "../../logic/useTask";
import { useData } from "../../logic/useData";
import { useCombat } from "../../logic/useCombat";
import { TaskIcon } from "./taskIcon";
import { IMAGE } from "../../config";
import { FractionItem } from "../fractionItem";
import { Enemy } from "../enemy";
import { useStats } from "../../logic/useStats";

const TitleBar: React.FC<{
    active: boolean;
    zone: number;
    depth?: number;
    zoneName: string;
    zoneLvl: number;
    enemyDepths: Record<number, number[]>;
    depthTotals: number[];
    showEnemies: boolean;
    unlockedEnemy: number | null;
}> = ({ active, zone, zoneName, zoneLvl, enemyDepths, depthTotals, depth, showEnemies, unlockedEnemy }) => {
    const selectTask = useTask((s) => s.selectTask);
    const [hover, setHover] = useState(false);

    const unlockedTasks = useStats((state) => state.unlockedTasks);
    const unlockedTask = unlockedTasks.some(unlock => unlock.skill === "Combat" && unlock.task === zone);
    const removeUnlockedTask = useStats((state) => state.removeUnlockedTask);

    const bgNormal = `url(${IMAGE}backgrounds/interface.png)`;
    const bgHighlighted = `url(${IMAGE}backgrounds/interfacehighlighted.png)`;

    // Extract and filter enemies based on depth if provided
    const enemies = Object.keys(enemyDepths)
        .map(Number)
        .filter((enemyId) => {
            if (depth === undefined) return true;
            const depths = enemyDepths[enemyId];
            return depths && depths[depth] !== 0;
        });

    return (
        <div onMouseEnter={() => unlockedTask && removeUnlockedTask("Combat", zone)}>
            <div
                onMouseEnter={() => !active && setHover(true)}
                onMouseLeave={() => !active && setHover(false)}
                onClick={() => !active && selectTask(zone)}
                style={{
                    backgroundImage: hover ? bgHighlighted : bgNormal,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    height: "48px",
                    paddingLeft: !active ? "2px" : 0,
                    cursor: !active ? "pointer" : "default"
                }}>
                {/* Icon */}
                <TaskIcon unlockedTask={unlockedTask} icon={
                    <img
                        src={`${IMAGE}${`tasks/Combat/${zone}.png`}`}
                        style={{
                            pointerEvents: "none",
                            objectFit: "contain",
                            display: "block",
                        }}
                    />
                } />

                {/* Title + Subtitle */}
                <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: "2px" }}>
                    <Text text={zoneName} type="bold" maxWidth={120} colour="black" />
                    <Text text={`lvl ${zoneLvl}`} type="normal" />
                </div>

                {/* Right Side Content */}
                {showEnemies && (
                    <div style={{ display: "flex", alignItems: "center", marginRight: "2px" }}>
                        {/* Enemy icons */}
                        <div style={{ display: "flex", marginRight: 4 }}>
                            {enemies.map((enemyId, i) => {
                                const enemy = <Enemy key={i} index={enemyId} quantity={1} updated={unlockedEnemy == enemyId} />

                                if (depth === undefined) {
                                    return enemy;
                                } else {
                                    return <FractionItem key={i} item={enemy} numerator={enemyDepths[enemyId][depth]} value={depthTotals[depth]} />
                                }
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}


/**
 * Combat Task Item Component
 * - Takes zone index to derive the data and render a zone item.
 */
export const CombatItem: React.FC<{
    zone: number;
    depth?: number;
    showEnemies?: boolean;
    active?: boolean;
}> = ({ zone, depth, showEnemies = true, active = false }) => {

    const gameData = useData((state) => state.gameData);
    const zoneData = gameData.zones[zone];
    const unlockedEnemy = useCombat(state => state.unlockedEnemy);

    const enemyDepths: Record<number, number[]> = {};
    // Loop over each depth level (index = depth)
    zoneData.enemies.forEach((enemiesAtDepth, depthIndex) => {
        enemiesAtDepth.forEach(enemy => {
            if (!enemyDepths[enemy.id]) {
                enemyDepths[enemy.id] = [0, 0, 0, 0]; // 4 depths
            }
            enemyDepths[enemy.id][depthIndex] = enemy.probability;
        });
    });

    const depthTotals = zoneData.enemies.map(depth =>
        depth.reduce((sum, enemy) => sum + enemy.probability, 0)
    );

    return (
        <div style={{ borderBottom: "1px solid #e0cfbf" }}>
            <TitleBar
                active={active}
                zone={zone}
                zoneName={zoneData.name}
                zoneLvl={zoneData.lvl}
                enemyDepths={enemyDepths}
                depthTotals={depthTotals}
                depth={depth}
                showEnemies={showEnemies}
                unlockedEnemy={unlockedEnemy}
            />
        </div>
    )
};