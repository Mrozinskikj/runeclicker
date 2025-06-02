import React from "react";
import { SkillBanner } from "../skillBanner";
import { useTask } from "../../logic/useTask";
import { ActionButton } from "./actionButton";
import { TaskItem } from "../taskList/taskItem";
import { EnergyBar } from "./energyBar";
import { ActionBar } from "./actionBar";


interface TaskScreenProps {
    skill: string;
    task: number;
}

/**
 * Task Screen Component
 * - Main screen for performing selected tasks.
 * - Skill banner.
 * - Current task data and actions left.
 * - Action button and energy meter.
 */
const TaskScreenComponent: React.FC<TaskScreenProps> = ({ skill, task }) => {
    const getTaskData = useTask((state) => state.getTaskData);
    const taskData = getTaskData(skill, task);

    return (
        <div>
            <SkillBanner skill={skill} />

            <div style={{ margin: "16px" }}>
                {/* Task Info */}
                <TaskItem skill={skill} task={task} clickable={false} />

                {/* Actions Progress Bar */}
                <ActionBar />
            </div>

            <div style={{
                marginLeft: "16px",
                marginRight: "16px",
                marginBottom: "16px",
                borderLeft: "1px solid black",
                borderRight: "1px solid black",
                borderTop: "1px solid black",
            }}>
                {/* Action Button Component */}
                <ActionButton taskAction={taskData.action} />

                {/* Energy Progress Bar */}
                <EnergyBar />
            </div>
        </div>
    );
};

export const TaskScreen = React.memo(TaskScreenComponent);