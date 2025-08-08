import React, { ReactNode } from 'react';
import { IMAGE } from "../../config";
import { Text } from "../text";

/**
 * Task Icon Component
 * - Displays an image for a given task.
 */
export const TaskIcon: React.FC<{
    unlockedTask?: boolean;
    icon: ReactNode;
    chance?: number;
}> = ({ icon, unlockedTask = false, chance = 1 }) => {
    return (
        <div
            style={{
                backgroundImage: `url(${IMAGE}slots/background.png)`,
                width: "44px",
                height: "44px",
                marginRight: '6px',
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {/* Image and overlay */}
            {icon && (
                <div style={{ position: "relative" }}>
                    {icon}
                    {chance !== 1 && (
                        <div
                            style={{
                                position: "absolute",
                                left: "50%",
                                transform: "translateX(-50%)",
                                bottom: -2
                            }}
                        >
                            <Text text={`1/${chance}`} type="shadow" colour="white" />
                        </div>
                    )}
                    {unlockedTask && (
                        <img
                            src={`${IMAGE}unlock.png`}
                            style={{
                                position: "absolute",
                                top: -2,
                                left: 28,
                                width: 10,
                                height: 19,
                                pointerEvents: "none"
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};