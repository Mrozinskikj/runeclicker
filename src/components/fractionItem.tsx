import React from "react";
import { Text } from "./text";
import { TextColour } from "./text";

interface FractionItemProps {
    item: JSX.Element;
    numerator?: number;
    value: number;
    colour?: TextColour;
}

export const FractionItem: React.FC<FractionItemProps> = ({ item, value, numerator = 1, colour = "black" }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <div style={{ height: "38px" }}>
                {item}
            </div>
            <Text text={`${numerator}/${value}`} type="small" colour={colour} />
        </div>
    );
};