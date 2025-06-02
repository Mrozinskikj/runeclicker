import React, { useState } from "react";
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
    const { scale, offsetX } = useScale();

    // Set tooltip position based on mouse position and game screen scale
    const handleMouseMove = (event: React.MouseEvent) => {
        setPosition({
            x: (event.clientX - offsetX + 20) / scale,
            y: (event.clientY + 10) / scale
        });
    };

    const handleMouseEnter = (event: React.MouseEvent) => {
        setVisible(true)
        setPosition({
            x: (event.clientX - offsetX + 20) / scale,
            y: (event.clientY + 10) / scale
        });
    };

    return (
        content ?
            <div
                style={{ position: "relative", display: "block" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setVisible(false)}
                onMouseMove={handleMouseMove} // Track mouse movement
            >
                {children}

                {visible && (
                    <div
                        style={{
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