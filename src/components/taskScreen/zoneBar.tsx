import React from "react";
import { IMAGE } from "../../config";
import { Text } from "../text";
import { Tooltip } from "../tooltip";
import { useCombat } from "../../logic/useCombat";

interface ZoneBarProps {
    step: number;
    record: number;
    updated?: boolean;
    showStep?: boolean;
}

export const ZoneBar: React.FC<ZoneBarProps> = ({ step, record, updated, showStep = true }) => {
    const calculateDepth = useCombat((state) => state.calculateDepth);
    const depth = calculateDepth(step);
    const isRest = useCombat((state) => state.isRest);

    const text = `Step: ${step}, Depth: ${depth + 1}`;
    const untilRest = depth != 3 ? String(10 - (step % 10)) : "-";

    // Tooltip for actions progress bar
    const tooltipContent = showStep && (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text text="Steps until rest: " type="normal" colour="white" />
                <Text text={untilRest} type="bold" colour="white" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text text="Best: " type="normal" colour="white" />
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    <Text text={String(record)} type="bold" colour="white" />
                    <Text text={(record - step) > 0 ? `(${record - step} away)` : "(new best)"} type="small" colour="white" />
                </div>
            </div>
        </div>
    );

    const maxChunks = 423;
    const chunkCount = Math.max(0, Math.min(step, maxChunks));

    return (
        <Tooltip content={tooltipContent}>
            {/* Bar Background */}
            <div style={{
                position: "relative",
                height: "10px",
                display: "flex",
                border: "1px solid #000",
            }}>
                {/* Bar Chunks + Dividers */}
                {Array.from({ length: chunkCount }).flatMap((_, i, arr) => {
                    const depth = calculateDepth(i + 1);
                    const isLast = i === arr.length - 1;
                    const rest = isRest(i + 1);

                    // Base chunk style
                    const chunkStyle: React.CSSProperties = {
                        flex: 1,
                        height: "100%",
                        backgroundImage: !rest
                            ? `url(${IMAGE}progress/depth${depth}.png)`
                            : `url(${IMAGE}progress/empty.png)`,
                        boxSizing: "border-box",
                        ...(isLast && showStep && {
                            border: "1px solid #FFFFFF",
                        }),
                    };

                    return [
                        <div key={`chunk-${i}`} style={chunkStyle} />,
                        !isLast && (
                            <div
                                key={`divider-${i}`}
                                style={{
                                    width: "1px",
                                    height: "100%",
                                    backgroundImage: !rest
                                        ? `url(${IMAGE}progress/depthdiv${depth}.png)`
                                        : `url(${IMAGE}progress/empty.png)`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                }}
                            />
                        ),
                    ];
                })}

                {/* Progress Text */}
                <div
                    style={{
                        position: "absolute",
                        top: "0px",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Text text={text} type="shadow" colour="white" />
                </div>


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