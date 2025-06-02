import React from "react";
import { IMAGE } from "../config";
import { Text } from "./text";
import { Tooltip } from "./tooltip";

interface ProgressBarProps {
    value: number;
    text?: string;
    image: string;
    tooltipContent?: React.ReactNode;
    updated?: boolean;
    updatedValue?: number | null;
    updatedImage?: string;
    bottomBorder?: boolean;
    fullBorder?: boolean;
}

/**
 * Progress Bar Component
 * - Displays progress bar with tooltip and text value.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({ value, text, image, tooltipContent, updated = false, updatedValue = null, updatedImage = "", bottomBorder = true, fullBorder = false }) => {
    return (
        <Tooltip content={tooltipContent}>
            {/* Bar Background */}
            <div style={{
                position: "relative",
                height: "10px",
                backgroundImage: `url(${IMAGE}progress/empty.png)`,
                borderTop: "1px solid #000",
                borderBottom: bottomBorder ? "1px solid #000" : "",
                borderLeft: fullBorder ? "1px solid #000" : "",
                borderRight: fullBorder ? "1px solid #000" : "",
            }}>
                {/* Main bar */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${value}%`,
                        backgroundImage: `url(${IMAGE}progress/${image}.png)`,
                    }}
                />

                {/* Updated bar (diff from value to updatedValue) */}
                {updatedValue !== null &&
                    <div
                        style={{
                            position: "absolute",
                            left: `${value}%`,
                            top: 0,
                            bottom: 0,
                            width: `${Math.max(0, Math.min(updatedValue, 100 - value))}%`,
                            backgroundImage: `url(${IMAGE}progress/${updatedImage}.png)`,
                        }}
                    />
                }

                {/* Progress Text */}
                {text && (
                    <div
                        style={{
                            position: "absolute",
                            top: "1px",
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Text text={text} type="shadow" colour="white" />
                    </div>
                )}

                {/* Updated Overlay */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#FFFFFF',
                        opacity: updated ? 1 : 0,
                    }}
                />
            </div>
        </Tooltip>
    );
};