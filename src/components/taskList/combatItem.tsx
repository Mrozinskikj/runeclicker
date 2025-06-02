import React, { useState } from "react";
import { Text } from "../text";
import { useTask } from "../../logic/useTask";
import { useData } from "../../logic/useData";
import { usePlayer } from "../../logic/usePlayer";
import { useCombat } from "../../logic/useCombat";
import { TaskIcon } from "./taskIcon";
import { Item } from "../item";
import { IMAGE } from "../../config";
import { Tooltip } from "../tooltip";
import { FractionItem } from "../fractionItem";
import { Enemy } from "../enemy";

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
            <TaskIcon source={`tasks/Combat/${zone}.png`} />

            {/* Title + Subtitle */}
            <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: "2px" }}>
                <Text text={zoneName} type="bold" maxWidth={100} colour="black" />
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
    )
}

const InfoButton: React.FC<{
    infoOpen: boolean;
    setInfoOpen: React.Dispatch<React.SetStateAction<boolean>>;
    last: boolean;
}> = ({ infoOpen, setInfoOpen, last }) => {
    const [hover, setHover] = useState(false);
    const bgDownNormal = `url(${IMAGE}combat/infodownidle.png)`;
    const bgDownHover = `url(${IMAGE}combat/infodownhover.png)`;
    const bgUpNormal = `url(${IMAGE}combat/infoupidle.png)`;
    const bgUpHover = `url(${IMAGE}combat/infouphover.png)`;

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => setInfoOpen(!infoOpen)}
            style={{
                cursor: "pointer",
                height: 16,
                width: 490,
                backgroundImage: infoOpen ? (hover ? bgUpHover : bgUpNormal) : (hover ? bgDownHover : bgDownNormal),
                backgroundSize: "cover",
                borderBottom: last ? "" : "1px solid black"
            }}
        />
    );
};

const EnemyRow: React.FC<{
    zone: number;
    enemyId: number;
    depths: number[];
    depthTotals: number[];
}> = ({ zone, enemyId, depths, depthTotals }) => {
    const gameData = useData((s) => s.gameData);
    const playerData = usePlayer((s) => s.player);
    const calculateDepth = useCombat((state) => state.calculateDepth);
    const calculateXp = useCombat((state) => state.calculateXp);

    const enemy = gameData.enemies[enemyId];
    const itemIcons = (
        <div style={{ display: "flex", gap: 8 }}>
            {enemy.items.map((it, i) => (
                <FractionItem
                    key={i}
                    item={
                        <Item index={it.id} quantity={it.quantity.min} quantityMax={it.quantity.max} />
                    }
                    value={it.probability}
                />
            ))}
        </div>
    );

    const depthStats = (
        <div style={{ display: "flex" }}>
            {depths.map((p, idx) => {
                const tooltipContent = <Text text={`Frequency at Depth ${idx + 1}`} type="small" colour="white" />
                const unlocked = calculateDepth(playerData.records.zones[zone]) >= idx;
                return (
                    <Tooltip key={idx} content={tooltipContent}>
                        <div
                            style={{
                                width: 36,
                                height: 20,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundImage: `url(${IMAGE}combat/depth${idx}${unlocked ? (p > 0 ? "on" : "off") : "off"}.png)`,
                            }}
                        >
                            <Text
                                text={unlocked ? (p > 0 ? `${p}/${depthTotals[idx]}` : "") : "???"}
                                type="shadow"
                                colour="white"
                            />
                        </div>
                    </Tooltip>
                );
            })}
        </div>
    );

    const locked = playerData.records.enemies[enemyId] == 0;

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                height: 48,
                paddingLeft: 2,
                borderTop: "1px solid #d8cfc0",
                backgroundImage: `url(${IMAGE}backgrounds/interfacelocked.png)`,
            }}
        >
            {locked ? (
                <Text text={"???"} type="normal" />
            ) : (
                <>
                    <div
                        style={{
                            backgroundImage: `url(${IMAGE}slots/background.png)`,
                            width: "44px",
                            height: "44px",
                            marginRight: "4px"
                        }}
                    >
                        <Enemy index={enemyId} quantity={1} />
                    </div>
                    <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                        <Text text={enemy.name} type="normal" maxWidth={170} />
                        {depthStats}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", marginRight: "2px" }}>
                        {/* Item Icons */}
                        {itemIcons}

                        {/* Right Text */}
                        <div style={{ minWidth: "65px", display: "flex", justifyContent: "flex-end" }}>
                            <Text text={`${calculateXp(enemyId)} xp`} type="normal" />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};


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

    const [infoOpen, setInfoOpen] = useState(false);

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

    const last = zone == gameData.zones.length - 1;

    return (
        infoOpen ? (
            <div>
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
                {Object.entries(enemyDepths).map(([idStr, depths]) => (
                    <EnemyRow
                        zone={zone}
                        key={idStr}
                        enemyId={Number(idStr)}
                        depths={depths}
                        depthTotals={depthTotals}
                    />
                ))}
                <InfoButton infoOpen={infoOpen} setInfoOpen={setInfoOpen} last={last} />
            </div>
        ) : (
            <div>
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
                {!active && (
                    <InfoButton infoOpen={infoOpen} setInfoOpen={setInfoOpen} last={last} />
                )}
            </div>
        )
    );
};