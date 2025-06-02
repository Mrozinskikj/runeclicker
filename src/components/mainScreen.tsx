import React from "react";
import { Window } from "./window";
import { TaskList } from "./taskList/taskList";
import { TaskScreen } from "./taskScreen/taskScreen";
import { CombatScreen } from "./taskScreen/combatScreen";
import { Stats } from "./extraMenus/stats";
import { Settings } from "./extraMenus/settings";
import { Info } from "./extraMenus/info";
import { usePlayer } from "../logic/usePlayer";

interface MainScreenProps {
    view: "skill" | "stats" | "info" | "settings";
}

/**
 * Main Screen Component
 * - Parent component for determining which screen to render based on game state.
 */
const MainScreenComponent: React.FC<MainScreenProps> = ({ view }) => {

    const task = usePlayer((state) => state.player.task);
    const skill = usePlayer((state) => state.player.skill);

    let content: React.ReactNode;

    if (view == "skill") {
        if (task !== null) {
            if (skill === "Combat") {
                content = <CombatScreen skill={skill} task={task} />
            } else {
                content = <TaskScreen skill={skill} task={task} />
            }
        } else {
            content = <TaskList skill={skill} />
        }
    } else if (view == "stats") {
        content = <Stats />
    } else if (view == "settings") {
        content = <Settings />
    } else if (view == "info") {
        content = <Info />
    }

    return (
        <Window content={content} mb={5} />
    );
};

export const MainScreen = React.memo(MainScreenComponent);