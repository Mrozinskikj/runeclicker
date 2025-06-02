import React from "react";
import { Text } from "./text";

interface FractionItemProps {
    item: JSX.Element;
    numerator?: number;
    value: number;
}

export const FractionItem: React.FC<FractionItemProps> = ({ item, value, numerator = 1 }) => {
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
            <Text text={`${numerator}/${value}`} type="small" />
        </div>
    );
};