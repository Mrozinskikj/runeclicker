import React, { useState, useLayoutEffect, useRef } from "react";
import { useScale } from "../logic/useScale";

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
}

/**
 * Tooltip Component
 * - Renders a tooltip when content is moused over.
 */
export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [ready, setReady] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const { scale, offsetX } = useScale();

    // Set tooltip position based on mouse position and game screen scale
    const updatePosition = (event: React.MouseEvent) => {
        if (!tooltipRef.current) return;

        // 1) Measure actual width in screen px
        const pxWidth = tooltipRef.current.getBoundingClientRect().width;
        // 2) Convert to game‐units
        const unitWidth = pxWidth / scale;

        // Clamp against the real viewport in game‐units
        const maxX = (window.innerWidth / scale) - 8;
        const rawX = (event.clientX - offsetX + 20) / scale;
        const clampedX = Math.min(rawX, maxX - unitWidth);

        setPosition({
            x: clampedX,
            y: (event.clientY + 10) / scale,
        });
        setReady(true);
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
        setVisible(true);
        setReady(false);
        updatePosition(e);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (visible) updatePosition(e);
    };

    const handleMouseLeave = () => {
        setVisible(false);
        setReady(false);
    };


    return (
        content ?
            <div
                style={{ position: "relative", display: "block" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            >
                {children}

                {visible && (
                    <div
                        ref={tooltipRef}
                        style={{
                            visibility: ready ? "visible" : "hidden",
                            position: "fixed",
                            top: `${position.y}px`,
                            left: `${position.x}px`,
                            backgroundColor: "rgba(0,0,0,0.8)",
                            color: "#FFF",
                            border: "1px solid white",
                            padding: "5px",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            boxShadow: "3px 3px 0 rgba(0,0,0,0.5)",
                            zIndex: 1000,
                            pointerEvents: "none",
                        }}
                    >
                        {content}
                    </div>
                )}
            </div>
            : children
    );
};