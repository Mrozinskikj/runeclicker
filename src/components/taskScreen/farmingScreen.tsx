import React from "react";
import { SkillBanner } from "../skillBanner";
import { ActionButton } from "./actionButton";
import { EnergyBar } from "./energyBar";
import { ActionBar } from "./actionBar";
import { FarmingItem } from "../taskList/farmingItem";
import { useFarming } from "../../logic/useFarming";
import { EquipmentSlot } from "../inventory/equipmentSlot";
import { useItems } from "../../logic/useItems";
import { FarmingBar } from "../taskList/farmingBar";

const FarmingScreenComponent: React.FC<{
    skill: string;
    plot: number;
}> = ({ skill, plot }) => {
    const plotState = useFarming((s) => s.getPlotState)(plot);
    const seed = useFarming((s) => s.seed);
    const fertiliser = useFarming((s) => s.fertiliser);
    const taskAction = plotState == "empty" ? "Plant" : "Harvest";
    const highlightedIndex = useItems((s) => s.highlightedIndex);
    const highlightedSlot = useItems((s) => s.getHighlightedSlot)(highlightedIndex);

    return (
        <div>
            <SkillBanner skill={skill} />

            <div style={{ position: "relative", margin: "16px", marginTop: "14px" }}>
                {/* Task Info */}
                <FarmingItem plot={plot} active={true} />

                {/* Actions Progress Bar */}
                {plotState == "empty" ? (
                    <FarmingBar plot={plot} />
                ) : (
                    <ActionBar />
                )}


                {plotState == "empty" && (
                    <>
                        <div onMouseDown={() => useItems.setState({ sourceIndex: "seed" })} style={{ cursor: seed !== null ? "pointer" : "default" }}>
                            <EquipmentSlot
                                x={378}
                                y={2}
                                item={seed}
                                slot={"seed"}
                                isSelected={false}
                                highlighted={highlightedSlot == "seed"}
                                active={true}
                            />
                        </div>
                        <div onMouseDown={() => useItems.setState({ sourceIndex: "fertiliser" })} style={{ cursor: fertiliser !== null ? "pointer" : "default" }}>
                            <EquipmentSlot
                                x={424}
                                y={2}
                                item={fertiliser}
                                slot={"fertiliser"}
                                isSelected={false}
                                highlighted={highlightedSlot == "fertiliser"}
                                active={true}
                            />
                        </div>
                    </>
                )
                }
            </div >

            <div style={{
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
        </div >
    );
};

export const FarmingScreen = React.memo(FarmingScreenComponent);