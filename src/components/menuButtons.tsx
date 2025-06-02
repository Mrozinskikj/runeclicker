import React, { useState } from "react";
import { Window } from "./window";
import { IMAGE } from "../config";
import { usePlayer } from "../logic/usePlayer";

interface MenuButtonsProps {
    view: "skill" | "stats" | "info" | "settings";
    handleViewSelect: (selection: "skill" | "stats" | "info" | "settings") => void;
}

interface ButtonConfig {
    key: "stats" | "info" | "settings";
    icon: string;
    marginLeft?: number;
    marginRight?: number;
}

/**
 * Menu Buttons Component
 * - Displays buttons to navigate to Stats, Info, or Settings.
 */
const MenuButtonsComponent: React.FC<MenuButtonsProps> = ({ view, handleViewSelect }) => {

    const player = usePlayer((state) => state.player);
    const complete = player.records.items.every(item => item >= 1);

    // Button configuration
    const buttons: ButtonConfig[] = [
        { key: "stats", icon: complete ? "statscomplete.png" : "stats.png", marginRight: 5 },
        { key: "settings", icon: "settings.png", marginLeft: 5, marginRight: 5 },
        { key: "info", icon: "info.png", marginLeft: 5 },
    ];

    const renderButton = ({ key, icon, marginLeft = 0, marginRight = 0 }: ButtonConfig) => {

        const bgNormal = `url(${IMAGE}backgrounds/interface.png)`;
        const bgHighlighted = `url(${IMAGE}backgrounds/interfacehighlighted.png)`;
        const bgSelected = `url(${IMAGE}backgrounds/interfacedark.png)`;

        const [hovered, setHovered] = useState<boolean>(false);

        return (
            <Window
                key={key}
                content={
                    <div
                        onClick={() => handleViewSelect(key)}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        style={{
                            cursor: "pointer",
                            width: "36px",
                            height: "36px",
                            backgroundImage: view === key ? bgSelected : (hovered ? bgHighlighted : bgNormal),
                            backgroundSize: "cover",
                        }}
                    >
                        <img src={`${IMAGE}menu/${icon}`} alt={`${key} icon`} style={{ pointerEvents: "none" }} />
                    </div>
                }
                mt={5}
                ml={marginLeft}
                mr={marginRight}
            />
        );
    };

    return (
        <div style={{ display: "flex" }}>
            {buttons.map(renderButton)}
        </div>
    );
};

export const MenuButtons = React.memo(MenuButtonsComponent);