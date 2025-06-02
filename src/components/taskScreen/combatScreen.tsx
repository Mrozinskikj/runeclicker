import React, { useMemo } from "react";
import { SkillBanner } from "../skillBanner";
import { useCombat } from "../../logic/useCombat";
import { useData } from "../../logic/useData";
import { ActionButton } from "./actionButton";
import { EnergyBar } from "./energyBar";
import { CombatItem } from "../taskList/combatItem";
import { ProgressBar } from "../progressBar";
import { Text } from "../text";
import { IMAGE } from "../../config";
import { TaskIcon } from "../taskList/taskIcon";
import { Enemy } from "../../logic/useCombat";
import { useStats } from "../../logic/useStats";
import { CombatStats } from "../../types/gameTypes";
import { Tooltip } from "../tooltip";
import { ZoneBar } from "./zoneBar";
import { usePlayer } from "../../logic/usePlayer";
import { EquipmentSlot } from "../inventory/equipmentSlot";
import { useItems } from "../../logic/useItems";
import { escape } from "querystring";

const LabelsRow: React.FC<{
    enemy: Enemy | null;
    rest: boolean;
    escape: boolean;
}> = ({ enemy, rest, escape }) => {
    let name;
    let image;
    if (rest) {
        name = "Rest";
        image = "combat/rest.png";
    } else if (escape) {
        name = "Escape";
        image = "combat/escape.png";
    } else {
        name = enemy ? useData((state) => state.gameData.enemies[enemy.id]).name : "";
        image = enemy ? `enemies/${enemy!.id}.png` : "";
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "45% 10% 45%",
                alignItems: "center",
            }}
        >
            <div style={{ justifySelf: "end", alignSelf: "end", marginBottom: 2 }}>
                <Text text="You" type="bold" />
            </div>
            <div />
            <div style={{ display: "flex", alignItems: "flex-end", marginBottom: 2, gap: "4px" }}>
                <TaskIcon source={image} />
                <Text text={name} type="bold" />
            </div>
        </div>
    );
};

const HealthBarsRow: React.FC<{
    health: number;
    enemy: Enemy | null;
    playerTurn: boolean;
    playerUpdated: boolean;
    enemyUpdated: boolean;
    playerDamage: number | null;
    enemyDamage: number | null;
    actions: number;
    rest: boolean;
}> = ({ health, enemy, playerTurn, playerUpdated, enemyUpdated, playerDamage, enemyDamage, actions, rest }) => {
    const enemyData = useData(state => enemy != null ? state.gameData.enemies[enemy.id] : null);
    const playerStats = useStats((state) => state.calculateStats)("Combat") as CombatStats;
    const calculateHitChance = useCombat((state) => state.calculateHitChance);

    const enemyBar = enemyData ? (enemy!.health / enemyData.health) * 100 : (actions / 8) * 100;
    const playerBar = (health / playerStats.health) * 100;
    const enemyDamageBar = (enemyData && enemyDamage !== null) ? ((enemyDamage / enemyData.health) * 100) : 0;
    const playerDamageBar = playerDamage !== null ? ((playerDamage / playerStats.health) * 100) : 0;

    const enemyText = enemyData ? `${enemy!.health} / ${enemyData.health}` : `${actions} / ${8}`;
    const playerText = `${health} / ${playerStats.health}`;

    const playerTooltip = rest ? (
        <>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Text text={"Missing health: "} type="normal" colour="white" />
                <Text text={String(playerStats.health - health)} type="bold" colour="white" />
            </div>
        </>
    ) : enemy &&  (
        <>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Text text={"Average hit damage: "} type="normal" colour="white" />
                <Text text={((1 + playerStats.strength) / 2).toFixed(1)} type="bold" colour="white" />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Text text={"Chance to hit: "} type="normal" colour="white" />
                <Text text={`${Math.round(calculateHitChance(true) * 100)}%`} type="bold" colour="white" />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Text text={"Chance to block: "} type="normal" colour="white" />
                <Text text={`${Math.round((1 - calculateHitChance(false)) * 100)}%`} type="bold" colour="white" />
            </div>
        </>
    );
    const enemyTooltip = enemy && (
        <>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Text text={"Average hit damage: "} type="normal" colour="white" />
                <Text text={`${(1 + enemy.strength) / 2}`} type="bold" colour="white" />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Text text={"Chance to hit: "} type="normal" colour="white" />
                <Text text={`${Math.round(calculateHitChance(false) * 100)}%`} type="bold" colour="white" />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Text text={"Chance to block: "} type="normal" colour="white" />
                <Text text={`${Math.round((1 - calculateHitChance(true)) * 100)}%`} type="bold" colour="white" />
            </div>
        </>
    );

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "45% 5% 5% 45%",
                alignItems: "center",
                marginBottom: 2
            }}
        >
            {/* Player Health */}
            <div style={{ boxShadow: playerTurn && enemy ? "0 0 0 1px #ffffff, 0 0 0 2px #000000" : "none" }}>
                <ProgressBar
                    value={playerBar}
                    text={playerText}
                    image={playerDamage == 0 ? "healthblock" : "health"}
                    tooltipContent={playerTooltip}
                    updated={playerUpdated}
                    updatedValue={playerDamageBar}
                    updatedImage="healthdamage"
                    fullBorder
                />
            </div>

            {/* Damage Values */}
            <div style={{ height: 10, marginTop: -4, marginLeft: 3 }}>
                {playerDamage !== null && (
                    playerDamage !== 0 ? (
                        <Text text={String(-playerDamage)} type="normal" colour="black" />
                    ) : (
                        <img
                            src={`${IMAGE}combat/block.png`}
                            style={{ width: 14, height: 14, marginBottom: 1, pointerEvents: "none" }}
                        />
                    )
                )}

            </div>
            <div style={{ height: 10, marginTop: -4, justifySelf: "end", marginRight: 2 }}>
                {enemyDamage !== null && (
                    enemyDamage !== 0 ? (
                        <Text text={String(-enemyDamage)} type="normal" colour="black" />
                    ) : (
                        <img
                            src={`${IMAGE}combat/block.png`}
                            style={{ width: 14, height: 14, marginBottom: 1, pointerEvents: "none" }}
                        />
                    )
                )}
            </div>

            {/* Enemy Health */}
            <div style={{ boxShadow: !playerTurn && enemy ? "0 0 0 1px #ffffff, 0 0 0 2px #000000" : "none" }}>
                <ProgressBar
                    value={enemyBar}
                    text={enemyText}
                    image={enemy ? (enemyDamage == 0 ? "healthblock" : "health") : "actions"}
                    tooltipContent={enemyTooltip}
                    updated={enemyUpdated}
                    updatedValue={enemyDamageBar}
                    updatedImage="healthdamage"
                    fullBorder
                />
            </div>
        </div >
    );
};

const StatRow: React.FC<{
    icon: string;
    tooltip: JSX.Element;
    playerValue: number;
    enemyValue: number | null;
}> = ({ icon, tooltip, playerValue, enemyValue }) => {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "45% 10% 45%",
                height: 18,
                alignItems: "center",
            }}
        >
            <div style={{ justifySelf: "end" }}>
                <Text text={`${playerValue.toFixed(1)}`} type="normal" />
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: -2 }}>
                <Tooltip content={tooltip}>
                    <img
                        src={icon}
                        style={{ width: 18, height: 18, objectFit: "contain", pointerEvents: "none" }}
                    />
                </Tooltip>
            </div>
            <div>
                <Text text={`${enemyValue !== null ? enemyValue : ""}`} type="normal" />
            </div>
        </div>
    );
}

const CombatScreenComponent: React.FC<{
    skill: string;
    task: number;
}> = ({ skill, task }) => {
    const calculateStats = useStats(state => state.calculateStats);
    const equipment = usePlayer(state => state.player.inventory.equipment);
    const xp = usePlayer((state) => state.player.xp[skill]);
    const lvlProperties = useStats((state) => state.calculateLvlProperties)(xp);
    const highlightedIndex = useItems((state) => state.highlightedIndex);
    const highlightedSlot = useItems((state) => state.getHighlightedSlot)(highlightedIndex);

    const playerStats = useMemo(
        () => calculateStats("Combat"),
        [calculateStats, equipment, lvlProperties.lvl]
    ) as CombatStats;

    const health = useCombat((state) => state.health);
    const enemy = useCombat((state) => state.enemy);
    const isRest = useCombat((state) => state.isRest);
    const step = useCombat((state) => state.step);
    const foodUsed = useCombat((state) => state.foodUsed);
    const escape = useCombat((state) => state.escape);
    const actions = useCombat((state) => state.actions);
    const playerTurn = useCombat((state) => state.playerTurn);
    const playerUpdated = useCombat((state) => state.playerUpdated);
    const enemyUpdated = useCombat((state) => state.enemyUpdated);
    const zoneBarUpdated = useCombat((state) => state.zoneBarUpdated);
    const playerDamage = useCombat((state) => state.playerDamage);
    const enemyDamage = useCombat((state) => state.enemyDamage);
    const calculateDepth = useCombat((state) => state.calculateDepth);
    const record = useCombat((state) => state.record);

    const depth = calculateDepth(step);

    const taskAction = isRest(step) ? "Rest" : (escape ? "Escape" : (playerTurn ? "Attack" : "Block"));

    const strengthTooltip = (
        <>
            <Text text="Strength" type="normal" colour="white" />
            <Text text="Maximum damage dealt on hits" type="small" colour="white" />
        </>
    );
    const accuracyTooltip = (
        <>
            <Text text="Accuracy" type="normal" colour="white" />
            <Text text="Increases chance to hit against enemy Defence" type="small" colour="white" />
        </>
    );
    const defenceTooltip = (
        <>
            <Text text="Defence" type="normal" colour="white" />
            <Text text="Increases chance to block against enemy Accuracy" type="small" colour="white" />
        </>
    );

    return (
        <div>
            <SkillBanner skill={skill} />

            <div style={{ margin: "16px" }}>
                {/* Task Info */}
                <CombatItem zone={task} active={true} showEnemies={!isRest(step)} depth={depth} />

                {/* Actions Progress Bar */}
                <ZoneBar step={step} updated={zoneBarUpdated} record={record} />
            </div>

            <div style={{ position: "relative", margin: "16px", marginTop: "-8px" }}>
                <LabelsRow enemy={enemy} rest={isRest(step)} escape={escape} />
                <HealthBarsRow
                    health={health}
                    enemy={enemy}
                    playerTurn={playerTurn}
                    playerUpdated={playerUpdated}
                    enemyUpdated={enemyUpdated}
                    playerDamage={playerDamage}
                    enemyDamage={enemyDamage}
                    actions={actions}
                    rest={isRest(step)}
                />
                <StatRow icon={`${IMAGE}combat/iconstrength.png`} tooltip={strengthTooltip} playerValue={playerStats.strength} enemyValue={enemy && enemy.strength} />
                <StatRow icon={`${IMAGE}combat/iconaccuracy.png`} tooltip={accuracyTooltip} playerValue={playerStats.accuracy} enemyValue={enemy && enemy.accuracy} />
                <StatRow icon={`${IMAGE}combat/icondefence.png`} tooltip={defenceTooltip} playerValue={playerStats.defence} enemyValue={enemy && enemy.defence} />
                {isRest(step) && (
                    <EquipmentSlot
                        x={257}
                        y={66}
                        item={null}
                        slot={"food"}
                        isSelected={false}
                        highlighted={highlightedSlot == "food"}
                        active={!foodUsed}
                    />
                )}
            </div>

            <div style={{
                marginTop: "-12px",
                marginLeft: "16px",
                marginRight: "16px",
                marginBottom: "16px",
                borderLeft: "1px solid black",
                borderRight: "1px solid black",
                borderTop: "1px solid black",
            }}>
                {/* Action Button Component */}
                <ActionButton taskAction={taskAction} />

                {/* Energy Progress Bar */}
                <EnergyBar />
            </div>
        </div>
    );
};

export const CombatScreen = React.memo(CombatScreenComponent);