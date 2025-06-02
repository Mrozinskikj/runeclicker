import React from "react";
import { SkillBanner } from "../skillBanner";
import { useData } from "../../logic/useData";
import { useTask } from "../../logic/useTask";
import { usePlayer } from "../../logic/usePlayer";
import { useStats } from "../../logic/useStats";
import { TaskItem } from "./taskItem";
import { CombatItem } from "./combatItem";
import { Text } from "../text";
import { IMAGE } from "../../config";

/**
 * Locked Task Component
 * - Displays an empty task if locked.
 */
const LockedTask: React.FC<{ lvl: number }> = ({ lvl }) => {

    return (
        <div style={{
            backgroundImage: `url(${IMAGE}backgrounds/interfacelocked.png)`,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "48px",
            borderBottom: "1px solid #e0cfbf",
            paddingLeft: "2px"
        }}>
            {/* Title and Subtitle */}
            <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: "2px" }}>
                <Text text={"???"} type="normal" />
                <Text text={`lvl ${lvl}`} type="normal" />
            </div>
        </div>
    );
};

/**
 * No Tasks Component
 * - Displays a message if there are no available tasks.
 */
const NoTasks: React.FC = ({ }) => {
    return (
        <div style={{
            backgroundImage: `url(${IMAGE}backgrounds/interfacelocked.png)`,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "48px",
            borderBottom: "1px solid #e0cfbf",
            paddingLeft: "4px"
        }}>
            <Text text={"No tasks available."} type="normal" />
        </div>
    );
};

/**
 * Task List Component
 * - Displays every task item component for a given skill as a list.
 */
const TaskListComponent: React.FC<{ skill: string }> = ({ skill }) => {

    const gameData = useData((state) => state.gameData);
    const selectTask = useTask((state) => state.selectTask);
    const getTaskData = useTask((state) => state.getTaskData);
    const calculateMaxTasks = useTask((state) => state.calculateMaxTasks);
    const player = usePlayer((state) => state.player);
    const calculateLvl = useStats((state) => state.calculateLvl);

    // Helper function to get the indexes for the task list
    const getTaskList = () => {
        switch (skill) {
            case "Woodcutting":
            case "Mining":
            case "Stamina":
                return [...Array(gameData.tasks[skill]?.length || 0).keys()];
            case "Processing":
                return [...Array(gameData.recipes.length).keys()];
            case "Merchanting":
                // Return the indices of items in the inventory that are not null
                return player.inventory.items
                    .map((item) => item !== null ? item.id : null)
                    .filter(index => index !== null && index !== 79) as number[];
            case "Combat":
                return [...Array(gameData.zones.length).keys()];
            default:
                return [];
        }
    };

    return (
        <div>
            <SkillBanner skill={skill} />

            <div style={{ maxHeight: "245px", overflowY: "scroll" }}>
                {getTaskList().length === 0 ? (
                    <NoTasks />
                ) : (
                    skill !== "Combat" ? (
                        getTaskList().map((task) => {
                            const tasklvl = getTaskData(skill, task).lvl;
                            const locked = calculateLvl(player.xp[skill]) < tasklvl;
                            const available = calculateMaxTasks(skill, task) > 0;

                            return locked ? (
                                <LockedTask key={task} lvl={tasklvl} />
                            ) : (
                                <div
                                    key={task}
                                    onClick={() => available && selectTask(task)}
                                    style={{
                                        cursor: available ? "pointer" : "default",
                                        paddingLeft: "2px"
                                    }}
                                >
                                    <TaskItem skill={skill} task={task} available={available} />
                                </div>
                            );
                        })
                    ) : (
                        getTaskList().map((task) => {
                            const tasklvl = gameData.zones[task].lvl;
                            const locked = calculateLvl(player.xp[skill]) < tasklvl;

                            return locked ? (
                                <LockedTask key={task} lvl={tasklvl} />
                            ) : (
                                <CombatItem key={task} zone={task} />
                            );
                        })
                    )
                )}
            </div>
        </div>
    );
};

export const TaskList = React.memo(TaskListComponent);