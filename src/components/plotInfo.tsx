import React from "react";
import { IMAGE } from "../config";
import { useFarming } from "../logic/useFarming";
import { usePlayer } from "../logic/usePlayer";

export const PlotInfo: React.FC = () => {
    const plots = usePlayer((s) => s.player.plots);
    void useFarming(s => s.plotTimes);
    const getPlotState = useFarming((s) => s.getPlotState);

    const gridMap = (index: number) => {
        const col = 2 - Math.floor(index / 3);
        const row = index % 3;
        return row * 3 + col;
    };

    const orderedPlots = Array(9).fill(null);
    plots.forEach((plot, i) => {
        orderedPlots[gridMap(i)] = { plot, originalIndex: i };
    });

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 11px)",
            gridTemplateRows: "repeat(3, 11px)",
            gap: "1px",
            marginLeft: "auto",
            marginRight: "1px",
        }}>
            {orderedPlots.map((item, i) => {
                if (!item) return <div key={i} />;
                
                const { plot, originalIndex } = item;
                const seed = plot.seed;
                const plotState = getPlotState(originalIndex);

                const image =
                    plotState === "empty"
                        ? "empty"
                        : plotState === "growing"
                            ? `${seed}growing`
                            : `${seed}`;

                return (
                    <img
                        key={i}
                        src={`${IMAGE}farming/${image}.png`}
                        style={{
                            width: "11px",
                            height: "11px",
                            pointerEvents: "none",
                        }}
                    />
                );
            })}
        </div>
    );
};