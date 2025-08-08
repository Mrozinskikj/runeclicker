import React from "react";
import { Text, TextColour } from "./text";

interface QuantityProps {
    min: number;
    max?: number;
    cost?: number;
}

/**
 * Quantity Component
 * - Creates formatted quantity text used for items.
 */
export const Quantity: React.FC<QuantityProps> = ({ min, max, cost }) => {

    // Convert number to k or m
    const abbreviateNumber = (value: number): string => {
        if (value >= 10_000_000) return `${Math.floor(value / 1_000_000)}m`;
        if (value >= 100_000) return `${Math.floor(value / 1_000)}k`;
        return String(value);
    };

    // Abbreviate number and determine text colour
    const formatNumber = (min: number, max?: number, cost?: number): { text: string; textColour: TextColour } => {
        let textColour: TextColour = "white";

        // Apply different text colors based on quantity vs. cost
        if (cost && min < cost) {
            textColour = "red";
        } else if (min >= 10_000_000) {
            textColour = "green2";
        } else if (min >= 100_000) {
            textColour = "green";
        }

        const formattedCost = cost !== undefined ? abbreviateNumber(cost) : undefined;
        const formattedMin = abbreviateNumber(min);
        let text = formattedMin;
        if (cost) {
            text = `${formattedMin}/${formattedCost}`;
        } else if (max && max > 1 && min !== max) {
            const formattedMax = abbreviateNumber(max);
            text = `${formattedMin}-${formattedMax}`;
        }

        return {
            text: text,
            textColour
        };
    };

    // Determine text format
    const { text, textColour } = formatNumber(min, max, cost);

    return (
        <div style={{ position: "absolute", top: "-1px", left: "1px", zIndex: 1 }}>
            {(cost || (!cost && (min > 1 || (max && max > 1)))) && (
                <Text text={text} type="shadow" colour={textColour} />
            )}
        </div>
    );
};