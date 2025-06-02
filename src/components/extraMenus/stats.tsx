import React from "react";
import { useData } from "../../logic/useData";
import { usePlayer } from "../../logic/usePlayer";
import { useStats } from "../../logic/useStats";
import { IMAGE } from "../../config";
import { Item } from "../item";
import { Enemy } from "../enemy";
import { Text } from "../text";
import { TaskIcon } from "../taskList/taskIcon";
import { ZoneBar } from "../taskScreen/zoneBar";

/**
 * Stats Component
 * - Displays player stat numbers.
 * - Displays unlocked items.
 */
export const Stats: React.FC = () => {

    function getPlayTime(created: string) {
        const diffInMs = Math.abs(new Date().getTime() - new Date(created).getTime());

        const d = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const h = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${d}d ${h}h ${m}m`;
    }

    const player = usePlayer((state) => state.player);
    const gameData = useData((state) => state.gameData);
    const calculateLvl = useStats((state) => state.calculateLvl);

    const totalXp = Object.values(player.xp).reduce((acc, xp) => acc + xp, 0).toLocaleString();
    const totalLvl = Object.values(player.xp).reduce((acc, xp) => acc + calculateLvl(xp), 0);

    const createdString = player.created.replace("T", ",").slice(0, 16)
    const playTime = getPlayTime(player.created);

    const items = player.records.items;
    const itemsTotal = items.length;
    const itemsUnlocked = items.filter(num => num > 0).length;

    const enemies = player.records.enemies;
    const enemiesTotal = enemies.length;
    const enemiesUnlocked = enemies.filter(num => num > 0).length;

    // Grid of all unlocked items
    const itemsWindow = (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(10, 44px)",
                gap: "4px",
                justifyContent: "center",
                marginBottom: "16px"
            }}
        >
            {gameData.items.map((_, index) => (
                <div
                    key={index}
                    style={{
                        backgroundImage: `url(${IMAGE}slots/background.png)`,
                        width: "44px",
                        height: "44px"
                    }}
                >
                    <Item index={index} quantity={items[index]} />
                </div>
            ))}
        </div>
    );

    // Grid of all unlocked enemies
    const enemiesWindow = (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(10, 44px)",
                gap: "4px",
                justifyContent: "center",
                marginBottom: "16px"
            }}
        >
            {gameData.enemies.map((_, index) => (
                <div
                    key={index}
                    style={{
                        backgroundImage: `url(${IMAGE}slots/background.png)`,
                        width: "44px",
                        height: "44px"
                    }}
                >
                    <Enemy index={index} quantity={enemies[index]} />
                </div>
            ))}
        </div>
    );

    // Records for all zones
    const zonesWindow = (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px"
            }}
        >
            {gameData.zones.map((zone, index) => {
                const tasklvl = gameData.zones[index].lvl;
                const locked = calculateLvl(player.xp["Combat"]) < tasklvl;
                return (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    >
                        {/* Icon */}
                        <TaskIcon source={locked ? "" : `tasks/Combat/${index}.png`} />

                        {/* Title + Subtitle */}
                        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: "2px" }}>
                            {locked ? (
                                <Text text={"???"} type="normal" maxWidth={100} colour="black" />
                            ) : (
                                <Text text={zone.name} type="bold" maxWidth={100} colour="black" />
                            )}
                            {!locked && (<ZoneBar step={player.records.zones[index]} showStep={false} />)}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div style={{ maxHeight: "278px", overflowY: "scroll", padding: "8px" }}>
            {/* Game Started */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <Text text={"Game started: "} type="normal" />
                <Text text={`${createdString} `} type="bold" />
                <Text text={`${playTime} ago`} type="small" />
            </div>

            {/* Total xp */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <Text text={"Total xp: "} type="normal" />
                <Text text={`${totalXp}`} type="bold" />
            </div>

            {/* Total lvl */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <Text text={"Total lvl: "} type="normal" />
                <Text text={`${totalLvl}`} type="bold" />
            </div>

            {/* Items unlocked */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <Text text={"Items unlocked: "} type="normal" />
                <Text text={`${itemsUnlocked}/${itemsTotal}`} type="bold" />
            </div>
            {itemsWindow}

            {/* Enemies unlocked */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <Text text={"Enemies unlocked: "} type="normal" />
                <Text text={`${enemiesUnlocked}/${enemiesTotal}`} type="bold" />
            </div>
            {enemiesWindow}

            {/* Zones */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <Text text={"Zones: "} type="normal" />
            </div>
            {zonesWindow}
        </div>
    );
};