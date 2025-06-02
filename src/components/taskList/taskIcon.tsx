import React from "react";
import { IMAGE } from "../../config";
import { Quantity } from "../quantity";
import { Text } from "../text";

interface TaskIconProps {
    source: string;
    quantity?: number;
    chance?: number;
}

/**
 * Task Icon Component
 * - Displays an image for a given task.
 */
/**
 * Task Icon Component
 * - Displays an image for a given task.
 */
export const TaskIcon: React.FC<TaskIconProps> = ({ source, quantity = 1, chance = 1 }) => {
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
            {/* Quantity text */}
            <Quantity min={quantity} />

            {/* Image and overlay */}
            {source && (
                <div style={{ position: "relative", top: 2 }}>
                    <img
                        src={`${IMAGE}${source}`}
                        style={{
                            pointerEvents: "none",
                            objectFit: "contain"
                        }}
                    />
                    {chance !== 1 && (
                        <div
                            style={{
                                position: "absolute",
                                bottom: -2,
                                left: "50%",
                                transform: "translateX(-50%)",
                            }}
                        >
                            <Text text={`1/${chance}`} type="shadow" colour="white" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};