import React, { useState, useEffect } from "react";
import { Text } from "../text";
import { IMAGE } from "../../config";
import { useTask } from "../../logic/useTask";
import { usePlayer } from "../../logic/usePlayer";

interface ActionButtonProps {
    taskAction: string;
}

/**
 * ActionButton Component
 * - Displays a clickable button for performing tasks.
 * - Changes appearance based on energy level and hover states.
 */
const ActionButtonComponent: React.FC<ActionButtonProps> = ({ taskAction }) => {

    const [active, setActive] = useState(false);
    const [actionButtonState, setActionButtonState] = useState<"idle" | "hover" | "down" | "energy">("idle");

    const energyDepleted = useTask((state) => state.energy === 0);
    const calculateMaxTasks = useTask((state) => state.calculateMaxTasks);
    const manualAction = useTask((state) => state.manualAction);
    const skill = usePlayer((state) => state.player.skill);
    const task = usePlayer((state) => state.player.task);
    const inventory = usePlayer((state) => state.player.inventory);
    const pause = useTask((state) => state.pause);
    const togglePause = useTask((state) => state.togglePause);

    // Determines if the button should be active based on task availability.
    useEffect(() => {
        setActive(task !== null && calculateMaxTasks(skill, task) > 0);
    }, [skill, task, inventory, calculateMaxTasks]);

    const getActionIdleState = () => (energyDepleted ? "energy" : "idle");
    const getPauseHoverState = () => (pause ? "down" : "hover");
    const getPauseIdleState = () => (pause ? "down" : "idle");

    const [pauseButtonState, setPauseButtonState] = useState<"idle" | "hover" | "down">(getPauseIdleState());

    // Update button state dynamically based on energy
    useEffect(() => {
        if (actionButtonState === "idle" || actionButtonState === "energy") {
            setActionButtonState(getActionIdleState());
        }
    }, [energyDepleted]);

    // Button sprite mappings
    const actionSpriteMap = {
        idle: `${IMAGE}action/actionidle.png`,
        hover: `${IMAGE}action/actionhover.png`,
        down: `${IMAGE}action/actiondown.png`,
        energy: `${IMAGE}action/actionenergy.png`,
    };
    const pauseSpriteMap = {
        idle: `${IMAGE}action/pauseidle.png`,
        hover: `${IMAGE}action/pausehover.png`,
        down: `${IMAGE}action/pausedown.png`,
    };

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1
        }}>
            <div
                onClick={() => active && manualAction()}
                style={{
                    cursor: active ? "pointer" : "default",
                    backgroundImage: active ? `url(${actionSpriteMap[actionButtonState]})` : `url(${actionSpriteMap.down})`,
                    backgroundSize: "cover",
                    height: "36px",
                    display: "flex",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: "36px"
                }}
                onMouseEnter={() => setActionButtonState("hover")}
                onMouseLeave={() => setActionButtonState(getActionIdleState())}
                onMouseDown={() => setActionButtonState("down")}
                onMouseUp={() => setActionButtonState("hover")}
            >
                <div style={{ paddingTop: !active || actionButtonState === "down" ? "2px" : "0px" }}>
                    <Text text={!energyDepleted ? taskAction : "Recharge Energy"} type="bold" />
                </div>
            </div>

            <div
                onClick={() => {
                    togglePause();
                    setPauseButtonState(pause ? "hover" : "down");
                }}
                style={{
                    cursor: "pointer",
                    backgroundImage: `url(${pauseSpriteMap[pauseButtonState]})`,
                    backgroundSize: "cover",
                    height: "36px",
                    width: "36px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                onMouseEnter={() => setPauseButtonState(getPauseHoverState())}
                onMouseLeave={() => setPauseButtonState(getPauseIdleState())}
                onMouseDown={() => setPauseButtonState("down")}
                onMouseUp={() => setPauseButtonState(getPauseHoverState())}
            />
        </div>
    );
};

export const ActionButton = React.memo(ActionButtonComponent);