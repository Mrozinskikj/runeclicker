import React, { useState, ReactNode } from "react";
import { IMAGE } from "../../config";
import { Text } from "../text";

export const Category: React.FC<{
    content: ReactNode;
    unlockedTask?: boolean;
    title?: string;
    rightText?: string;
    icon?: string;
}> = ({ content, title, rightText, icon, unlockedTask = false }) => {
    const [open, setOpen] = useState(false);
    const [hover, setHover] = useState(false);

    const imgState = hover ? "hover" : "idle";
    const imgOpen = open ? "open" : "closed";

    const topBar = (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => setOpen(!open)}
            style={{
                cursor: "pointer",
                height: 48,
                width: 490,
                backgroundImage: `url(${IMAGE}category/top${imgOpen}${imgState}.png)`,
                backgroundSize: "cover",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            {/* Icon */}
            {icon && <div style={{ position: "relative", paddingLeft: 2 }}>
                <img
                    src={`${IMAGE}${icon}`}
                    style={{
                        pointerEvents: "none",
                        objectFit: "contain",
                        display: "block",
                        paddingLeft: "4px",
                        paddingRight: "8px"
                    }}
                />
                {unlockedTask && (
                    <img
                        src={`${IMAGE}unlock.png`}
                        style={{
                            position: "absolute",
                            top: -2,
                            left: 32,
                            width: 10,
                            height: 19,
                            pointerEvents: "none"
                        }}
                    />
                )}
            </div>}

            {/* Title */}
            {title && <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: "2px" }}>
                <Text text={title} type="bold" maxWidth={170} colour={"black"} />
            </div>}

            {/* Right Side Content */}
            {rightText && <div style={{ display: "flex", alignItems: "center", marginRight: "8px", justifyContent: "flex-end" }}>
                <Text text={rightText} type="normal" />
            </div>}
        </div>
    );

    const BottomBar = (
        <>
            <div
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => setOpen(!open)}
                style={{
                    cursor: "pointer",
                    height: 15,
                    width: 490,
                    backgroundImage: `url(${IMAGE}category/bottom${imgState}.png)`,
                    backgroundSize: "cover",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            />
        </>
    );

    const sideBar = (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => setOpen(!open)}
            style={{
                cursor: "pointer",
                width: 6,
                backgroundImage: `url(${IMAGE}category/side${imgState}.png)`,
                minHeight: "100%"
            }}
        />
    )

    return (
        open ? (
            <>
                {topBar}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "stretch",
                        width: 490
                    }}
                >
                    {sideBar}
                    {/* Content */}
                    <div style={{ flex: 1 }}>
                        {content}
                    </div>
                    {sideBar}
                </div>
                {BottomBar}
            </>
        ) : (topBar)
    );
};